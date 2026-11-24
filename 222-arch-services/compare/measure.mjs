// The numbers and outputs video 222 shows, measured on this machine:  node compare/measure.mjs
// (from the video's folder in quillo-videos, or from this app's folder in video-apps: it finds main.qwe either way).
// sh get-quillo.sh first, so .quillo/bin/quillo is there. macOS or Linux (it stops servers with signals and pkill).
//
//   speed    300 buys one after another (median, 99th percentile), then 3,000 with 50 at a time (buys a second):
//            in one process, --split, and --split --scale billing=3; three rounds each, the medians kept
//   wire     billing on its own, the shop calling it through compare/peek.mjs, which prints the call;
//            then that call sent again by hand: unsigned, with its body changed, and as it was (twice)
//   down     the shop with billing not running: seven buys, each one's status and time
//   hanging  billing taking 5 s an invoice (BILLING_DELAY=5000), the shop's timeout 2 s: six buys,
//            then billing's counts once it has finished
//   scale    --split --scale billing=3: seven buys, then summary three times (each copy's own `served`)
// Writes MEASURE.json and logs/*.txt beside this file, and prints each run.
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.dirname(here);
const APP = fs.existsSync(path.join(root, 'app', 'main.qwe')) ? path.join(root, 'app') : root;
const QUILLO = path.join(APP, '.quillo', 'bin', 'quillo');
const LOGS = path.join(here, 'logs');
fs.mkdirSync(LOGS, { recursive: true });
const SHOP = 8250, BILL = 8251, PEEK = 8252;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const agent = new http.Agent({ keepAlive: true, maxSockets: 64 });
const now = () => performance.now();
const home = os.homedir();
const tidy = (s) => s.split(home).join('/Users/you');

function req(port, method, p, body, headers = {}) {
  return new Promise((resolve) => {
    const t0 = now();
    const r = http.request({ host: '127.0.0.1', port, method, path: p, agent, headers }, (res) => {
      let b = ''; res.on('data', (d) => (b += d)); res.on('end', () => resolve({ status: res.statusCode, body: b, ms: now() - t0 }));
    });
    r.on('error', (e) => resolve({ status: 0, body: String(e), ms: now() - t0 }));
    r.end(body);
  });
}
const buy = (name = 'Ada') => req(SHOP, 'POST', '/buy', `name=${name}`, { 'content-type': 'application/x-www-form-urlencoded' });
const summary = async () => JSON.parse((await req(SHOP, 'GET', '/summary')).body);

function run(file, args, env = {}, cwd = APP) {
  const p = spawn(QUILLO, ['run', file, ...args], { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  p.out = '';
  p.stdout.on('data', (d) => (p.out += d)); p.stderr.on('data', (d) => (p.out += d));
  return p;
}
async function up(port, p) {
  for (let i = 0; i < 600; i++) { const r = await req(port, 'GET', '/'); if (r.status) return; await sleep(25); }
  throw new Error(`nothing on ${port}:\n${p?.out}`);
}
async function stop(p) {
  if (p.exitCode !== null) return p.out;
  p.kill('SIGINT'); await sleep(300); if (p.exitCode === null) p.kill('SIGINT');
  await new Promise((r) => (p.exitCode !== null ? r() : p.on('exit', r))); await sleep(300);
  return p.out;
}
const fresh = () => { for (const f of ['billing.db', 'billing.db-wal', 'billing.db-shm']) fs.rmSync(path.join(APP, f), { force: true }); };
const pct = (xs, q) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * (s.length - 1)))]; };

const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), node: process.version,
  machine: `${os.cpus()[0].model}, ${os.cpus().length} cores, ${os.platform()} ${os.release()}`, speed: {} };
console.log(out.quillo, '|', out.machine);

// speed: three rounds a side, each from a fresh start; the medians are kept
for (const [name, args] of [['one process', []], ['--split', ['--split']], ['--split --scale billing=3', ['--split', '--scale', 'billing=3']]]) {
  const rounds = [];
  for (let round = 0; round < 3; round++) {
    fresh();
    const p = run('main.qwe', ['--port', String(SHOP), ...args]);
    await up(SHOP, p);
    for (let i = 0; i < 50; i++) await buy();                      // warm up
    const one = [];
    for (let i = 0; i < 300; i++) { const r = await buy(); if (r.status !== 200) throw new Error(r.body); one.push(r.ms); }
    const N = 3000, C = 50; let next = 0; const t0 = now();
    await Promise.all(Array.from({ length: C }, async () => { while (next++ < N) { const r = await buy(); if (r.status !== 200) throw new Error(r.body); } }));
    const secs = (now() - t0) / 1000;
    const s = await summary();
    if (s.invoices !== 3350) throw new Error(`${name}: ${s.invoices} invoices`);
    rounds.push({ median: pct(one, 0.5), p99: pct(one, 0.99), per_second: N / secs });
    const log = await stop(p);
    if (name === '--split' && round === 0) fs.writeFileSync(path.join(LOGS, 'split-start.txt'), tidy(log.split('\n').filter((l) => !/ -> 200 /.test(l)).join('\n')));
    console.log(name, 'round', round + 1, '| one at a time: median', pct(one, 0.5).toFixed(2), 'ms, p99', pct(one, 0.99).toFixed(2), 'ms | 50 at a time:', (N / secs).toFixed(0), 'buys/s');
  }
  const mid = (k) => pct(rounds.map((r) => r[k]), 0.5);
  out.speed[name] = { median: mid('median'), p99: mid('p99'), per_second: mid('per_second'), rounds };
}

// split, two buys and a summary, for the terminal scene
{
  fresh();
  const p = run('main.qwe', ['--port', String(SHOP), '--split']);
  await up(SHOP, p);
  const a = await buy('Ada'), g = await buy('Grace'); await summary();
  out.split = { ada: a.body.match(/<p>(.*?)<\/p>/)[1], grace: g.body.match(/<p>(.*?)<\/p>/)[1] };
  fs.writeFileSync(path.join(LOGS, 'split.txt'), tidy(await stop(p)));
}

// wire
{
  fresh();
  const secret = crypto.randomBytes(32).toString('hex');
  const env = { QUILLO_SERVICE_SECRET: secret };
  const b = run('billing.qwe', ['--port', String(BILL), '--as-service'], env);
  for (const f of fs.readdirSync(LOGS)) if (/^call-\d+\.json$/.test(f)) fs.rmSync(path.join(LOGS, f));
  const peek = spawn(process.execPath, [path.join(here, 'peek.mjs'), String(PEEK), String(BILL)], { stdio: ['ignore', 'pipe', 'inherit'] });
  let seen = ''; peek.stdout.on('data', (d) => (seen += d));
  const s = run('main.qwe', ['--port', String(SHOP), '--service-url', `billing=http://127.0.0.1:${PEEK}`], env);
  await up(SHOP, s); await sleep(300);
  const a = await buy('Ada');
  await sleep(200);
  fs.writeFileSync(path.join(LOGS, 'wire.txt'), seen);
  const call = JSON.parse(fs.readFileSync(path.join(LOGS, 'call-1.json')));
  const send = async (mode) => {
    const h = { ...call.headers }; delete h['content-length']; let body = call.body;
    if (mode === 'unsigned') delete h['x-quillo-service'];
    if (mode === 'changed') body = body.replace('1200', '1');
    const r = await req(BILL, 'POST', call.url, body, h);
    return { status: r.status, body: r.body };
  };
  const plain = await req(BILL, 'POST', '/_quillo/service/invoice', '["Mallory",1]', { 'content-type': 'application/json' });
  const rpc = await req(BILL, 'POST', '/_quillo/rpc/invoice', '["Mallory",1]', { 'content-type': 'application/json' });
  out.wire = { page: a.body.match(/<p>(.*?)<\/p>/)[1], plain: { status: plain.status, body: plain.body }, rpc: { status: rpc.status, body: rpc.body },
    unsigned: await send('unsigned'), changed: await send('changed'), again: await send('same'), again2: await send('same') };
  out.wire.after = await summary();
  console.log('wire:', JSON.stringify(out.wire));
  await stop(s); peek.kill(); fs.writeFileSync(path.join(LOGS, 'wire-billing.txt'), tidy(await stop(b)));
}

// down
{
  const env = { QUILLO_SERVICE_SECRET: crypto.randomBytes(32).toString('hex') };
  const s = run('main.qwe', ['--port', String(SHOP), '--service-url', `billing=http://127.0.0.1:${BILL}`], env);
  await up(SHOP, s);
  const tries = [];
  for (let i = 0; i < 7; i++) { const r = await buy(); tries.push({ status: r.status, ms: r.ms, body: r.body }); }
  out.down = tries;
  fs.writeFileSync(path.join(LOGS, 'down.txt'), tidy(await stop(s)));
  console.log('down:', tries.map((t) => `${t.status} ${t.ms.toFixed(1)}ms`).join(', '));
}

// hanging
{
  fresh();
  const env = { QUILLO_SERVICE_SECRET: crypto.randomBytes(32).toString('hex') };
  const b = run('billing.qwe', ['--port', String(BILL), '--as-service'], { ...env, BILLING_DELAY: '5000' });
  const s = run('main.qwe', ['--port', String(SHOP), '--service-url', `billing=http://127.0.0.1:${BILL}`], env);
  await up(SHOP, s); await sleep(500);
  const tries = [];
  for (let i = 0; i < 6; i++) { const r = await buy(); tries.push({ status: r.status, ms: r.ms }); }
  await sleep(12000);                                              // billing finishes; the circuit closes again
  out.hanging = { tries, after: await summary() };
  fs.writeFileSync(path.join(LOGS, 'hanging.txt'), tidy(await stop(s)));
  fs.writeFileSync(path.join(LOGS, 'hanging-billing.txt'), tidy(await stop(b)));
  console.log('hanging:', tries.map((t) => `${t.status} ${t.ms.toFixed(0)}ms`).join(', '), '| afterwards', JSON.stringify(out.hanging.after));
}

// scale
{
  fresh();
  const p = run('main.qwe', ['--port', String(SHOP), '--split', '--scale', 'billing=3']);
  await up(SHOP, p);
  const pages = [];
  for (let i = 0; i < 7; i++) pages.push((await buy()).body.match(/<p>(.*?)<\/p>/)[1]);
  const sums = [await summary(), await summary(), await summary()];
  out.scale = { pages, sums };
  fs.writeFileSync(path.join(LOGS, 'scale.txt'), tidy(await stop(p)));
  console.log('scale:', pages.join(' | '), '|', JSON.stringify(sums));
}
fresh();
out.load = os.loadavg().map((x) => +x.toFixed(2));
out.when = new Date().toISOString();
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
console.log('wrote compare/MEASURE.json');
process.exit(0);
