// Logging out, in one browser: sign in to both of the club's sites (Trail Club, as "ana" on the provider's page, then
// Photo Album, asked nothing). Then on Trail Club, "Log out" (this site only): what Trail Club and Photo Album show, and
// what logging in to Trail Club again asks. Then "Log out everywhere" (this site, and the provider's own session, after
// its "Do you want to sign-out" page): what each site shows, and what logging in to Trail Club asks now.
// With --shots <dir>: <name>_<step>.png for each step.
//   node logout.mjs express=http://trail.localhost:3000,http://photos.localhost:3001 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
const short = (u) => { const x = new URL(u); return `${x.host}${x.pathname}`.replace(/(interaction|auth)\/([\w-]{6})[\w-]+/, '$1/$2…'); };
for (const [name, bases] of args.map((a) => a.split('='))) {
  const [trail, photos] = bases.split(',');
  const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
  const page = await ctx.newPage();
  const steps = [];
  const look = async (step) => {
    await page.waitForLoadState('networkidle');
    const h1 = (await page.locator('h1').count()) ? (await page.locator('h1').first().innerText()).trim() : null;
    steps.push({ step, h1, title: await page.title(), url: short(page.url()) });
    if (shots) await page.screenshot({ path: `${shots}/${name}_${step}.png` });
  };
  // Logging in from a site's page: what the provider asked (its login form, or nothing), until back on the site.
  const logIn = async (base) => {
    await page.click('text=Log in');
    const asked = [];
    while (true) {
      await page.waitForLoadState('networkidle');
      if (page.url().startsWith(base)) return asked;
      if (await page.locator('input[name=login]').count()) {
        asked.push('login');
        await page.fill('input[name=login]', 'ana'); await page.fill('input[name=password]', 'any password');
        await page.click('button[type=submit]');
      } else await page.waitForTimeout(200);
    }
  };
  const visit = async (base, step) => { await page.goto(base + '/'); await look(step); };
  const r = {};
  await page.goto(trail + '/'); r.trail_login = await logIn(trail); await look('trail_in');
  await page.goto(photos + '/'); r.photos_login = await logIn(photos); await look('photos_in');
  // Photo Album's page while signed in, five times: the time to its first byte (the median), as the browser saw it.
  const ttfb = [];
  for (let i = 0; i < 5; i++) { const res = await page.goto(photos + '/'); const t = res.request().timing(); ttfb.push(t.responseStart - t.requestStart); }
  r.photos_ttfb_ms = Math.round(ttfb.sort((x, y) => x - y)[2] * 10) / 10;
  // 1. Log out, of Trail Club only.
  await page.goto(trail + '/'); await page.click('text=Log out'); await look('trail_out');
  await visit(photos, 'photos_after_out');
  await page.goto(trail + '/'); r.relogin_after_out = await logIn(trail); await look('trail_back');
  // 2. Log out everywhere, from Trail Club: the provider's page, then back.
  await page.click('text=Log out everywhere');
  await page.waitForSelector('button[name=logout]'); await look('provider_logout');
  await page.click('button[name=logout]'); await page.waitForURL(trail + '/'); await look('trail_out_all');
  await visit(photos, 'photos_after_all');
  await page.goto(trail + '/'); r.relogin_after_all = await logIn(trail); await look('trail_relogin');
  r.steps = steps;
  results[name] = r;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}:`);
  for (const s of r.steps) console.error(`  ${s.step.padEnd(18)} ${String(s.url).padEnd(30)} ${s.h1}`);
  console.error(`  Photo Album's page, signed in: ${r.photos_ttfb_ms} ms to its first byte (the median of 5)`);
  console.error(`  logging in again after Log out asked: ${r.relogin_after_out.join(', ') || 'nothing'}; after Log out everywhere: ${r.relogin_after_all.join(', ') || 'nothing'}`);
}
