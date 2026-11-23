// Starts Quillo (on 8095) and each other one-process setting (8096, 8097, ...), saves what curl gets from each in
// runs/ (run-curl-<setting>.txt: text, JSON and the loop; run-size.txt: the page's size; page-<setting>.html), then
// stops them. Addresses are 127.0.0.1, as FrankenPHP's Caddyfile names its site (a request for localhost gets nothing). The same file in each of these videos; the servers are sides.mjs's.
//   node compare/run-curl.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { here, settings } from './sides.mjs';

const ones = settings.filter((s) => s.procs === 1);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const procs = [], ports = {};
let port = 8095;
for (const s of ones) { ports[s.key] = port; procs.push(...s.start(port)); port++; }
const curl = (args) => execFileSync('curl', ['-s', ...args]).toString();
try {
  for (const s of ones) {
    for (let i = 0; i < 300; i++) { try { if (curl([`127.0.0.1:${ports[s.key]}${s.prefix || ''}/text`]) === 'Hello, World!') break; } catch {} await sleep(100); }
  }
  for (const s of ones) {   // a warm-up for the JIT and the JSP compiler, before anything is saved
    for (const p of ['fortunes', 'db']) for (let i = 0; i < 20; i++) curl([`127.0.0.1:${ports[s.key]}/${p}`]);
  }
  const size = [];
  for (const s of ones) {
    const at = `127.0.0.1:${ports[s.key]}${s.prefix || ''}`, lines = [];
    for (const p of ['text', 'json', 'compute']) lines.push(`$ curl -s ${at}/${p}`, curl([`${at}/${p}`]).trimEnd());
    fs.writeFileSync(path.join(here, 'runs', `run-curl-${s.name}.txt`), lines.join('\n') + '\n');
    size.push(`$ curl -s -o /dev/null -w "%{size_download} bytes\\n" ${at}/fortunes`, curl(['-o', '/dev/null', '-w', '%{size_download} bytes', `${at}/fortunes`]));
    fs.writeFileSync(path.join(here, 'runs', `page-${s.name}.html`), curl([`${at}/fortunes`]));
  }
  fs.writeFileSync(path.join(here, 'runs', 'run-size.txt'), size.join('\n') + '\n');
} finally {
  for (const p of procs) { try { process.kill(-p.pid, 'SIGKILL'); } catch {} }
}
