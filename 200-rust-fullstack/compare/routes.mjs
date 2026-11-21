// Eight addresses on one side's Trail Guide (already running): the status and title the server sends (a plain
// fetch, as a search engine or curl would see it), and the heading the page shows in Chromium once it has run.
//   node routes.mjs <side> <base url> <out.json>
import { chromium } from 'playwright';
import fs from 'node:fs';

const PATHS = ['/trails/2', '/trails/2/reviews', '/trails/02', '/trails/+2', '/trails/abc', '/trails/99',
  '/trails/4294967296', '/nope'];
const [side, base, outFile] = process.argv.slice(2);

const text = (html, re) => (html.match(re)?.[1] ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const browser = await chromium.launch();
const page = await browser.newPage();
const nojs = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
const results = [];
for (const p of PATHS) {
  const r = await fetch(base + p, { redirect: 'manual' });
  const html = await r.text();
  await page.goto(base + p);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(800);
  const shows = (await page.locator('h1').first().innerText({ timeout: 1500 }).catch(() => '')).replace(/\s+/g, ' ').trim();
  await nojs.goto(base + p);
  const plain = (await nojs.locator('main').first().innerText({ timeout: 1500 }).catch(() => '')).replace(/\s+/g, ' ').trim();
  results.push({
    path: p,
    status: r.status,
    sentTitle: text(html, /<title[^>]*>([\s\S]*?)<\/title>/),
    sentH1: text(html, /<h1[^>]*>([\s\S]*?)<\/h1>/),
    shows,
    title: await page.title(),
    nojs: plain,
  });
}
await browser.close();
if (outFile) fs.writeFileSync(outFile, JSON.stringify({ side, results }, null, 1) + '\n');
console.log(side);
for (const r of results) {
  console.log(`  ${r.path.padEnd(19)} ${r.status} ${r.shows.padEnd(20)} no JS: ${r.nojs.slice(0, 22).padEnd(22)} tab: ${r.title}`);
}
