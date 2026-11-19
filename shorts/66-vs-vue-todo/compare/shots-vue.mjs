// Vue's screenshots for the Short, from Vite's dev server (npm run dev, port 5174):
//   node shorts/66-vs-vue-todo/compare/shots-vue.mjs
// The list as it starts (v0), with a new to-do typed (v1), added (v2), and "Learn HTML" taken off (v3), into
// ../assets, with the tab's title and path in assets/titles.json and urls.json, as shots() writes them for Quillo.
// The same viewport and density as ../shots.mjs, so both windows show their page alike.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'vue'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 200 }, dsf = 3, port = 5174, NEW = 'Make a Short';
const server = spawn('npx', ['vite', '--port', String(port), '--strictPort'],
  { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NO_COLOR: '1' } });
let log = '';
server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
process.on('exit', () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};
for (let i = 0; !/ready in/.test(log); i++) {
  if (i > 300 || server.exitCode != null) throw new Error(`vite didn't start:\n${log}`);
  await new Promise(r => setTimeout(r, 100));
}
const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport, deviceScaleFactor: dsf })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.locator('li').first().waitFor();
  const snap = async (name, want) => {
    const got = await page.locator('li').evaluateAll((lis) => lis.map((li) => li.firstChild.textContent.trim()));
    if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(`the list is ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title());
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${got.join(', ')}`);
  };
  await snap('v0', ['Learn HTML', 'Learn JavaScript', 'Learn Vue']);
  await page.locator('input').pressSequentially(NEW, { delay: 20 });
  await snap('v1', ['Learn HTML', 'Learn JavaScript', 'Learn Vue']);
  await page.locator('form button').click();
  await page.waitForFunction(() => document.querySelectorAll('li').length === 4);
  if (await page.locator('input').inputValue() !== '') throw new Error('the box was not emptied');
  await snap('v2', ['Learn HTML', 'Learn JavaScript', 'Learn Vue', NEW]);
  await page.locator('li').first().locator('button').click();
  await page.waitForFunction(() => document.querySelectorAll('li').length === 3);
  await snap('v3', ['Learn JavaScript', 'Learn Vue', NEW]);
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
  console.log(log.split('\n').filter(l => /VITE|ready in|Local/.test(l)).join('\n'));
} finally {
  await browser.close();
  try { process.kill(-server.pid, 'SIGTERM'); } catch {}
}
