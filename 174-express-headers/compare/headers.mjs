// Trail Club's home page on each side: its security headers, whether a page on another site can frame it, and
// whether its like button still works, in a real browser.
//   node headers.mjs express <out.json>      express/app.js (Express as it comes), port 3000
//   node headers.mjs helmet <out.json>       express/variants/helmet.js (app.use(helmet()), its defaults)
//   node headers.mjs helmet-file <out.json>  express/variants/helmet-file.js (helmet, the script in public/like.js)
//   node headers.mjs quillo-v1 <out.json>    ../steps/v1 (Quillo's own headers), port 8170
//   node headers.mjs quillo <out.json>       ../app (with the guide's site_headers line), port 8170
// The other site is 127.0.0.1:9000 (the club is at localhost, another site to a browser): a page with the club's
// page in an iframe. The button is clicked twice, and the console's Content Security Policy messages kept. Each
// server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const express = path.join(here, 'express');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');
const v1 = path.join(here, '..', 'steps', 'v1');
const node = (file) => ({ cwd: express, cmd: 'node', args: [file], url: 'http://localhost:3000' });
const quillo = (dir) => ({ cwd: dir, cmd: path.join(dir, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', '8170'], url: 'http://localhost:8170' });
const SIDES = { express: node('app.js'), helmet: node('variants/helmet.js'), 'helmet-file': node('variants/helmet-file.js'), 'quillo-v1': quillo(v1), quillo: quillo(appDir) };
const SECURITY = ['content-security-policy', 'strict-transport-security', 'x-frame-options', 'x-content-type-options',
  'referrer-policy', 'cross-origin-opener-policy', 'cross-origin-resource-policy', 'origin-agent-cluster',
  'x-dns-prefetch-control', 'x-download-options', 'x-permitted-cross-domain-policies', 'x-xss-protection', 'permissions-policy'];
const REVEAL = ['x-powered-by', 'server'];

const [side, outFile] = process.argv.slice(2);
const S = SIDES[side];
if (!S || !outFile) { console.error('usage: node headers.mjs express|helmet|helmet-file|quillo-v1|quillo <out.json>'); process.exit(2); }
const server = spawn(S.cmd, S.args, { cwd: S.cwd, stdio: 'ignore', detached: true });
const other = http.createServer((req, res) => { res.setHeader('content-type', 'text/html'); res.end(`<!doctype html><title>Free trail maps</title><h1>Free trail maps</h1><iframe src="${S.url}/" width="600" height="300"></iframe>`); }).listen(9000, '127.0.0.1');
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(S.url + '/')).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }

const res = await fetch(S.url + '/');
const headers = Object.fromEntries([...res.headers].filter(([k]) => SECURITY.includes(k) || REVEAL.includes(k)));
const browser = await chromium.launch();
// Framed by another site: is the club's page in the frame?
const fp = await browser.newPage();
await fp.goto('http://127.0.0.1:9000/'); await fp.waitForTimeout(1500);
const frame = fp.frames().find((f) => f !== fp.mainFrame());
let framed = false;
try { framed = (await frame.locator('h1').count()) > 0 && (await frame.locator('h1').innerText()) === 'Trail Club'; } catch {}
const frameUrl = frame?.url() ?? null;
await fp.close();
// The like button, twice.
const page = await browser.newPage();
const csp = [];
page.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) csp.push(m.text()); });
await page.goto(S.url + '/'); await page.waitForTimeout(800);
const before = (await page.locator('button').innerText()).trim();
for (let i = 0; i < 2; i++) { await page.locator('button').click(); await page.waitForTimeout(600); }
const after = (await page.locator('button').innerText()).trim();
await browser.close(); stop(); other.close();

const result = { side, headers, framed, frameUrl, button: { before, after, works: before !== after }, csp };
fs.writeFileSync(outFile, JSON.stringify(result, null, 1) + '\n');
const has = SECURITY.filter((h) => headers[h]);
console.log(side);
console.log(`  security headers  ${has.length}: ${has.join(', ') || 'none'}`);
console.log(`  says who it is    ${REVEAL.filter((h) => headers[h]).map((h) => `${h}: ${headers[h]}`).join(', ') || 'nothing'}`);
console.log(`  framed by another site  ${framed ? 'yes, the page shows in the frame' : 'refused'}`);
console.log(`  the like button   ${before} -> ${after}${result.button.works ? '' : ' (nothing happened)'}${csp.length ? `; the console: "${csp[0].slice(0, 90)}..."` : ''}`);
