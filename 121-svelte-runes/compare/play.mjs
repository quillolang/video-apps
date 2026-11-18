// Times one race in the Lap Timer, in Chromium: Start, 5.6 seconds (an automatic lap is due at 5.0), Lap, Stop and
// 2 seconds stopped, then Start and 2 seconds more, then Stop. Prints what the page shows at each step, the time it
// gained while stopped and while running again, the console's errors and warnings, and the bytes the page
// downloaded to start (as sent, compressed where the server compressed them). A screenshot at 4.5 seconds too.
//   node play.mjs <name> <url> [<shots dir>]     (with a folder, a screenshot of each step: <name>_<step>.png)
import { chromium } from 'playwright';
const [name, url, shots] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 600, height: 520 }, deviceScaleFactor: shots ? 3 : 1 });
const console_ = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 240)}`); });
page.on('pageerror', (e) => console_.push(`pageerror: ${e.message.split('\n')[0].slice(0, 240)}`));
const sizes = [];
page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
await page.goto(url);
await page.waitForSelector('.time');
await page.waitForTimeout(800);
const time = async () => (await page.locator('.time').count()) ? parseFloat(await page.locator('.time').innerText()) : NaN;
const shows = async (step) => {
  if (!(await page.locator('.time').count())) {   // the timer is gone: what the page shows instead
    const r = { step, gone: true, body: (await page.locator('body').innerText()).trim().split('\n').filter(Boolean) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
    return r;
  }
  const laps = await page.locator('li').allInnerTexts();
  const best = (await page.locator('.best').count()) ? await page.locator('.best').innerText() : null;
  const r = { step, time: await page.locator('.time').innerText(), laps, best, button: await page.locator('.buttons button').first().innerText() };
  if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
  return r;
};
const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
const steps = [];
steps.push(await shows('start'));
await page.click('.buttons button >> nth=0'); await page.waitForTimeout(4500); steps.push(await shows('running4'));
await page.waitForTimeout(1100); steps.push(await shows('running'));
let gainedStopped = null, gainedAgain = null;
if (!steps.at(-1).gone) {
  await page.click('.buttons button >> nth=1'); await page.waitForTimeout(300); steps.push(await shows('lap'));
  await page.click('.buttons button >> nth=0'); const stoppedAt = await time(); await page.waitForTimeout(2000); steps.push(await shows('stopped'));
  gainedStopped = Math.round((await time() - stoppedAt) * 10) / 10;
  const before = await time(); await page.click('.buttons button >> nth=0'); await page.waitForTimeout(2000); steps.push(await shows('again'));
  gainedAgain = Math.round((await time() - before) * 10) / 10;
  await page.click('.buttons button >> nth=0');
}
await browser.close();
console.log(JSON.stringify({ name, steps, gainedStopped, gainedAgain, console: console_, bytes }, null, 1));
