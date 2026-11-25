// Plays the four boxes of one app (Quillo's or React's) in Chromium, records what each shows, and with --shots takes
// 10:7 crops of each box at 3x into that folder as <name>-<moment>.png.
//   node play.mjs <name> <url> [--shots dir]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const [name, url, ...rest] = process.argv.slice(2);
const shots = rest.includes('--shots') ? rest[rest.indexOf('--shots') + 1] : null;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 3 });
const log = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) log.push(m.text()); });
page.on('pageerror', (e) => log.push(e.message));
const box = (k) => page.locator(`.box-${k}`);
const text = async (k) => (await box(k).innerText()).replace(/\s+/g, ' ').trim();
const snap = async (file, k) => { if (!shots) return; fs.mkdirSync(shots, { recursive: true });
  const b = await box(k).boundingBox(); let w = b.width + 40, h = b.height + 40;
  if (w / h > 10 / 7) h = w * 7 / 10; else w = h * 10 / 7;
  const x = Math.max(0, Math.min(800 - w, b.x + b.width / 2 - w / 2)), y = Math.max(0, b.y + b.height / 2 - h / 2);
  await page.screenshot({ path: path.join(shots, `${name}-${file}.png`), clip: { x, y, width: w, height: h }, fullPage: true }); };
const click = async (k, n) => { await box(k).getByRole('button', { name: n, exact: true }).click(); await page.waitForTimeout(300); };
const ticks = async () => Number((await text('timer')).match(/(\d+) ticks/)[1]);
const r = { name, url, when: new Date().toISOString() };
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
if (shots) await page.screenshot({ path: path.join(shots, `${name}-page.png`) });
// 1. if / else if / else
r.if0 = await text('if'); await snap('if-0', 'if');
await click('if', '+1 unread'); r.if1 = await text('if'); await snap('if-1', 'if');
await click('if', '+1 unread'); await click('if', '+1 unread'); r.if3 = await text('if'); await snap('if-3', 'if');
await click('if', 'Read all'); r.ifRead = await text('if');
// 2. if as a statement: a ticker that runs while running is true, at speed
r.t0 = await ticks(); await snap('timer-0', 'timer');
await click('timer', 'Start'); let a = await ticks(); await page.waitForTimeout(1000); r.perSecond = (await ticks()) - a;
await click('timer', 'Faster'); a = await ticks(); await page.waitForTimeout(1000); r.perSecondFaster = (await ticks()) - a;
// 3. a field in the branch, typed while it ticks
const note = box('timer').getByRole('textbox', { name: 'Note' });
await note.click();
for (const ch of 'buy milk') { await page.keyboard.type(ch); await page.waitForTimeout(150); }
r.noteValue = await note.inputValue(); r.noteFocused = await note.evaluate((e) => e === document.activeElement);
await snap('timer-typing', 'timer');
await click('timer', 'Stop'); a = await ticks(); await page.waitForTimeout(1000); r.afterStop = (await ticks()) - a;
r.noteGone = (await box('timer').getByRole('textbox').count()) === 0; await snap('timer-stopped', 'timer');
// 4. if inside for
r.list = await text('list'); await snap('list-0', 'list');
await box('list').getByRole('checkbox').click(); await page.waitForTimeout(300); r.listAll = await text('list'); await snap('list-all', 'list');
// 5. one field, its placeholder switched
const email = box('one').getByRole('textbox', { name: 'Email' });
await email.click(); await page.keyboard.type('ana@mail.com'); await snap('one-typed', 'one');
await click('one', "I'm new here"); r.oneValue = await email.inputValue(); r.onePlaceholder = await email.getAttribute('placeholder'); await snap('one-switched', 'one');
r.console = log;
await browser.close();
fs.mkdirSync('runs', { recursive: true });
fs.writeFileSync(`runs/${name}.json`, JSON.stringify(r, null, 1) + '\n');
console.log(JSON.stringify(r));
