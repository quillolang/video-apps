// React's screenshots for the Short, from Vite's dev server (npx vite, port 5178):
//   node shorts/72-vs-shipped-js/compare/shots-react.mjs
// The counter at 0, then after three clicks (r0, r3), into ../assets, with titles.json and urls.json as shots()
// writes them for Quillo, with the same viewport and density as ../shots.mjs, so both windows show their page alike.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'react'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 128 }, dsf = 3, port = 5178;
const server = spawn('npx', ['vite', '--port', String(port), '--strictPort'],
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
for (let i = 0; !/ready in/.test(log); i++) {
  if (i > 1800 || server.exitCode != null) throw new Error(`vite didn't start:\n${log}`);
  await new Promise(r => setTimeout(r, 100));
}
const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport, deviceScaleFactor: dsf })).newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.locator('button').waitFor();
  await page.waitForTimeout(500);
  const shot = async (name, want) => {
    const got = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    if (got !== want) throw new Error(`the page says "${got}", not "${want}"`);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, await page.title());
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${got}`);
  };
  await shot('r0', '0 0 doubled is 0');
  for (let i = 0; i < 3; i++) { await page.locator('button').click(); await page.waitForTimeout(150); }
  await shot('r3', '6 3 doubled is 6');
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
  console.log(log.split('\n').filter(l => /VITE|ready in|Local/.test(l)).join('\n'));
} finally {
  await browser.close();
  stop();
}
