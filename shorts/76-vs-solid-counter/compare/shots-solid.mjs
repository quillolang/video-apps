// Solid's screenshots for the Short, from its dev server (npm run dev, port 3001):
//   node shorts/76-vs-solid-counter/compare/shots-solid.mjs
// 1. solid/ as it is (doubled is a function): the counter at 0, then after three clicks (s0, s3).
// 2. The same page with doubled read once in the body (variants/body-read), put in for this run and put back
//    however it ends: after three clicks (p3), and the warning Solid prints in the browser console, into
//    ../assets/solid-console.txt.
// The tab's title and path go in ../assets/titles.json and urls.json, as shots() writes them for Quillo, with the
// same viewport and density as ../shots.mjs, so both windows show their page alike.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'solid'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 128 }, dsf = 3, port = 3001;
const PAGE = path.join(app, 'src/App.tsx'), kept = fs.readFileSync(PAGE, 'utf8');
let server = null, consoleLines = [];
const stopServer = () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGTERM'); } catch {} } };
process.on('exit', () => { stopServer(); fs.writeFileSync(PAGE, kept); });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));

const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};

const run = async (shots) => {
  let log = ''; consoleLines = [];
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
    page.on('console', m => { consoleLines.push(`[${m.type()}] ${m.text()}`); });
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
  return { log, console: consoleLines };
};

// 1. As it is: doubled is a function, called in the JSX.
const first = await run([['s0', 0, '0 0 doubled is 0'], ['s3', 3, '6 3 doubled is 6']]);
if (first.console.some(l => /STRICT_READ_UNTRACKED/.test(l))) throw new Error(`a warning as it is:\n${first.console.join('\n')}`);
// 2. doubled read once, in the body.
fs.copyFileSync(path.join(here, 'variants/body-read/App.tsx'), PAGE);
const second = await run([['p3', 3, '0 3 doubled is 0']]);
const warned = second.console.filter(l => /STRICT_READ_UNTRACKED/.test(l));
if (!warned.length) throw new Error(`no warning in the browser console:\n${second.console.join('\n')}`);
fs.writeFileSync(path.join(assets, 'solid-console.txt'), second.console.join('\n') + '\n');
console.log(warned.join('\n'));
