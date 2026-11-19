// Next.js's screenshots for the Short, from production builds (next build, then next start -p 3010):
//   node shorts/78-vs-next-data/compare/shots-next.mjs
// 1. The first try (variants/static/page.tsx, put in place for its build and put back however this ends), from the
//    three seeded trails: the page (n0), then a fourth trail inserted with sqlite3 and the page loaded again (n1).
// 2. The page as it is (connection() in a Suspense boundary), the same way (d0, d1).
// Into ../assets, with titles.json and urls.json as shots() writes them for Quillo, the same viewport and density as
// ../shots.mjs. The server is started here, and only it is stopped.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.join(here, 'next'), assets = path.join(here, '..', 'assets');
const viewport = { width: 320, height: 160 }, dsf = 3, port = 3010;
const PAGE = path.join(app, 'app/page.tsx'), kept = fs.readFileSync(PAGE, 'utf8');
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
let server = null;
const stop = () => { if (server && server.exitCode == null) { try { process.kill(-server.pid, 'SIGTERM'); } catch {} } };
process.on('exit', () => { stop(); fs.writeFileSync(PAGE, kept); });
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
const json = (f, k, v) => {
  const p = path.join(assets, f), o = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  o[k] = v; fs.writeFileSync(p, JSON.stringify(o, null, 1) + '\n');
};
const seed = () => {
  for (const f of ['trails.db', 'trails.db-wal', 'trails.db-shm']) fs.rmSync(path.join(app, f), { force: true });
  execFileSync('sh', ['-c', 'sqlite3 trails.db < ../seed.sql'], { cwd: app });
};

const run = async (names) => {
  seed();
  execFileSync('npx', ['next', 'build'], { cwd: app, env, stdio: 'ignore' });
  let log = '';
  server = spawn('npx', ['next', 'start', '-p', String(port)], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'], detached: true, env });
  server.stdout.on('data', d => { log += d; }); server.stderr.on('data', d => { log += d; });
  for (let i = 0; ; i++) {
    if (server.exitCode != null) throw new Error(`next start stopped:\n${log}`);
    try { if ((await fetch(`http://localhost:${port}/`)).ok) break; } catch {}
    if (i > 300) throw new Error(`no answer:\n${log}`);
    await new Promise(r => setTimeout(r, 100));
  }
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext({ viewport, deviceScaleFactor: dsf })).newPage();
    const snap = async (name) => {
      await page.goto(`http://localhost:${port}/`); await page.locator('li').first().waitFor(); await page.waitForTimeout(400);
      const got = await page.locator('li').allInnerTexts();
      await page.screenshot({ path: path.join(assets, `${name}.png`) });
      json('titles.json', name, await page.title());
      json('urls.json', name, `//localhost:${port}/`);
      console.log(`  assets/${name}.png: ${got.join(' · ')}`);
      return got.length;
    };
    const before = await snap(names[0]);
    execFileSync('sqlite3', [path.join(app, 'trails.db'), "insert into trails (name, km) values ('Lake Trail', 6.1)"]);
    const after = await snap(names[1]);
    return [before, after];
  } finally {
    await browser.close();
    stop();
    await new Promise(r => (server.exitCode != null ? r() : server.on('exit', r)));
  }
};

fs.copyFileSync(path.join(here, 'variants/static/page.tsx'), PAGE);
const first = await run(['n0', 'n1']);
if (first.join() !== '3,3') throw new Error(`the first try showed ${first.join(', ')} trails, not 3, 3`);
fs.writeFileSync(PAGE, kept);
const fixed = await run(['d0', 'd1']);
if (fixed.join() !== '3,4') throw new Error(`the page as it is showed ${fixed.join(', ')} trails, not 3, 4`);
seed();
