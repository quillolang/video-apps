// Uses the Book Club in each app, in Chromium: Add on Tea for Two Robots, then on The Long Picnic, and prints what the
// header and My list show after each, the page's changes (MutationObserver records under <body>), the console's errors
// and warnings, and the bytes the page downloaded to start (as sent, compressed where the server compressed them).
// With --shots <dir>, a screenshot after each: <name>_<step>.png.
//   node play.mjs svelte=http://localhost:4173 quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 820, height: 600 }, deviceScaleFactor: shots ? 3 : 1 });
  const console_ = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 300)}`); });
  page.on('pageerror', (e) => console_.push(`pageerror: ${e.message.split('\n')[0].slice(0, 300)}`));
  await page.addInitScript(() => {
    window.__mutations = 0;
    addEventListener('DOMContentLoaded', () => new MutationObserver((r) => { window.__mutations += r.length; })
      .observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true }));
  });
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('.books li').length === 8);
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const shows = async (step) => {
    const r = { step, count: await page.locator('.count').innerText(), list: await page.locator('aside p').allInnerTexts(),
      mutations: await page.evaluate(() => window.__mutations) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
    await page.evaluate(() => { window.__mutations = 0; });
    return r;
  };
  const add = async (title) => { await page.locator('.books li', { hasText: title }).locator('button').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); };
  const steps = [await shows('start')];
  await add('Tea for Two Robots'); steps.push(await shows('add1'));
  await add('The Long Picnic'); steps.push(await shows('add2'));
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
