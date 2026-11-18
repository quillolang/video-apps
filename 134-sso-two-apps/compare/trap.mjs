// The two sites on plain localhost, on two ports, in one browser: sign in to Trail Club (the provider's login page, as
// "ana"), open Photo Album and sign in there, then go back to Trail Club. What each page's heading says at each step, and
// the cookies the browser holds for localhost (one cookie jar for every port). With --shots <dir>: <name>_trap_trail,
// <name>_trap_photos, <name>_trap_trail_again (.png).
//   node trap.mjs express=http://localhost:3000,http://localhost:3001 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
for (const [name, bases] of args.map((a) => a.split('='))) {
  const [trail, photos] = bases.split(',');
  const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
  const page = await ctx.newPage();
  const h1 = async (shot) => {
    if (shots) await page.screenshot({ path: `${shots}/${name}_${shot}.png` });
    return { h1: (await page.locator('h1').innerText()).trim(), title: await page.title(), url: page.url().replace('http://', '') };
  };
  await page.goto(trail + '/'); await page.click('text=Log in');
  await page.fill('input[name=login]', 'ana'); await page.fill('input[name=password]', 'any password');
  await page.click('button[type=submit]'); await page.waitForURL(trail + '/');
  const r = { trail: await h1('trap_trail') };
  await page.goto(photos + '/'); await page.click('text=Log in'); await page.waitForURL(photos + '/');
  r.photos = await h1('trap_photos');
  r.asked_on_photos = 'nothing';
  await page.goto(trail + '/');
  r.trail_again = await h1('trap_trail_again');
  r.cookies = (await ctx.cookies()).filter((c) => c.domain === 'localhost').map((c) => c.name);
  results[name] = r;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
