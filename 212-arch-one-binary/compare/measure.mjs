// The numbers video 212 shows, measured on this machine:  node compare/measure.mjs
// (from the video's folder in quillo-videos, or from this app's folder in video-apps: it finds main.qwe either way).
// Each timing is run RUNS times and the median is kept. The app is copied to a scratch folder first, so its
// database and files start the same way each time and app/ itself is never changed.
//   size     the quillo binary, on disk
//   check    `quillo check main.qwe`, from start to exit
//   first    `quillo run main.qwe`, from start until GET / answers 200 (the database there already)
//   fresh    the same, with no app.db: the migration runs first
//   rss      the server's memory after that first answer (ps's RSS)
//   reload   under --watch: main.qwe saved with a new heading, until GET / shows it
// Writes MEASURE.json beside this file, and prints each run. sh get-quillo.sh first, so .quillo/bin/quillo is there,
// and npm install in compare/express. macOS or Linux (it uses ps).
import { spawn, spawnSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.dirname(here);
const APP = fs.existsSync(path.join(root, 'app', 'main.qwe')) ? path.join(root, 'app') : root;
const QUILLO = path.join(APP, '.quillo', 'bin', 'quillo');
const RUNS = 11, PORT = 8233;
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'q212-'));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[(s.length - 1) >> 1]; };
const ms = (t0) => Number(process.hrtime.bigint() - t0) / 1e6;
const sleep = (n) => new Promise((r) => setTimeout(r, n));

function fresh(withDb) {
  const dir = path.join(scratch, 'app');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, 'migrations'), { recursive: true });
  for (const f of ['main.qwe', 'migrations/001_likes.sql']) fs.copyFileSync(path.join(APP, f), path.join(dir, f));
  if (withDb) spawnSync(QUILLO, ['check', 'main.qwe'], { cwd: dir }) && primeDb(dir);
  return dir;
}
// The database made once by a real start, so `first` finds it there.
function primeDb(dir) {
  const p = spawn(QUILLO, ['run', 'main.qwe', '--port', String(PORT)], { cwd: dir, stdio: 'ignore' });
  for (let i = 0; i < 200 && !fs.existsSync(path.join(dir, 'app.db')); i++) execFileSync('sleep', ['0.02']);
  execFileSync('sleep', ['0.3']);
  p.kill('SIGTERM');
  execFileSync('sleep', ['0.3']);
}
async function get(url) { try { const r = await fetch(url); return { status: r.status, text: await r.text() }; } catch { return null; } }
async function until(f, limit = 10000) {
  const t0 = Date.now();
  for (;;) { const v = await f(); if (v) return v; if (Date.now() - t0 > limit) throw new Error('timed out'); await sleep(1); }
}
async function start(dir, args = []) {
  const t0 = process.hrtime.bigint();
  const p = spawn(QUILLO, ['run', 'main.qwe', '--port', String(PORT), ...args], { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = ''; p.stdout.on('data', (d) => (log += d)); p.stderr.on('data', (d) => (log += d));
  await until(async () => (await get(`http://127.0.0.1:${PORT}/`))?.status === 200);
  return { p, t: ms(t0), log: () => log };
}
async function stop(p) { p.kill('SIGTERM'); await new Promise((r) => p.on('exit', r)); await sleep(150); }

const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), machine: `${os.cpus()[0].model}, ${os.cpus().length} cores, ${os.platform()} ${os.release()}`, runs: RUNS };
out.size = fs.statSync(QUILLO).size;
console.log(out.quillo, '|', out.machine, '| binary', out.size, 'bytes');

const checks = [];
let dir = fresh(false);
for (let i = 0; i < RUNS; i++) { const t0 = process.hrtime.bigint(); const r = spawnSync(QUILLO, ['check', 'main.qwe'], { cwd: dir }); checks.push(ms(t0)); if (r.status !== 0) throw new Error(r.stderr.toString()); }
out.check = median(checks); console.log('check', checks.map((x) => x.toFixed(1)).join(' '), '→', out.check.toFixed(1), 'ms');

const firsts = [], rss = [];
dir = fresh(true);
for (let i = 0; i < RUNS; i++) {
  const s = await start(dir); firsts.push(s.t);
  rss.push(Number(execFileSync('ps', ['-o', 'rss=', '-p', String(s.p.pid)]).toString().trim()) * 1024);
  await stop(s.p);
}
out.first = median(firsts); out.rss = median(rss);
console.log('first', firsts.map((x) => x.toFixed(1)).join(' '), '→', out.first.toFixed(1), 'ms; rss', out.rss, 'bytes');

const freshes = [];
for (let i = 0; i < RUNS; i++) { dir = fresh(false); const s = await start(dir); freshes.push(s.t); await stop(s.p); }
out.fresh = median(freshes); console.log('fresh', freshes.map((x) => x.toFixed(1)).join(' '), '→', out.fresh.toFixed(1), 'ms');

const reloads = [];
dir = fresh(true);
const s = await start(dir, ['--watch']);
const main = path.join(dir, 'main.qwe'), src = fs.readFileSync(main, 'utf8');
for (let i = 0; i < RUNS; i++) {
  const word = `Reload ${i}`;
  await sleep(600);
  const t0 = process.hrtime.bigint();
  fs.writeFileSync(main, src.replace('Hello from one binary', word));
  await until(async () => (await get(`http://127.0.0.1:${PORT}/`))?.text.includes(word));
  reloads.push(ms(t0));
}
await stop(s.p);
out.reload = median(reloads); console.log('reload', reloads.map((x) => x.toFixed(1)).join(' '), '→', out.reload.toFixed(1), 'ms');
// For scale: the same page in Express 5 on Node 24 (compare/express), from `node server.js` to GET / answering 200,
// and its memory then. Its node_modules is linked in, not copied.
const ex = path.join(here, 'express');
const exFirst = [], exRss = [];
for (let i = 0; i < RUNS; i++) {
  const d = path.join(scratch, 'express'); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d);
  for (const f of ['server.js', 'package.json']) fs.copyFileSync(path.join(ex, f), path.join(d, f));
  fs.symlinkSync(path.join(ex, 'node_modules'), path.join(d, 'node_modules'));
  const t0 = process.hrtime.bigint();
  const p = spawn(process.execPath, ['server.js'], { cwd: d, stdio: 'ignore', env: { ...process.env, PORT: String(PORT) } });
  await until(async () => (await get(`http://127.0.0.1:${PORT}/`))?.status === 200);
  exFirst.push(ms(t0));
  exRss.push(Number(execFileSync('ps', ['-o', 'rss=', '-p', String(p.pid)]).toString().trim()) * 1024);
  await stop(p);
}
out.express = { node: process.version, first: median(exFirst), rss: median(exRss) };
console.log('express first', exFirst.map((x) => x.toFixed(1)).join(' '), '→', out.express.first.toFixed(1), 'ms; rss', out.express.rss);
out.load = os.loadavg().map((x) => +x.toFixed(2));
out.when = new Date().toISOString();
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
fs.rmSync(scratch, { recursive: true, force: true });
console.log(JSON.stringify(out));
process.exit(0);
