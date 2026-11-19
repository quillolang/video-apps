// Five notes, each trying to break out of one place a value goes, posted to a board, then the page opened in a real
// browser: does any of them run, or change the page?
//   node contexts.mjs go <out.json>       Go: go/ (html/template), built with go build, port 8160
//   node contexts.mjs quillo-v1 <out.json> Quillo's first board: ../steps/v1 (quillo run main.qwe), port 8161
//   node contexts.mjs quillo <out.json>   Quillo with the color check: ../app, port 8161
// The notes (name, text, link, color), each from a fresh board:
//   text    Ana, <script>alert('text')</script>, /, green                       (the text, between tags)
//   attr    x" onmouseover="alert('attr'), hello, /, green                      (the name, in title="...")
//   link    Click me, my route, javascript:alert('link'), green                 (the link, in href="...")
//   style   Cy, my note, /, red; position: fixed; inset: 0; background: red    (the color, in style="color: ...")
//   script  </script><script>alert('script')</script>, last, /, green          (the last name, in the page's script)
// The page is loaded (any alert counted), each li hovered, the link clicked; the li of the style note is measured
// (does it cover the page?), and the page's "Latest note" line read. A note the board refuses (400) isn't on it. The
// server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const v1 = path.join(here, '..', 'steps', 'v1');
const GO = process.env.GO ?? 'go';
const SIDES = {
  go: { cwd: path.join(here, 'go'), cmd: path.join(here, 'go', 'notes'), args: [], url: 'http://localhost:8160/', build: [GO, ['build', '-o', 'notes', '.']] },
  'quillo-v1': { cwd: v1, cmd: path.join(v1, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8161'], url: 'http://localhost:8161/' },
  quillo: { cwd: appDir, cmd: path.join(appDir, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8161'], url: 'http://localhost:8161/' },
};
const NOTES = [
  ['text', 'Ana', "<script>alert('text')</script>", '/', 'green'],
  ['attr', `x" onmouseover="alert('attr')`, 'hello', '/', 'green'],
  ['link', 'Click me', 'my route', "javascript:alert('link')", 'green'],
  ['style', 'Cy', 'my note', '/', 'red; position: fixed; inset: 0; background: red'],
  ['script', "</script><script>alert('script')</script>", 'last', '/', 'green'],
];
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node contexts.mjs go|quillo-v1|quillo <out.json>'); process.exit(2); }
if (S.build) { const b = spawnSync(S.build[0], S.build[1], { cwd: S.cwd, encoding: 'utf8' }); if (b.status !== 0) { console.error(b.stderr); process.exit(1); } }
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(S.cwd, f), { force: true });
const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(S.url)).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }

const accepted = [], refused = {};
for (const [key, name, text, link, color] of NOTES) {
  const r = await fetch(S.url + 'notes', { method: 'POST', body: new URLSearchParams({ name, text, link, color }), redirect: 'manual' });
  if (r.status >= 400) refused[key] = { status: r.status, body: (await r.text()).trim() }; else accepted.push(key);
}
const html = await (await fetch(S.url)).text();
const lis = [...html.matchAll(/<li(?:\s[^>]*)?>[\s\S]*?<\/li>/g)].map((m) => m[0]);
const script = html.match(/const latest = "(?:[^"\\]|\\.)*";/)?.[0] ?? null;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 800, height: 600 } })).newPage();
const alerts = [];
let phase = 'load';
page.on('dialog', async (d) => { alerts.push({ when: phase, message: d.message() }); await d.dismiss(); });
await page.goto(S.url); await page.waitForTimeout(1000);
const styleLi = page.locator('li', { hasText: 'my note' });
const box = (await styleLi.count()) === 0 ? null : await styleLi.evaluate((li) => { const s = getComputedStyle(li), r = li.getBoundingClientRect(); return { position: s.position, color: s.color, width: Math.round(r.width), height: Math.round(r.height) }; });
const latestLine = (await page.locator('#latest').innerText()).trim();
phase = 'hover';
for (const li of await page.locator('li').all()) { await li.hover({ force: true }); await page.waitForTimeout(150); }
phase = 'click';
await page.locator('li', { hasText: 'my route' }).locator('a').click({ force: true }); await page.waitForTimeout(800);
await browser.close();
stop();
await new Promise((r) => setTimeout(r, 300));
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(S.cwd, f), { force: true });
if (S.build) fs.rmSync(S.cmd, { force: true });   // the binary go build made

const covers = !!box && box.position === 'fixed' && box.width >= 790 && box.height >= 590;
const result = { side, notes: NOTES.map(([k]) => ({ note: k, refused: refused[k] ?? null, li: accepted.includes(k) ? lis[accepted.indexOf(k)] ?? null : null, alerts: alerts.filter((a) => a.message === k) })), script, styleBox: box, covers, latestLine, alerts };
fs.writeFileSync(outFile, JSON.stringify(result, null, 1) + '\n');
console.log(side);
for (const n of result.notes) {
  const ran = n.refused ? `refused (${n.refused.status}: ${n.refused.body})` : n.alerts.length ? `RAN (${n.alerts.map((a) => a.when).join(', ')})` : null;
  const kept = n.note === 'style' ? (covers ? `took over the page (position: fixed, ${box.width}x${box.height})` : 'stayed in its note') : 'stayed text';
  console.log(`  ${n.note.padEnd(7)} ${ran ?? kept}`);
}
console.log(`  latest  "${latestLine}"`);
