// The to-do list's screenshots and download, from a built site served as it is:
//   node compare/shots-todo.mjs <site-dir> <name> <port> <third item> [<out-dir>]
// The list as it starts (<name>0), with "Make a Short" typed (<name>1), added (<name>2), and "Learn HTML" taken off
// (<name>3), into ../assets, with titles.json and urls.json as shots() writes them for Quillo, 320x200 at 3x; each step
// checks the list. With <out-dir>, a fresh browser then measures what it downloads until the fourth to-do is added:
// every script, inline <script> and WebAssembly module, gzip -9 (as 73's measure.mjs does).
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'assets');
const [site, name, port, third, outDir] = process.argv.slice(2);
if (!site || !name || !port || !third) { console.error('usage: node shots-todo.mjs <site-dir> <name> <port> <third item> [<out-dir>]'); process.exit(2); }
const NEW = 'Make a Short';
const server = spawn('node', [path.join(here, 'serve-dist.mjs'), site, port], { stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};
const url = `http://localhost:${port}/`;
for (let i = 0; ; i++) { try { await fetch(url); break; } catch { if (i > 100) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); } }
const items = (page) => page.locator('li').evaluateAll((lis) => lis.map((li) => li.firstChild.textContent.trim()));
const wait = async (page, want) => {
  await page.waitForFunction((n) => document.querySelectorAll('li').length === n, want.length);
  const got = await items(page);
  if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`the list is ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
};
const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport: { width: 320, height: 200 }, deviceScaleFactor: 3 })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url); await page.locator('li').first().waitFor(); await page.waitForTimeout(500);
  const snap = async (n) => {
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(assets, `${name}${n}.png`) });
    json('titles.json', `${name}${n}`, (await page.title()) || `localhost:${port}`);
    json('urls.json', `${name}${n}`, `//localhost:${port}/`);
    console.log(`  assets/${name}${n}.png: ${(await items(page)).join(', ')}`);
  };
  const start = ['Learn HTML', 'Learn JavaScript', third];
  await wait(page, start); await snap(0);
  await page.locator('input').pressSequentially(NEW, { delay: 20 }); await snap(1);
  await page.locator('form button').click();
  await wait(page, [...start, NEW]);
  if (await page.locator('input').inputValue() !== '') throw new Error('the box was not emptied');
  await snap(2);
  await page.locator('li').first().locator('button').click();
  await wait(page, [...start.slice(1), NEW]); await snap(3);
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
  if (outDir) {
    const gz = (file) => Number(execFileSync('sh', ['-c', 'gzip -9 -c "$1" | wc -c', 'sh', file]).toString().trim());
    fs.rmSync(outDir, { recursive: true, force: true }); fs.mkdirSync(outDir, { recursive: true });
    const p2 = await (await browser.newContext()).newPage();
    const responses = []; p2.on('response', (r) => responses.push(r));
    await p2.goto(url, { waitUntil: 'load' }); await p2.locator('li').first().waitFor(); await p2.waitForTimeout(1000);
    await p2.locator('input').fill(NEW); await p2.locator('form button').click();
    await wait(p2, [...start, NEW]); await p2.waitForTimeout(1000);
    const sum = { js: [0, 0], wasm: [0, 0] }; let n = 0;
    for (const r of responses) {
      const type = r.request().resourceType(), ct = r.headers()['content-type'] || '', u = new URL(r.url());
      let body; try { body = await r.body(); } catch { body = Buffer.alloc(0); }
      const take = (kind, buf, label) => { const f = path.join(outDir, `${String(++n).padStart(2, '0')}-${label}`); fs.writeFileSync(f, buf); sum[kind][0] += buf.length; sum[kind][1] += gz(f); };
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
    console.log(`  JavaScript: ${sum.js[0]} B raw, ${sum.js[1]} B gzip -9`);
    console.log(`  WebAssembly: ${sum.wasm[0]} B raw, ${sum.wasm[1]} B gzip -9`);
    console.log(`  both: ${((sum.js[1] + sum.wasm[1]) / 1000).toFixed(1)} KB gzip -9`);
  }
} finally {
  await browser.close();
  stop();
}
