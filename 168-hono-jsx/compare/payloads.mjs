// Four notes a visitor could leave, posted to each board, then the page opened in a real browser: does any of them run?
//   node payloads.mjs hono <out.json>      Hono on Bun: compare/hono (bun run src/index.tsx), port 3000
//   node payloads.mjs hono-safe <out.json> the same, with variants/safe-link.tsx (a link only if it's http(s) or a path)
//   node payloads.mjs quillo <out.json>    Quillo: ../app (quillo run main.qwe), port 8132
// Each from a fresh club.db. The notes (name, text, link):
//   script   Ana, <script>alert('script')</script>, /
//   img      Ben, <img src=x onerror="alert('img')">, /
//   quote    x" onmouseover="alert('quote'), hello, /         (breaks out of the li's title="..." if not escaped)
//   link     Click me, my route, javascript:alert('link')     (a link that runs code when clicked)
// The page is loaded (any alert counted), each li hovered, and the last note's link clicked. Prints, for each note, its
// li as the server sent it, and the alerts that came. The server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const SIDES = {
  hono: { cwd: path.join(here, 'hono'), cmd: 'bun', args: ['run', 'src/index.tsx'], url: 'http://localhost:3000/' },
  'hono-safe': { cwd: path.join(here, 'hono'), cmd: 'bun', args: ['run', 'variants/safe-link.tsx'], url: 'http://localhost:3000/' },
  quillo: { cwd: appDir, cmd: path.join(appDir, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8132'], url: 'http://127.0.0.1:8132/' },
};
const NOTES = [
  ['script', 'Ana', "<script>alert('script')</script>", '/'],
  ['img', 'Ben', `<img src=x onerror="alert('img')">`, '/'],
  ['quote', `x" onmouseover="alert('quote')`, 'hello', '/'],
  ['link', 'Click me', 'my route', "javascript:alert('link')"],
];
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node payloads.mjs hono|hono-safe|quillo <out.json>'); process.exit(2); }
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(S.cwd, f), { force: true });
const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(S.url)).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }

for (const [, name, text, link] of NOTES) {
  const r = await fetch(S.url + 'notes', { method: 'POST', body: new URLSearchParams({ name, text, link }), redirect: 'manual' });
  if (r.status >= 400) throw new Error(`POST /notes: ${r.status}`);
}
const html = await (await fetch(S.url)).text();
const lis = [...html.matchAll(/<li\b[\s\S]*?<\/li>/g)].map((m) => m[0]);

const browser = await chromium.launch();
const page = await browser.newPage();
const alerts = [];
page.on('dialog', async (d) => { alerts.push({ when: phase, message: d.message() }); await d.dismiss(); });
let phase = 'load';
await page.goto(S.url); await page.waitForTimeout(1000);
phase = 'hover';
for (const li of await page.locator('li').all()) { await li.hover(); await page.waitForTimeout(200); }
phase = 'click';
await page.locator('li').last().locator('a').click(); await page.waitForTimeout(1000);
await browser.close();
stop();

const result = { side, notes: NOTES.map(([k], i) => ({ note: k, li: lis[i] ?? null, alerts: alerts.filter((a) => a.message === k) })), alerts };
fs.writeFileSync(outFile, JSON.stringify(result, null, 1) + '\n');
console.error(side);
for (const n of result.notes) console.error(`  ${n.note.padEnd(7)} ${n.alerts.length ? `RAN (${n.alerts.map((a) => a.when).join(', ')})` : 'stayed text'}`);
