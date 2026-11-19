// React + socket.io's screenshots for the Short: the socket.io server (server/, `npm start`, port 3002) from an empty
// wall.db, and the page from Vite's dev server (client/, port 5176, which the server's CORS lets in):
//   node shorts/70-vs-react-live/compare/shots-react.mjs
// Two tabs: both empty (ra0, rb0); tab A posts, and tab B shows it too (ra1, rb1); tab B answers, and tab A shows it
// too (ra2, rb2). Nothing is reloaded; then a third tab, opened last, must show both. Into ../assets, with
// titles.json and urls.json as shots() writes them for Quillo, the same viewport and density as ../shots.mjs.
// Both servers are started here, and only these are stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'assets'), server = path.join(here, 'server'), client = path.join(here, 'client');
const viewport = { width: 320, height: 160 }, dsf = 3, port = 5176;
const A = 'Hi from tab A!', B = 'Hello back from B!';
for (const f of ['wall.db', 'wall.db-wal', 'wall.db-shm']) fs.rmSync(path.join(server, f), { force: true });

const kids = [];
const start = (cmd, args, cwd) => {
  const kid = spawn(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NO_COLOR: '1' } });
  kid.log = ''; kid.stdout.on('data', d => { kid.log += d; }); kid.stderr.on('data', d => { kid.log += d; });
  kids.push(kid); return kid;
};
const stopAll = () => { for (const k of kids) { try { process.kill(-k.pid, 'SIGTERM'); } catch {} } };
process.on('exit', stopAll);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const until = async (url, kid) => {
  for (let i = 0; i < 300; i++) {
    if (kid.exitCode != null) throw new Error(`it stopped:\n${kid.log}`);
    try { await fetch(url); return; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  throw new Error(`nothing at ${url}:\n${kid.log}`);
};
const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};

const io = start('npm', ['start'], server);
await until('http://localhost:3002/socket.io/?EIO=4&transport=polling', io);
const vite = start('npx', ['vite', '--port', String(port), '--strictPort'], client);
await until(`http://localhost:${port}/`, vite);
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf });
  const errors = [];
  const open = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message)); await p.goto(`http://localhost:${port}/`); await p.locator('form').waitFor(); await p.waitForTimeout(800); return p; };
  const wait = async (page, want) => {
    await page.waitForFunction((n) => document.querySelectorAll('li').length === n, want.length);
    const got = await page.locator('li').allInnerTexts();
    if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`the wall is ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
  };
  const snap = async (page, name) => {
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title());
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${(await page.locator('li').allInnerTexts()).join(', ') || '(empty)'}`);
  };
  const a = await open(), b = await open();
  await wait(a, []); await wait(b, []); await snap(a, 'ra0'); await snap(b, 'rb0');
  await a.locator('input').fill(A); await a.locator('form button').click();
  await wait(a, [A]); await wait(b, [A]); await snap(a, 'ra1'); await snap(b, 'rb1');
  await b.locator('input').fill(B); await b.locator('form button').click();
  await wait(b, [A, B]); await wait(a, [A, B]); await snap(a, 'ra2'); await snap(b, 'rb2');
  await wait(await open(), [A, B]);              // a third tab, opened now, gets both
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
} finally {
  await browser.close();
  stopAll();
}
