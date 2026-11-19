// Sign-ups for Saturday's hike, posted to each side as a visitor (or anyone with curl) could, then one posted by a
// page on another site in a real browser. What each side did with each:
//   node forms.mjs fresh <out.json>          Fresh as its guide shows (form.get(...)?.toString(), Number()), port 8000
//   node forms.mjs fresh-strict <out.json>   the same with variants/strict-index.tsx (text only, digits only)
//   node forms.mjs fresh-csrf <out.json>     the same with variants/main-csrf.ts (app.use(csrf()))
//   node forms.mjs quillo <out.json>         Quillo: ../app (quillo run main.qwe), port 8140
// A Fresh side is built first (deno task build) with its variant in place, and the files are put back after. Each side
// from a fresh club.db; the server is started here, and only it is stopped. The other site is 127.0.0.1:9000 (the
// club is at localhost, another site to a browser), served here from other-site/.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const fresh = path.join(here, 'fresh');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const FRESH = { cwd: fresh, cmd: 'deno', args: ['serve', '-A', '--port', '8000', '_fresh/server.js'], url: 'http://localhost:8000', post: '/' };
const SIDES = {
  fresh: { ...FRESH, swap: [] },
  'fresh-strict': { ...FRESH, swap: [['variants/strict-index.tsx', 'routes/index.tsx']] },
  'fresh-csrf': { ...FRESH, swap: [['variants/main-csrf.ts', 'main.ts']] },
  quillo: { cwd: appDir, cmd: path.join(appDir, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8140'], url: 'http://localhost:8140', post: '/signup' },
};
const CASES = [
  ['guests=2', { name: 'Ada', guests: '2' }],
  ['guests=abc', { name: 'Ben', guests: 'abc' }],
  ['guests=1e1', { name: 'Cy', guests: '1e1' }],
  ['guests=0x0A', { name: 'Dee', guests: '0x0A' }],
  ['guests=12.0', { name: 'Eli', guests: '12.0' }],
  ['no guests', { name: 'Flo' }],
  ['name=(spaces)', { name: '   ', guests: '2' }],
  ['name=(a file)', { name: new File(['hello\n'], 'hello.txt', { type: 'text/plain' }), guests: '2' }],
];
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node forms.mjs fresh|fresh-strict|fresh-csrf|quillo <out.json>'); process.exit(2); }

if (S.cwd === fresh) {
  const saved = S.swap.map(([from, to]) => { const t = path.join(fresh, to), keep = fs.readFileSync(t); fs.copyFileSync(path.join(fresh, from), t); return [t, keep]; });
  const b = spawnSync('deno', ['task', 'build'], { cwd: fresh, encoding: 'utf8' });
  for (const [t, keep] of saved) fs.writeFileSync(t, keep);
  if (b.status !== 0) { console.error(b.stdout, b.stderr); process.exit(1); }
}
const dbs = ['club.db', 'club.db-wal', 'club.db-shm'].map((f) => path.join(S.cwd, f));
for (const f of dbs) fs.rmSync(f, { force: true });
const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: 'ignore', detached: true });
const other = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(fs.readFileSync(path.join(here, 'other-site/index.html'))); }).listen(9000, '127.0.0.1');
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(S.url)).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }

const clean = (html) => html.replace(/<!--.*?-->/g, '');
const list = async () => [...clean(await (await fetch(S.url + '/')).text()).matchAll(/<li(?:\s[^>]*)?>(.*?)<\/li>/g)].map((m) => m[1]);
const results = [];
for (const [label, fields] of CASES) {
  const hasFile = Object.values(fields).some((v) => v instanceof File);
  let body;
  if (hasFile) { body = new FormData(); for (const [k, v] of Object.entries(fields)) body.append(k, v); }
  else body = new URLSearchParams(fields);
  const before = (await list()).length;
  const r = await fetch(S.url + S.post, { method: 'POST', body, redirect: 'manual' });
  const html = clean(await r.text());
  const after = await list();
  const said = [...html.matchAll(/<strong>\s*(.*?)<\/strong>/g)].map((m) => m[1]).join(', ');
  const what = after.length > before ? `added "${after.at(-1)}"` : said ? said : r.status === 403 ? 'refused' : html.trim().slice(0, 60);
  results.push({ case: label, status: r.status, what });
}

// The other site's page posts as it opens; where did it go, and is "Someone else" on the list?
const browser = await chromium.launch();
const page = await browser.newPage();
let posted = null;
page.on('response', (r) => { if (r.request().method() === 'POST') posted = { status: r.status(), url: r.url() }; });
await page.goto(`http://127.0.0.1:9000/?to=${S.url + S.post}`);
await page.waitForTimeout(2000);
const crossBody = clean(await page.content()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
await browser.close();
const signedUp = (await list()).some((l) => l.startsWith('Someone else'));
const cross = { status: posted?.status ?? null, added: signedUp, page: crossBody };

stop(); other.close();
for (const f of dbs) fs.rmSync(f, { force: true });
fs.writeFileSync(outFile, JSON.stringify({ side, results, cross }, null, 1) + '\n');
console.log(side);
for (const r of results) console.log(`  ${r.case.padEnd(15)} ${String(r.status).padEnd(4)} ${r.what}`);
console.log(`  ${'other site'.padEnd(15)} ${String(cross.status).padEnd(4)} ${cross.added ? 'added "Someone else: 12"' : 'not added'}`);
