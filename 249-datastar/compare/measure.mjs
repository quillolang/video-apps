// Plays the same shopping list in Datastar (Go) and Quillo in Chromium, two tabs each, and writes
// runs/<side>.json with what was seen and measured. Nothing in the video is guessed: it comes from here.
//   node compare/measure.mjs [datastar|quillo]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const video = path.dirname(here);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SIDES = {
  datastar: {
    port: 8190, cwd: path.join(here, 'datastar'), db: 'list.db',
    start: () => [path.join(here, 'datastar', 'shoplist'), []],
  },
  quillo: {
    port: 8191, cwd: path.join(video, 'app'), db: 'list.db',
    start: () => [path.join(video, 'app', '.quillo', 'bin', 'quillo'), ['run', 'main.qwe', '--port', '8191']],
  },
};

function startServer(side) {
  const [cmd, args] = side.start();
  const p = spawn(cmd, args, { cwd: side.cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  p.log = '';
  alive.add(p);
  p.once('exit', () => alive.delete(p));
  p.stdout.on('data', (d) => (p.log += d));
  p.stderr.on('data', (d) => (p.log += d));
  return p;
}
async function waitUp(port) {
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/`); if (r.ok) return; } catch {}
    await sleep(100);
  }
  throw new Error(`nothing on ${port}`);
}
const stop = (p) => new Promise((r) => { p.once('exit', r); p.kill('SIGTERM'); });

// Bytes on the wire for one tab, from the DevTools protocol: HTTP bodies both ways and WebSocket frames.
async function meter(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const m = { up: 0, down: 0, requests: [] };
  cdp.on('Network.requestWillBeSent', (e) => {
    m.requests.push(`${e.request.method} ${new URL(e.request.url).pathname} @${Date.now() % 100000}`);
    m.up += Buffer.byteLength(e.request.postData || '');
  });
  cdp.on('Network.dataReceived', (e) => (m.down += e.encodedDataLength || e.dataLength));
  cdp.on('Network.webSocketFrameSent', (e) => (m.up += Buffer.byteLength(e.response.payloadData)));
  cdp.on('Network.webSocketFrameReceived', (e) => (m.down += Buffer.byteLength(e.response.payloadData)));
  m.reset = () => { m.up = 0; m.down = 0; m.requests = []; };
  return m;
}

const names = (page) => page.$$eval('li', (lis) => lis.filter((li) => li.offsetParent !== null).map((li) => li.textContent.trim()));
const leftText = (page) => page.$eval('main', (m) => (m.innerText.match(/(\d+) left/) || [])[0] || null);
async function waitFor(fn, ms = 5000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await fn()) return Date.now() - t0; await sleep(5); }
  return null;
}

const alive = new Set();
process.on('exit', () => { for (const p of alive) p.kill('SIGTERM'); });
process.on('uncaughtException', (e) => { console.error(e); process.exit(1); });
process.on('unhandledRejection', (e) => { console.error(e); process.exit(1); });

async function run(name) {
  const side = SIDES[name];
  for (const f of [side.db, `${side.db}-wal`, `${side.db}-shm`]) fs.rmSync(path.join(side.cwd, f), { force: true });
  let server = startServer(side);
  await waitUp(side.port);
  const url = `http://127.0.0.1:${side.port}/`;
  const out = { side: name, url };
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 720, height: 504 } });

  // First load: every script the page runs, its size as sent and gzipped.
  const a = await ctx.newPage();
  const scripts = [];
  a.on('response', async (r) => {
    if (r.request().resourceType() === 'script' && !scripts.some((x) => x.url === new URL(r.url()).pathname)) {
      const body = await r.body().catch(() => Buffer.alloc(0));
      scripts.push({ url: new URL(r.url()).pathname, bytes: body.length, gzip: zlib.gzipSync(body, { level: 9 }).length, encoding: r.headers()['content-encoding'] || null });
    }
  });
  const errorsA = [];
  a.on('console', (m) => { if (m.type() === 'error') errorsA.push(m.text()); });
  a.on('pageerror', (e) => errorsA.push(String(e)));
  await a.goto(url, { waitUntil: 'networkidle' }).catch(() => a.goto(url));
  await sleep(500);
  out.scripts = scripts;
  out.js_bytes = scripts.reduce((s, x) => s + x.bytes, 0);
  out.js_gzip = scripts.reduce((s, x) => s + x.gzip, 0);
  out.html_bytes = Buffer.byteLength(await (await fetch(url)).text());

  const b = await ctx.newPage();
  await b.goto(url, { waitUntil: 'domcontentloaded' });
  await sleep(800);
  const ma = await meter(a);
  const mb = await meter(b);
  await sleep(300);

  // 1. Add "Milk" in tab A: the bytes it takes, both tabs, and when tab B shows it.
  ma.reset(); mb.reset();
  await a.fill('input[aria-label="New item"]', 'Milk');
  const t0 = Date.now();
  await a.click('button:has-text("Add")');
  const seenB = await waitFor(async () => (await names(b)).includes('Milk'));
  await sleep(600);
  out.add = {
    other_tab_ms: seenB, a_up: ma.up, a_down: ma.down, b_up: mb.up, b_down: mb.down, a_requests: [...ma.requests], b_requests: [...mb.requests],
    input_after: await a.inputValue('input[aria-label="New item"]'),
  };
  // Median of 20 more adds, a second apart, for the other tab's delay. Quillo gathers changes that come
  // within ~0.1 s of the last into one refresh (its guide, "Live data"), so SPACED=0 measures that window.
  const delays = [];
  for (let i = 0; i < 20; i++) {
    const n = `Item ${i}`;
    await a.fill('input[aria-label="New item"]', n);
    const t = Date.now();
    await a.click('button:has-text("Add")');
    const d = await waitFor(async () => (await names(b)).includes(n));
    delays.push(d === null ? null : Date.now() - t);
    await waitFor(async () => (await a.inputValue('input[aria-label="New item"]')) === '');
    await sleep(Number(process.env.SPACED ?? 1000)); // a person's pace; SPACED=0 adds as fast as it can
  }
  const ok = delays.filter((x) => x !== null).sort((x, y) => x - y);
  out.add.other_tab_median_ms = ok[Math.floor(ok.length / 2)];
  out.add.other_tab_missed = delays.filter((x) => x === null).length;
  out.add.other_tab_all_ms = delays;
  // Back to a short list for the screenshots' sake: clear the extra rows through a fresh start below.
  void t0;

  // 2. An empty add: the message.
  await a.fill('input[aria-label="New item"]', '   ');
  await a.click('button:has-text("Add")');
  await sleep(500);
  out.empty = { problem: await a.$eval('main', (m) => (m.querySelector('.problem') && m.querySelector('.problem').offsetParent !== null ? m.querySelector('.problem').textContent.trim() : null)) };

  // 3. Tick "Milk" off in tab B; tab A follows.
  const before = await leftText(a);
  const boxB = b.locator('li', { hasText: 'Milk' }).locator('input');
  await boxB.click();
  const trace = [];
  const tt = Date.now();
  while (Date.now() - tt < 800) { trace.push([Date.now() - tt, await boxB.isChecked()]); await sleep(10); }
  out.tick_trace_b = trace;
  const tickMs = await waitFor(async () => (await leftText(a)) !== before);
  out.tick = { left_before: before, left_after: await leftText(a), a_ms: tickMs, a_checked: await a.locator('li', { hasText: 'Milk' }).locator('input').isChecked() };

  // 4. Hide done in tab A: is the server asked?
  await sleep(1000);
  ma.reset();
  out.hide_t0 = Date.now() % 100000;
  await a.check('label:has-text("Hide done") input');
  await sleep(500);
  out.hide = { requests: [...ma.requests], up: ma.up, down: ma.down, milk_visible: (await names(a)).includes('Milk') };
  await a.uncheck('label:has-text("Hide done") input');
  await sleep(300);

  // 5. Typing in tab A while tab B adds: kept?
  await a.fill('input[aria-label="New item"]', '');
  await a.click('input[aria-label="New item"]');
  await a.keyboard.type('Bre');
  await b.fill('input[aria-label="New item"]', 'Eggs');
  await b.click('button:has-text("Add")');
  await waitFor(async () => (await names(a)).includes('Eggs'));
  await sleep(300);
  out.typing = {
    value: await a.inputValue('input[aria-label="New item"]'),
    focused: await a.evaluate(() => document.activeElement && document.activeElement.getAttribute('aria-label')),
  };
  await a.fill('input[aria-label="New item"]', '');

  // 6. A name with markup in it.
  await a.fill('input[aria-label="New item"]', '<b>Bold</b> beans');
  await a.click('button:has-text("Add")');
  await waitFor(async () => (await names(b)).some((x) => x.includes('beans')));
  out.markup = {
    text: (await names(b)).find((x) => x.includes('beans')),
    bold_elements: await b.$$eval('li b', (x) => x.length),
  };

  // 7. Stop the server for a while, start it again, add from a fresh tab: when do A and B show it, with no reload?
  out.restart = [];
  for (const [k, down] of [['Bread', 3000], ['Butter', 20000]]) {
    await stop(server);
    const stoppedAt = Date.now();
    await sleep(down);
    server = startServer(side);
    await waitUp(side.port);
    const upAfter = Date.now() - stoppedAt;
    const c = await ctx.newPage();
    await c.goto(url, { waitUntil: 'domcontentloaded' });
    await sleep(300);
    await c.fill('input[aria-label="New item"]', k);
    const tc = Date.now();
    await c.click('button:has-text("Add")');
    const [am, bm] = await Promise.all([
      waitFor(async () => (await names(a)).includes(k), 60000),
      waitFor(async () => (await names(b)).includes(k), 60000),
    ]);
    out.restart.push({ item: k, down_ms: down, up_after_ms: upAfter, a_ms: am, b_ms: bm, since_stop_a: am === null ? null : tc - stoppedAt + am });
    await c.close();
  }

  out.console_errors = errorsA;
  out.final_list = await names(a);
  await browser.close();
  await stop(server);
  out.server_log = server.log.slice(0, 2000).split(os.homedir()).join('/Users/you');
  fs.mkdirSync(path.join(here, 'runs'), { recursive: true });
  fs.writeFileSync(path.join(here, 'runs', `${name}.json`), JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ ...out, scripts: out.scripts.map((s) => `${s.url} ${s.bytes}/${s.gzip}`), server_log: undefined, add: { ...out.add, other_tab_all_ms: undefined } }, null, 1));
}

for (const name of process.argv[2] ? [process.argv[2]] : Object.keys(SIDES)) await run(name);
