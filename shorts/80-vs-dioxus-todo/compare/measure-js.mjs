// The JavaScript a browser downloads until the counter has been clicked once, measured the same way
// for both apps:
//   node compare/measure-js.mjs vue    <out-dir>   Vue: Vite's production build (`npm run build`, first), served by `vite preview` (4173)
//   node compare/measure-js.mjs quillo <out-dir>   Quillo: `quillo run main.qwe` (8129), no --watch
// A fresh browser (no cache) opens the page, types a to-do, clicks Add Todo, and waits for the fourth item, then
// one more second for anything late. Every response is kept; the JavaScript is each script response
// (resourceType "script", or a JavaScript content-type) and each inline <script> in an HTML page.
// Each body is saved in <out-dir>/<side>/ and its size taken with `gzip -9 -c FILE | wc -c`, then summed:
// the servers' own compression is not used.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [side, outRoot] = process.argv.slice(2);
// The Quillo app: ../app here, or the folder above in the published copy (github.com/quillolang/video-apps).
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const quillo = path.join(appDir, '.quillo', 'bin', 'quillo');
if (!fs.existsSync(quillo)) execFileSync('sh', ['get-quillo.sh'], { cwd: appDir, stdio: 'inherit' });
const SIDES = {
  vue: { cwd: path.join(here, 'vue'), cmd: 'npx', args: ['vite', 'preview', '--port', '4173', '--strictPort'], url: 'http://localhost:4173/' },
  quillo: { cwd: appDir, cmd: quillo, args: ['run', 'main.qwe', '--port', '8129'], url: 'http://127.0.0.1:8129/' },
};
const S = SIDES[side];
if (!S || !outRoot) { console.error('usage: node measure-js.mjs vue|quillo <out-dir>'); process.exit(2); }
const out = path.join(outRoot, side);
fs.mkdirSync(out, { recursive: true });

const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
let log = '';
server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
const gz = (file) => execFileSync('sh', ['-c', 'gzip -9 -c "$1" | wc -c', 'sh', file]).toString().trim() | 0;

let browser;
try {
  for (let i = 0; ; i++) {
    if (server.exitCode != null) throw new Error(`the server stopped:\n${log}`);
    try { if ((await fetch(S.url)).ok) break; } catch {}
    if (i > 100) throw new Error(`no answer at ${S.url}:\n${log}`);
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 320, height: 128 } });
  const page = await ctx.newPage();
  const responses = [];
  page.on('response', r => responses.push(r));
  page.on('websocket', ws => console.log(`  websocket: ${ws.url()}`));
  await page.goto(S.url, { waitUntil: 'load' });
  await page.waitForTimeout(1000);                       // what the page loads by itself
  const before = responses.length;
  await page.locator('input').fill('Make a Short');
  await page.locator('form button').click();
  await page.waitForFunction(() => document.querySelectorAll('li').length === 4);
  await page.waitForTimeout(1000);                       // anything late
  console.log(`  the list: ${(await page.locator('li').allInnerTexts()).map((t) => t.replace(/\s*X$/, '')).join(', ')}`);

  const rows = [];
  let n = 0;
  for (const [i, r] of responses.entries()) {
    const type = r.request().resourceType(), ct = r.headers()['content-type'] || '', u = new URL(r.url());
    let body; try { body = await r.body(); } catch { body = Buffer.alloc(0); }
    const when = i < before ? 'load' : 'click';
    const isJs = type === 'script' || /javascript|ecmascript/.test(ct);
    const name = `${String(++n).padStart(2, '0')}-${(u.pathname.split('/').pop() || 'index.html')}`;
    fs.writeFileSync(path.join(out, name), body);
    rows.push({ when, url: u.pathname, type, ct: ct.split(';')[0], raw: body.length, gzip: gz(path.join(out, name)), js: isJs });
    // Inline scripts in an HTML page are JavaScript downloaded too (not JSON data, not speculation rules).
    if (type === 'document' || /text\/html/.test(ct)) {
      const html = body.toString('utf8');
      for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        const attrs = m[1], code = m[2], t = (attrs.match(/type\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || '';
        if (/\bsrc\s*=/.test(attrs) || !code.trim() || !['', 'module', 'text/javascript'].includes(t.toLowerCase())) continue;
        const f = path.join(out, `${String(++n).padStart(2, '0')}-inline-script.js`);
        fs.writeFileSync(f, code);
        rows.push({ when, url: `${u.pathname} (inline <script>)`, type: 'inline', ct: 'text/javascript', raw: Buffer.byteLength(code), gzip: gz(f), js: true });
      }
    }
  }
  const w = (s, n) => String(s).padEnd(n);
  console.log(`  ${w('when', 6)}${w('what', 40)}${w('type', 11)}${w('raw B', 9)}gzip -9 B   JS?`);
  for (const r of rows) console.log(`  ${w(r.when, 6)}${w(r.url, 40)}${w(r.type, 11)}${w(r.raw, 9)}${w(r.gzip, 12)}${r.js ? 'JS' : ''}`);
  const js = rows.filter(r => r.js), all = rows.filter(r => r.type !== 'inline');
  const sum = (xs, k) => xs.reduce((a, r) => a + r[k], 0);
  console.log(`  JavaScript: ${js.length} pieces, ${sum(js, 'raw')} B raw, ${sum(js, 'gzip')} B gzip -9 (${(sum(js, 'gzip') / 1024).toFixed(1)} KiB)`);
  console.log(`  everything (each response once): ${all.length} responses, ${sum(all, 'raw')} B raw, ${sum(all, 'gzip')} B gzip -9`);
} finally {
  await browser?.close();
  try { process.kill(-server.pid, 'SIGTERM'); } catch { server.kill(); }
}
