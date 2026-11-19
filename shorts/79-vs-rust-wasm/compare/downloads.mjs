// What the same counter downloads, built with four Rust front ends and in Quillo: the JavaScript and the WebAssembly
// a fresh browser gets until the button has been clicked once, each gzipped with gzip -9:
//   node shorts/79-vs-rust-wasm/compare/downloads.mjs <out-dir>
// Each Rust counter is the one its own Short measured, built here, release, tuned for size as its framework's docs
// say (each project's Cargo.toml or .cargo/config.toml holds the settings; see that Short's MEASURE.md):
//   leptos    ../73-vs-leptos-counter/compare/counter      trunk build --release (wasm-opt z in its index.html)
//   yew       ../75-vs-yew-counter/compare/counter         trunk build --release (wasm-opt z in its index.html)
//   sycamore  ../77-vs-sycamore-counter/compare/counter    trunk build --release (wasm-opt z in its index.html)
//   dioxus    ../67-vs-dioxus-counter/compare/counter      dx build --release --platform web, then wasm-opt -Oz
//   quillo    ../app (this Short's main.qwe), quillo run
// Needs trunk, dx and wasm-opt on PATH (or WASM_OPT), and the wasm32-unknown-unknown target; CARGO_TARGET_BASE, below.
// Each build's files are copied to <out-dir>/<app>/site and served as they are; the page is opened, clicked once, checked for
// "2 1 doubled is 2", and given one more second. Prints a line per app, smallest first.
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
const outRoot = process.argv[2];
if (!outRoot) { console.error('usage: node downloads.mjs <out-dir>'); process.exit(2); }
// CARGO_TARGET_BASE=<dir> builds each app in <dir>/target<NN> (NN its Short's number), where its own Short built it.
const envFor = (cwd) => {
  const nn = /shorts\/(\d+)-/.exec(cwd)?.[1];
  return process.env.CARGO_TARGET_BASE && nn ? { ...process.env, CARGO_TARGET_DIR: path.join(process.env.CARGO_TARGET_BASE, `target${nn}`) } : process.env;
};
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'ignore', env: envFor(cwd) });
const trunk = (name) => {
  const dir = path.join(shorts, name, 'compare/counter');
  fs.rmSync(path.join(dir, 'dist'), { recursive: true, force: true });
  run('trunk', ['build', '--release'], dir);
  return path.join(dir, 'dist');
};
const APPS = {
  leptos: () => trunk('73-vs-leptos-counter'),
  yew: () => trunk('75-vs-yew-counter'),
  sycamore: () => trunk('77-vs-sycamore-counter'),
  dioxus: () => {
    const dir = path.join(shorts, '67-vs-dioxus-counter/compare/counter');
    run('dx', ['build', '--release', '--platform', 'web'], dir);
    const meta = JSON.parse(execFileSync('cargo', ['metadata', '--format-version', '1', '--no-deps'], { cwd: dir, env: envFor(dir) }).toString());
    const pub = path.join(meta.target_directory, 'dx/counter/release/web/public');
    const html = fs.readFileSync(path.join(pub, 'index.html'), 'utf8');
    const wasm = /assets\/(counter_bg-[\w-]+\.wasm)/.exec(fs.readFileSync(path.join(pub, 'assets', fs.readdirSync(path.join(pub, 'assets')).find((f) => f.endsWith('.js') && html.includes(f))), 'utf8'))?.[1];
    if (!wasm) throw new Error('dioxus: no wasm named in its script');
    const f = path.join(pub, 'assets', wasm);
    run(process.env.WASM_OPT || 'wasm-opt', [f, '-o', f, '-Oz'], dir);
    return pub;
  },
};
const gz = (file) => Number(execFileSync('sh', ['-c', 'gzip -9 -c "$1" | wc -c', 'sh', file]).toString().trim());
let server = null;
const stop = () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGTERM'); } catch {} } };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const browser = await chromium.launch();
const results = [];
let port = 4195;
for (const name of ['leptos', 'yew', 'sycamore', 'dioxus', 'quillo']) {
  const out = path.join(outRoot, name);
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  let url;
  if (name === 'quillo') {
    url = 'http://127.0.0.1:8126/';
    server = spawn(quillo, ['run', 'main.qwe', '--port', '8126'], { cwd: appDir, stdio: 'ignore', detached: true });
  } else {
    const site = path.join(out, 'site');
    fs.cpSync(APPS[name](), site, { recursive: true });
    url = `http://localhost:${++port}/`;
    server = spawn('node', [path.join(here, 'serve-dist.mjs'), site, String(port)], { stdio: 'ignore', detached: true });
  }
  for (let i = 0; ; i++) { try { if ((await fetch(url)).ok) break; } catch {} if (i > 300) throw new Error(`${name}: no answer`); await new Promise((r) => setTimeout(r, 100)); }
  const ctx = await browser.newContext({ viewport: { width: 320, height: 128 } });
  const page = await ctx.newPage();
  const responses = [];
  page.on('response', (r) => responses.push(r));
  await page.goto(url, { waitUntil: 'load' });
  await page.locator('button').waitFor(); await page.waitForTimeout(1000);
  await page.locator('button').click();
  await page.waitForFunction(() => document.querySelector('button')?.innerText.trim() === '2');
  await page.waitForTimeout(1000);
  const says = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  if (says !== '2 1 doubled is 2') throw new Error(`${name}: the page says "${says}"`);
  let n = 0; const sum = { js: 0, wasm: 0 };
  const take = (kind, buf, label) => { const f = path.join(out, `${String(++n).padStart(2, '0')}-${label}`); fs.writeFileSync(f, buf); sum[kind] += gz(f); };
  for (const r of responses) {
    const type = r.request().resourceType(), ct = r.headers()['content-type'] || '', u = new URL(r.url());
    let body; try { body = await r.body(); } catch { body = Buffer.alloc(0); }
    if (/application\/wasm/.test(ct) || u.pathname.endsWith('.wasm')) take('wasm', body, path.basename(u.pathname));
    else if (type === 'script' || /javascript|ecmascript/.test(ct)) take('js', body, path.basename(u.pathname) || 'script.js');
    else if (type === 'document' || /text\/html/.test(ct)) {
      for (const m of body.toString('utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        const attrs = m[1], code = m[2], t = (attrs.match(/type\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || '';
        if (/\bsrc\s*=/.test(attrs) || !code.trim() || !['', 'module', 'text/javascript'].includes(t.toLowerCase())) continue;
        take('js', Buffer.from(code), 'inline-script.js');
      }
    }
  }
  await ctx.close();
  stop(); await new Promise((r) => (server.exitCode != null ? r() : server.on('exit', r)));
  results.push({ name, ...sum });
}
await browser.close();
results.sort((a, b) => (a.js + a.wasm) - (b.js + b.wasm));
const kb = (b) => (b / 1000).toFixed(1).padStart(5);
for (const r of results) console.log(`${r.name.padEnd(9)} ${kb(r.js + r.wasm)} KB  (JS ${kb(r.js).trim()} + wasm ${kb(r.wasm).trim()})`);
