// Runs Lighthouse's SEO audit (its phone settings) on each page, in Playwright's Chromium (CHROME_PATH), and prints the
// score and each audit that failed. With --no-scripts, the page's script files are blocked (Lighthouse's
// blockedUrlPatterns, '*.js'), so the page is read as its HTML has it, as a crawler that doesn't run scripts reads it.
// (Chromium with JavaScript turned off can't be audited: Lighthouse needs it itself.)
//   CHROME_PATH=... node seo.mjs spa=http://localhost:4173/breads/sourdough quillo=http://localhost:8080/breads/sourdough
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
const args = process.argv.slice(2), ni = args.indexOf('--no-scripts'), noScripts = ni >= 0 ? (args.splice(ni, 1), true) : false;
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ['--headless=new'] });
  const { lhr } = await lighthouse(url, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['seo'],
    ...(noScripts && { blockedUrlPatterns: ['*.js'] }) });
  await chrome.kill();
  const cat = lhr.categories.seo, a = lhr.audits;
  // A page Lighthouse can't audit (one that never paints, say) gets no score, and the reason.
  const error = lhr.runtimeError ? `${lhr.runtimeError.message.split('.')[0]} (${lhr.runtimeError.code})` : null;
  results[name] = { score: error ? null : Math.round(cat.score * 100), error, lighthouse: lhr.lighthouseVersion,
    failed: cat.auditRefs.filter((r) => a[r.id].score === 0).map((r) => ({ id: r.id, title: a[r.id].title, weight: r.weight })),
    passed: cat.auditRefs.filter((r) => a[r.id].score === 1).map((r) => r.id) };
}
console.log(JSON.stringify(results, null, 1));
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}: ${r.error ? `no score: ${r.error}` : `seo ${r.score}`}${noScripts ? ' (scripts blocked)' : ''}`);
  for (const f of r.failed) console.error(`  ${f.id}: ${f.title}`);
}
