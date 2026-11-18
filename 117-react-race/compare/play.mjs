// Types "a", then 100 ms later "p", into each pantry, in Chromium, and prints what the page shows 0.5 s and 2 s after
// the "p": the "Results for" line and the foods, and how many of the foods hold "ap". Also the console's errors and
// warnings, and the bytes the page downloaded to start. With --shots <dir>, a screenshot at each of those moments.
//   node play.mjs effect=http://localhost:4173 ... quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 600, height: 460 }, deviceScaleFactor: shots ? 3 : 1 });
  const console_ = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 300)}`); });
  page.on('pageerror', (e) => console_.push(`pageerror: ${e.message.split('\n')[0].slice(0, 300)}`));
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForSelector('input');
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const shows = async (step) => {
    const foods = await page.locator('li').allInnerTexts();
    const r = { step, heading: await page.locator('.for').innerText(), foods, matching: foods.filter((f) => f.toLowerCase().includes('ap')).length };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
    return r;
  };
  await page.locator('input').click();
  await page.keyboard.type('a');
  await page.waitForTimeout(100);
  await page.keyboard.type('p');
  await page.waitForTimeout(500);
  const steps = [await shows('soon')];
  await page.waitForTimeout(1500);
  steps.push(await shows('later'));
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
