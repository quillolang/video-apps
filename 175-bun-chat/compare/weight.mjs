// What a browser downloads to show each side's chat page, until it can chat: every response for the page (the
// socket itself left out), as sent (with whatever compression the server chose) and as unpacked, after 3 s.
//   node weight.mjs bun <out.json>     chat/ (index.ts), NODE_ENV=production, port 3000
//   node weight.mjs quillo <out.json>  ../steps/v1 (main.qwe), port 8175
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const chat = path.join(here, 'chat'), v1 = path.join(here, '..', 'steps', 'v1');
const SIDES = {
  bun: { cwd: chat, cmd: 'bun', args: ['index.ts'], env: { NODE_ENV: 'production' }, url: 'http://localhost:3000' },
  quillo: { cwd: v1, cmd: path.join(v1, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8175'], env: {}, url: 'http://localhost:8175' },
};
const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node weight.mjs bun|quillo <out.json>'); process.exit(2); }
let server = null;
const stop = () => new Promise((r) => { if (!server || server.exitCode != null) return r(); server.on('exit', r); try { process.kill(-server.pid, 'SIGTERM'); } catch { r(); } });
process.on('exit', () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGKILL'); } catch {} } });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

server = spawn(S.cmd, S.args, { cwd: S.cwd, env: { ...process.env, ...S.env }, stdio: 'ignore', detached: true });
for (let i = 0; ; i++) { try { if ((await fetch(S.url + '/')).ok) break; } catch {} if (i > 300) throw new Error(`nothing at ${S.url}`); await wait(50); }
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
const seen = [];
page.on('requestfinished', (req) => seen.push(req));
await page.goto(S.url + '/'); await wait(3000);
const files = [];
for (const req of seen) {
  const res = await req.response(); if (!res) continue;
  const sizes = await req.sizes();
  let unpacked = null; try { unpacked = (await res.body()).length; } catch {}
  files.push({ path: req.url().replace(/^https?:\/\/[^/]+/, '').replace(/\?.*/, '?…'), status: res.status(),
    type: (res.headers()['content-type'] || '').split(';')[0], encoding: res.headers()['content-encoding'] || null,
    sent: sizes.responseBodySize, unpacked });
}
await browser.close(); await stop();
const total = (k) => files.reduce((n, f) => n + (f[k] || 0), 0);
for (const f of files) console.log(`${f.status} ${f.path}  ${f.type}${f.encoding ? ' (' + f.encoding + ')' : ''}: ${f.sent} bytes sent, ${f.unpacked} unpacked`);
console.log(`${files.length} files: ${total('sent')} bytes sent, ${total('unpacked')} unpacked`);
fs.writeFileSync(outFile, JSON.stringify({ side, when: new Date().toString(), files, sent: total('sent'), unpacked: total('unpacked') }, null, 1) + '\n');
