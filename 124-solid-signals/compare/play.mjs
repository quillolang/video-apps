// Uses the Tip Splitter in each app, in Chromium: 20% tip, one more person, then a bill of 90. Prints what the page
// shows after each, the DOM changes each made (a MutationObserver under <body>), the console's errors and warnings,
// and the bytes the page downloaded to start (as sent, compressed where the server compressed them).
//   node play.mjs body=http://localhost:4173 ... quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 600, height: 520 }, deviceScaleFactor: shots ? 3 : 1 });
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
  await page.waitForSelector('.share');
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const shows = async (step) => {
    const r = { step, total: await page.locator('.total').innerText(), share: await page.locator('.share').innerText(),
      people: await page.locator('.people span').innerText(), on: await page.locator('.tips button.on').allInnerTexts(),
      mutations: await page.evaluate(() => window.__mutations) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
    await page.evaluate(() => { window.__mutations = 0; });
    return r;
  };
  const steps = [await shows('start')];
  await page.click('.tips button >> text=20%'); await page.waitForTimeout(300); steps.push(await shows('tip20'));
  await page.click('.people button >> nth=1'); await page.waitForTimeout(300); steps.push(await shows('people3'));
  await page.fill('input', '90'); await page.waitForTimeout(300); steps.push(await shows('bill90'));
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
