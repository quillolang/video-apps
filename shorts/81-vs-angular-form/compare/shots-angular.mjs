// Angular's screenshots for the Short, from its dev server (ng serve, port 4202):
//   node shorts/81-vs-angular-form/compare/shots-angular.mjs
// The sign-up form, checking as you type: empty (a0), an email and age 12 (a1), age 14 (a2), and joined (a3), into
// ../assets, with titles.json and urls.json as shots() writes them for Quillo, with the same viewport and density as
// ../shots.mjs, so both windows show their page alike. Each step checks the page's text and the button first.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'form'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 160 }, dsf = 3, port = 4202;
const server = spawn('npx', ['ng', 'serve', '--port', String(port)],
  { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NO_COLOR: '1', NG_CLI_ANALYTICS: 'false' } });
let log = '';
server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};
for (let i = 0; !/Local:/.test(log); i++) {
  if (i > 1800 || server.exitCode != null) throw new Error(`ng serve didn't start:\n${log}`);
  await new Promise(r => setTimeout(r, 100));
}
const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport, deviceScaleFactor: dsf })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.locator('form').waitFor();
  await page.waitForTimeout(500);
  const state = async () => ({ text: (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim(),
    off: await page.locator('button').count() ? await page.locator('button').isDisabled() : null });
  const shot = async (name, text, off) => {
    let s;
    for (let i = 0; i < 40; i++) { s = await state(); if (s.text === text && s.off === off) break; await page.waitForTimeout(50); }
    if (s.text !== text || s.off !== off) throw new Error(`${name}: the page is ${JSON.stringify(s)}, not ${JSON.stringify({ text, off })}`);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title());
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${s.text} (Join ${off === null ? 'gone' : off ? 'off' : 'on'})`);
  };
  await shot('a0', 'Join', true);
  await page.locator('input[type=email]').pressSequentially('ada@example.com', { delay: 10 });
  await page.locator('input[type=number]').pressSequentially('12', { delay: 10 });
  await shot('a1', '13 or older, please Join', true);
  await page.locator('input[type=number]').fill('14');
  await shot('a2', 'Join', false);
  await page.locator('button').click();
  await shot('a3', 'Welcome, ada@example.com!', null);
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
  console.log(log.split('\n').filter(l => /Local:|Application bundle|Watch mode/.test(l)).join('\n'));
} finally {
  await browser.close();
  stop();
}
