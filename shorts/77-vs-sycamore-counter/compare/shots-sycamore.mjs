// Sycamore's screenshots for the Short, from its release build (trunk build --release), dist/ served as it is by
// serve-dist.mjs on port 4193:
//   node shorts/77-vs-sycamore-counter/compare/shots-leptos.mjs
// The counter at 0, then after three clicks (s0, s3), into ../assets, with titles.json and urls.json as shots() writes
// them for Quillo, the same viewport and density as ../shots.mjs. Each shot checks the page's text first.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 128 }, dsf = 3, port = 4193;
const server = spawn('node', ['serve-dist.mjs', 'counter/dist', String(port)], { cwd: here, stdio: 'ignore', detached: true });
const stop = () => { try { process.kill(-server.pid, 'SIGTERM'); } catch {} };
process.on('exit', stop);
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};
for (let i = 0; ; i++) { try { await fetch(`http://localhost:${port}/`); break; } catch { if (i > 100) throw new Error('no server'); await new Promise((r) => setTimeout(r, 100)); } }
const browser = await chromium.launch();
try {
  const page = await (await browser.newContext({ viewport, deviceScaleFactor: dsf })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://localhost:${port}/`);
  await page.locator('button').waitFor(); await page.waitForTimeout(500);
  const shot = async (name, want) => {
    const got = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    if (got !== want) throw new Error(`the page says "${got}", not "${want}"`);
    await page.screenshot({ path: path.join(assets, `${name}.png`) });
    json('titles.json', name, (await page.title()) || `localhost:${port}`);
    json('urls.json', name, `//localhost:${port}/`);
    console.log(`  assets/${name}.png: ${got}`);
  };
  await shot('s0', '0 0 doubled is 0');
  for (let i = 0; i < 3; i++) { await page.locator('button').click(); await page.waitForTimeout(150); }
  await shot('s3', '6 3 doubled is 6');
  if (errors.length) throw new Error('errors in the page:\n' + errors.join('\n'));
} finally {
  await browser.close();
  stop();
}
