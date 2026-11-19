// The conditions board, tried the same ways on each side, in a real browser, with a ranger's POST /status (curl's
// way: a form body) for each change. What each step saw goes in <out.json>, and a table to stderr:
//   node live.mjs <side> <out.json>        side: express | no-cleanup | compression | compression-flush | quillo
//   express      compare/express/app.js                    node, port 3000
//   no-cleanup   compare/express/variants/no-cleanup.js     the same, without req.on('close')
//   compression  compare/express/variants/compression.js    the same, with app.use(compression())
//   compression-flush   variants/compression-flush.js       and res.flush() after each event, as compression's README says
//   quillo       ../app/main.qwe                           quillo run, port 8131
// Steps, each from a fresh club.db (three trails: Fern Gully muddy):
//   opened     do the first two tabs show the board within 5 s of opening?
//   two tabs   two tabs open; Fern Gully set to closed: does each tab show it within 3 s, without a reload?
//   late tab   a third tab, opened after that: does it show closed?
//   closed     ten more tabs opened and closed again, then one more change: what Express's log says it wrote to
//   restart    the server stopped and started again under an open tab; 5 s later, a change: does the tab show it within 8 s?
// The server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const express = path.join(here, 'express');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const quillo = path.join(appDir, '.quillo', 'bin', 'quillo');
const SIDES = {
  express: { cwd: express, cmd: 'node', args: ['app.js'], url: 'http://localhost:3000/' },
  'no-cleanup': { cwd: express, cmd: 'node', args: ['variants/no-cleanup.js'], url: 'http://localhost:3000/' },
  compression: { cwd: express, cmd: 'node', args: ['variants/compression.js'], url: 'http://localhost:3000/' },
  'compression-flush': { cwd: express, cmd: 'node', args: ['variants/compression-flush.js'], url: 'http://localhost:3000/' },
  quillo: { cwd: appDir, cmd: quillo, args: ['run', 'main.qwe', '--port', '8131'], url: 'http://127.0.0.1:8131/' },
};
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error(`usage: node live.mjs ${Object.keys(SIDES).join('|')} <out.json>`); process.exit(2); }

let server = null, log = '';
const start = async () => {
  log = '';
  server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  server.stdout.on('data', (d) => { log += d; }); server.stderr.on('data', (d) => { log += d; });
  for (let i = 0; ; i++) {
    if (server.exitCode != null) throw new Error(`the server stopped:\n${log}`);
    try { if ((await fetch(S.url)).ok) return; } catch {}
    if (i > 300) throw new Error(`no answer at ${S.url}:\n${log}`);
    await new Promise((r) => setTimeout(r, 100));
  }
};
const stop = () => new Promise((r) => { if (!server || server.exitCode != null) return r(); server.on('exit', r); try { process.kill(-server.pid, 'SIGTERM'); } catch { r(); } });
process.on('exit', () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGKILL'); } catch {} } });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(S.cwd, f), { force: true });

const post = (id, status) => fetch(S.url + 'status', { method: 'POST', body: new URLSearchParams({ id: String(id), status }) });
const shows = (page, text, ms) => page.waitForFunction((t) => document.body.innerText.includes(t), text, { timeout: ms }).then(() => true, () => false);
const result = { side, steps: {} };

await start();
const browser = await chromium.launch();
const ctx = await browser.newContext();
// A tab, and whether its board showed up within 5 s (with compression, the first event never arrives).
const open = async () => {
  const p = await ctx.newPage(); await p.goto(S.url);
  p.loaded = await p.locator('li').first().waitFor({ timeout: 5000 }).then(() => true, () => false);
  await p.waitForTimeout(800); return p;
};

// two tabs
const a = await open(), b = await open();
await post(2, 'closed');
result.steps.two_tabs = { loaded: a.loaded && b.loaded, a: await shows(a, 'Fern Gully: closed', 3000), b: await shows(b, 'Fern Gully: closed', 3000) };
// late tab
const c = await open();
result.steps.late_tab = { shows: await shows(c, 'Fern Gully: closed', 1000) };
await c.close();
// closed tabs
for (let i = 0; i < 10; i++) { const t = await open(); await t.close(); }
await new Promise((r) => setTimeout(r, 1000));
await post(1, 'muddy');
await new Promise((r) => setTimeout(r, 1000));
const sent = [...log.matchAll(/sent to (\d+) open pages/g)].map((m) => Number(m[1]));
result.steps.closed_tabs = { open_now: 2, express_says: sent.at(-1) ?? null, a: await shows(a, 'Coastal Path: muddy', 3000) };
await b.close();
// restart
await stop();
await new Promise((r) => setTimeout(r, 500));
await start();
await new Promise((r) => setTimeout(r, 5000));
await post(3, 'closed');
result.steps.restart = { shows: await shows(a, 'Ridge Loop: closed', 8000), board: (await a.locator('li').allInnerTexts()).join(' · ') };

await browser.close();
await stop();
result.log = log.trim();
fs.writeFileSync(outFile, JSON.stringify(result, null, 1) + '\n');
const yes = (v) => (v ? 'yes' : 'no');
const T = result.steps;
console.error(`${side}`);
console.error(`  opened:      ${T.two_tabs.loaded ? 'the board shows' : 'the board stays empty'}`);
console.error(`  two tabs:    tab A ${yes(T.two_tabs.a)}, tab B ${yes(T.two_tabs.b)}`);
console.error(`  late tab:    ${yes(T.late_tab.shows)}`);
console.error(`  closed tabs: 2 open, ${T.closed_tabs.express_says == null ? 'no count in the log' : `sent to ${T.closed_tabs.express_says}`}; tab A ${yes(T.closed_tabs.a)}`);
console.error(`  restart:     ${yes(T.restart.shows)}`);
