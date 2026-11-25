// What the browser downloads to show the six-counter page, for Quillo, Phoenix LiveView, and the Rails, Laravel,
// SvelteKit, Nuxt, Next.js, Solid, Angular, Svelte, Vue and React versions of the videos before (videos/236-state-rails,
// ... 227-state-react):  node compare/bytes.mjs
// Each server started fresh; Chromium opens / and waits for the load event, then 3 s. Bytes are as the page gets them,
// unpacked (the Node servers send them uncompressed, Quillo compresses: unpacked sizes compare the code itself).
// Writes BYTES.json beside this file.
import { execFileSync, spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), video = path.dirname(here), videos = path.dirname(video);
const root = path.resolve(video, '../..');
const { chromium } = await import(fs.existsSync(path.join(root, 'node_modules/playwright/index.mjs')) ? path.join(root, 'node_modules/playwright/index.mjs') : 'playwright');
const QAPP = fs.existsSync(path.join(video, 'app', 'main.qwe')) ? path.join(video, 'app') : video;
const PORT = 8333, URL0 = `http://127.0.0.1:${PORT}/`, sleep = (n) => new Promise((r) => setTimeout(r, n));
const SIDES = {
  quillo: (work) => { for (const f of ['main.qwe', 'style.qwe']) fs.copyFileSync(path.join(QAPP, f), path.join(work, f)); return [path.join(QAPP, '.quillo/bin/quillo'), ['run', 'main.qwe', '--port', String(PORT)]]; },
  phoenix: (work) => {
    const C = path.join(root, '.cache'), P = path.join(here, 'phoenix');
    const env = { MIX_HOME: path.join(C, 'mix'), HEX_HOME: path.join(C, 'hex'), MIX_ENV: 'prod', PHX_HOST: '127.0.0.1', DATABASE_PATH: path.join(work, 'state.db'), PORT: String(PORT), SECRET_KEY_BASE: crypto.randomBytes(64).toString('hex') };
    execFileSync('mix', ['ecto.migrate'], { cwd: P, env: { ...process.env, ...env }, stdio: 'ignore' });
    return ['mix', ['phx.server'], P, env];
  },
  rails: (work) => {
    const dir = path.join(work, 'state.db'); fs.mkdirSync(dir, { recursive: true });
    const G = path.join(root, '.cache', 'gems'), R = path.join(videos, '236-state-rails/compare/rails');
    const env = { GEM_HOME: G, GEM_PATH: G, PATH: `${G}/bin:${process.env.PATH}`, RAILS_ENV: 'production', RAILS_FORCE_SSL: 'false', STATE_DIR: dir, PORT: String(PORT), SECRET_KEY_BASE: crypto.randomBytes(64).toString('hex') };
    execFileSync('bin/rails', ['db:prepare'], { cwd: R, env: { ...process.env, ...env }, stdio: 'ignore' });
    return ['bin/rails', ['server', '-b', '127.0.0.1', '-p', String(PORT)], R, env];
  },
  laravel: (work) => {
    const env = { APP_KEY: 'base64:' + crypto.randomBytes(32).toString('base64'), APP_ENV: 'production', APP_DEBUG: 'false', DB_DATABASE: path.join(work, 'state.db') };
    execFileSync('php', ['artisan', 'migrate', '--force'], { cwd: path.join(videos, '235-state-laravel/compare/laravel'), env: { ...process.env, ...env }, stdio: 'ignore' });
    return ['php', ['artisan', 'serve', '--host=127.0.0.1', `--port=${PORT}`, '--no-reload'], path.join(videos, '235-state-laravel/compare/laravel'), env];
  },
  sveltekit: (work) => [process.execPath, ['--no-warnings', path.join(videos, '234-state-sveltekit/compare/sveltekit/build/index.js')], work, { HOST: '127.0.0.1', ORIGIN: `http://127.0.0.1:${PORT}`, STATE_DB: path.join(work, 'state.db') }],
  nuxt: (work) => [process.execPath, ['--no-warnings', path.join(videos, '233-state-nuxt/compare/nuxt/.output/server/index.mjs')], work, { HOST: '127.0.0.1', STATE_DB: path.join(work, 'state.db') }],
  nextjs: (work) => [process.execPath, ['--no-warnings', path.join(videos, '232-state-nextjs/compare/nextjs/node_modules/next/dist/bin/next'), 'start', '-p', String(PORT)], path.join(videos, '232-state-nextjs/compare/nextjs'), { STATE_DB: path.join(work, 'state.db') }],
  solid: () => [process.execPath, ['--no-warnings', path.join(videos, '231-state-solid/compare/solid/server.js')]],
  angular: () => [process.execPath, ['--no-warnings', path.join(videos, '230-state-angular/compare/angular/server.js')]],
  svelte: () => [process.execPath, ['--no-warnings', path.join(videos, '229-state-svelte/compare/svelte/server.js')]],
  vue: () => [process.execPath, ['--no-warnings', path.join(videos, '228-state-vue/compare/vue/server.js')]],
  react: () => [process.execPath, ['--no-warnings', path.join(videos, '227-state-react/compare/react/server.js')]],
};
const out = {};
const browser = await chromium.launch();
for (const [name, cmd] of Object.entries(SIDES)) {
  const work = path.join(os.tmpdir(), `v237-bytes-${name}`);
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work, { recursive: true });
  const [bin, args, cwd = work, extra = {}] = cmd(work);
  const p = spawn(bin, args, { detached: true, cwd, env: { ...process.env, PORT: String(PORT), SESSION_SECRET: crypto.randomBytes(32).toString('hex'), ...extra }, stdio: 'ignore' });
  for (let i = 0; i < 300; i++) { try { if ((await fetch(URL0)).ok) break; } catch {} await sleep(20); }
  const page = await (await browser.newContext()).newPage();
  let total = 0, js = 0;
  page.on('response', async (r) => { try { const b = (await r.body()).length; total += b; if (/javascript/.test(r.headers()['content-type'] || '')) js += b; } catch {} });
  await page.goto(URL0); await page.waitForLoadState('load'); await page.waitForTimeout(3000);   // not 'networkidle': a live stream stays open
  out[name] = { total, js };
  console.log(name, 'total', total, 'bytes; JavaScript', js);
  await page.context().close();
  try { process.kill(-p.pid, 'SIGTERM'); } catch {} await new Promise((r) => (p.exitCode !== null ? r() : p.on('exit', r))); await sleep(300);
}
await browser.close();
fs.writeFileSync(path.join(here, 'BYTES.json'), JSON.stringify({ ...out, when: new Date().toISOString() }, null, 1) + '\n');
process.exit(0);
