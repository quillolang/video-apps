// The numbers and outputs video 224 shows, measured on this machine:  node compare/measure.mjs
// (from the video's folder in quillo-videos, or from this app's folder in video-apps: it finds main.qwe either way;
// the first version is steps/v1). sh get-quillo.sh first, so .quillo/bin/quillo is there. macOS or Linux (kill, pgrep).
//
//   twice    the same buy sent twice (the same body; for the final version, the same Idempotency-Key): invoices after
//   crash    billing on its own with BILLING_PAUSE=3000 (3 s after writing the invoice), the shop with --service-url;
//            a buy (key k1), billing killed (kill -9) 0.8 s in, billing started again without the pause;
//            then the invoices, the same key again, and a new key (what "Try again" gives)
//   cost     300 buys one after another, each with a new key, under --split: median and 99th percentile;
//            then 300 with one key sent again (the kept answer): median. Three rounds, the medians kept
// Writes MEASURE.json and logs/*.txt beside this file, and prints each run.
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.dirname(here);
const FINAL = fs.existsSync(path.join(root, 'app', 'main.qwe')) ? path.join(root, 'app') : root;
const V1 = path.join(root, 'steps', 'v1');
const QUILLO = path.join(FINAL, '.quillo', 'bin', 'quillo');
const LOGS = path.join(here, 'logs');
fs.mkdirSync(LOGS, { recursive: true });
const SHOP = 8250, BILL = 8251;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const agent = new http.Agent({ keepAlive: true, maxSockets: 64 });
const now = () => performance.now();
const tidy = (s) => s.split(os.homedir()).join('/Users/you');

function req(port, method, p, body, headers = {}) {
  return new Promise((resolve) => {
    const t0 = now();
    const r = http.request({ host: '127.0.0.1', port, method, path: p, agent, headers }, (res) => {
      let b = ''; res.on('data', (d) => (b += d));
      res.on('end', () => resolve({ status: res.statusCode, body: b, replayed: res.headers['idempotent-replayed'] === 'true', ms: now() - t0 }));
    });
    r.on('error', (e) => resolve({ status: 0, body: String(e), ms: now() - t0 }));
    r.end(body);
  });
}
const buy = (key) => req(SHOP, 'POST', '/buy', 'name=Ada', { 'content-type': 'application/x-www-form-urlencoded', ...(key ? { 'idempotency-key': key } : {}) });
const page = (r) => `${r.status} ${(r.body.match(/<p>(.*?)<\/p>/) || [, r.body])[1].replace(/<[^>]+>/g, '')}${r.replayed ? ' (replayed)' : ''}`;
const invoices = async () => JSON.parse((await req(SHOP, 'GET', '/summary')).body).invoices;

function run(dir, file, args, env = {}) {
  const p = spawn(QUILLO, ['run', file, ...args], { cwd: dir, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  p.out = '';
  p.stdout.on('data', (d) => (p.out += d)); p.stderr.on('data', (d) => (p.out += d));
  return p;
}
async function up(port) {
  for (let i = 0; i < 600; i++) { const r = await req(port, 'GET', '/'); if (r.status) return; await sleep(25); }
  throw new Error(`nothing on ${port}`);
}
async function stop(p) {
  if (p.exitCode !== null || p.signalCode) return p.out;
  p.kill('SIGINT'); await sleep(300); if (p.exitCode === null) p.kill('SIGINT');
  await new Promise((r) => (p.exitCode !== null || p.signalCode ? r() : p.on('exit', r))); await sleep(300);
  return p.out;
}
const fresh = (dir) => { for (const f of ['billing.db', 'shop.db']) for (const x of ['', '-wal', '-shm']) fs.rmSync(path.join(dir, f + x), { force: true }); };
const pct = (xs, q) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1)))]; };
const sides = [['v1', V1], ['final', FINAL]];

const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), node: process.version,
  machine: `${os.cpus()[0].model}, ${os.cpus().length} cores, ${os.platform()} ${os.release()}`, twice: {}, crash: {}, cost: {} };
console.log(out.quillo, '|', out.machine);

// twice
for (const [name, dir] of sides) {
  fresh(dir);
  const p = run(dir, 'main.qwe', ['--port', String(SHOP), '--split']);
  await up(SHOP);
  const a = await buy('order-7'), b = await buy('order-7');
  out.twice[name] = { first: page(a), second: page(b), invoices: await invoices() };
  await stop(p);
  console.log(name, 'twice:', JSON.stringify(out.twice[name]));
}

// crash
for (const [name, dir] of sides) {
  fresh(dir);
  const secret = { QUILLO_SERVICE_SECRET: crypto.randomBytes(32).toString('hex') };
  let b = run(dir, 'billing.qwe', ['--port', String(BILL), '--as-service'], { ...secret, BILLING_PAUSE: '3000' });
  const s = run(dir, 'main.qwe', ['--port', String(SHOP), '--service-url', `billing=http://127.0.0.1:${BILL}`], secret);
  await up(SHOP); await up(BILL);
  const first = buy('k1');
  await sleep(800);
  b.kill('SIGKILL');
  const r1 = await first;
  await new Promise((r) => (b.exitCode !== null || b.signalCode ? r() : b.on('exit', r)));
  const billLog1 = b.out;
  await sleep(6000);                                                   // the shop's circuit closes again
  b = run(dir, 'billing.qwe', ['--port', String(BILL), '--as-service'], secret);
  await up(BILL); await sleep(300);
  const after = await invoices();
  const r2 = await buy('k1');
  const mid = await invoices();
  const r3 = await buy('k2');
  out.crash[name] = { first: page(r1), first_ms: r1.ms, after_crash: after, same_key: page(r2), after_same_key: mid, new_key: page(r3), invoices: await invoices() };
  fs.writeFileSync(path.join(LOGS, `crash-${name}-shop.txt`), tidy(await stop(s)));
  fs.writeFileSync(path.join(LOGS, `crash-${name}-billing.txt`), tidy(billLog1 + '--- started again ---\n' + await stop(b)));
  console.log(name, 'crash:', JSON.stringify(out.crash[name]));
}

// cost
for (const [name, dir] of sides) {
  const rounds = [];
  for (let round = 0; round < 3; round++) {
    fresh(dir);
    const p = run(dir, 'main.qwe', ['--port', String(SHOP), '--split']);
    await up(SHOP);
    for (let i = 0; i < 50; i++) await buy(`warm-${round}-${i}`);
    const one = [], again = [];
    for (let i = 0; i < 300; i++) { const r = await buy(`n-${round}-${i}`); if (r.status !== 200) throw new Error(r.body); one.push(r.ms); }
    for (let i = 0; i < 300; i++) { const r = await buy('same'); if (r.status !== 200) throw new Error(r.body); again.push(r.ms); }
    rounds.push({ median: pct(one, 0.5), p99: pct(one, 0.99), again: pct(again, 0.5), invoices: await invoices() });
    await stop(p);
    console.log(name, 'cost round', round + 1, JSON.stringify(rounds.at(-1)));
  }
  const mid = (k) => pct(rounds.map((r) => r[k]), 0.5);
  out.cost[name] = { median: mid('median'), p99: mid('p99'), again: mid('again'), invoices: rounds.map((r) => r.invoices), rounds };
}
for (const [, dir] of sides) fresh(dir);
out.load = os.loadavg().map((x) => +x.toFixed(2));
out.when = new Date().toISOString();
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
console.log('wrote compare/MEASURE.json');
process.exit(0);
