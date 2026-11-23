// Four Bun.serve processes sharing a port with reusePort: how much CPU each one used while the page was loaded for
// 5 seconds (64 connections). On macOS one process takes them all.
//   node compare/reuseport.mjs > compare/runs/run-reuseport.txt
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { settings, build } from './sides.mjs';

const s = settings.find((x) => x.key === 'serve-4'), p = s.start(8098)[0];
await new Promise((r) => setTimeout(r, 2500));
const cpu = () => execFileSync('ps', ['-o', 'pid=,time=,command=', '-g', String(p.pid)]).toString().trim().split('\n')
  .filter((l) => l.includes('serve.ts')).map((l) => l.trim().split(/\s+/)).map(([pid, t]) => [pid, t.split(':').reduce((a, x) => a * 60 + Number(x), 0)]);
try {
  const before = new Map(cpu());
  execFileSync(path.join(build, 'load'), ['http://127.0.0.1:8098/fortunes', '64', '4', '5']);
  const after = cpu().filter(([pid]) => before.has(pid) && pid !== String(p.pid));   // the four children, not the parent that started them
  after.forEach(([pid, t], i) => console.log(`Bun process ${i + 1}: ${(t - before.get(pid)).toFixed(2)} s of CPU`));
} finally { process.kill(-p.pid, 'SIGKILL'); }
