// Three changes on the Settings page, in Chromium, then a reload: does what was changed come back?
// Starts with nothing saved. Ticks Dark mode, picks large text, unticks Email me news. Counts the saves two ways:
// what the page says ("Saved N times"), and every localStorage.setItem the page made (wrapped before the page loads).
// Prints JSON: what the page showed at each step, the calls, what localStorage held, and the console's errors.
//   node play.mjs <name> <url> [<shots dir>]     (with a folder, a screenshot of each step: <name>_<step>.png)
import { chromium } from 'playwright';
const [name, url, shots] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 520, height: 560 }, deviceScaleFactor: shots ? 3 : 1 });
await ctx.addInitScript(() => {
  const set = Storage.prototype.setItem;
  window.__sets = JSON.parse(sessionStorage.getItem('__sets') ?? '[]');   // kept across the reload
  Storage.prototype.setItem = function (k, v) {
    if (k !== '__sets') { window.__sets.push(k); set.call(sessionStorage, '__sets', JSON.stringify(window.__sets)); }
    return set.call(this, k, v);
  };
});
const page = await ctx.newPage();
const log = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 240)}`); });
page.on('pageerror', (e) => log.push(`pageerror: ${e.message.split('\n')[0].slice(0, 240)}`));
const shows = async (step) => {
  const r = await page.evaluate(() => ({
    summary: document.querySelector('.summary')?.innerText,
    saves: document.querySelector('.saves')?.innerText,
    dark: document.querySelector('main').classList.contains('dark'),
    checked: [...document.querySelectorAll('input[type=checkbox]')].map((c) => c.checked),
    size: document.querySelector('select').value,
    calls: window.__sets.length,
    stored: localStorage.getItem('settings'),
  }));
  if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
  return { step, ...r };
};
await page.goto(url);
await page.waitForSelector('.saves');
await page.waitForTimeout(1000);
const steps = [await shows('start')];
await page.locator('input[type=checkbox]').nth(0).click(); await page.waitForTimeout(400); steps.push(await shows('dark'));
await page.selectOption('select', 'large'); await page.waitForTimeout(400); steps.push(await shows('large'));
await page.locator('input[type=checkbox]').nth(1).click(); await page.waitForTimeout(600); steps.push(await shows('changed'));
await page.reload();
await page.waitForSelector('.saves');
await page.waitForTimeout(1000);
steps.push(await shows('reloaded'));
await browser.close();
console.log(JSON.stringify({ name, steps, console: log }, null, 1));
