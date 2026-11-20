// Quillo's chat (../steps/v1) opened at 127.0.0.1, where the page takes WebTransport (at localhost it takes the
// WebSocket: Chrome dials [::1] for QUIC, where Quillo doesn't listen; FEEDBACK80, Q-1266). Ana and Ben in tabs of
// their own; Ana says "hello"; the server stops (SIGTERM) and starts again; then Ben says "ping N" every 2 s. When
// does Ana first hear Ben, and which of Ben's pings reached his own tab? Into <out.json>.
//   node wt-restart.mjs <out.json>
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const v1 = path.join(here, '..', 'steps', 'v1'), quillo = path.join(v1, '.quillo/bin/quillo');
const [outFile] = process.argv.slice(2);
if (!outFile) { console.error('usage: node wt-restart.mjs <out.json>'); process.exit(2); }
let server = null;
const start = async () => { server = spawn(quillo, ['run', 'main.qwe', '--port', '8175'], { cwd: v1, stdio: 'ignore', detached: true });
  for (let i = 0; ; i++) { try { if ((await fetch('http://127.0.0.1:8175/')).ok) return; } catch {} if (i > 300) throw new Error('nothing on 8175'); await new Promise((r) => setTimeout(r, 50)); } };
const stop = () => new Promise((r) => { if (!server || server.exitCode != null) return r(); server.on('exit', r); try { process.kill(-server.pid, 'SIGTERM'); } catch { r(); } });
process.on('exit', () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGKILL'); } catch {} } });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await start();
const browser = await chromium.launch();
const tabs = {};
for (const who of ['Ana', 'Ben']) {
  const page = await (await browser.newContext()).newPage();
  const t = { page, websockets: 0 };
  page.on('websocket', () => { t.websockets++; });
  await page.goto('http://127.0.0.1:8175/'); await page.locator('input').first().fill(who);
  tabs[who] = t;
}
await wait(2000);
const say = async (who, text) => { await tabs[who].page.locator('input').nth(1).fill(text); await tabs[who].page.locator('button').click(); };
const lines = async (who) => (await tabs[who].page.locator('li').allInnerTexts()).map((s) => s.trim());
await say('Ana', 'hello'); await wait(1000);
const before = { Ana: await lines('Ana'), Ben: await lines('Ben') };
console.log(`before the restart: Ana's tab ${JSON.stringify(before.Ana)}, Ben's tab ${JSON.stringify(before.Ben)}`);
await stop(); await wait(1000); await start(); const t0 = Date.now();
let heard = null;
for (let n = 1; n <= 25 && !heard; n++) {
  await say('Ben', `ping ${n}`); await wait(2000);
  const fromBen = (await lines('Ana')).filter((l) => l.startsWith('Ben'));
  if (fromBen.length) heard = { first: fromBen[0], after: +((Date.now() - t0) / 1000).toFixed(1) };
}
const after = { Ana: await lines('Ana'), Ben: await lines('Ben') };
console.log(heard ? `Ana first heard "${heard.first}", ${heard.after} s after the restart` : 'Ana heard nothing from Ben in 50 s');
console.log(`Ben's tab: ${JSON.stringify(after.Ben)}`);
console.log(`WebSockets opened: Ana ${tabs.Ana.websockets}, Ben ${tabs.Ben.websockets} (WebTransport otherwise)`);
await browser.close(); await stop();
fs.writeFileSync(outFile, JSON.stringify({ when: new Date().toString(), before, heard, after, websockets: { Ana: tabs.Ana.websockets, Ben: tabs.Ben.websockets } }, null, 1) + '\n');
