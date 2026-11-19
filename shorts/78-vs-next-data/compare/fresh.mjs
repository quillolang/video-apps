// Does the page show a row added while it runs? For each side, from the three seeded trails:
//   node shorts/78-vs-next-data/compare/fresh.mjs next      Next.js, production: next start -p 3010 (after next build)
//   node shorts/78-vs-next-data/compare/fresh.mjs next-dev  Next.js, while you work: next dev -p 3011
//   node shorts/78-vs-next-data/compare/fresh.mjs quillo    Quillo: quillo run main.qwe --port 8118
// Each side's trails.db is made afresh from seed.sql (Quillo's by its migration), the server is started, the page
// is fetched; then a fourth trail is inserted with the sqlite3 command, and the page is fetched again, now and
// after two seconds. Prints each list as the page shows it. The server is started here, and only it is stopped.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const SIDES = {
  next: { cwd: path.join(here, 'next'), cmd: 'npx', args: ['next', 'start', '-p', '3010'], url: 'http://localhost:3010/', seed: true },
  'next-dev': { cwd: path.join(here, 'next'), cmd: 'npx', args: ['next', 'dev', '-p', '3011'], url: 'http://localhost:3011/', seed: true },
  quillo: { cwd: appDir, cmd: path.join(appDir, '.quillo', 'bin', 'quillo'), args: ['run', 'main.qwe', '--port', '8118'], url: 'http://127.0.0.1:8118/' },
};
const side = process.argv[2], S = SIDES[side];
if (!S) { console.error('usage: node fresh.mjs next|next-dev|quillo'); process.exit(2); }
const db = path.join(S.cwd, 'trails.db');
for (const f of [db, `${db}-wal`, `${db}-shm`]) fs.rmSync(f, { force: true });
if (S.seed) execFileSync('sh', ['-c', 'sqlite3 trails.db < ../seed.sql'], { cwd: S.cwd });

const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
let log = '';
server.stdout.on('data', (d) => { log += d; }); server.stderr.on('data', (d) => { log += d; });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const list = async () => {
  const html = await (await fetch(S.url)).text();
  return [...html.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/g)].map((m) => m[1].replace(/<!--[^>]*-->/g, '').replace(/<[^>]+>/g, '').trim());
};
for (let i = 0; ; i++) {
  if (server.exitCode != null) throw new Error(`the server stopped:\n${log}`);
  try { if ((await fetch(S.url)).ok) break; } catch {}
  if (i > 300) throw new Error(`no answer at ${S.url}:\n${log}`);
  await new Promise((r) => setTimeout(r, 100));
}
console.log(`before:        ${(await list()).join(' · ')}`);
execFileSync('sqlite3', [db, "insert into trails (name, km) values ('Lake Trail', 6.1)"]);
console.log(`added a trail: ${(await list()).join(' · ')}`);
await new Promise((r) => setTimeout(r, 2000));
console.log(`2 s later:     ${(await list()).join(' · ')}`);
stop();
