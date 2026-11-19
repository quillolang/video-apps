// React + Express's screenshots for the Short: the API (server/, `npm start`, port 3001) from an empty todos.db, and
// the page from Vite's dev server (client/, `npm run dev`, port 5175, which passes /api on to 3001):
//   node shorts/68-vs-react-fullstack/compare/shots-react.mjs
// The empty list (r0), three to-dos added (r1), "Learn HTML" taken off (r2), and the page opened again in a new tab
// (r3), into ../assets, with the tab's title and path in assets/titles.json and urls.json, as shots() writes them
// for Quillo. The same viewport and density as ../shots.mjs. Both servers are started here, and only these are stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'assets'), server = path.join(here, 'server'), client = path.join(here, 'client');
const viewport = { width: 320, height: 200 }, dsf = 3, port = 5175;
const ADD = ['Learn HTML', 'Learn JavaScript', 'Make a Short'];
for (const f of ['todos.db', 'todos.db-wal', 'todos.db-shm']) fs.rmSync(path.join(server, f), { force: true });

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

const api = start('npm', ['start'], server);
await until('http://localhost:3001/api/todos', api);
const vite = start('npx', ['vite', '--port', String(port), '--strictPort'], client);
await until(`http://localhost:${port}/`, vite);
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: dsf });
  const errors = [];
  const open = async () => { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message)); await p.goto(`http://localhost:${port}/`); await p.locator('form').waitFor(); await p.waitForTimeout(500); return p; };
  const snap = async (page, name, want) => {
    const got = await page.locator('li').evaluateAll((lis) => lis.map((li) => li.firstChild.textContent.trim()));
    if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`the list is ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title());
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${got.join(', ') || '(empty)'}`);
  };
  const page = await open();
  await snap(page, 'r0', []);
  for (const [i, text] of ADD.entries()) {
    await page.locator('input').fill(text);
    await page.locator('form button').click();
    await page.waitForFunction((n) => document.querySelectorAll('li').length === n, i + 1);
  }
  await snap(page, 'r1', ADD);
  await page.locator('li').first().locator('button').click();
  await page.waitForFunction(() => document.querySelectorAll('li').length === 2);
  await snap(page, 'r2', ADD.slice(1));
  await snap(await open(), 'r3', ADD.slice(1));
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
} finally {
  await browser.close();
  stopAll();
}
