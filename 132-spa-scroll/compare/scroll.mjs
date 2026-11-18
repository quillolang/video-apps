// Where each page opens, and where Back goes, in Chromium (640×440): open /soups, scroll the list until soup 25 is in
// the middle, click it, and note where its page opens (scrollY, and whether its heading is in view); then press Back
// and note where the list is. Then soup 25's page opened with JavaScript off: its heading, or nothing.
// With --shots <dir>: <name>_list.png, <name>_soup.png, <name>_back.png, <name>_nojs.png.
//   node scroll.mjs naive=http://localhost:4177 restore=http://localhost:4178 quillo=http://localhost:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
const opts = { viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 };
const where = (page) => page.evaluate(() => {
  const h1 = document.querySelector('h1'), r = h1 && h1.getBoundingClientRect();
  const top = [...document.querySelectorAll('ul.soups li')].find((li) => li.getBoundingClientRect().top > 60);
  return { y: Math.round(scrollY), h1: h1 ? h1.textContent.trim() : null, h1InView: !!r && r.top >= 0 && r.bottom <= innerHeight,
    firstSoupInView: top ? top.querySelector('a').textContent : null, title: document.title };
});
for (const [name, base] of args.map((a) => a.split('='))) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(base + '/soups'); await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.querySelector('a[href="/soups/25"]').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(400);
  const list = await where(page);
  if (shots) await page.screenshot({ path: `${shots}/${name}_list.png` });
  await page.click('a[href="/soups/25"]');
  await page.waitForFunction(() => document.querySelector('h1')?.textContent.trim() === 'Wonton');
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(600);
  const soup = await where(page);
  if (shots) await page.screenshot({ path: `${shots}/${name}_soup.png` });
  await page.goBack();
  await page.waitForFunction(() => document.querySelector('h1')?.textContent.trim() === 'Soups');
  await page.waitForLoadState('networkidle'); await page.waitForTimeout(800);
  const back = await where(page);
  if (shots) await page.screenshot({ path: `${shots}/${name}_back.png` });
  await ctx.close();
  const off = await browser.newContext({ ...opts, javaScriptEnabled: false });
  const p2 = await off.newPage();
  await p2.goto(base + '/soups/25'); await p2.waitForTimeout(500);
  const nojs = { h1: (await p2.locator('h1').count()) ? (await p2.locator('h1').first().innerText()).trim() : null,
    text: (await p2.locator('body').innerText()).trim().length };
  if (shots) await p2.screenshot({ path: `${shots}/${name}_nojs.png` });
  await off.close();
  results[name] = { list, soup, back, nojs };
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
