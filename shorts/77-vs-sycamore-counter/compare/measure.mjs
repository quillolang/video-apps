// What the browser downloads to run each counter, measured the same way for both apps:
//   node compare/measure.mjs sycamore <out-dir>   Sycamore: trunk build --release (first), dist/ served as it is by serve-dist.mjs (4193)
//   node compare/measure.mjs quillo <out-dir>   Quillo: quillo run main.qwe (8124)
// A fresh browser (no cache) opens the page, waits a second, clicks the button once, waits for the page to say
// "2 1 doubled is 2", and one more second for anything late. Every script response, every inline <script> in an
// HTML page, and every WebAssembly module (application/wasm, or a .wasm address) is saved in <out-dir>/<side>/ and
// taken with gzip -9; the servers' own compression isn't used. Prints the JavaScript, the WebAssembly, and both.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const quillo = path.join(appDir, '.quillo', 'bin', 'quillo');
const SIDES = {
  sycamore: { cwd: here, cmd: 'node', args: ['serve-dist.mjs', 'counter/dist', '4193'], url: 'http://localhost:4193/' },
  quillo: { cwd: appDir, cmd: quillo, args: ['run', 'main.qwe', '--port', '8124'], url: 'http://127.0.0.1:8124/' },
};
const [side, outRoot] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outRoot) { console.error(`usage: node measure.mjs ${Object.keys(SIDES).join('|')} <out-dir>`); process.exit(2); }
if (side === 'quillo' && !fs.existsSync(quillo)) execFileSync('sh', ['get-quillo.sh'], { cwd: appDir, stdio: 'inherit' });
const out = path.join(outRoot, side);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const gz = (file) => Number(execFileSync('sh', ['-c', 'gzip -9 -c "$1" | wc -c', 'sh', file]).toString().trim());
const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
let log = '';
server.stdout.on('data', (d) => { log += d; }); server.stderr.on('data', (d) => { log += d; });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

let browser;
try {
  for (let i = 0; ; i++) {
    if (server.exitCode != null) throw new Error(`the server stopped:\n${log}`);
    try { if ((await fetch(S.url)).ok) break; } catch {}
    if (i > 300) throw new Error(`no answer at ${S.url}:\n${log}`);
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: 320, height: 128 } })).newPage();
  const responses = [];
  page.on('response', (r) => responses.push(r));
  await page.goto(S.url, { waitUntil: 'load' });
  await page.locator('button').waitFor(); await page.waitForTimeout(1000);
  await page.locator('button').click();
  await page.waitForFunction(() => document.querySelector('button')?.innerText.trim() === '2');
  await page.waitForTimeout(1000);
  const says = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  if (says !== '2 1 doubled is 2') throw new Error(`the page says "${says}"`);
  console.log(`  the page says: ${says}`);
  const sum = { js: [0, 0, 0], wasm: [0, 0, 0] };   // pieces, raw bytes, gzip -9 bytes
  let n = 0;
  const save = (buf, label) => { const f = path.join(out, `${String(++n).padStart(2, '0')}-${label}`); fs.writeFileSync(f, buf); return f; };
  const add = (kind, buf, label) => { const f = save(buf, label); const g = gz(f); sum[kind][0]++; sum[kind][1] += buf.length; sum[kind][2] += g; console.log(`  ${kind.padEnd(5)}${label.padEnd(44)}${String(buf.length).padStart(9)} B  ${String(g).padStart(8)} B gzip -9`); };
  for (const r of responses) {
    const type = r.request().resourceType(), ct = r.headers()['content-type'] || '', u = new URL(r.url());
    let body; try { body = await r.body(); } catch { body = Buffer.alloc(0); }
    const name = path.basename(u.pathname) || 'index.html';
    if (/application\/wasm/.test(ct) || u.pathname.endsWith('.wasm')) add('wasm', body, name);
    else if (type === 'script' || /javascript|ecmascript/.test(ct)) add('js', body, name);
    else if (type === 'document' || /text\/html/.test(ct)) {
      for (const m of body.toString('utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
        const attrs = m[1], code = m[2], t = (attrs.match(/type\s*=\s*["']?([^"'\s>]+)/i) || [])[1] || '';
        if (/\bsrc\s*=/.test(attrs) || !code.trim() || !['', 'module', 'text/javascript'].includes(t.toLowerCase())) continue;
        add('js', Buffer.from(code), `${name} (inline <script>)`);
      }
    }
  }
  const kb = (b) => (b / 1000).toFixed(1);
  console.log(`  JavaScript: ${sum.js[0]} pieces, ${sum.js[1]} B raw, ${sum.js[2]} B gzip -9`);
  console.log(`  WebAssembly: ${sum.wasm[0]} pieces, ${sum.wasm[1]} B raw, ${sum.wasm[2]} B gzip -9`);
  console.log(`  both: ${kb(sum.js[2] + sum.wasm[2])} KB gzip -9`);
} finally {
  await browser?.close();
  stop();
}
