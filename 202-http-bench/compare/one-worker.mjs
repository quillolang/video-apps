// Dioxus with TOKIO_WORKER_THREADS=1: how many cores its server uses anyway, on each answer (5 s each).
//   node compare/one-worker.mjs > compare/runs/run-dioxus-one-worker.txt
import { spawn, execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.resolve(here, '../../..');
const build = fs.existsSync(path.join(root, 'engine/build.mjs')) ? path.join(root, '.cache/rust-target/v202') : path.join(here, '.build');
const dx = path.join(build, 'dioxus'), load = path.join(build, 'load');   // load: built by bench.mjs
const cpuOf = (pgid) => execFileSync('ps', ['-axo', 'pgid=,time=']).toString().trim().split('\n').map((l) => l.trim().split(/\s+/))
  .filter(([g]) => Number(g) === pgid).reduce((s, [, t]) => s + t.split(':').reduce((a, x) => a * 60 + Number(x), 0), 0);
const threadsOf = (pid) => execFileSync('ps', ['-M', '-p', String(pid)]).toString().trim().split('\n').length - 1;
const server = spawn('./server', [], { cwd: dx, stdio: 'ignore', detached: true, env: { ...process.env, IP: '127.0.0.1', PORT: '8098', TOKIO_WORKER_THREADS: '1' } });
await new Promise((r) => setTimeout(r, 1500));
console.log(`$ TOKIO_WORKER_THREADS=1 ./server   (Dioxus 0.7.10, on ${(await import('node:os')).cpus().length} cores)`);
console.log(`threads in the server: ${threadsOf(server.pid)}`);
try {
  for (const sc of ['text', 'fortunes', 'db', 'compute']) {
    const cpu0 = cpuOf(server.pid), t0 = performance.now();
    const r = JSON.parse(execFileSync(load, [`http://127.0.0.1:8098/${sc}`, '64', '4', '5']));
    const used = (cpuOf(server.pid) - cpu0) / ((performance.now() - t0) / 1000);
    console.log(`/${sc}: ${r.rps} requests a second, ${used.toFixed(1)} cores used`);
  }
  console.log(`threads in the server: ${threadsOf(server.pid)}`);
} finally { process.kill(-server.pid, 'SIGKILL'); }
