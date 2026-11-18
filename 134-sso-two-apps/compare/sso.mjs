// Signs in to the club's two sites in one browser, as a person does: Trail Club first (the provider's login page, as
// "ana"), then Photo Album. For each site: the provider pages that asked something (a login or a consent form), every
// page request on the way (method, address, status, where a redirect points), and the time from clicking Log in to the
// site's page. With --shots <dir>: <name>_trail_home, _trail_login, _trail_done, _photos_home, _photos_done (.png).
//   node sso.mjs express=http://trail.localhost:3000,http://photos.localhost:3001 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
const short = (u) => { const x = new URL(u); return `${x.host}${x.pathname}`.replace(/(interaction|auth)\/([\w-]{6})[\w-]+/, '$1/$2…'); };
for (const [name, bases] of args.map((a) => a.split('='))) {
  const [trail, photos] = bases.split(',');
  const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
  const page = await ctx.newPage();
  let chain = [];
  page.on('response', (r) => {
    if (r.request().resourceType() !== 'document') return;
    const loc = r.headers()['location'];
    chain.push({ method: r.request().method(), url: short(r.url()), status: r.status(), to: loc ? short(new URL(loc, r.url()).href) : null });
  });
  const seen = {};
  const snap = async (shot) => {
    seen[shot] = { title: await page.title(), url: short(page.url()) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${shot}.png` });
  };
  results[name] = {};
  for (const [site, base] of [['trail', trail], ['photos', photos]]) {
    await page.goto(base + '/'); await page.waitForLoadState('networkidle');
    await snap(`${site}_home`);
    chain = [];
    const asked = [];
    const t0 = Date.now();
    await page.click('text=Log in');
    // Until we're back on the site: answer each form the provider shows, and count it.
    while (true) {
      await page.waitForLoadState('networkidle');
      if (page.url().startsWith(base)) break;
      if (await page.locator('input[name=login]').count()) {
        asked.push('login'); await snap(`${site}_login`);
        await page.fill('input[name=login]', 'ana'); await page.fill('input[name=password]', 'any password');
        await page.click('button[type=submit]');
      } else if (await page.locator('button[type=submit]').count()) {
        asked.push('consent'); await snap(`${site}_consent`); await page.click('button[type=submit]');
      } else { await page.waitForTimeout(200); }
    }
    const ms = Date.now() - t0;
    await snap(`${site}_done`);
    results[name][site] = { asked, ms, chain: [...chain], h1: (await page.locator('h1').innerText()).trim() };
  }
  // And back to the first site: still signed in?
  await page.goto(trail + '/'); await page.waitForLoadState('networkidle');
  await snap('trail_again');
  results[name].trail_again = (await page.locator('h1').innerText()).trim();
  results[name].seen = seen;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
// And each site's sign-in as a table, on stderr, for people.
for (const [name, r] of Object.entries(results)) for (const site of ['trail', 'photos']) {
  const x = r[site];
  console.error(`${name}, ${site === 'trail' ? 'Trail Club' : 'Photo Album'}: asked ${x.asked.length ? x.asked.join(', ') : 'nothing'}; ${x.chain.length} page requests, ${x.ms} ms`);
  for (const c of x.chain) console.error(`  ${c.method.padEnd(4)} ${c.url.padEnd(34)} ${c.status}${c.to ? ` → ${c.to}` : ''}`);
}
