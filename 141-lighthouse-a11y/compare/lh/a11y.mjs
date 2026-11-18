// Runs Lighthouse's accessibility audit (its phone settings) on each page, in Playwright's Chromium (CHROME_PATH), and
// prints the score, each audit that failed with how many elements it found, and Lighthouse's own note on what it can
// and can't check. The audit reads the page as it stands once loaded, so one run is enough: it doesn't vary.
//   CHROME_PATH=... node a11y.mjs vue=http://localhost:4191/ quillo=http://localhost:8081/
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
const results = {};
for (const [name, url] of process.argv.slice(2).map((a) => a.split('='))) {
  const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ['--headless=new'] });
  const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['accessibility'] });
  await chrome.kill();
  const cat = lhr.categories.accessibility, a = lhr.audits;
  const failed = cat.auditRefs.filter((r) => a[r.id].score === 0).map((r) => ({
    id: r.id, title: a[r.id].title, weight: r.weight,
    items: (a[r.id].details?.items ?? []).map((i) => i.node?.snippet ?? ''),
  }));
  const manual = cat.auditRefs.filter((r) => r.group === 'a11y-manual' || a[r.id].scoreDisplayMode === 'manual').length;
  results[name] = { score: Math.round(cat.score * 100), failed, manual, note: cat.manualDescription ?? null,
    description: cat.description ?? null, lighthouse: lhr.lighthouseVersion };
}
console.log(JSON.stringify(results, null, 1));
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}: accessibility ${r.score}`);
  for (const f of r.failed) console.error(`  ${f.id} (${f.items.length})`);
}
