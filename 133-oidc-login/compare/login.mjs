// Logs in through each app in Chromium, as a person does: the app's page, Log in, the provider's development login page
// (any name: "ana"), its consent page, and back. Records every page request the browser makes on the way (method,
// address without its query, status, and where a redirect points), how long the whole login took, and what each app
// shows at the end. With --shots <dir>: <name>_home.png, <name>_login.png, <name>_consent.png, <name>_done.png.
//   node login.mjs express=http://localhost:3000 quillo=http://localhost:8080 [--shots <dir>]
import { chromium } from 'playwright';
const args = process.argv.slice(2), si = args.indexOf('--shots'), shots = si >= 0 ? args.splice(si, 2)[1] : null;
const browser = await chromium.launch();
const results = {};
const short = (u) => { const x = new URL(u); return `${x.host}${x.pathname}`; };
for (const [name, base] of args.map((a) => a.split('='))) {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 440 }, deviceScaleFactor: shots ? 3 : 1 });
  const page = await ctx.newPage();
  const chain = [];
  page.on('response', async (r) => {
    if (r.request().resourceType() !== 'document') return;
    const loc = r.headers()['location'];
    chain.push({ method: r.request().method(), url: short(r.url()), status: r.status(), to: loc ? short(new URL(loc, r.url()).href) : null,
      params: [...new URL(r.url()).searchParams.keys()] });
  });
  const seen = {};
  const snap = async (shot) => {
    seen[shot] = { title: await page.title(), url: short(page.url()) };
    if (shots) await page.screenshot({ path: `${shots}/${name}_${shot}.png` });
  };
  await page.goto(base + '/');
  await snap('home');
  const t0 = Date.now();
  chain.length = 0;
  await page.click('text=Log in');
  await page.waitForSelector('input[name=login]');
  await snap('login');
  await page.fill('input[name=login]', 'ana');
  await page.fill('input[name=password]', 'any password');
  await page.click('button[type=submit]');
  await page.waitForSelector('button[autofocus], button[type=submit]');
  await snap('consent');
  const prompts = 2;
  await page.click('button[type=submit]');
  await page.waitForURL(`${base}/`);
  await page.waitForLoadState('networkidle');
  const ms = Date.now() - t0;
  await snap('done');
  results[name] = { h1: (await page.locator('h1').innerText()).trim(), text: (await page.locator('main').innerText()).trim(),
    chain, ms, prompts, seen, cookies: (await ctx.cookies()).map((c) => `${c.domain}:${c.port ?? ''} ${c.name}`) };
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 1));
// And each login's page requests as a table, on stderr, for people (an interaction's long id cut short, and of each
// address's parameters only those that keep a login safe: state, nonce, the PKCE challenge, and the code).
const shown = (ps) => { const k = ps.filter((p) => ['state', 'nonce', 'code_challenge', 'code'].includes(p)); return k.length ? `  with ${k.join(', ')}` : ''; };
for (const [name, r] of Object.entries(results)) {
  console.error(`${name}: ${r.chain.length} page requests, ${r.ms} ms`);
  for (const c of r.chain) console.error(`  ${c.method.padEnd(4)} ${c.url.replace(/(interaction|auth)\/([\w-]{6})[\w-]+/, '$1/$2…').padEnd(32)} ${c.status}${c.to ? ` → ${c.to.replace(/(interaction|auth)\/([\w-]{6})[\w-]+/, '$1/$2…')}` : ''}${shown(c.params)}`);
}
