// Plays the same five-box page in one framework's app, in Chromium, and records what it shows at each step.
//   node run.mjs <name> <url> [--shots <dir>] [--out runs/<name>.json] [--wait ms]
// Every box is found by its class (box-details, box-status, ...; Streamlit's st-key-box-...), every control by its
// role and its visible name, so the same steps run in every app.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const [name, url, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(k); return i < 0 ? d : rest[i + 1]; };
const shots = opt('--shots', null), outFile = opt('--out', `runs/${name}.json`), wait = Number(opt('--wait', 350));
const only = opt('--only', 'details,status,zero,switch,keep').split(',');
const full = rest.includes('--full'), clip = rest.includes('--clip'), scale = Number(opt('--scale', 1));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 700 }, deviceScaleFactor: scale });
const consoleMsgs = [];
page.on('console', m => { if (['error', 'warning'].includes(m.type())) consoleMsgs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', e => consoleMsgs.push(`pageerror: ${e.message}`));
const res = { name, url, when: new Date().toISOString(), steps: {}, console: consoleMsgs };
const box = k => page.locator(`[class*="box-${k}"]`).first();
const text = async k => (await box(k).innerText()).replace(/\s+/g, ' ').trim();
const settle = () => page.waitForTimeout(wait);
const click = async (k, label) => { await box(k).getByRole('button', { name: label, exact: true }).first().click(); await settle(); };
const snap = async (file, k) => { if (!shots) return; fs.mkdirSync(shots, { recursive: true });
  if (k && clip && !(await box(k).count())) {   // the box is gone (a blank page): the whole page
    await page.screenshot({ path: path.join(shots, `${name}-${file}.png`) }); return;
  }
  if (k && clip) {   // the box in the middle of a 10:7 frame around it, so every window shows its box big
    const b = await box(k).boundingBox(), W = 1000, H = await page.evaluate(() => document.documentElement.scrollHeight);
    let w = b.width + 40, h = b.height + 40;
    if (w / h > 10 / 7) h = w * 7 / 10; else w = h * 10 / 7;
    const x = Math.max(0, Math.min(W - w, b.x + b.width / 2 - w / 2)), y = Math.max(0, Math.min(Math.max(H, 700) - h, b.y + b.height / 2 - h / 2));
    await page.screenshot({ path: path.join(shots, `${name}-${file}.png`), clip: { x, y, width: w, height: h }, fullPage: true });
    return;
  }
  await (k && !full ? box(k) : page).screenshot({ path: path.join(shots, `${name}-${file}.png`) }); };
const step = async (k, label, f) => { try { res.steps[`${k}:${label}`] = await f(); } catch (e) { res.steps[`${k}:${label}`] = { error: e.message.split('\n')[0] }; } };

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[class*="box-keep"]', { timeout: 60000 });
  await settle(); await settle();
  await snap('start');
  if (only.includes('details')) {
    await step('details', 'start', async () => { await snap('details-start', 'details'); return text('details'); });
    await step('details', 'shown', async () => { await click('details', 'Show details'); await snap('details-open', 'details'); return text('details'); });
    await step('details', 'hidden', async () => { await click('details', 'Hide details'); return text('details'); });
  }
  if (only.includes('status')) {
    await step('status', 'start', () => text('status'));
    for (const s of ['Error', 'Ready', 'Loading']) await step('status', s, async () => { await click('status', s); return text('status'); });
  }
  if (only.includes('zero')) {
    await step('zero', 'start', async () => { await snap('zero-start', 'zero'); return text('zero'); });
    await step('zero', 'one', async () => { await click('zero', '+1 unread'); await snap('zero-one', 'zero'); return text('zero'); });
    await step('zero', 'read', async () => { await click('zero', 'Read all'); await snap('zero-read', 'zero'); return text('zero'); });
  }
  if (only.includes('switch')) {
    await step('switch', 'typed', async () => {
      const i = box('switch').getByRole('textbox').first();
      await i.click(); await i.pressSequentially('ana@mail.com', { delay: 20 }); await i.press('Tab'); await settle();
      await snap('switch-typed', 'switch');
      return { value: await i.inputValue(), placeholder: await i.getAttribute('placeholder'), aria: await i.getAttribute('aria-label') };
    });
    await step('switch', 'switched', async () => {
      await click('switch', "I'm new here"); await snap('switch-switched', 'switch');
      const i = box('switch').getByRole('textbox').first();
      return { value: await i.inputValue(), placeholder: await i.getAttribute('placeholder'), aria: await i.getAttribute('aria-label'), text: await text('switch') };
    });
    await step('switch', 'back', async () => {
      await click('switch', 'I have an account');
      const i = box('switch').getByRole('textbox').first();
      return { value: await i.inputValue(), placeholder: await i.getAttribute('placeholder') };
    });
  }
  if (only.includes('keep')) {
    await snap('keep-start', 'keep');
    await step('keep', 'clicked', async () => { await click('keep', '+1'); await click('keep', '+1'); await snap('keep-clicked', 'keep'); return text('keep'); });
    await step('keep', 'hidden', async () => { await click('keep', 'Hide counter'); return text('keep'); });
    await step('keep', 'back', async () => { await click('keep', 'Show counter'); await snap('keep-back', 'keep'); return text('keep'); });
  }
  await snap('end');
} catch (e) { res.error = e.message.split('\n')[0]; }
await browser.close();
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(res, null, 1) + '\n');
console.log(JSON.stringify(res, null, 1));
