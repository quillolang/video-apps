// Eight addresses on each Trail Guide: the status the server sends, and the heading the page shows in a real browser.
//   node routes.mjs dioxus <out.json>   Dioxus's web build (dist/, from dx build --release --platform web), served
//                                       with the fallback a client-side app needs: index.html for any path
//   node routes.mjs plain <out.json>    the same build on a plain static server (python3 -m http.server): / , a click
//                                       on Eagle Ridge, then a reload of that address
//   node routes.mjs quillo <out.json>   Quillo: ../app (quillo run main.qwe)
// Each server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(here, 'dist');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const PATHS = ['/trails/2', '/trails/02', '/trails/+2', '/trails/abc', '/trails/999', '/trails/0', '/trails/4294967296', '/nowhere'];
const [side, outFile] = process.argv.slice(2);
if (!['dioxus', 'plain', 'quillo'].includes(side) || !outFile) { console.error('usage: node routes.mjs dioxus|plain|quillo <out.json>'); process.exit(2); }

let server = null, child = null;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };
let url;
if (side === 'dioxus') {   // a file if there is one, else index.html: every path is a 200
  url = 'http://localhost:8150';
  server = http.createServer((req, res) => {
    const p = path.join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const file = fs.existsSync(p) && fs.statSync(p).isFile() ? p : path.join(dist, 'index.html');
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(8150);
} else if (side === 'plain') {
  url = 'http://localhost:8151';
  child = spawn('python3', ['-m', 'http.server', '8151', '--bind', '127.0.0.1', '-d', dist], { stdio: 'ignore', detached: true });
} else {
  url = 'http://localhost:8152';
  child = spawn(path.join(appDir, '.quillo/bin/quillo'), ['run', 'main.qwe', '--port', '8152'], { cwd: appDir, stdio: 'ignore', detached: true });
}
const stop = () => { if (child) { try { process.kill(-child.pid, 'SIGTERM'); } catch {} } if (server) server.close(); };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(url + '/')).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }

const browser = await chromium.launch();
const page = await browser.newPage();
const heading = async () => {   // the page's h1 once it's drawn (Dioxus draws it after its wasm loads)
  try { await page.waitForSelector('h1', { timeout: 8000 }); return (await page.locator('h1').first().innerText()).trim(); }
  catch { return (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim().slice(0, 50); }
};
const results = [];
if (side === 'plain') {
  let r = await page.goto(url + '/'); results.push({ step: 'open /', status: r.status(), shows: await heading(), at: new URL(page.url()).pathname });
  await page.getByText('Eagle Ridge').click(); await page.waitForURL('**/trails/2'); await page.waitForTimeout(500);
  results.push({ step: 'click Eagle Ridge', status: null, shows: await heading(), at: new URL(page.url()).pathname });
  r = await page.reload(); results.push({ step: 'reload', status: r.status(), shows: await heading(), at: new URL(page.url()).pathname });
} else {
  for (const p of PATHS) {
    const status = (await fetch(url + p, { redirect: 'manual' })).status;
    await page.goto(url + p);
    results.push({ path: p, status, shows: await heading() });
  }
}
await browser.close();
stop();
fs.writeFileSync(outFile, JSON.stringify({ side, results }, null, 1) + '\n');
console.log(side);
for (const r of results) console.log(`  ${(r.path ?? r.step).padEnd(20)} ${String(r.status ?? '').padEnd(4)} ${r.shows}${r.at ? `   (at ${r.at})` : ''}`);
