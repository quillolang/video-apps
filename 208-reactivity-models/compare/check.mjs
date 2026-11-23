// Checks that the six Groceries apps do the same: 50 rows and "40 left · $555.52" to start; "ap" leaves the
// rows with "ap" in their names; ticking Bananas makes "39 left"; removing Bread drops a row; adding Basil
// gives "40 left" again and a 50th row. Prints each app's steps, then a line per app: the same as the first, or "differs".
//   node check.mjs react=http://127.0.0.1:5181 ... quillo=http://127.0.0.1:8096
import { chromium } from 'playwright';

const targets = process.argv.slice(2).map((a) => a.split('='));
const browser = await chromium.launch();
const seen = {};
for (const [name, url] of targets) {
  const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url);
  await page.waitForFunction(() => document.querySelectorAll('.list li').length === 50, null, { timeout: 30000 });
  const state = () => page.evaluate(() => [
    document.querySelectorAll('.list li').length,
    document.querySelector('.summary').textContent.replace(/\s+/g, ' ').trim(),
    document.querySelectorAll('.list li.done').length,
  ].join(' | '));
  const steps = [await state()];
  await page.fill('.filter', 'ap');
  await page.waitForTimeout(300);
  steps.push(await state() + ' | ' + (await page.$$eval('.list .name', (xs) => xs.map((x) => x.textContent).join(','))));
  await page.fill('.filter', '');
  await page.waitForTimeout(300);
  await page.getByRole('checkbox').nth(1).click();
  await page.waitForTimeout(300);
  steps.push(await state());
  await page.getByRole('button', { name: 'Remove Bread' }).click();
  await page.waitForTimeout(300);
  steps.push(await state());
  await page.fill('.add input', 'Basil');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.waitForTimeout(300);
  steps.push(await state() + ' | ' + (await page.$$eval('.list .name', (xs) => xs.at(-1).textContent)) + ' | draft "' + (await page.inputValue('.add input')) + '"');
  seen[name] = steps;
  console.log(`${name}:\n  ${steps.join('\n  ')}${errors.length ? `\n  errors: ${errors.join('; ')}` : ''}`);
  await page.close();
}
const [firstName, firstSteps] = Object.entries(seen)[0];
console.log('');
for (const [name, steps] of Object.entries(seen)) {
  console.log(`${name.padEnd(15)}${JSON.stringify(steps) === JSON.stringify(firstSteps) ? `the same as ${firstName}, step by step` : 'differs'}`);
}
await browser.close();
