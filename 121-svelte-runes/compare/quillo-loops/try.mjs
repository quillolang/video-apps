// Clicks A once, B five times, then C once, and prints what each shows and the console's messages.
//   quillo run main.qwe --port 8146 & node try.mjs http://127.0.0.1:8146/
import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage(); const log = [];
p.on('console', (m) => log.push(`${m.type()}: ${m.text()}`)); p.on('pageerror', (e) => log.push(`pageerror: ${e.message}`));
await p.goto(process.argv[2]); await p.waitForTimeout(800);
await p.click('#a'); await p.waitForTimeout(500);
for (let i = 0; i < 5; i++) { await p.click('#b'); await p.waitForTimeout(100); }
await p.waitForTimeout(500);
console.log('A, after one click:', await p.locator('#an').innerText());
console.log('B, after five ticks:', await p.locator('#bn').innerText());
await p.click('#c'); await p.waitForTimeout(1500);
console.log('C, after one click:', await p.locator('#cn').innerText());
for (const l of log) console.log('console', l);
await b.close();
