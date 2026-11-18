// Plays one game in each app, in Chromium: Red three times, Red twice more (5, the target), New game, then Blue
// once, and prints what the page shows after each, with the console's errors and warnings, and the bytes the page
// downloaded to start (as sent, compressed where the server compressed them).
//   node play.mjs destructure=http://localhost:4273 ... quillo=http://127.0.0.1:8080
import { chromium } from 'playwright';
const browser = await chromium.launch();
const results = {};
for (const [name, url] of process.argv.slice(2).map((a) => a.split('='))) {
  const page = await browser.newPage();
  const console_ = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => console_.push(`pageerror: ${e.message}`));
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForSelector('button.red');
  await page.waitForTimeout(600);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const shows = async () => {
    const t = (sel) => page.locator(sel).count().then((n) => (n ? page.locator(sel).innerText() : null));
    return { red: await t('button.red'), blue: await t('button.blue'), leader: await t('.leader'), winner: await t('.winner') };
  };
  const steps = [];
  const click = async (sel, n) => { for (let i = 0; i < n; i++) { await page.click(sel); await page.waitForTimeout(120); } await page.waitForTimeout(250); };
  steps.push({ after: 'start', ...(await shows()) });
  await click('button.red', 3); steps.push({ after: 'Red x3', ...(await shows()) });
  await click('button.red', 2); steps.push({ after: 'Red x5', ...(await shows()) });
  await click('button.new', 1); steps.push({ after: 'New game', ...(await shows()) });
  await click('button.blue', 1); steps.push({ after: 'Blue x1', ...(await shows()) });
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
