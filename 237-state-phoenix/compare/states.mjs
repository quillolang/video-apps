// Puts the six kinds of state through the same events, in a real browser, for Quillo and for Phoenix LiveView
// (mix phx.server, prod), and prints what each counter shows:  node compare/states.mjs [quillo|phoenix ...]
// Needs: sh get-quillo.sh in the Quillo app, mix deps.get and MIX_ENV=prod mix assets.deploy in compare/phoenix
// (Elixir 1.20), Playwright's Chromium.
// Events (columns), each side started fresh (an empty state.db):
//   +1          each counter pressed once, in tab 1 of browser A
//   reload      tab 1 reloaded
//   2nd tab     a second tab of browser A, opening /
//   browser B   another browser (its own cookies: another visitor), opening /
//   B's +1      B presses each counter once; tab 1 of browser A is read 2.5 s later, without reloading it
//   restart     the server stopped and started again, with the same session secret; tab 1 reloaded
//   new secret  started again with another session secret (Quillo: none set, so a random one); tab 1 reloaded
//   2 servers   two processes (Quillo: --instances 2; Phoenix: two connected nodes behind one port, compare/two.mjs): four +1s on
//               each server-side counter, from new connections, then the counts read 20 times: every value seen
//   sync        a fresh server; tab A idle for 30 s: the HTTP requests and WebSocket messages it made, and the chunks of data it
//               received on streams already open; then B presses
//               "Kept in sync" five times, 2 to 3 s apart (staggered): how long until tab A shows it (checked every 10 ms), median; then
//               with two processes: tab A open, twelve fresh browsers B press once each: did A show it within 3 s, and how soon?
// Prints a table per side, and writes MEASURE.json beside this file.
import { spawn, execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), video = path.dirname(here);
const QAPP = fs.existsSync(path.join(video, 'app', 'main.qwe')) ? path.join(video, 'app') : video;
const QUILLO = path.join(QAPP, '.quillo', 'bin', 'quillo');
const PHOENIX = path.join(here, 'phoenix');
const root = path.resolve(video, '../..');
const CACHE = path.join(root, '.cache');   // where this machine keeps Mix and Hex (MIX_HOME, HEX_HOME)
const { chromium } = await import(fs.existsSync(path.join(root, 'node_modules/playwright/index.mjs')) ? path.join(root, 'node_modules/playwright/index.mjs') : 'playwright');
const PORT = 8331, URL0 = `http://127.0.0.1:${PORT}/`;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const KINDS = [['tab', 'This tab'], ['address', 'The address'], ['visitor', 'This visitor'], ['everyone', 'Everyone, until a restart'], ['saved', 'Everyone, for good'], ['synced', 'Kept in sync']];
const SERVER_KINDS = ['everyone', 'saved', 'synced'];

const SIDES = {
  quillo: {
    start(work, secret, two) {
      const env = { ...process.env }; delete env.QUILLO_SECRET; if (secret) env.QUILLO_SECRET = secret;
      return spawn(QUILLO, ['run', 'main.qwe', '--port', String(PORT), ...(two ? ['--instances', '2'] : [])], { cwd: work, env, stdio: 'ignore' });
    },
    setup(work) { for (const f of ['main.qwe', 'style.qwe']) fs.copyFileSync(path.join(QAPP, f), path.join(work, f)); },
    add: (id) => fetch(`${URL0}${id}`, { method: 'POST', redirect: 'manual', headers: { connection: 'close', 'content-type': 'application/x-www-form-urlencoded' }, body: 'addr=0' }),
    async counts() { const html = await (await fetch(URL0, { headers: { connection: 'close' } })).text(); return Object.fromEntries(SERVER_KINDS.map((id) => [id, Number(html.match(new RegExp(`id="${id}"[^>]*>[^<]*?: (\\d+)`))[1])])); },
  },
  phoenix: {
    // The session secret is SECRET_KEY_BASE: Phoenix signs its session cookie with it. Each start migrates the SQLite
    // file first. Two processes: two nodes, connected, behind compare/two.mjs.
    start(work, secret, two) {
      const env = { ...process.env, MIX_HOME: path.join(CACHE, 'mix'), HEX_HOME: path.join(CACHE, 'hex'), MIX_ENV: 'prod', PHX_HOST: '127.0.0.1',
        DATABASE_PATH: path.join(work, 'state.db'), PORT: String(PORT), SECRET_KEY_BASE: secret ? secret.repeat(2) : crypto.randomBytes(64).toString('hex') };
      execFileSync('mix', ['ecto.migrate'], { cwd: PHOENIX, env, stdio: 'ignore' });
      const [bin, args] = two ? [process.execPath, [path.join(here, 'two.mjs'), String(PORT)]] : ['mix', ['phx.server']];
      // Its own process group, so the BEAM (and two.mjs's nodes) stop with it.
      const p = spawn(bin, args, { cwd: PHOENIX, env, stdio: 'ignore', detached: true });
      p.kill = (sig) => { try { process.kill(-p.pid, sig); } catch {} return true; };
      return p;
    },
    setup() {},
    // A +1 is a LiveView event (the visitor's, a form): pressed in a fresh browser, so each one makes new connections.
    async add(id) {
      const b = await chromium.launch(); const p = await b.newPage();
      await p.goto(URL0); await p.waitForTimeout(1000); await p.click(`#${id}`); await p.waitForTimeout(1200); await b.close();
    },
    async counts() { const html = (await (await fetch(URL0, { headers: { connection: 'close' } })).text()).replace(/<!--[^>]*-->/g, ''); return Object.fromEntries(SERVER_KINDS.map((id) => [id, Number(html.match(new RegExp(`id="${id}"[^>]*>[^<]*?: (\\d+)`))[1])])); },
  },
};

async function up() { for (let i = 0; i < 500; i++) { try { if ((await fetch(URL0)).status === 200) return; } catch {} await sleep(20); } throw new Error('no server'); }
async function stop(p) { p.kill('SIGTERM'); await new Promise((r) => (p.exitCode !== null || p.signalCode ? r() : p.on('exit', r))); await sleep(400); }
const value = async (page, id) => Number((await page.locator(`#${id}`).innerText()).split(':').pop().trim());
async function read(page) { await page.waitForTimeout(800); const out = {}; for (const [id] of KINDS) out[id] = await value(page, id); return out; }
async function plusOne(page) {   // each counter once, waiting for it to show one more (a form reloads the page in Quillo)
  for (const id of ['address', 'visitor', 'everyone', 'saved', 'synced', 'tab']) {
    const before = await value(page, id);
    await page.click(`#${id}`);
    for (let i = 0; i < 100; i++) { await sleep(50); try { if (await value(page, id) === before + 1) break; } catch {} }
    await page.waitForTimeout(300);
  }
}

async function run(name) {
  const side = SIDES[name], work = path.join(os.tmpdir(), `v237-${name}`);
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work, { recursive: true }); side.setup(work);
  const secret = crypto.randomBytes(32).toString('hex'), table = {};
  let server = side.start(work, secret); await up();
  const browser = await chromium.launch();
  const A = await browser.newContext(), B = await browser.newContext();
  const tab1 = await A.newPage(); await tab1.goto(URL0); await tab1.waitForTimeout(800);
  await plusOne(tab1); table['+1'] = await read(tab1);
  await tab1.reload(); table['reload'] = await read(tab1);
  const tab2 = await A.newPage(); await tab2.goto(URL0); table['2nd tab'] = await read(tab2);
  const b1 = await B.newPage(); await b1.goto(URL0); table['browser B'] = await read(b1);
  await plusOne(b1); await tab1.waitForTimeout(1700); table["B's +1"] = await read(tab1);
  await stop(server); server = side.start(work, secret); await up();
  await tab1.reload(); table['restart'] = await read(tab1);
  await stop(server); server = side.start(work, null); await up();
  await tab1.reload(); table['new secret'] = await read(tab1);
  await browser.close(); await stop(server);
  for (const f of ['state.db', 'state.db-wal', 'state.db-shm']) fs.rmSync(path.join(work, f), { force: true, recursive: true });
  server = side.start(work, secret, true); await up(); await sleep(3000);   // both processes up before the +1s
  for (const id of ['everyone', 'saved']) for (let i = 0; i < 4; i++) await side.add(id);
  const seen = Object.fromEntries(SERVER_KINDS.map((k) => [k, new Set()]));
  for (let i = 0; i < 20; i++) { const c = await side.counts(); for (const k of SERVER_KINDS) seen[k].add(c[k]); }
  await stop(server);
  const two = Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, [...v].sort((a, b) => a - b)]));
  return { table, two, sync: await sync(side, work, secret) };
}

async function sync(side, work, secret) {
  for (const f of ['state.db', 'state.db-wal', 'state.db-shm']) fs.rmSync(path.join(work, f), { force: true, recursive: true });
  const server = side.start(work, secret); await up();
  const browser = await chromium.launch();
  const A = await (await browser.newContext()).newPage(), B = await (await browser.newContext()).newPage();
  let requests = 0, frames = 0;
  A.on('request', () => requests++);
  A.on('websocket', (ws) => { ws.on('framereceived', () => frames++); ws.on('framesent', () => frames++); });
  let chunks = 0, bytes = 0;
  const cdp = await A.context().newCDPSession(A); await cdp.send('Network.enable');
  cdp.on('Network.dataReceived', (e) => { chunks++; bytes += e.dataLength; });
  await A.goto(URL0); await B.goto(URL0); await A.waitForTimeout(1500);
  requests = 0; frames = 0; chunks = 0; bytes = 0;
  await A.waitForTimeout(30000);
  const idle = { requests, frames, chunks, bytes };
  const waits = [];
  for (let i = 0; i < 5; i++) {
    const before = await value(A, 'synced');
    const t0 = Date.now();
    await B.click('#synced');
    while ((await value(A, 'synced')) <= before && Date.now() - t0 < 5000) await sleep(10);
    waits.push(Date.now() - t0);
    await sleep(2000 + 237 * i);   // staggered, so presses don't line up with a timer on the server
  }
  await browser.close(); await stop(server);
  return { idle_30s: idle, waits, median: [...waits].sort((a, b) => a - b)[2], two: await syncTwo(side, work, secret) };
}

// The same with two server processes: tab A stays open; twelve times, a fresh browser B presses Kept in sync once (after
// 0 to 3 extra requests, so B's connections land on either process): did A show it within 3 s?
async function syncTwo(side, work, secret) {
  for (const f of ['state.db', 'state.db-wal', 'state.db-shm']) fs.rmSync(path.join(work, f), { force: true, recursive: true });
  const server = side.start(work, secret, true); await up(); await sleep(3000);
  const browser = await chromium.launch();
  const A = await (await browser.newContext()).newPage();
  await A.goto(URL0); await A.waitForTimeout(1200);
  let seen = 0; const tries = 12, waits = [];
  for (let i = 0; i < tries; i++) {
    for (let k = 0; k < i % 4; k++) await fetch(URL0, { headers: { connection: 'close' } });
    const B = await (await browser.newContext()).newPage();
    await B.goto(URL0); await B.waitForTimeout(800);
    const before = await value(B, 'synced');
    const t0 = Date.now();
    await B.click('#synced');
    while ((await value(A, 'synced')) <= before && Date.now() - t0 < 3000) await sleep(20);
    if ((await value(A, 'synced')) > before) { seen++; waits.push(Date.now() - t0); }
    await B.context().close();
  }
  await browser.close(); await stop(server);
  return { seen, tries, waits, median: waits.length ? [...waits].sort((a, b) => a - b)[Math.floor(waits.length / 2)] : null };
}

const names = process.argv.slice(2).length ? process.argv.slice(2) : ['quillo', 'phoenix'];
const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), phoenix: (fs.readFileSync(path.join(PHOENIX, 'mix.lock'), 'utf8').match(/"phoenix": \{:hex, :phoenix, "([^"]+)"/) || [])[1], live_view: (fs.readFileSync(path.join(PHOENIX, 'mix.lock'), 'utf8').match(/"phoenix_live_view": \{:hex, :phoenix_live_view, "([^"]+)"/) || [])[1], elixir: execFileSync('elixir', ['-e', 'IO.write System.version']).toString(), node: process.version, sides: {}, printed: {} };
for (const name of names) {
  const { table, two, sync: sy } = await run(name);
  const cols = Object.keys(table), w0 = 27, w = 11;
  const line = (cells) => cells.map((c, i) => String(c).padEnd(i === 0 ? w0 : w)).join('').trimEnd();
  const lines = [line([{ quillo: 'Quillo', phoenix: 'Phoenix LiveView' }[name], ...cols])];
  for (const [id, label] of KINDS) lines.push(line([label, ...cols.map((c) => table[c][id])]));
  lines.push(`${{ quillo: 'Quillo, --instances 2', phoenix: 'Phoenix, 2 connected nodes' }[name]}: 4 +1s each, then 20 reads: everyone ${two.everyone.join(' or ')}; saved ${two.saved.join(' or ')}`);
  lines.push(`kept in sync: tab A saw B's +1 after ${sy.waits.join(', ')} ms (median ${sy.median}); idle for 30 s it made ${sy.idle_30s.requests} HTTP requests and ${sy.idle_30s.frames} WebSocket messages, and received ${sy.idle_30s.chunks} chunks (${sy.idle_30s.bytes} bytes) on open streams`);
  lines.push(`kept in sync with 2 processes: tab A saw B's +1 within 3 s in ${sy.two.seen} of ${sy.two.tries} tries (median of those ${sy.two.median} ms)`);
  console.log(lines.join('\n') + '\n');
  out.sides[name] = { table, two, sync: sy }; out.printed[name] = lines;
}
out.when = new Date().toISOString();
const file = path.join(here, 'MEASURE.json');
const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { sides: {}, printed: {} };
fs.writeFileSync(file, JSON.stringify({ ...out, sides: { ...prev.sides, ...out.sides }, printed: { ...prev.printed, ...out.printed } }, null, 1) + '\n');
process.exit(0);
