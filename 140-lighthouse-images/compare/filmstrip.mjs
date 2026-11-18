// What each journal page shows while it loads on a slow phone: the network and CPU slowed as Lighthouse's applied
// ("devtools") throttling slows them (562.5 ms latency, 1.47 Mbit/s down, 0.68 up, a 4× slower CPU).
// First one load of each, recorded with Chromium's screencast (each frame the screen showed, and when) and kept until
// its photos are in, with the browser's own record of it: when it first showed something, when each photo's first and
// last bytes came, and each layout shift (its time and score, from a PerformanceObserver set up before the page runs).
// Then a sharp picture for each moment: before the first frame the screen is still the blank white one; after it, a
// fresh load and a screenshot at that moment (the time it was taken is kept: under the slowed CPU it takes a little).
// (A screenshot taken before the page can paint waits until it can, so it can't show the white screen itself; and the
// screencast's frames are only 640 by 440.)
// Writes <name>_t<ms>.png in <dir>.
//   node filmstrip.mjs svelte_plain=http://localhost:4182/ quillo_plain=http://localhost:8091/ --shots <dir>
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const MARKS = [500, 1000, 1500, 2000, 3000, 4000, 6000];
const W = 640, H = 440, SCALE = 3;
const browser = await chromium.launch();
const slowed = async (watch) => {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
  if (watch) await ctx.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts.push([Math.round(e.startTime), e.value]); })
      .observe({ type: 'layout-shift', buffered: true });
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 1474.56 * 1024 / 8, uploadThroughput: 675 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  return { ctx, page, cdp };
};
const results = {};
for (const [name, url] of args.map((a) => a.split('='))) {
  const { ctx, page, cdp } = await slowed(true);
  const frames = [];
  cdp.on('Page.screencastFrame', (f) => {
    frames.push(f.metadata.timestamp * 1000);
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 30, everyNthFrame: 1 });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(1500);
  await cdp.send('Page.stopScreencast');
  const seen = await page.evaluate(() => ({
    origin: performance.timeOrigin,
    shifts: window.__shifts,
    fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? -1),
    load: Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd),
    images: performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'img')
      .map((r) => [new URL(r.name).pathname.split('/').pop(), Math.round(r.responseStart), Math.round(r.responseEnd)]),
  }));
  await ctx.close();
  // The page's first frame: the first one shown once it had painted (the frames before are the blank page's).
  const first = frames.map((t) => Math.round(t - seen.origin)).find((t) => t >= seen.fcp - 50) ?? null;
  const shown = [];
  for (const ms of MARKS) {
    const out = `${shots}/${name}_t${ms}.png`;
    if (first === null || ms < first) {
      if (shots) spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', `color=white:s=${W * SCALE}x${H * SCALE}`, '-frames:v', '1', out]);
      shown.push({ ms, white: true });
      continue;
    }
    const { ctx, page } = await slowed(false);
    const t0 = Date.now();
    page.goto(url).catch(() => {});
    await page.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
    if (shots) await page.screenshot({ path: out });
    const taken = Date.now() - t0;
    const h2 = await page.locator('h2').first().boundingBox({ timeout: 200 }).catch(() => null);
    shown.push({ ms, taken, monday_top: h2 ? Math.round(h2.y) : null });
    await ctx.close();
  }
  delete seen.origin;
  results[name] = { first_frame: first, ...seen, shift_total: +seen.shifts.reduce((s, x) => s + x[1], 0).toFixed(3), frames: shown };
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}: first paint ${r.fcp} ms, its first frame ${r.first_frame} ms; Monday's heading from the top: `
    + r.frames.map((f) => `${f.ms / 1000} s ${f.white ? 'white' : `${f.monday_top} (taken ${f.taken})`}`).join(' | '));
  console.error(`  the photos' first bytes ${r.images.map((i) => i[1]).join('/')} ms, last ${r.images.map((i) => i[2]).join('/')} ms; `
    + `layout shifts: ${r.shifts.length ? r.shifts.map(([t, v]) => `${v.toFixed(3)} at ${t} ms`).join(', ') : 'none'} (total ${r.shift_total})`);
}
