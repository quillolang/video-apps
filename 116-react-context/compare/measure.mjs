// Clicks Add on three pastries in each app, in Chromium, with counters.js put in before the page's own scripts, and
// prints for each click: the React components that ran (by name; minified in a production build), the DOM changes,
// and what the badge says; and the bytes the page downloaded to start (as sent, compressed where the server
// compressed them). With --shots <dir>, it outlines what ran (orange) and what changed (green), and takes a
// screenshot after the first click: <name>_added.png, and <name>_start.png before it.
//   node measure.mjs drilling=http://localhost:4173 ... quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
import fs from 'node:fs';

const counters = fs.readFileSync(new URL('./counters.js', import.meta.url), 'utf8');
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 760, height: 600 }, deviceScaleFactor: shots ? 3 : 1 });
  if (shots) await page.addInitScript(() => { window.__highlight = true; });
  await page.addInitScript(counters);
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('.grid button').length === 12);
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const reset = () => page.evaluate(() => { window.__clearHighlight(); for (const k of Object.keys(window.__renders)) delete window.__renders[k]; window.__mutations = 0; });
  const read = () => page.evaluate(() => ({ renders: { ...window.__renders }, total: Object.values(window.__renders).reduce((a, b) => a + b, 0),
    mutations: window.__mutations, badge: document.querySelector('.badge').textContent }));
  const snap = async (n) => { if (!shots) return; await page.evaluate(() => { window.__frozen = true; }); await page.screenshot({ path: `${shots}/${name}_${n}.png` }); await page.evaluate(() => { window.__frozen = false; }); };
  await reset(); await snap('start');
  const clicks = [];
  for (const i of [0, 4, 7]) {
    await reset();
    await page.locator('.grid button').nth(i).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(400);
    clicks.push({ item: await page.locator('.grid b').nth(i).innerText(), ...(await read()) });
    if (clicks.length === 1) await snap('added');
  }
  results[name] = { clicks, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
