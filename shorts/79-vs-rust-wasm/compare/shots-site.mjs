// Screenshots of a built counter, served as it is: node compare/shots-site.mjs <site-dir> <name> <port>
// (79 takes Sycamore's, the smallest Rust one, from the site downloads.mjs copied: <name> s.) The counter at 0, then
// after three clicks (<name>0, <name>3), into ../assets, with titles.json and urls.json as shots() writes them for
// Quillo, the same viewport and density as ../shots.mjs. Each shot checks the page's text first.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, '..', 'assets');
const [site, name, port] = process.argv.slice(2);
if (!site || !name || !port) { console.error('usage: node shots-site.mjs <site-dir> <name> <port>'); process.exit(2); }
const viewport = { width: 320, height: 128 }, dsf = 3;
const server = spawn('node', [path.join(here, 'serve-dist.mjs'), site, port], { stdio: 'ignore', detached: true });
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
  await page.goto(`http://localhost:${port}/`);
  await page.locator('button').waitFor(); await page.waitForTimeout(500);
  const shot = async (n, want) => {
    const got = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    if (got !== want) throw new Error(`the page says "${got}", not "${want}"`);
    await page.screenshot({ path: path.join(assets, `${name}${n}.png`) });
    json('titles.json', `${name}${n}`, (await page.title()) || `localhost:${port}`);
    json('urls.json', `${name}${n}`, `//localhost:${port}/`);
    console.log(`  assets/${name}${n}.png: ${got}`);
  };
  await shot(0, '0 0 doubled is 0');
  for (let i = 0; i < 3; i++) { await page.locator('button').click(); await page.waitForTimeout(150); }
  await shot(3, '6 3 doubled is 6');
} finally {
  await browser.close();
  stop();
}
