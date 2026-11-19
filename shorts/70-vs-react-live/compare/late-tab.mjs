// The first try (variants/connect-early: socket.js connects as it's imported, and App's useEffect listens after the
// first render) against the page as it is (autoConnect: false, and connect() in the effect, after socket.on):
//   node shorts/70-vs-react-live/compare/late-tab.mjs
// For each, from an empty wall.db: tab A posts a note, then five new tabs are opened, one after another, and each
// is given 3 seconds to show it. The first try's files are put in place for its run, and put back however it ends.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const server = path.join(here, 'server'), client = path.join(here, 'client'), src = path.join(client, 'src');
const port = 5176, kept = Object.fromEntries(['socket.js', 'App.jsx'].map((f) => [f, fs.readFileSync(path.join(src, f), 'utf8')]));
const kids = [];
const putBack = () => { for (const [f, s] of Object.entries(kept)) fs.writeFileSync(path.join(src, f), s); };
const stopAll = () => { for (const k of kids.splice(0)) { try { process.kill(-k.pid, 'SIGTERM'); } catch {} } };
process.on('exit', () => { stopAll(); putBack(); });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const start = (cmd, args, cwd) => { const k = spawn(cmd, args, { cwd, stdio: 'ignore', detached: true }); kids.push(k); return k; };
const until = async (url) => { for (let i = 0; i < 300; i++) { try { await fetch(url); return; } catch { await new Promise((r) => setTimeout(r, 100)); } } throw new Error(`nothing at ${url}`); };

const run = async (name) => {
  for (const f of ['wall.db', 'wall.db-wal', 'wall.db-shm']) fs.rmSync(path.join(server, f), { force: true });
  start('npm', ['start'], server); await until('http://localhost:3002/socket.io/?EIO=4&transport=polling');
  start('npx', ['vite', '--port', String(port), '--strictPort'], client); await until(`http://localhost:${port}/`);
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const a = await ctx.newPage(); await a.goto(`http://localhost:${port}/`); await a.locator('form').waitFor(); await a.waitForTimeout(800);
  await a.locator('input').fill('Hi from tab A!'); await a.locator('form button').click();
  await a.waitForFunction(() => document.querySelectorAll('li').length === 1);
  const seen = [];
  for (let i = 0; i < 5; i++) {
    const t = await ctx.newPage(); await t.goto(`http://localhost:${port}/`);
    seen.push(await t.waitForFunction(() => document.querySelectorAll('li').length === 1, null, { timeout: 3000 }).then(() => 'shows it', () => 'empty'));
    await t.close();
  }
  await browser.close(); stopAll(); await new Promise((r) => setTimeout(r, 500));
  console.log(`${name}: ${seen.join(', ')}`);
};

for (const f of ['socket.js', 'App.jsx']) fs.copyFileSync(path.join(here, 'variants/connect-early', f), path.join(src, f));
await run('first try (connects as imported)');
putBack();
await run('as it is (connects in the effect)');
