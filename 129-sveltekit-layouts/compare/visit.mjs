// Visits the same addresses on each app: the HTTP status the server answers (what a crawler or curl gets), then, in
// Chromium, the page's title, first heading and the nav link marked as the current one, and the console's errors.
// With --shots <dir>, a screenshot of each: <name>_<n>.png, n the address's place in the list (0 is /).
//   node visit.mjs section=http://localhost:4181 rest=http://localhost:4182 quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
export const PATHS = ['/', '/trails', '/trails/3', '/about', '/trails/999', '/trails/abc', '/trails/nope', '/nope'];
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, base] of args.map((a) => a.split('='))) {
  results[name] = [];
  for (const [n, p] of PATHS.entries()) {
    const res = await fetch(base + p, { redirect: 'manual' });
    const status = res.status; await res.arrayBuffer();
    const page = await browser.newPage({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().split('\n')[0].slice(0, 200)); });
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message.split('\n')[0].slice(0, 200)}`));
    await page.goto(base + p); await page.waitForTimeout(700);
    const h1 = (await page.locator('h1').count()) ? (await page.locator('h1').first().innerText()).trim() : null;
    const here = (await page.locator('nav a.here').count()) ? (await page.locator('nav a.here').first().innerText()).trim() : null;
    if (shots) await page.screenshot({ path: `${shots}/${name}_${n}.png` });
    results[name].push({ path: p, status, title: await page.title(), h1, here, errors });
    await page.close();
  }
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
