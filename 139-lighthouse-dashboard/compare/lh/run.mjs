// Runs Lighthouse (its default: a phone, with simulated slow 4G and a slower CPU) on each page three times, in
// Playwright's Chromium (CHROME_PATH), and prints the run with the median Performance score: the four category scores,
// the metrics, and what the page downloaded. With --reports <dir>, each run's report JSON is kept there.
//   CHROME_PATH=... node run.mjs react=http://localhost:4173/ quillo=http://localhost:8080/ [--applied] [--reports <dir>]
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';
const args = process.argv.slice(2), ri = args.indexOf('--reports'), reports = ri >= 0 ? args.splice(ri, 2)[1] : null;
// --applied: the network and CPU really slowed while the page loads (Lighthouse's "devtools" throttling), instead of
// a load at full speed whose times are then worked out for a slow phone (its default, "simulate").
const ai = args.indexOf('--applied'), applied = ai >= 0 ? (args.splice(ai, 1), true) : false;
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const runs = [];
  for (let i = 0; i < 3; i++) {
    const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ['--headless=new'] });
    const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', ...(applied && { throttlingMethod: 'devtools' }) });
    await chrome.kill();
    if (reports) fs.writeFileSync(`${reports}/${name}-${i + 1}.json`, JSON.stringify(lhr));
    const a = lhr.audits, items = a['network-requests'].details.items;
    runs.push({
      scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)])),
      lcp: a['largest-contentful-paint'].numericValue, fcp: a['first-contentful-paint'].numericValue,
      tbt: a['total-blocking-time'].numericValue, cls: a['cumulative-layout-shift'].numericValue, si: a['speed-index'].numericValue,
      bytes: a['total-byte-weight'].numericValue, requests: items.length,
      js: items.filter((r) => r.resourceType === 'Script').reduce((s, r) => s + r.transferSize, 0),
      image: items.filter((r) => r.resourceType === 'Image').map((r) => `${new URL(r.url).pathname.slice(0, 40)} ${r.mimeType} ${r.transferSize}`),
      failed: Object.values(lhr.categories).flatMap((c) => c.auditRefs.filter((r) => r.weight > 0 && a[r.id].score !== null && a[r.id].score < 1).map((r) => `${c.id}: ${r.id}`)),
      lighthouse: lhr.lighthouseVersion, chrome: lhr.environment.hostUserAgent.match(/Chrome\/[\d.]+/)?.[0],
    });
  }
  runs.sort((x, y) => x.scores.performance - y.scores.performance || x.lcp - y.lcp);
  results[name] = { median: runs[1], performance: runs.map((r) => r.scores.performance), lcp: runs.map((r) => Math.round(r.lcp)) };
}
console.log(JSON.stringify(results, null, 1));
const s = (ms) => `${(ms / 1000).toFixed(1)} s`;
console.error(`${''.padEnd(22)}${Object.keys(results).map((n) => n.padEnd(16)).join('')}`);
const row = (label, f) => console.error(`${label.padEnd(22)}${Object.values(results).map((r) => String(f(r.median)).padEnd(16)).join('')}`);
for (const k of ['performance', 'accessibility', 'best-practices', 'seo']) row(k, (m) => m.scores[k]);
row('LCP', (m) => s(m.lcp)); row('FCP', (m) => s(m.fcp)); row('TBT', (m) => `${Math.round(m.tbt)} ms`); row('CLS', (m) => m.cls.toFixed(3));
row('downloaded', (m) => `${(m.bytes / 1000).toFixed(0)} KB`); row('JavaScript', (m) => `${(m.js / 1000).toFixed(0)} KB`); row('requests', (m) => m.requests);
console.error(`(${applied ? 'applied throttling; ' : ''}the median of 3 runs each; Performance, all runs: ${Object.entries(results).map(([n, r]) => `${n} ${r.performance.join('/')}`).join(', ')})`);
