// Uses each Pie Shop in Chromium, three ways, each in a fresh browser (no cookies, nothing stored):
//   out     signed out, open /admin
//   forged  signed out, but with the browser told it's signed in: for Vue, the flag the guard reads
//           (localStorage signedIn = '1', what one line in the browser's console does); for Quillo, a session
//           cookie whose payload says {"staff":"mallory"}, with no signature of the server's
//   staff   log in with the right password, as a person does, and land on /admin
// For each: the address the browser ends on, the first heading, the page's text and the requests to the data.
// With --shots <dir>, a screenshot of each: <name>_<way>.png.
//   node play.mjs vue-open=http://localhost:4175 vue-checked=http://localhost:4176 quillo=http://localhost:8080 [--shots <dir>]
import { chromium } from 'playwright';
const PASSWORD = process.env.STAFF_PASSWORD;
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, base] of args.map((a) => a.split('='))) {
  results[name] = {};
  for (const way of ['out', 'forged', 'staff']) {
    const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
    const page = await ctx.newPage();
    const data = [];
    page.on('response', (r) => { if (/\/api\/orders|\/orders\.json/.test(r.url())) data.push(`${r.status()} ${new URL(r.url()).pathname}`); });
    if (way === 'forged') {
      if (name === 'quillo') {
        const payload = Buffer.from(JSON.stringify({ e: 1897573886, d: { staff: 'mallory' }, i: 'c0dcf6491109cf91ef3ea8b94946df64' })).toString('base64url');
        await page.setExtraHTTPHeaders({ Cookie: `__Host-quillo_session=${payload}` });   // sent with every request
      } else {
        await page.goto(base + '/');
        await page.evaluate(() => localStorage.setItem('signedIn', '1'));
      }
    }
    if (way === 'staff') {
      await page.goto(base + '/login');
      await page.fill('input[name=name], label:has-text("Name") input', 'ana');
      await page.fill('input[type=password]', PASSWORD);
      await page.click('button');
      await page.waitForURL(/\/admin/, { timeout: 8000 }).catch(() => {});
    } else {
      await page.goto(base + '/admin');
    }
    await page.waitForLoadState('networkidle'); await page.waitForTimeout(500);
    const h1 = (await page.locator('h1').count()) ? (await page.locator('h1').first().innerText()).trim() : null;
    const text = (await page.locator('main').innerText()).trim().split('\n').filter(Boolean).slice(0, 7);
    if (shots) await page.screenshot({ path: `${shots}/${name}_${way}.png` });
    results[name][way] = { url: page.url().replace(base, ''), title: await page.title(), h1, text, data };
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
