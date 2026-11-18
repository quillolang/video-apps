// What each dashboard shows while it loads on a slow phone: the network and CPU slowed as Lighthouse's applied
// ("devtools") throttling slows them (562.5 ms latency, 1.47 Mbit/s down, 0.68 up, a 4× slower CPU), one fresh load
// for each moment, and a screenshot that many seconds after the load starts. Also what each page's first HTML holds.
// Writes <name>_t<ms>.png in <dir>.
//   node filmstrip.mjs react=http://localhost:4173/ quillo=http://localhost:8080/ --shots <dir>
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const MARKS = [500, 1000, 1500, 2000, 2500, 3000];
const browser = await chromium.launch();
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  results[name] = { frames: [] };
  for (const ms of MARKS) {
    const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 1474.56 * 1024 / 8, uploadThroughput: 675 * 1024 / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const t0 = Date.now();
    page.goto(url).catch(() => {});
    await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
    if (shots) await page.screenshot({ path: `${shots}/${name}_t${ms}.png` });
    const h1 = await page.locator('h1').first().innerText({ timeout: 200 }).catch(() => null);
    const body = (await page.locator('body').innerText({ timeout: 200 }).catch(() => '')).trim().split('\n')[0];
    results[name].frames.push({ ms, h1, first: body.slice(0, 40), title: await page.title().catch(() => '') });
    await ctx.close();
  }
  const html = await (await fetch(url).catch(() => fetch(url, { headers: { connection: 'close' } }))).text();
  results[name].html_bytes = html.length;
  results[name].html_has_revenue = html.includes('13,017.40');
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}: ${r.frames.map((f) => `${f.ms / 1000} s: ${f.h1 ?? (f.first || '(blank)')}`).join(' | ')}`);
  console.error(`  its first HTML: ${r.html_bytes} characters, the revenue in it: ${r.html_has_revenue ? 'yes' : 'no'}`);
}
