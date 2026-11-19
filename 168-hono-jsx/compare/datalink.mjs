// Quillo lets a data: link through (escaped). Does a browser open it when the link is clicked?
//   node datalink.mjs      Quillo: ../app (quillo run main.qwe), port 8132, from a fresh club.db
// Posts one note whose link is data:text/html,<script>alert(1)</script>, clicks it in Chromium, and prints any alert
// and where the page is afterwards. The server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'app');
const url = 'http://127.0.0.1:8132/';
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(app, f), { force: true });
const server = spawn(path.join(app, '.quillo/bin/quillo'), ['run', 'main.qwe', '--port', '8132'], { cwd: app, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
for (let i = 0; ; i++) { try { if ((await fetch(url)).ok) break; } catch {} if (i > 300) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); }
await fetch(url + 'notes', { method: 'POST', body: new URLSearchParams({ name: 'Data', text: 't', link: 'data:text/html,<script>alert(1)</script>' }), redirect: 'manual' });
const browser = await chromium.launch();
const page = await browser.newPage();
const alerts = [], logs = [];
page.on('dialog', async (d) => { alerts.push(d.message()); await d.dismiss(); });
page.on('console', (m) => logs.push(m.text()));
await page.goto(url);
const href = await page.locator('li a').getAttribute('href');
await page.locator('li a').click(); await page.waitForTimeout(1500);
console.log(`href:    ${href}`);
console.log(`alerts:  ${alerts.length ? alerts.join(', ') : 'none'}`);
console.log(`page:    ${page.url()}`);
for (const l of logs) console.log(`console: ${l}`);
await browser.close();
stop();
for (const f of ['club.db', 'club.db-wal', 'club.db-shm']) fs.rmSync(path.join(app, f), { force: true });
