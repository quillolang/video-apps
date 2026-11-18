// Plays the Mixtape in each app, in Chromium: ▶ on Paper Moon Pie, then ＋ on Neon Rain and on Lemon Tree Lane, and
// prints what the header says after each, the page's changes (MutationObserver records under <body>), the console's
// errors and warnings, and the bytes the page downloaded to start (as sent, compressed where the server compressed
// them). With --shots <dir>, a screenshot after each: <name>_<step>.png.
//   node play.mjs drilling=http://localhost:4173 ... quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 760, height: 560 }, deviceScaleFactor: shots ? 3 : 1 });
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
  await page.waitForFunction(() => document.querySelectorAll('.tracks li').length === 10);
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const shows = async (step) => {
    const r = { step, now: (await page.locator('.now').innerText()).replace(/\s+/g, ' ').trim(), mutations: await page.evaluate(() => window.__mutations) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
    await page.evaluate(() => { window.__mutations = 0; });
    return r;
  };
  const row = (title) => page.locator('.tracks li', { hasText: title });
  const steps = [await shows('start')];
  await row('Paper Moon Pie').locator('button.play').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('play'));
  await row('Neon Rain').locator('button.add').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('queue1'));
  await row('Lemon Tree Lane').locator('button.add').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('queue2'));
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
