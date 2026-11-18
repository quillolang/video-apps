// With JavaScript turned off in Chromium: open the list, type Tea, press Add, then open the page again. Prints JSON:
// the list before and after, and where the browser ended up.
//   node nojs.mjs <name> <url> [<shots dir>]
import { chromium } from 'playwright';
const [name, url, shots] = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 520, height: 600 }, deviceScaleFactor: shots ? 3 : 1 });
const page = await ctx.newPage();
const items = async () => (await page.locator('li').allInnerTexts()).map((s) => s.replace(/^\s*✓?\s*/, '').trim());
await page.goto(url);
const before = await items();
await page.fill('form.add input', 'Tea');
await Promise.all([page.waitForLoadState('load'), page.click('form.add button')]);
await page.waitForTimeout(1000);
const landed = page.url().replace(/^https?:\/\/[^/]+/, '');
await page.goto(url);
const after = await items();
if (shots) await page.screenshot({ path: `${shots}/${name}_nojs.png` });
await browser.close();
console.log(JSON.stringify({ name, before, landed, after, added: after.includes('Tea') }));
