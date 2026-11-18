// Two people, one grocery list, in Chromium: tab A and tab B (each its own browser context, like two people) open
// the list. A adds Milk. How long until B shows it (checked every 50 ms, for 10 s)? If B never does, B adds Milk
// too, as a person who didn't see it would. Then both tabs sit still for a minute, and every HTTP request and
// WebSocket message is counted. Prints JSON: what each tab showed at each step, B's delay, the idle traffic, the
// console's errors and warnings, and the bytes the page downloaded to start (as sent).
//   node race.mjs <name> <url> [<shots dir>]       (with a folder, a screenshot of each tab at each step)
import { chromium } from 'playwright';
const [name, url, shots] = process.argv.slice(2);
const IDLE = Number(process.env.IDLE ?? 60000);
const browser = await chromium.launch();
const log = [];
const open = async (tab) => {
  const ctx = await browser.newContext({ viewport: { width: 520, height: 600 }, deviceScaleFactor: shots ? 3 : 1 });
  const page = await ctx.newPage();
  const t = { tab, page, requests: [], frames: [], bytes: [] };
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.push(`${tab} ${m.type()}: ${m.text().split('\n')[0].slice(0, 240)}`); });
  page.on('pageerror', (e) => log.push(`${tab} pageerror: ${e.message.split('\n')[0].slice(0, 240)}`));
  page.on('request', (r) => t.requests.push({ at: Date.now(), method: r.method(), url: r.url().replace(/^https?:\/\/[^/]+/, '') }));
  page.on('requestfinished', (r) => { const at = Date.now(); t.bytes.push(r.sizes().then((z) => ({ at, n: z.responseBodySize + z.responseHeadersSize })).catch(() => ({ at, n: 0 }))); });   // a live stream can end as the browser closes
  page.on('websocket', (ws) => {
    ws.on('framereceived', (f) => t.frames.push({ at: Date.now(), dir: 'in', len: String(f.payload).length }));
    ws.on('framesent', (f) => t.frames.push({ at: Date.now(), dir: 'out', len: String(f.payload).length }));
  });
  await page.goto(url);
  await page.waitForSelector('li');
  await page.waitForTimeout(1500);       // hydrated, and the live connection open
  t.startBytes = (await Promise.all(t.bytes)).reduce((a, b) => a + b.n, 0);
  return t;
};
const items = async (t) => (await t.page.locator('li').allInnerTexts()).map((s) => s.replace(/^\s*✓?\s*/, '').trim());
const snap = async (step, ...tabs) => {
  const r = { step };
  for (const t of tabs) {
    r[t.tab] = { items: await items(t), left: await t.page.locator('.left').innerText() };
    if (shots) await t.page.screenshot({ path: `${shots}/${name}_${step}_${t.tab}.png` });
  }
  return r;
};
const add = async (t, what) => {
  await t.page.fill('form.add input', what);
  await t.page.click('form.add button');
};

const A = await open('A'), B = await open('B');
const steps = [await snap('open', A, B)];
await add(A, 'Milk');
const t0 = Date.now();
await A.page.waitForFunction(() => [...document.querySelectorAll('li')].some((li) => li.innerText.includes('Milk')));
const aShown = Date.now() - t0;
steps.push(await snap('sent', A, B));      // the moment A shows it (B's delay below is measured from the click)
let bShown = null;
for (let i = 0; i < 200 && bShown == null; i++) {
  if ((await items(B)).includes('Milk')) bShown = Date.now() - t0;
  else await B.page.waitForTimeout(50);
}
steps.push(await snap('added', A, B));
if (bShown == null) {
  await add(B, 'Milk');
  await B.page.waitForFunction(() => [...document.querySelectorAll('li')].some((li) => li.innerText.includes('Milk')));
  await B.page.waitForTimeout(1500);
  steps.push(await snap('again', A, B));
}

// A minute of nobody doing anything: what goes over the wire?
await A.page.waitForTimeout(1000);
const idleFrom = Date.now();
await A.page.waitForTimeout(IDLE);
const idle = Object.fromEntries([A, B].map((t) => [t.tab, {
  requests: t.requests.filter((r) => r.at >= idleFrom).length,
  sample: [...new Set(t.requests.filter((r) => r.at >= idleFrom).map((r) => `${r.method} ${r.url}`))].slice(0, 4),
  wsMessages: t.frames.filter((f) => f.at >= idleFrom).length,
  wsIn: t.frames.filter((f) => f.at >= idleFrom && f.dir === 'in').length,
}]));
for (const t of [A, B]) idle[t.tab].bytes = (await Promise.all(t.bytes)).filter((b) => b.at >= idleFrom).reduce((a, b) => a + b.n, 0);
steps.push(await snap('idle', A, B));

// Then ten more adds in A, at uneven times, and how long each took to show in B (checked every 20 ms, for 5 s).
const trials = [];
if (bShown != null) {
  const pause = [700, 1300, 400, 1900, 1100, 600, 1500, 900, 1700, 300];
  for (let k = 1; k <= 10; k++) {
    await A.page.waitForTimeout(pause[k - 1]);
    const what = `Item ${k}`;
    await add(A, what);
    const t = Date.now();
    let shown = null;
    while (shown == null && Date.now() - t < 5000) {
      if ((await items(B)).includes(what)) shown = Date.now() - t;
      else await B.page.waitForTimeout(20);
    }
    trials.push(shown);
  }
}
await browser.close();
console.log(JSON.stringify({ name, url, steps, aShown, bShown, trials, idleMs: IDLE, idle, console: log, startBytes: A.startBytes }, null, 1));
