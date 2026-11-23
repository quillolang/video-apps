// The benchmark's engine, the same in each of these videos (videos/202-207; the setting list is each one's bench.mjs).
// Each setting's server answers the same five requests; load.rs (64 keep-alive connections from 4 threads, one
// request in flight on each) loads each answer for `secs` seconds after a warm-up, in rounds that alternate the
// order. The CPU time each server used is measured too (cores used = CPU seconds / wall seconds, every process and
// thread the setting started), with its memory. Prints medians and writes every figure to runs/bench-<label>.json.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';

export const scenarios = ['text', 'json', 'fortunes', 'db', 'compute'];
const conns = 64, threads = 4;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const freePort = () => new Promise((ok) => { const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); }); });

// Builds and other generated files: .cache/rust-target/<video> inside quillo-videos, else compare/.build.
export function buildDir(here, video) {
  const root = path.resolve(here, '../../..');
  const dir = fs.existsSync(path.join(root, 'engine/build.mjs')) ? path.join(root, '.cache/rust-target', video) : path.join(here, '.build');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// A process started in a group of its own, so it and everything it starts can be measured and stopped together.
export const detached = (cmd, args, opts = {}) => spawn(cmd, args, { stdio: 'ignore', detached: true, ...opts });

// Quillo's two settings: one process (its default) and --instances 4.
export const quilloSetting = (appDir, procs) => ({
  key: `quillo-${procs}`, name: 'quillo', procs,
  start: (port) => [detached(path.join(appDir, '.quillo/bin/quillo'), ['run', 'main.qwe', '--port', String(port), '--log', 'off', ...(procs > 1 ? ['--instances', String(procs)] : [])], { cwd: appDir })],
});

const ps = (field) => execFileSync('ps', ['-axo', `pgid=,${field}=`]).toString().trim().split('\n').map((l) => l.trim().split(/\s+/));
const rssOf = (groups) => Math.round(ps('rss').filter(([g]) => groups.includes(Number(g))).reduce((s, [, r]) => s + Number(r), 0) / 1024 * 10) / 10;
const cpuOf = (groups) => ps('time').filter(([g]) => groups.includes(Number(g))).reduce((s, [, t]) => s + t.split(':').reduce((a, x) => a * 60 + Number(x), 0), 0);

export async function bench({ here, build, settings, secs = 10, rounds = 3, label = 'final', warm = 2 }) {
  const load = path.join(build, 'load');
  if (!fs.existsSync(load) || fs.statSync(load).mtimeMs < fs.statSync(path.join(here, 'load.rs')).mtimeMs) execFileSync('rustc', ['-O', '-o', load, path.join(here, 'load.rs')]);
  const rows = [];
  for (let round = 1; round <= rounds; round++) {
    for (const set of round % 2 ? settings : [...settings].reverse()) {
      const port = await freePort(), procs = set.start(port), groups = procs.map((p) => p.pid), prefix = set.prefix || '';
      try {
        let up = false;
        for (let i = 0; i < 600 && !up; i++) { try { up = (await fetch(`http://127.0.0.1:${port}${prefix}/text`)).ok; } catch {} if (!up) await sleep(50); }
        if (!up) throw new Error(`${set.key} did not start`);
        await sleep(500);
        const idle = rssOf(groups);
        for (const sc of scenarios) {
          const url = `http://127.0.0.1:${port}${prefix}/${sc}`;
          execFileSync(load, [url, String(conns), String(threads), String(set.warm ?? warm)]);   // warm up
          const cpu0 = cpuOf(groups), t0 = performance.now();
          const r = JSON.parse(execFileSync(load, [url, String(conns), String(threads), String(secs)]));
          const used = (cpuOf(groups) - cpu0) / ((performance.now() - t0) / 1000);
          const row = { round, set: set.key, name: set.name, procs: set.procs, sc, ...r, cores: Math.round(used * 100) / 100, rss: rssOf(groups), idle, load: os.loadavg()[0] };
          rows.push(row);
          process.stderr.write(`round ${round}, ${set.key} ${sc}: ${r.rps} req/s, p99 ${r.p99} ms, ${row.cores} cores, ${row.rss} MB${r.errors ? `, ${r.errors} errors` : ''} (${r.status}, ${r.bytes} B)\n`);
        }
      } finally {
        for (const p of procs) { try { process.kill(-p.pid, 'SIGKILL'); } catch {} }
        await sleep(1500);
      }
    }
  }
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
  const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)));
  const summary = [];
  console.log(`requests a second, median of ${rounds} (p99 latency in ms; cores used; memory under load in MB)`);
  console.log(''.padEnd(10) + settings.map((s) => s.key.padStart(30)).join(''));
  for (const sc of scenarios) {
    console.log(sc.padEnd(10) + settings.map((set) => {
      const rs = rows.filter((x) => x.set === set.key && x.sc === sc);
      const m = { set: set.key, name: set.name, procs: set.procs, sc, rps: median(rs.map((x) => x.rps)), p99: median(rs.map((x) => x.p99)), cores: median(rs.map((x) => x.cores)),
        rss: median(rs.map((x) => x.rss)), idle: median(rs.map((x) => x.idle)), bytes: rs[0].bytes, status: rs[0].status, errors: rs.reduce((s, x) => s + x.errors, 0), all: rs.map((x) => x.rps) };
      summary.push(m);
      return `${fmt(m.rps)} (${m.p99.toFixed(2)}; ${m.cores.toFixed(1)}c; ${m.rss})${m.errors ? '!' : ''}`.padStart(30);
    }).join(''));
  }
  console.log(`\nload average during the runs: ${Math.min(...rows.map((r) => r.load)).toFixed(1)} to ${Math.max(...rows.map((r) => r.load)).toFixed(1)}; ${os.cpus().length} cores, ${os.cpus()[0].model}`);
  fs.mkdirSync(path.join(here, 'runs'), { recursive: true });
  fs.writeFileSync(path.join(here, 'runs', `bench-${label}.json`), JSON.stringify({ secs, rounds, conns, threads, warm, settings: settings.map((s) => s.key), machine: os.cpus()[0].model, summary, rows }, null, 1));
}
