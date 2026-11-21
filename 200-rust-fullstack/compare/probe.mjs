// Uses one side's Trail Guide in Chromium, as a visitor would, and writes what happened as JSON.
//   node probe.mjs <side> <base url> <out.json>
// Every step records the address, the tab's title, the header's saved count, and the requests the step
// made: a "document" request is a page load; a fetch is a call to the server. Scripts and wasm are gzipped
// here (level 9) to count what a visitor downloads, as earlier videos did.
import { chromium } from 'playwright';
import fs from 'node:fs';
import zlib from 'node:zlib';

const [side, base, outFile] = process.argv.slice(2);
const browser = await chromium.launch();
const out = { side, base, steps: [], scripts: [], nojs: [] };

// A call's name: Leptos's /api/load_trail<hash>, Quillo's /_quillo/rpc/load_trail, Dioxus's POST /api/trail.
const callName = (c) => {
  const [method, p] = c.split(' ');
  if (p.startsWith('/_quillo/rpc/')) return p.slice(13);
  if (/^\/api\/[a-z_]+\d{6,}$/.test(p)) return p.slice(5).replace(/\d+$/, '');
  if (method === 'GET' && !p.startsWith('/api/')) return `prefetch ${p}`;
  return `${method} ${p}`;
};

async function visit(ctx, label) {
  const page = await ctx.newPage();
  let reqs = [];
  page.on('request', (r) => {
    const t = r.resourceType();
    const u = new URL(r.url());
    if (u.origin !== new URL(base).origin) return;
    reqs.push({ type: t, method: r.method(), path: u.pathname + u.search });
  });
  const scripts = new Map();
  page.on('response', async (r) => {
    const t = r.request().resourceType();
    const u = r.url();
    if (t === 'script' || u.endsWith('.wasm') || t === 'fetch' && u.endsWith('.wasm')) {
      try { const b = await r.body(); scripts.set(new URL(u).pathname, b); } catch {}
    }
  });
  async function step(name, act) {
    reqs = [];
    let missing = null;
    try { await act(); } catch (e) { missing = String(e.message).split('\n')[0]; }
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(400);
    const s = {
      step: name,
      url: new URL(page.url()).pathname,
      title: await page.title(),
      h1: (await page.locator('h1').first().textContent({ timeout: 1500 }).catch(() => null))?.trim() ?? null,
      saved: (await page.locator('.saved').first().textContent({ timeout: 1500 }).catch(() => null))?.trim() ?? null,
      documents: reqs.filter((r) => r.type === 'document').length,
      calls: reqs.filter((r) => r.type === 'fetch' || r.type === 'xhr').map((r) => `${r.method} ${r.path}`),
      ...(missing ? { missing } : {}),
    };
    s.main = (await page.locator('main').first().innerText({ timeout: 1500 }).catch(() => '')).replace(/\s+/g, ' ').trim();
    const calls = s.calls.filter((c) => !c.endsWith('.wasm')).map(callName);
    console.log(`${label ? label + '  ' : ''}${name.padEnd(17)}  ${s.url.padEnd(18)} loads ${s.documents}  calls ${(calls.join(', ') || 'none').padEnd(17)} ` +
      (label ? `shows "${missing ? '(nothing to click)' : s.main.slice(0, 26)}"` : `tab "${s.title}"  ${s.saved}`));
    return s;
  }
  return { page, step, scripts };
}

// With JavaScript.
{
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const { page, step, scripts } = await visit(ctx, '');
  out.steps.push(await step('open /', () => page.goto(base + '/')));
  // Wait until the page has come alive (the framework's code has run) before clicking, as a visitor would.
  await page.waitForTimeout(1500);
  out.steps.push(await step('click Eagle Ridge', () => page.locator('a', { hasText: 'Eagle Ridge' }).first().click()));
  out.steps.push(await step('click Reviews', () => page.locator('a', { hasText: 'Reviews' }).first().click()));
  out.steps.push(await step('click Save', () => page.locator('button.save').first().click()));
  out.steps.push(await step('click Overview', () => page.locator('a', { hasText: 'Overview' }).first().click()));
  out.steps.push(await step('Back', () => page.goBack()));
  out.steps.push(await step('click Trail Guide', () => page.locator('a', { hasText: 'Trail Guide' }).first().click()));
  out.steps.push(await step('reload', () => page.reload()));
  for (const [path, body] of scripts) {
    out.scripts.push({ path, bytes: body.length, gzip: zlib.gzipSync(body, { level: 9 }).length });
  }
  out.scripts.sort((a, b) => a.path.localeCompare(b.path));
  const total = out.scripts.reduce((n, s) => n + s.gzip, 0);
  for (const s of out.scripts) console.log(`downloads ${s.path.padEnd(44)} ${String(s.bytes).padStart(9)} bytes, ${String(s.gzip).padStart(7)} gzipped`);
  console.log(`downloads ${'all of it'.padEnd(44)} ${String(out.scripts.reduce((n, s) => n + s.bytes, 0)).padStart(9)} bytes, ${String(total).padStart(7)} gzipped`);
  await ctx.close();
}

// With JavaScript off: what the server's pages alone do.
{
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 700 }, javaScriptEnabled: false });
  const { page, step } = await visit(ctx, 'no JS');
  out.nojs.push(await step('open /', () => page.goto(base + '/')));
  const quick = { timeout: 3000 };
  out.nojs.push(await step('click Eagle Ridge', () => page.locator('a', { hasText: 'Eagle Ridge' }).first().click(quick)));
  out.nojs.push(await step('open /trails/2', () => page.goto(base + '/trails/2')));
  out.nojs.push(await step('click Reviews', () => page.locator('a', { hasText: 'Reviews' }).first().click(quick)));
  out.nojs.push(await step('click Save', () => page.locator('button.save').first().click(quick)));
  out.nojs.push(await step('open /trails/2/reviews', () => page.goto(base + '/trails/2/reviews')));
  await ctx.close();
}

await browser.close();
if (outFile) fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
