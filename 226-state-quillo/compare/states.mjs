// Puts the six kinds of state on the page through the same events, in a real browser, and prints what each shows:
//   node compare/states.mjs            (sh get-quillo.sh in app/ first; Playwright's Chromium)
// Events (columns), in this order, with the server started fresh (an empty state.db):
//   +1          each control pressed once, in tab 1 of browser A
//   reload      tab 1 reloaded
//   2nd tab     a second tab of browser A, opening /
//   browser B   another browser (its own cookies: another visitor), opening /
//   B's +1      B presses each control once; tab 1 of browser A is read without reloading it
//   restart     the server stopped and started again with the same QUILLO_SECRET (the session key); tab 1 reloaded
//   no secret   the server started again without QUILLO_SECRET (a random session key each start); tab 1 reloaded
//   2 servers   the server run with --instances 2: four +1s on each server-side control, from new connections,
//               then / loaded 20 times: every value seen (each instance has its own variables)
// Prints the table, and writes MEASURE.json beside this file.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), video = path.dirname(here);
const APP = fs.existsSync(path.join(video, 'app', 'main.qwe')) ? path.join(video, 'app') : video;
const QUILLO = path.join(APP, '.quillo', 'bin', 'quillo');
const root = path.resolve(video, '../..');
const { chromium } = await import(fs.existsSync(path.join(root, 'node_modules/playwright/index.mjs')) ? path.join(root, 'node_modules/playwright/index.mjs') : 'playwright');
const PORT = 8270, URL0 = `http://127.0.0.1:${PORT}/`, WORK = path.join(os.tmpdir(), 'v226-run');
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const KINDS = [['tab', 'This tab'], ['address', 'The address'], ['visitor', 'This visitor'], ['everyone', 'Everyone, until a restart'], ['saved', 'Everyone, for good'], ['synced', 'Kept in sync']];

fs.rmSync(WORK, { recursive: true, force: true }); fs.mkdirSync(WORK, { recursive: true });
for (const f of ['main.qwe', 'style.qwe']) fs.copyFileSync(path.join(APP, f), path.join(WORK, f));
const SECRET = (await import('node:crypto')).randomBytes(32).toString('hex');
function start(args = [], secret = SECRET) { const env = { ...process.env }; delete env.QUILLO_SECRET; if (secret) env.QUILLO_SECRET = secret; return spawn(QUILLO, ['run', 'main.qwe', '--port', String(PORT), ...args], { cwd: WORK, env, stdio: 'ignore' }); }
async function up() { for (let i = 0; i < 500; i++) { try { if ((await fetch(URL0)).status === 200) return; } catch {} await sleep(20); } throw new Error('no server'); }
async function stop(p) { p.kill('SIGTERM'); await new Promise((r) => (p.exitCode !== null || p.signalCode ? r() : p.on('exit', r))); await sleep(300); }
async function read(page) {
  const out = {};
  for (const [id] of KINDS) out[id] = Number((await page.locator(`#${id}`).innerText()).split(':').pop().trim());
  return out;
}
async function plusOne(page) {   // the address first (it loads a new page), the tab's own count last
  await page.click('#address'); await page.waitForLoadState('load');
  for (const id of ['visitor', 'everyone', 'saved']) { await Promise.all([page.waitForNavigation(), page.click(`#${id}`)]); }
  await page.waitForTimeout(400);  // the components take over
  await page.click('#synced'); await page.waitForTimeout(300);
  await page.click('#tab'); await page.waitForTimeout(100);
}

const table = {};
let server = start(); await up();
const browser = await chromium.launch();
const A = await browser.newContext(), B = await browser.newContext();
const tab1 = await A.newPage(); await tab1.goto(URL0); await tab1.waitForTimeout(500);
await plusOne(tab1); table['+1'] = await read(tab1);
await tab1.reload(); await tab1.waitForTimeout(500); table['reload'] = await read(tab1);
const tab2 = await A.newPage(); await tab2.goto(URL0); await tab2.waitForTimeout(500); table['2nd tab'] = await read(tab2);
const b1 = await B.newPage(); await b1.goto(URL0); await b1.waitForTimeout(500); table['browser B'] = await read(b1);
await plusOne(b1); await tab1.waitForTimeout(1500); table["B's +1, seen in tab 1"] = await read(tab1);
await stop(server); server = start(); await up();
await tab1.reload(); await tab1.waitForTimeout(500); table['restart'] = await read(tab1);
await stop(server); server = start([], null); await up();
await tab1.reload(); await tab1.waitForTimeout(500); table['no secret'] = await read(tab1);
await browser.close(); await stop(server);

// two instances: server-side controls only
server = start(['--instances', '2']); await up();
const fresh = () => ({ headers: { connection: 'close' } });
for (const id of ['everyone', 'saved']) for (let i = 0; i < 4; i++) await fetch(`http://127.0.0.1:${PORT}/${id}`, { method: 'POST', redirect: 'manual', headers: { connection: 'close', 'content-type': 'application/x-www-form-urlencoded' }, body: 'addr=0' });
const seen = { everyone: new Set(), saved: new Set(), synced: new Set() };
for (let i = 0; i < 20; i++) {
  const html = await (await fetch(URL0, fresh())).text();
  for (const id of Object.keys(seen)) seen[id].add(Number(html.match(new RegExp(`id="${id}"[^>]*>[^<]*?: (\\d+)`))[1]));
}
await stop(server);
const two = Object.fromEntries(Object.entries(seen).map(([k, v]) => [k, [...v].sort((a, b) => a - b)]));

// print
const cols = Object.keys(table);
const w0 = 27, w = 11;
const line = (cells) => cells.map((c, i) => String(c).padEnd(i === 0 ? w0 : w)).join('');
const lines = [line(['', ...cols.map((c) => c.replace(', seen in tab 1', ''))]).trimEnd()];
for (const [id, name] of KINDS) lines.push(line([name, ...cols.map((c) => table[c][id])]).trimEnd());
lines.push('');
lines.push(`--instances 2, after 4 +1s on each, the values / showed in 20 loads: everyone ${two.everyone.join(' or ')}; saved ${two.saved.join(' or ')}; synced ${two.synced.join(' or ')}`);
console.log(lines.join('\n'));
const out = { quillo: (await import('node:child_process')).execFileSync(QUILLO, ['version']).toString().trim(), table, two, printed: lines, when: new Date().toISOString() };
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
process.exit(0);
