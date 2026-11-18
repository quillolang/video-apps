// Uses the Chore Chart in each app, in Chromium: ☆ on "Fold the laundry", → on "Water the plants" (To do to Doing),
// then ☆ on "Wash the dishes". After each it prints what each column holds (★ for a starred card), the page's changes
// (MutationObserver records under <body>), and how many card rows are new elements (each <li> is marked before the
// click; a row without the mark was made again). Also the console's errors and warnings, and the bytes the page
// downloaded to start (as sent, compressed where the server compressed them). With --shots <dir>, a screenshot after
// each, with rows made again outlined in orange and the elements the page's changes touched in green.
//   node play.mjs draft=http://localhost:4173 ... quillo=http://127.0.0.1:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const page = await browser.newPage({ viewport: { width: 860, height: 520 }, deviceScaleFactor: shots ? 3 : 1 });
  const console_ = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 300)}`); });
  page.on('pageerror', (e) => console_.push(`pageerror: ${e.message.split('\n')[0].slice(0, 300)}`));
  await page.addInitScript(() => {
    window.__mutations = 0; window.__targets = [];
    addEventListener('DOMContentLoaded', () => new MutationObserver((r) => {
      if (window.__frozen) return;
      window.__mutations += r.length;
      for (const m of r) window.__targets.push(m.type === 'characterData' ? m.target.parentElement : m.target);
    }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true }));
  });
  const sizes = [];
  page.on('requestfinished', (req) => sizes.push(req.sizes().then((z) => z.responseBodySize)));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('li').length === 8);
  await page.waitForTimeout(800);
  const bytes = (await Promise.all(sizes)).reduce((a, b) => a + b, 0);
  const mark = () => page.evaluate(() => { document.querySelectorAll('li').forEach((li) => { li.__old = true; }); document.querySelectorAll('.__hl').forEach((d) => d.remove()); window.__mutations = 0; window.__targets = []; });
  const outline = () => page.evaluate(() => {
    window.__frozen = true;
    const box = (el, color, off) => { if (!el || !el.getBoundingClientRect) return; const r = el.getBoundingClientRect(); if (!r.width) return;
      const d = document.createElement('div'); d.className = '__hl';
      Object.assign(d.style, { position: 'fixed', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, outline: `3px solid ${color}`, outlineOffset: off, borderRadius: '8px', pointerEvents: 'none', zIndex: 2147483647 });
      document.documentElement.appendChild(d); };
    const fresh = [...document.querySelectorAll('li')].filter((li) => !li.__old);
    for (const li of fresh) box(li, '#f97316', '1px');
    for (const t of new Set(window.__targets)) if (t && t.isConnected && !fresh.some((li) => li.contains(t))) box(t, '#16a34a', '-1px');
  });
  const shows = async (step) => {
    const r = await page.evaluate((step) => ({
      step,
      columns: [...document.querySelectorAll('section')].map((s) => [...s.querySelectorAll('li')].map((li) => li.querySelector('span').textContent + (li.classList.contains('starred') ? ' ★' : ''))),
      mutations: window.__mutations,
      newRows: [...document.querySelectorAll('li')].filter((li) => !li.__old).length,
    }), step);
    if (shots) { await outline(); await page.screenshot({ path: `${shots}/${name}_${step}.png` }); await page.evaluate(() => { window.__frozen = false; }); }
    return r;
  };
  const card = (text) => page.locator('li', { hasText: text });
  await mark();
  const steps = [await shows('start')];
  await mark(); await card('Fold the laundry').locator('button.star').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('star'));
  await mark(); await card('Water the plants').locator('button.move').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('move'));
  await mark(); await card('Wash the dishes').locator('button.star').click(); await page.mouse.move(0, 0); await page.waitForTimeout(300); steps.push(await shows('star2'));
  results[name] = { steps, console: console_, bytes };
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
