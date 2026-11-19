// What the same counter downloads, in six ways: the JavaScript a fresh browser gets until the button has been
// clicked once, each script gzipped with gzip -9, measured the same way for every app:
//   node shorts/72-vs-shipped-js/compare/downloads.mjs <out-dir>
// The counter (a button that shows doubled, and "{count} doubled is {doubled}") is:
//   react    compare/react (npm create vite, React), built with npm run build, served by vite preview
//   vue      compare/vue (npm create vue --default --bare), npm run build, vite preview
//   svelte   ../64-vs-svelte-counter/compare/svelte (SvelteKit, sv create), npm run build, vite preview
//   angular  ../74-vs-angular-counter/compare/counter (ng new), npx ng build, served as it is by serve-dist.mjs
//   solid    ../76-vs-solid-counter/compare/solid (create-solid, bare), npm run build, vite preview
//   quillo   ../app (this Short's main.qwe), quillo run, as it serves the page
// Each app is built here first (so the builds are of today), then served on its own port, opened in a fresh
// browser, clicked once, and given one more second for anything late. Every script response and every inline
// <script> in an HTML page is saved in <out-dir>/<app>/ and taken with gzip -9; the servers' own compression isn't
// used. Prints a line per app, smallest first. Each server is started here, and only these are stopped.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const shorts = path.resolve(here, '..', '..');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const quillo = path.join(appDir, '.quillo', 'bin', 'quillo');
if (!fs.existsSync(quillo)) execFileSync('sh', ['get-quillo.sh'], { cwd: appDir, stdio: 'inherit' });
const vite = (dir, port) => ({ dir, build: ['npm', ['run', 'build']], serve: ['npx', ['vite', 'preview', '--port', String(port), '--strictPort']], url: `http://localhost:${port}/` });
const APPS = {
  react: vite(path.join(here, 'react'), 4181),
  vue: vite(path.join(here, 'vue'), 4182),
  svelte: vite(path.join(shorts, '64-vs-svelte-counter/compare/svelte'), 4183),
  angular: { dir: path.join(shorts, '74-vs-angular-counter/compare/counter'), build: ['npx', ['ng', 'build']],
    serve: ['node', [path.join(here, 'serve-dist.mjs'), 'dist/counter/browser', '4184']], url: 'http://localhost:4184/' },
  solid: vite(path.join(shorts, '76-vs-solid-counter/compare/solid'), 4185),
  quillo: { dir: appDir, serve: [quillo, ['run', 'main.qwe', '--port', '8120']], url: 'http://127.0.0.1:8120/' },
};
const outRoot = process.argv[2];
if (!outRoot) { console.error('usage: node downloads.mjs <out-dir>'); process.exit(2); }
const env = { ...process.env, NG_CLI_ANALYTICS: 'false', NEXT_TELEMETRY_DISABLED: '1' };
const gz = (file) => Number(execFileSync('sh', ['-c', 'gzip -9 -c "$1" | wc -c', 'sh', file]).toString().trim());
let server = null;
const stop = () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGTERM'); } catch {} } };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const browser = await chromium.launch();
const results = [];
for (const [name, A] of Object.entries(APPS)) {
  if (A.build) execFileSync(A.build[0], A.build[1], { cwd: A.dir, env, stdio: 'ignore' });
  let log = '';
  server = spawn(A.serve[0], A.serve[1], { cwd: A.dir, env, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  server.stdout.on('data', (d) => { log += d; }); server.stderr.on('data', (d) => { log += d; });
  for (let i = 0; ; i++) {
    if (server.exitCode != null) throw new Error(`${name}: the server stopped:\n${log}`);
    try { if ((await fetch(A.url)).ok) break; } catch {}
    if (i > 300) throw new Error(`${name}: no answer at ${A.url}:\n${log}`);
    await new Promise((r) => setTimeout(r, 100));
  }
  const out = path.join(outRoot, name);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 320, height: 128 } });
  const page = await ctx.newPage();
  const responses = [];
  page.on('response', (r) => responses.push(r));
  await page.goto(A.url, { waitUntil: 'load' });
  await page.locator('button').waitFor(); await page.waitForTimeout(1000);
  await page.locator('button').click();
  await page.waitForFunction(() => document.querySelector('button')?.innerText.trim() === '2');
  await page.waitForTimeout(1000);
  const says = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  if (says !== '2 1 doubled is 2') throw new Error(`${name}: the page says "${says}"`);
  let n = 0, raw = 0, zipped = 0, pieces = 0;
  for (const r of responses) {
    const type = r.request().resourceType(), ct = r.headers()['content-type'] || '';
    let body; try { body = await r.body(); } catch { body = Buffer.alloc(0); }
    const save = (buf, label) => { const f = path.join(out, `${String(++n).padStart(2, '0')}-${label}`); fs.writeFileSync(f, buf); return f; };
    if (type === 'script' || /javascript|ecmascript/.test(ct)) {
      const f = save(body, path.basename(new URL(r.url()).pathname) || 'script.js');
      raw += body.length; zipped += gz(f); pieces++;
    } else if (type === 'document' || /text\/html/.test(ct)) {
      for (const m of body.toString('utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        const attrs = m[1], code = m[2], t = (attrs.match(/type\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || '';
        if (/\bsrc\s*=/.test(attrs) || !code.trim() || !['', 'module', 'text/javascript'].includes(t.toLowerCase())) continue;
        const f = save(code, 'inline-script.js');
        raw += Buffer.byteLength(code); zipped += gz(f); pieces++;
      }
    }
  }
  await ctx.close();
  stop(); await new Promise((r) => (server.exitCode != null ? r() : server.on('exit', r)));
  results.push({ name, pieces, raw, zipped });
}
await browser.close();
results.sort((a, b) => a.zipped - b.zipped);
for (const r of results) console.log(`${r.name.padEnd(8)} ${(r.zipped / 1000).toFixed(1).padStart(5)} KB  (${r.pieces} ${r.pieces === 1 ? 'piece' : 'pieces'}, ${r.raw} B before gzip)`);
