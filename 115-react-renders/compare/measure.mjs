// Types three letters into "Name for the order" and clicks "Add" three times, in each app, and prints, for
// each keystroke and click: the React components that rendered (by name), the DOM changes, and the time from
// the key or click to the last DOM change. Counters are counters.js, put in before the page's own scripts.
// Then it types 20 more letters and clicks Add 20 more times, and gives the median time of each.
// And the bytes the page downloaded to start (as sent, so compressed where the server compressed them).
//   ROWS=1000 node measure.mjs plain=http://localhost:4173 ... quillo=http://127.0.0.1:8140 [--json]
// prints a table; with --json, everything it measured, as JSON; with JSON_FILE=<file>, the table, and the JSON
// into that file (one run, both ways).
import { chromium } from 'playwright';
import fs from 'node:fs';

const counters = fs.readFileSync(new URL('./counters.js', import.meta.url), 'utf8');
const ROWS = Number(process.env.ROWS || 1000);
const JSON_OUT = process.argv.includes('--json');
const targets = process.argv.slice(2).filter((a) => a !== '--json').map((a) => a.split('='));
const browser = await chromium.launch();
const results = {};
for (const [name, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  await page.addInitScript(counters);
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForFunction((n) => document.querySelectorAll('li').length === n, ROWS, { timeout: 60000 });
  await page.waitForTimeout(1000);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const files = sizes.length;
  const reset = () => page.evaluate(() => {
    for (const k of Object.keys(window.__renders)) delete window.__renders[k];
    window.__mutations = 0; window.__lastUpdate = 0; window.__inputAt = 0;
  });
  const read = () => page.evaluate(() => ({
    renders: { ...window.__renders },
    total: Object.values(window.__renders).reduce((a, b) => a + b, 0),
    mutations: window.__mutations,
    ms: Math.round((window.__lastUpdate - window.__inputAt) * 100) / 100,
  }));
  const steps = [];
  await page.locator('input').click();
  await page.waitForTimeout(300);
  for (const key of ['A', 'd', 'a']) {
    await reset();
    await page.keyboard.press(key);
    await page.waitForTimeout(400);
    steps.push({ step: `type ${key}`, ...(await read()) });
  }
  for (let i = 1; i <= 3; i++) {
    await reset();
    await page.locator('li button').first().click();
    await page.waitForTimeout(400);
    steps.push({ step: `add ${i}`, ...(await read()) });
  }
  const median = (xs) => { xs.sort((a, b) => a - b); return xs[Math.floor(xs.length / 2)]; };
  const keys = [], adds = [];
  await page.locator('input').click();
  await page.waitForTimeout(300);
  for (const key of ' Lovelace Byron Kin') {
    await reset(); await page.keyboard.press(key === ' ' ? 'Space' : key); await page.waitForTimeout(150);
    keys.push((await read()).ms);
  }
  for (let i = 0; i < 20; i++) {
    await reset(); await page.locator('li button').nth(i + 1).click(); await page.waitForTimeout(150);
    adds.push((await read()).ms);
  }
  steps.push({ step: 'median ms', keystroke: median(keys), add: median(adds), keys: keys.length, adds: adds.length });
  steps.push({ step: 'shows', text: await page.locator('.total').innerText(), input: await page.locator('input').inputValue() });
  steps.push({ step: 'download', bytes, files });
  results[name] = steps;
  await page.close();
}
await browser.close();
if (process.env.JSON_FILE) fs.writeFileSync(process.env.JSON_FILE, JSON.stringify(results, null, 1) + '\n');
if (JSON_OUT) console.log(JSON.stringify(results, null, 1));
else {
  const pad = (x, n) => String(x).padStart(n);
  console.log(`${ROWS} rows, in Chromium. renders: React components that ran;`);
  console.log(`DOM: changes to the page; ms: from the key or click (median); KB: download`);
  console.log(`${''.padEnd(20)}  a keystroke   an Add      median ms`);
  console.log(`${'app'.padEnd(20)}  renders DOM  renders DOM   key  Add     KB`);
  for (const [name, steps] of Object.entries(results)) {
    const k = steps.find((s) => s.step === 'type d'), a = steps.find((s) => s.step === 'add 2');
    const m = steps.find((s) => s.step === 'median ms'), d = steps.find((s) => s.step === 'download');
    console.log(`${name.padEnd(20)}  ${pad(k.total, 7)} ${pad(k.mutations, 3)}  ${pad(a.total, 7)} ${pad(a.mutations, 3)}  ${pad(m.keystroke.toFixed(1), 4)} ${pad(m.add.toFixed(1), 4)}  ${pad((d.bytes / 1000).toFixed(1), 5)}`);
  }
}
