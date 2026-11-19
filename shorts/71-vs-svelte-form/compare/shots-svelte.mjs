// SvelteKit's screenshots for the Short, from its dev server (npm run dev, port 5177), with JavaScript on, as a
// visitor has it (the form isn't enhanced, so each send loads the page again, as with JavaScript off):
//   node shorts/71-vs-svelte-form/compare/shots-svelte.mjs
// The form as it opens (s0), sent with age 12 (s1), and sent with age 14 (s2), into ../assets, with titles.json and
// urls.json as shots() writes them for Quillo, the same viewport and density as ../shots.mjs.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'svelte'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 160 }, dsf = 3, port = 5177;
const server = spawn('npm', ['run', 'dev', '--', '--port', String(port), '--strictPort'],
  { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NO_COLOR: '1' } });
let log = '';
server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
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
  const text = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const snap = async (name) => {
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title() || `localhost:${port}`);
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${await text()}`);
  };
  const send = async (age) => {
    await page.locator('input[name=email]').fill('ada@example.com');
    await page.locator('input[name=age]').fill(age);
    await Promise.all([page.waitForNavigation(), page.locator('button').click()]);
  };
  await page.goto(`http://localhost:${port}/`); await page.locator('form').waitFor(); await page.waitForTimeout(500);
  await snap('s0');
  await send('12');
  if (!(await text()).includes('You must be 13 or older')) throw new Error(`age 12: ${await text()}`);
  if (await page.locator('input[name=email]').inputValue() !== 'ada@example.com') throw new Error('the email was not kept');
  await snap('s1');
  await send('14');
  if (await text() !== 'Welcome, ada@example.com!') throw new Error(`age 14: ${await text()}`);
  await snap('s2');
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
} finally {
  await browser.close();
  stop();
}
