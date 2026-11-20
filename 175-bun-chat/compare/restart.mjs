// Trail Club's chat on each side, in two tabs (Ana and Ben, each in a browser context of their own), through a
// restart of the server, as a deploy does:
//   1. Ana says "hello"                      (both tabs should show it)
//   2. the server stops; Ana says "anyone there?" while it's down
//   3. the server starts again; 5 s later, Ben says "back again"
// Done in <rounds> rounds (5 unless given), each from a fresh server and fresh tabs. What each tab shows after each
// step, its sockets (opened, closed) and its console errors go in <out.json>; the first round is printed in full.
//   node restart.mjs bun <out.json> [rounds]            chat/ (index.ts), NODE_ENV=production, port 3000
//   node restart.mjs bun-reconnect <out.json> [rounds]  chat/variants/reconnect/ (the same server; the page reconnects)
//   node restart.mjs quillo <out.json> [rounds]         ../steps/v1 (main.qwe, the chat), port 8175
//   node restart.mjs quillo-wt <out.json> [rounds]      the same, opened at 127.0.0.1 (WebTransport)
// Each server is started here, and only it is stopped (SIGTERM, then the same command again).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const chat = path.join(here, 'chat'), app = path.join(here, '..', 'steps', 'v1');
const bun = (file) => ({ cwd: chat, cmd: 'bun', args: [file], env: { NODE_ENV: 'production' }, url: 'http://localhost:3000' });
const SIDES = {
  bun: bun('index.ts'),
  'bun-reconnect': bun('variants/reconnect/index.ts'),
  quillo: { cwd: app, cmd: path.join(app, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8175'], env: {}, url: 'http://localhost:8175' },
  // The same at 127.0.0.1, where the page takes WebTransport (at localhost it tries ::1, where nothing listens on UDP).
  'quillo-wt': { cwd: app, cmd: path.join(app, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8175'], env: {}, url: 'http://127.0.0.1:8175' },
};
const [side, outFile, roundsArg] = process.argv.slice(2);
const S = SIDES[side], ROUNDS = Number(roundsArg || 5);
if (!S || !outFile) { console.error('usage: node restart.mjs bun|bun-reconnect|quillo|quillo-wt <out.json> [rounds]'); process.exit(2); }

let server = null;
const start = async () => {
  server = spawn(S.cmd, S.args, { cwd: S.cwd, env: { ...process.env, ...S.env }, stdio: 'ignore', detached: true });
  for (let i = 0; ; i++) { try { if ((await fetch(S.url + '/')).ok) return; } catch {} if (i > 300) throw new Error(`nothing at ${S.url}`); await new Promise((r) => setTimeout(r, 50)); }
};
const stop = () => new Promise((r) => { if (!server || server.exitCode != null) return r(); server.on('exit', r); try { process.kill(-server.pid, 'SIGTERM'); } catch { r(); } });
process.on('exit', () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGKILL'); } catch {} } });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const secs = (ms) => +(ms / 1000).toFixed(1);

const browser = await chromium.launch();
async function round(n) {
  await start();
  const tabs = {};
  for (const who of ['Ana', 'Ben']) {
    const context = await browser.newContext({ viewport: { width: 480, height: 300 } });
    const page = await context.newPage();
    const t = { context, page, sockets: [], errors: [] };
    page.on('websocket', (ws) => {
      const s = { url: ws.url().replace(/^ws:\/\/[^/]+/, '').replace(/\?.*/, '?…'), opened: Date.now(), closed: null };
      t.sockets.push(s); ws.on('close', () => { s.closed = Date.now(); });
    });
    page.on('console', (m) => { if (m.type() === 'error') t.errors.push(m.text().replace(/\?t=[^:\s]+/, '?…')); });
    page.on('pageerror', (e) => t.errors.push(String(e)));
    await page.goto(S.url + '/');
    await page.locator('input').first().fill(who);
    tabs[who] = t;
  }
  await wait(1500);
  const say = async (who, text) => {
    const p = tabs[who].page;
    await p.locator('input').nth(1).fill(text);
    await p.locator('button').click();
  };
  const lines = async (who) => (await tabs[who].page.locator('li').allInnerTexts()).map((s) => s.trim());
  const t0 = Date.now(), steps = [];
  const snap = async (what) => {
    const s = { what, at: secs(Date.now() - t0), Ana: await lines('Ana'), Ben: await lines('Ben') };
    steps.push(s);
    if (n === 1) console.log(`${s.what}\n  Ana's tab: ${JSON.stringify(s.Ana)}\n  Ben's tab: ${JSON.stringify(s.Ben)}`);
  };
  await say('Ana', 'hello'); await wait(1000);
  await snap('Ana: hello');
  await stop(); await wait(1000);
  await say('Ana', 'anyone there?'); await wait(1000);
  await snap('server stopped; Ana: anyone there?');
  await start(); const restarted = Date.now(); await wait(5000);
  await say('Ben', 'back again'); await wait(1500);
  await snap('server started; 5 s later, Ben: back again');
  const out = { round: n, steps, sockets: {}, errors: {}, back_after: {} };
  for (const [who, t] of Object.entries(tabs)) {
    out.sockets[who] = t.sockets.map((s) => ({ url: s.url, opened: secs(s.opened - t0), closed: s.closed && secs(s.closed - t0) }));
    out.errors[who] = t.errors;
    // When the tab's socket that stayed open (the one it had at the end) opened, counted from the restart.
    const last = t.sockets.at(-1);
    out.back_after[who] = last && last.closed == null && last.opened >= restarted ? secs(last.opened - restarted) : null;
    await t.context.close();
  }
  await stop();
  const end = steps.at(-1);
  out.summary = {
    ana_back: end.Ana.includes('Ben: back again'), ben_back: end.Ben.includes('Ben: back again'),
    waiting_line_reached_ana: end.Ana.includes('Ana: anyone there?'), waiting_line_reached_ben: end.Ben.includes('Ana: anyone there?'),
    back_after: out.back_after,
  };
  console.log(`round ${n}: ${JSON.stringify(out.summary)}`);
  return out;
}
const rounds = [];
for (let n = 1; n <= ROUNDS; n++) rounds.push(await round(n));
await browser.close();
const count = (k) => rounds.filter((r) => r.summary[k]).length;
const totals = Object.fromEntries(['ana_back', 'ben_back', 'waiting_line_reached_ana', 'waiting_line_reached_ben'].map((k) => [k, count(k)]));
console.log(`${ROUNDS} rounds: ${JSON.stringify(totals)}`);
fs.writeFileSync(outFile, JSON.stringify({ side, when: new Date().toString(), rounds: ROUNDS, totals, runs: rounds }, null, 1) + '\n');
