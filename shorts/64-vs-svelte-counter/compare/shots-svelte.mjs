// Svelte's screenshots for the Short, from SvelteKit's dev server (npm run dev, port 5173):
//   node shorts/64-vs-svelte-counter/compare/shots-svelte.mjs
// 1. svelte/ as it is ($derived): the counter at 0, then after three clicks (s0, s3).
// 2. The same page with a plain let in place of $derived (variants/plain-let), put in for this run and put back
//    however it ends: after three clicks (p3), and the warning the dev server prints, into ../assets/svelte-dev.txt.
// The tab's title and path go in ../assets/titles.json and urls.json, as shots() writes them for Quillo, with the
// same viewport and density as ../shots.mjs, so both windows show their page alike.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'svelte'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 128 }, dsf = 3, port = 5173;
const PAGE = path.join(app, 'src/routes/+page.svelte'), kept = fs.readFileSync(PAGE, 'utf8');
let server = null;
const stopServer = () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGTERM'); } catch {} } };
process.on('exit', () => { stopServer(); fs.writeFileSync(PAGE, kept); });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};

const run = async (shots) => {
  let log = '';
  server = spawn('npm', ['run', 'dev', '--', '--port', String(port), '--strictPort'],
    { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' } });
  server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
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
    const button = page.locator('button');
    await button.waitFor();
    await page.waitForTimeout(500);                       // hydrated
    for (const [name, clicks, want] of shots) {
      for (let i = 0; i < clicks; i++) { await button.click(); await page.waitForTimeout(150); }
      const got = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
      if (got !== want) throw new Error(`the page says "${got}", not "${want}"`);
      await page.screenshot({ path: path.join(assets, `${name}.png`) });
      json('titles.json', name, await page.title() || `localhost:${port}`);
      json('urls.json', name, `//localhost:${port}/`);
      console.log(`  assets/${name}.png: ${got}`);
    }
    if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
  } finally {
    await browser.close();
    stopServer();
    await new Promise(r => (server.exitCode != null ? r() : server.on('exit', r)));
  }
  return log;
};

// 1. As it is: $derived.
await run([['s0', 0, '0 0 doubled is 0'], ['s3', 3, '6 3 doubled is 6']]);
// 2. A plain let.
fs.copyFileSync(path.join(here, 'variants/plain-let/+page.svelte'), PAGE);
const log = await run([['p3', 3, '0 3 doubled is 0']]);
const lines = log.replace(/\x1b\[[0-9;]*m/g, '').split('\n');
const at = lines.findIndex(l => /state_referenced_locally|only captures the initial value/.test(l));
if (at < 0) throw new Error(`no warning in the dev server's log:\n${log}`);
fs.writeFileSync(path.join(assets, 'svelte-dev.txt'), log.replace(/\x1b\[[0-9;]*m/g, ''));
console.log(lines.slice(Math.max(0, at - 2), at + 10).join('\n'));
