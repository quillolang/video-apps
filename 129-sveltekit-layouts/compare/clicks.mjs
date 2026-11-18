// Opens each app at / in Chromium and clicks around as a visitor would: Trails, Lantern Lake, About, Home. For the
// first load and for each click: the bytes the server sent (counted by a small proxy in front of the app, so what a
// page fetches ahead of time when a link is pointed at counts too), how many of them were JavaScript, the requests,
// and how many were whole pages (HTML). Each click comes after the pointer has rested on the link for 300 ms, as a
// person's does. Then the same clicks with JavaScript turned off: does each one still arrive?
//   node clicks.mjs section=http://localhost:4181 quillo=http://127.0.0.1:8080
import { chromium } from 'playwright';
import http from 'node:http';
const CLICKS = [['nav a[href="/trails"]', 'Trails'], ['main a[href="/trails/3"]', 'Lantern Lake'], ['nav a[href="/about"]', 'About'], ['nav a[href="/"]', 'Trail Guide']];

// The proxy: each request goes on to the app unchanged; each answer comes back unchanged, its body counted.
let seen = [];
const proxy = (target) => new Promise((ok) => {
  const t = new URL(target);
  const server = http.createServer((req, res) => {
    const up = http.request({ host: t.hostname, port: t.port, path: req.url, method: req.method, headers: { ...req.headers, host: t.host } }, (r) => {
      const row = { path: req.url, type: String(r.headers['content-type'] || '').split(';')[0], bytes: 0 };
      seen.push(row);
      res.writeHead(r.statusCode, r.headers);
      r.on('data', (c) => { row.bytes += c.length; res.write(c); });
      r.on('end', () => res.end());
    });
    up.on('error', () => { res.writeHead(502); res.end(); });
    req.pipe(up);
  });
  server.listen(0, '127.0.0.1', () => ok({ base: `http://127.0.0.1:${server.address().port}`, server }));
});

const browser = await chromium.launch();
const results = {};
for (const [name, target] of process.argv.slice(2).map((a) => a.split('='))) {
  const { base, server } = await proxy(target);
  results[name] = {};
  for (const js of [true, false]) {
    const ctx = await browser.newContext({ javaScriptEnabled: js });
    const page = await ctx.newPage();
    const settle = async () => { await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); };
    const take = async (step) => {
      const row = { step, h1: (await page.locator('h1').first().innerText()).trim(),
        requests: seen.length, pages: seen.filter((s) => s.type === 'text/html').length,
        bytes: seen.reduce((a, s) => a + s.bytes, 0),
        js: seen.filter((s) => /javascript/.test(s.type)).reduce((a, s) => a + s.bytes, 0),
        files: seen.map((s) => `${s.type} ${s.path} ${s.bytes}`) };
      seen = [];
      return row;
    };
    seen = [];
    await page.goto(base + '/'); await settle();
    const steps = [await take('open /')];
    for (const [sel, want] of CLICKS) {
      await page.hover(sel); await page.waitForTimeout(300);
      await page.click(sel);
      await page.waitForFunction((w) => document.querySelector('h1')?.textContent.trim() === w, want, { timeout: 8000 }).catch(() => {});
      await settle();
      steps.push(await take(`click ${want}`));
    }
    results[name][js ? 'js' : 'nojs'] = steps;
    await ctx.close();
  }
  server.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
// And a table of the JavaScript-on run, on stderr, for people: kilobytes are 1,000 bytes.
const kb = (b) => `${(b / 1000).toFixed(1)} KB`.padStart(8);
for (const [name, { js: steps }] of Object.entries(results)) {
  steps.forEach((s, i) => console.error(`${(i ? '' : name).padEnd(8)} ${s.step.padEnd(19)} ${kb(s.bytes)}${s.js ? `  ${kb(s.js).trim()} JavaScript` : ''}${s.pages ? `  ${s.pages} page` : ''}`));
  console.error(`${''.padEnd(8)} ${'five pages, in all'.padEnd(19)} ${kb(steps.reduce((a, s) => a + s.bytes, 0))}`);
}
