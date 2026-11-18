// What a page sends the browser to run: each script it loads (its address and its size, as sent and unzipped) and
// each script written into the page, as it loads; then a click on +1, to see the counter work and what loads for it.
// In Playwright's Chromium.
//   node js.mjs http://localhost:8000/ http://localhost:8080/about
import { chromium } from 'playwright';
const browser = await chromium.launch();
const results = {};
for (const url of process.argv.slice(2)) {
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const sent = new Map(), types = new Map();
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, [e.response.url, e.type]));
  cdp.on('Network.loadingFinished', (e) => sent.set(e.requestId, e.encodedDataLength));
  const scripts = async (seen) => {
    const files = [];
    for (const [id, [u, type]] of types) if (type === 'Script' && !seen.has(id)) {
      seen.add(id);
      const body = await cdp.send('Network.getResponseBody', { requestId: id }).catch(() => null);
      files.push({ url: new URL(u).pathname, sent: sent.get(id) ?? 0, size: body ? (body.base64Encoded ? Buffer.from(body.body, 'base64').length : Buffer.byteLength(body.body)) : 0 });
    }
    return files;
  };
  const seen = new Set();
  await page.goto(url); await page.waitForLoadState('networkidle');
  const files = await scripts(seen);
  const inline = await page.evaluate(() => [...document.querySelectorAll('script:not([src])')].map((s) => s.textContent.length));
  const all = [...sent.values()].reduce((a, b) => a + b, 0);
  let counter = null, clicked = [];
  const plus = page.locator('button', { hasText: '+1' });
  if (await plus.count()) {
    await plus.click(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(300);
    counter = (await page.locator('p.text-3xl').innerText()).trim();
    clicked = await scripts(seen);
  }
  results[url] = { files, inline, all, counter, clicked, all_after: [...sent.values()].reduce((a, b) => a + b, 0) };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
const kb = (n) => `${(n / 1000).toFixed(1)} KB`;
for (const [url, r] of Object.entries(results)) {
  const js = r.files.reduce((a, f) => a + f.size, 0) + r.inline.reduce((a, b) => a + b, 0);
  console.error(`${url}  as it loads: ${kb(js)} of JavaScript (${r.files.length} files, ${r.inline.length} in the page); ${kb(r.all)} sent in all`);
  if (r.counter) console.error(`  after a click on +1: the counter says ${r.counter}; ${r.clicked.length} more files`
    + (r.clicked.length ? `, ${kb(r.clicked.reduce((a, f) => a + f.size, 0))} (${kb(r.clicked.reduce((a, f) => a + f.sent, 0))} sent)` : ''));
}
