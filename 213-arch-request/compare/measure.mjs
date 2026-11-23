// The numbers video 213 shows, measured on this machine:  node compare/measure.mjs
// (from the video's folder in quillo-videos, or from this app's folder in video-apps: it finds main.qwe either way).
// sh get-quillo.sh first, so .quillo/bin/quillo is there, and npm install in compare/express. macOS or Linux (it uses ps).
//
// Each experiment starts a fresh server, and runs ROUNDS times; the median is kept.
//   waits    100 requests to /slow (each sleeps 1 s) sent at once, then /fast 100 ms later: how long /fast took,
//            and when the 100 slow ones finished (the last, and how many within 1.5 s)
//   network  the same with /weather, which asks a slow API (compare/upstream.mjs, 1 s an answer, started here)
//   compute  /busy (computes for 0.8 s) sent, then /fast 50 ms later: how long /fast took
//   both     /both (two 0.8 s spins in parallel(...); Promise.all in Express): how long it took, and /fast sent 50 ms in
//   limit    /busy under --max-compute 500ms: its status and time
//   memory   the server's RSS (ps) idle, then the most it reached while 1,000 requests to /slow were asleep at once
//   count    1,000 requests to /count at once (hits += 1, no wait): the count afterwards
//   lost     200 requests to /lost at once (read hits, wait 5 ms, write it + 1): the count afterwards
//   safe     200 requests to /safe at once (wait 5 ms, then hits += 1): the count afterwards
// Sides: Quillo as it starts (64 workers), Quillo --workers 128, Quillo --instances 2, and Express 5 on Node 24.
// Writes MEASURE.json beside this file, and prints each run.
import { spawn, execFileSync } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.dirname(here);
const APP = fs.existsSync(path.join(root, 'app', 'main.qwe')) ? path.join(root, 'app') : root;
const QUILLO = path.join(APP, '.quillo', 'bin', 'quillo');
const EXPRESS = path.join(here, 'express');
const PORT = 8241, ROUNDS = 5;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[(s.length - 1) >> 1]; };
const agent = new http.Agent({ keepAlive: false, maxSockets: Infinity });
const now = () => performance.now();

function get(p) {
  return new Promise((resolve) => {
    const t0 = now();
    const req = http.get({ host: '127.0.0.1', port: PORT, path: p, agent }, (res) => {
      let body = ''; res.on('data', (d) => (body += d)); res.on('end', () => resolve({ status: res.statusCode, body, t0, t1: now() }));
    });
    req.on('error', (e) => resolve({ status: 0, body: String(e), t0, t1: now() }));
  });
}
async function start(side) {
  const [cmd, args, cwd, env] = side.express
    ? [process.execPath, ['server.js'], EXPRESS, { ...process.env, PORT: String(PORT) }]
    : [QUILLO, ['run', 'main.qwe', '--port', String(PORT), ...side.args], APP, process.env];
  const p = spawn(cmd, args, { cwd, env, stdio: 'ignore' });
  for (let i = 0; i < 500; i++) { const r = await get('/fast'); if (r.status === 200) return p; await sleep(10); }
  throw new Error(`${side.name} did not start`);
}
async function stop(p) { p.kill('SIGTERM'); await new Promise((r) => p.on('exit', r)); await sleep(200); }

const sides = [
  { name: 'quillo', args: [] },
  { name: 'quillo --workers 128', args: ['--workers', '128'] },
  { name: 'quillo --instances 2', args: ['--instances', '2'] },
  { name: 'express', express: true },
];
const upstream = spawn(process.execPath, [path.join(here, 'upstream.mjs')], { stdio: 'ignore', env: { ...process.env, PORT: '8242' } });
await sleep(300);
const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), node: process.version, machine: `${os.cpus()[0].model}, ${os.cpus().length} cores, ${os.platform()} ${os.release()}`, rounds: ROUNDS, sides: {} };
console.log(out.quillo, '|', out.node, '|', out.machine);

for (const side of sides) {
  const r = (out.sides[side.name] = {});
  // waits
  const fast = [], first = [], last = [], waves = [];
  for (let i = 0; i < ROUNDS; i++) {
    const p = await start(side);
    const t0 = now();
    const slow = Array.from({ length: 100 }, () => get('/slow'));
    await sleep(100);
    const f = await get('/fast');
    const done = await Promise.all(slow);
    if (done.some((d) => d.status !== 200)) throw new Error(`${side.name}: a slow request failed`);
    const ends = done.map((d) => d.t1 - t0).sort((a, b) => a - b);
    fast.push(f.t1 - f.t0); first.push(ends[0]); last.push(ends[ends.length - 1]);
    waves.push(ends.filter((e) => e < 1500).length);
    await stop(p);
  }
  r.waits = { fast: median(fast), first: median(first), last: median(last), within_1_5s: median(waves) };
  console.log(side.name, 'waits: /fast', fast.map((x) => x.toFixed(1)).join(' '), '| last slow', last.map((x) => x.toFixed(0)).join(' '), '| done within 1.5 s', waves.join(' '));
  // network
  {
    const nf = [], nl = [], nw = [];
    for (let i = 0; i < ROUNDS; i++) {
      const p = await start(side);
      const t0 = now();
      const slow = Array.from({ length: 100 }, () => get('/weather'));
      await sleep(100);
      const f = await get('/fast');
      const done = await Promise.all(slow);
      if (done.some((d) => d.status !== 200 || d.body !== 'sunny')) throw new Error(`${side.name}: a /weather request failed`);
      const ends = done.map((d) => d.t1 - t0).sort((a, b) => a - b);
      nf.push(f.t1 - f.t0); nl.push(ends[ends.length - 1]); nw.push(ends.filter((e) => e < 1500).length);
      await stop(p);
    }
    r.network = { fast: median(nf), last: median(nl), within_1_5s: median(nw) };
    console.log(side.name, 'network: /fast', nf.map((x) => x.toFixed(1)).join(' '), '| last', nl.map((x) => x.toFixed(0)).join(' '), '| done within 1.5 s', nw.join(' '));
  }
  // compute
  const blocked = [];
  for (let i = 0; i < 11; i++) {
    const p = i === 0 || side.instances ? await start(side) : r._p;
    r._p = p;
    const b = get('/busy');
    await sleep(50);
    const f = await get('/fast');
    await b;
    blocked.push(f.t1 - f.t0);
    await sleep(100);
  }
  await stop(r._p); delete r._p;
  r.compute = { fast: median(blocked), all: blocked.map((x) => +x.toFixed(1)) };
  {
    const p = await start(side);
    const took = [], held = [];
    for (let i = 0; i < 3; i++) {
      const b = get('/both');
      await sleep(50);
      const f = await get('/fast');
      const d = await b;
      took.push(d.t1 - d.t0); held.push(f.t1 - f.t0);
    }
    await stop(p);
    r.both = { took: median(took), fast: median(held) };
    console.log(side.name, 'both: took', took.map((x) => x.toFixed(0)).join(' '), '| /fast', held.map((x) => x.toFixed(0)).join(' '));
  }
  console.log(side.name, 'compute: /fast', blocked.map((x) => x.toFixed(1)).join(' '));
  // memory
  {
    const p = await start(side);
    const rss = () => Number(execFileSync('ps', ['-o', 'rss=', '-p', String(p.pid)]).toString().trim()) * 1024;
    // --instances runs its copies as threads of one process (one pid), so ps sees them all
    const idle = rss();
    let peak = idle, open = true;
    const all = Promise.all(Array.from({ length: 1000 }, () => get('/slow'))).then((d) => { open = false; return d; });
    while (open) { peak = Math.max(peak, rss()); await sleep(50); }
    const done = await all;
    if (done.some((d) => d.status !== 200)) throw new Error(`${side.name}: a sleeping request failed`);
    r.memory = { idle, peak };
    await stop(p);
    console.log(side.name, 'memory: idle', (idle / 1e6).toFixed(1), 'MB, with 1,000 asleep', (peak / 1e6).toFixed(1), 'MB');
  }
  // count and lost
  let p = await start(side);
  const counts = await Promise.all(Array.from({ length: 1000 }, () => get('/count')));
  r.count = Math.max(...counts.map((c) => +c.body));
  await stop(p);
  p = await start(side);
  const losts = await Promise.all(Array.from({ length: 200 }, () => get('/lost')));
  r.lost = Math.max(...losts.map((c) => +c.body));
  await stop(p);
  p = await start(side);
  const safes = await Promise.all(Array.from({ length: 200 }, () => get('/safe')));
  r.safe = Math.max(...safes.map((c) => +c.body));
  await stop(p);
  console.log(side.name, 'count after 1,000:', r.count, '| lost: count after 200:', r.lost, '| safe: count after 200:', r.safe);
}
// --max-compute
{
  const p = await start({ name: 'limit', args: ['--max-compute', '500ms'] });
  const b = await get('/busy');
  out.limit = { status: b.status, ms: b.t1 - b.t0, body: b.body.slice(0, 200) };
  await stop(p);
  console.log('--max-compute 500ms: /busy', b.status, (b.t1 - b.t0).toFixed(0), 'ms', JSON.stringify(b.body.slice(0, 120)));
}
upstream.kill();
out.load = os.loadavg().map((x) => +x.toFixed(2));
out.when = new Date().toISOString();
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out));
process.exit(0);
