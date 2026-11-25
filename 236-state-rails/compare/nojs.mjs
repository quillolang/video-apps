// With JavaScript turned off in the browser: Chromium opens / and presses each counter once, for Quillo and for
// Rails + Hotwire, and prints what each counter shows after its press:  node compare/nojs.mjs
// A press that does nothing leaves the count at 0. Each side started fresh; writes NOJS.json beside this file.
import { execFileSync, spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), video = path.dirname(here);
const root = path.resolve(video, '../..');
const { chromium } = await import(fs.existsSync(path.join(root, 'node_modules/playwright/index.mjs')) ? path.join(root, 'node_modules/playwright/index.mjs') : 'playwright');
const PORT = 8325, URL0 = `http://127.0.0.1:${PORT}/`, sleep = (n) => new Promise((r) => setTimeout(r, n));
const KINDS = [['tab', 'This tab'], ['address', 'The address'], ['visitor', 'This visitor'], ['everyone', 'Everyone, until a restart'], ['saved', 'Everyone, for good'], ['synced', 'Kept in sync']];
const SIDES = {
  quillo: (work) => {
    for (const f of ['main.qwe', 'style.qwe']) fs.copyFileSync(path.join(video, 'app', f), path.join(work, f));
    return spawn(path.join(video, 'app/.quillo/bin/quillo'), ['run', 'main.qwe', '--port', String(PORT)], { cwd: work, env: { ...process.env, QUILLO_SECRET: crypto.randomBytes(32).toString('hex') }, stdio: 'ignore' });
  },
  rails: (work) => {
    const dir = path.join(work, 'state.db'); fs.mkdirSync(dir, { recursive: true });
    const G = path.join(root, '.cache', 'gems'), R = path.join(here, 'rails');
    const env = { GEM_HOME: G, GEM_PATH: G, PATH: `${G}/bin:${process.env.PATH}`, RAILS_ENV: 'production', RAILS_FORCE_SSL: 'false', STATE_DIR: dir, PORT: String(PORT), SECRET_KEY_BASE: crypto.randomBytes(64).toString('hex') };
    execFileSync('bin/rails', ['db:prepare'], { cwd: R, env: { ...process.env, ...env }, stdio: 'ignore' });
    return spawn('bin/rails', ['server', '-b', '127.0.0.1', '-p', String(PORT)], { cwd: R, env: { ...process.env, ...env }, stdio: 'ignore', detached: true });
  },
};
const value = async (page, id) => Number((await page.locator(`#${id}`).innerText()).split(':').pop().trim());
const out = {}, printed = [];
const browser = await chromium.launch();
for (const [name, start] of Object.entries(SIDES)) {
  const work = path.join(os.tmpdir(), `v236-nojs-${name}`);
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work, { recursive: true });
  const p = start(work);
  for (let i = 0; i < 300; i++) { try { if ((await fetch(URL0)).ok) break; } catch {} await sleep(20); }
  const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
  await page.goto(URL0);
  const row = {};
  for (const [id] of KINDS) {
    await page.click(`#${id}`); await page.waitForLoadState('load'); await sleep(400);
    row[id] = await value(page, id);
  }
  out[name] = row;
  const label = name === 'quillo' ? 'Quillo' : 'Rails';
  printed.push(`${label.padEnd(11)}` + KINDS.map(([id, l]) => `${l}: ${row[id]}`).join(' · '));
  await page.context().close();
  try { process.kill(name === 'rails' ? -p.pid : p.pid, 'SIGTERM'); } catch {} await new Promise((r) => (p.exitCode !== null ? r() : p.on('exit', r))); await sleep(300);
}
await browser.close();
console.log(printed.join('\n'));
fs.writeFileSync(path.join(here, 'NOJS.json'), JSON.stringify({ sides: out, printed, when: new Date().toISOString() }, null, 1) + '\n');
process.exit(0);
