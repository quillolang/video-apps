// The benchmark: Quillo (main.qwe) and Dioxus (dioxus/, built by build.sh) answering the same five requests, each
// loaded by load.rs (64 keep-alive connections from 4 threads, one request in flight on each), in rounds that
// alternate which side goes first. The settings: Quillo as one process (its default) and as four (--instances 4);
// Dioxus with four Tokio workers, and as it ships (a worker for each core); and the same answers as plain axum
// routes in the same server (/axum/...), on one worker and on four. Dioxus renders pages and runs server
// functions on a pool of its own, one thread for each core, whatever the worker count, so the CPU time each server
// used is measured too: cores used = CPU seconds / wall seconds. Prints requests a second, p99 latency, cores used
// and memory, and writes every figure to runs/bench-<label>.json.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
const here = path.dirname(fileURLToPath(import.meta.url));
// The builds: .cache/rust-target/v202 inside quillo-videos, else compare/.build (see build.sh).
const root = path.resolve(here, '../../..'), build = fs.existsSync(path.join(root, 'engine/build.mjs')) ? path.join(root, '.cache/rust-target/v202') : path.join(here, '.build');
const secs = Number(process.argv[2] || 10), rounds = Number(process.argv[3] || 3), label = process.argv[4] || 'final';
const scenarios = ['text', 'json', 'fortunes', 'db', 'compute'], conns = 64, threads = 4;
// [side, workers]; 0 is Dioxus as it ships. axum is the Dioxus server's /axum/ routes.
const settings = [['quillo', 1], ['quillo', 4], ['dioxus', 4], ['dioxus', 0], ['axum', 1], ['axum', 4]];
const prefix = (name) => (name === 'axum' ? '/axum' : '');
const key = ([n, w]) => `${n}-${w || 'default'}`;
const quillo = path.join(appDir, '.quillo/bin/quillo'), dioxusDir = path.join(build, 'dioxus');
const load = path.join(build, 'load');
fs.mkdirSync(build, { recursive: true });
if (!fs.existsSync(load) || fs.statSync(load).mtimeMs < fs.statSync(path.join(here, 'load.rs')).mtimeMs) execFileSync('rustc', ['-O', '-o', load, path.join(here, 'load.rs')]);
fs.copyFileSync(path.join(appDir, 'fortunes.db'), path.join(dioxusDir, 'fortunes.db'));

const freePort = () => new Promise((ok) => { const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function start(name, port, procs) {
  const opts = { stdio: 'ignore', detached: true };
  if (name === 'quillo') return spawn(quillo, ['run', 'main.qwe', '--port', String(port), '--log', 'off', ...(procs > 1 ? ['--instances', String(procs)] : [])], { ...opts, cwd: appDir });
  return spawn(path.join(dioxusDir, 'server'), [], { ...opts, cwd: dioxusDir, env: { ...process.env, IP: '127.0.0.1', PORT: String(port), ...(procs ? { TOKIO_WORKER_THREADS: String(procs) } : {}), RUST_LOG: 'off' } });
}
// The memory of the server's processes (the process group the runner started), in MB.
const rssOf = (pgid) => {
  const out = execFileSync('ps', ['-axo', 'pgid=,rss=']).toString();
  return Math.round(out.trim().split('\n').map((l) => l.trim().split(/\s+/).map(Number)).filter(([g]) => g === pgid).reduce((s, [, r]) => s + r, 0) / 1024 * 10) / 10;
};

// The CPU time the server's processes have used so far, in seconds (ps's TIME, every thread counted).
const cpuOf = (pgid) => {
  const out = execFileSync('ps', ['-axo', 'pgid=,time=']).toString();
  return out.trim().split('\n').map((l) => l.trim().split(/\s+/)).filter(([g]) => Number(g) === pgid)
    .reduce((s, [, t]) => s + t.split(':').reduce((a, x) => a * 60 + Number(x), 0), 0);
};

const rows = [];
for (let round = 1; round <= rounds; round++) {
  for (const set of round % 2 ? settings : [...settings].reverse()) {
    const [name, procs] = set;
    const port = await freePort(), server = start(name, port, procs);
    try {
      let up = false;
      for (let i = 0; i < 200 && !up; i++) { try { up = (await fetch(`http://127.0.0.1:${port}${prefix(name)}/text`)).ok; } catch {} if (!up) await sleep(50); }
      if (!up) throw new Error(`${name} did not start`);
      await sleep(500);
      const idle = rssOf(server.pid);
      for (const sc of scenarios) {
        const url = `http://127.0.0.1:${port}${prefix(name)}/${sc}`;
        execFileSync(load, [url, String(conns), String(threads), '2']);           // warm up
        const cpu0 = cpuOf(server.pid), t0 = performance.now();
        const r = JSON.parse(execFileSync(load, [url, String(conns), String(threads), String(secs)]));
        const used = (cpuOf(server.pid) - cpu0) / ((performance.now() - t0) / 1000);
        const row = { round, set: key(set), name, procs, sc, ...r, cores: Math.round(used * 100) / 100, rss: rssOf(server.pid), idle, load: os.loadavg()[0] };
        rows.push(row);
        process.stderr.write(`round ${round}, ${row.set} ${sc}: ${r.rps} req/s, p99 ${r.p99} ms, ${row.cores} cores, ${row.rss} MB${r.errors ? `, ${r.errors} errors` : ''} (${r.status}, ${r.bytes} B)\n`);
      }
    } finally {
      try { process.kill(-server.pid, 'SIGKILL'); } catch {}
      await sleep(1000);
    }
  }
}
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)));
const summary = [];
console.log(`\nrequests a second, median of ${rounds} (p99 latency in ms; cores used; memory under load in MB)`);
console.log(''.padEnd(10) + settings.map((set) => key(set).padStart(30)).join(''));
for (const sc of scenarios) {
  const cells = settings.map((set) => {
    const rs = rows.filter((x) => x.set === key(set) && x.sc === sc);
    const m = { set: key(set), name: set[0], procs: set[1], sc, rps: median(rs.map((x) => x.rps)), p99: median(rs.map((x) => x.p99)), cores: median(rs.map((x) => x.cores)),
      rss: median(rs.map((x) => x.rss)), idle: median(rs.map((x) => x.idle)), bytes: rs[0].bytes, status: rs[0].status, errors: rs.reduce((s, x) => s + x.errors, 0), all: rs.map((x) => x.rps) };
    summary.push(m);
    return `${fmt(m.rps)} (${m.p99.toFixed(2)}; ${m.cores.toFixed(1)}c; ${m.rss})${m.errors ? '!' : ''}`.padStart(30);
  });
  console.log(sc.padEnd(10) + cells.join(''));
}
console.log(`\nload average during the runs: ${Math.min(...rows.map((r) => r.load)).toFixed(1)} to ${Math.max(...rows.map((r) => r.load)).toFixed(1)}; ${os.cpus().length} cores, ${os.cpus()[0].model}`);
fs.mkdirSync(path.join(here, 'runs'), { recursive: true });
fs.writeFileSync(path.join(here, 'runs', `bench-${label}.json`), JSON.stringify({ secs, rounds, conns, threads, settings: settings.map(key), machine: os.cpus()[0].model, summary, rows }, null, 1));
