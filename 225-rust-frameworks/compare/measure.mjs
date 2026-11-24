// Measures the guestbooks for video 225 (Quillo, six Rust frameworks, and Axum tuned):  node compare/measure.mjs
// Needs: the Rust builds (sh compare/build.sh <side>, which leaves them in .cache/rust-target/v225/<side>/ and
// runs/build-<side>.json), the Quillo app (sh get-quillo.sh in app/), wrk, and Playwright's Chromium. macOS or Linux.
//
//   code     lines of code (not blank, not a comment) and files, in what the developer keeps (src/, Cargo.toml, index.html,
//            Dioxus.toml; main.qwe), not Cargo.lock, assets or the starters' READMEs
//   start    from starting the server to its first 200 on / (Yew: its API's /api/entries), fresh each time: median of 5
//   memory   the server's RSS when idle, and the most it reached under load
//   load     wrk -t4 -c64 -d10s on the page with 20 entries (Yew: /api/entries, where its page's entries come from);
//            three rounds, the sides taking turns, median kept
//   browser  Chromium opens the page and waits until the 20 entries show: bytes transferred, and of them JavaScript
//            and WebAssembly; and whether the entries are in the page's HTML (no JavaScript needed)
// Writes MEASURE.json beside this file. With --code, only the code counts are taken, into the MEASURE.json there is.
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url)), video = path.dirname(here);
const root = path.resolve(video, '../..');
const BUILDS = process.env.BUILDS || path.join(root, '.cache/rust-target/v225');   // the same BUILDS as build.sh
const QUILLO_APP = fs.existsSync(path.join(video, 'app', 'main.qwe')) ? path.join(video, 'app') : video;
const QUILLO = path.join(QUILLO_APP, '.quillo', 'bin', 'quillo');
const WORK = path.join(os.tmpdir(), 'v225-run');
const PORT = 8262;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[(s.length - 1) >> 1]; };
const SIDES = ['quillo', 'axum', 'axum-tuned', 'actix', 'rocket', 'leptos', 'dioxus', 'yew'];
const PATHS = { yew: '/api/entries' };

// Each server in a fresh folder of its own (its guestbook.db lands there).
function launch(side) {
  const dir = path.join(WORK, side);
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = path.join(BUILDS, side);
  let cmd, args = [], env = { ...process.env, PORT: String(PORT) };
  if (side === 'quillo') { fs.copyFileSync(path.join(QUILLO_APP, 'main.qwe'), path.join(dir, 'main.qwe')); cmd = QUILLO; args = ['run', 'main.qwe', '--port', String(PORT)]; }
  else if (side === 'rocket') { cmd = path.join(b, 'guestbook'); env.ROCKET_PORT = String(PORT); env.ROCKET_LOG_LEVEL = 'off'; }
  else if (side === 'leptos') { fs.symlinkSync(path.join(b, 'site'), path.join(dir, 'site')); cmd = path.join(b, 'guestbook');
    Object.assign(env, { LEPTOS_OUTPUT_NAME: 'guestbook', LEPTOS_SITE_ROOT: 'site', LEPTOS_SITE_PKG_DIR: 'pkg', LEPTOS_SITE_ADDR: `127.0.0.1:${PORT}`, LEPTOS_RELOAD_PORT: '3001', LEPTOS_ENV: 'PROD' }); }
  else if (side === 'dioxus') { fs.symlinkSync(path.join(b, 'public'), path.join(dir, 'public')); fs.copyFileSync(path.join(b, 'server'), path.join(dir, 'server')); cmd = path.join(dir, 'server'); env.IP = '127.0.0.1'; }
  else if (side === 'yew') { fs.symlinkSync(path.join(b, 'dist'), path.join(dir, 'dist')); cmd = path.join(b, 'guestbook-api'); }
  else cmd = path.join(b, 'guestbook');
  const t0 = performance.now();
  const p = spawn(cmd, args, { cwd: dir, env, stdio: 'ignore' });
  p.t0 = t0;
  return p;
}
async function ready(p, side) {
  const url = `http://127.0.0.1:${PORT}${PATHS[side] || '/'}`;
  for (let i = 0; i < 4000; i++) {
    try { const r = await fetch(url); if (r.status === 200) { await r.text(); return performance.now() - p.t0; } } catch {}
    await sleep(2);
  }
  throw new Error(`${side} did not start`);
}
async function stop(p) { p.kill('SIGTERM'); await new Promise((r) => (p.exitCode !== null || p.signalCode ? r() : p.on('exit', r))); await sleep(300); }
const rss = (pid) => Number(execFileSync('ps', ['-o', 'rss=', '-p', String(pid)]).toString().trim()) * 1024;
async function fill(side) {
  for (let i = 1; i <= 20; i++) {
    const name = `Guest ${i}`, message = `Hello number ${i}`;
    if (side === 'dioxus' || side === 'yew') await fetch(`http://127.0.0.1:${PORT}/api/sign`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, message }) });
    else {
      const action = side === 'leptos' ? (await (await fetch(`http://127.0.0.1:${PORT}/`)).text()).match(/action="([^"]+)"/)[1] : '/sign';
      await fetch(`http://127.0.0.1:${PORT}${action}`, { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: `name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}` });
    }
  }
}

// code
const CODE = { quillo: [path.join(QUILLO_APP, 'main.qwe')] };
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? (['target', 'dist', 'node_modules', '.git'].includes(d.name) ? [] : walk(path.join(dir, d.name))) : [path.join(dir, d.name)]); }
for (const side of SIDES.slice(1)) {
  const dir = path.join(here, side);
  CODE[side] = walk(dir).filter((f) => /\.(rs|toml|html)$/.test(f) && !/Cargo\.lock$/.test(f) && !/clippy\.toml$/.test(f) && !f.includes(`${path.sep}end2end${path.sep}`));
}
const loc = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim() && !/^\s*(\/\/|#(?!\[)|<!--)/.test(l)).length;
const out = { quillo: execFileSync(QUILLO, ['version']).toString().trim(), machine: `${os.cpus()[0].model}, ${os.cpus().length} cores, ${os.platform()} ${os.release()}`, sides: {} };
for (const side of SIDES) {
  const files = CODE[side];
  out.sides[side] = { code: { lines: files.reduce((n, f) => n + loc(f), 0), files: files.map((f) => path.relative(side === 'quillo' ? QUILLO_APP : path.join(here, side), f)) } };
  if (side !== 'quillo') out.sides[side].build = JSON.parse(fs.readFileSync(path.join(here, 'runs', `build-${side}.json`), 'utf8'));
}
out.sides.quillo.build = { seconds: 0, packages: '0', deployed_bytes: fs.statSync(QUILLO).size + fs.statSync(path.join(QUILLO_APP, 'main.qwe')).size };
console.log('code:', SIDES.map((s) => `${s} ${out.sides[s].code.lines}`).join(', '));
if (process.argv.includes('--code')) {   // only the code counts, into the MEASURE.json there is (after a change of layout)
  const m = JSON.parse(fs.readFileSync(path.join(here, 'MEASURE.json'), 'utf8'));
  for (const side of SIDES) m.sides[side].code = out.sides[side].code;
  fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(m, null, 1) + '\n');
  console.log('code counts updated in compare/MEASURE.json'); process.exit(0);
}

// start and idle memory
for (const side of SIDES) {
  const starts = [];
  for (let i = 0; i < 5; i++) { const p = launch(side); starts.push(await ready(p, side)); if (i === 4) { await sleep(500); out.sides[side].idle = rss(p.pid); } await stop(p); }
  out.sides[side].start = median(starts);
  console.log(side, 'start', starts.map((x) => x.toFixed(0)).join(' '), 'ms | idle', (out.sides[side].idle / 1e6).toFixed(1), 'MB');
}

// load: the sides take turns, three rounds
for (const side of SIDES) out.sides[side].load = [];
for (let round = 0; round < 3; round++) {
  for (const side of SIDES) {
    const p = launch(side); await ready(p, side); await fill(side);
    let peak = rss(p.pid), on = true;
    const watch = (async () => { while (on) { peak = Math.max(peak, rss(p.pid)); await sleep(200); } })();
    const w = execFileSync('wrk', ['-t4', '-c64', '-d10s', '--latency', `http://127.0.0.1:${PORT}${PATHS[side] || '/'}`]).toString();
    on = false; await watch;
    const rps = Number(w.match(/Requests\/sec:\s+([\d.]+)/)[1]), p50 = w.match(/50%\s+([\d.]+\w+)/)[1];
    const bad = w.match(/Non-2xx or 3xx responses: (\d+)/);
    if (bad) throw new Error(`${side}: ${bad[1]} errors`);
    out.sides[side].load.push({ rps, p50, peak });
    await stop(p);
    console.log(side, 'round', round + 1, rps.toFixed(0), 'req/s, p50', p50, '| peak', (peak / 1e6).toFixed(1), 'MB');
  }
}
for (const side of SIDES) { const l = out.sides[side].load; out.sides[side].rps = median(l.map((x) => x.rps)); out.sides[side].peak = median(l.map((x) => x.peak)); }

// browser
const { chromium } = await import(fs.existsSync(path.join(root, 'node_modules/playwright/index.mjs')) ? path.join(root, 'node_modules/playwright/index.mjs') : 'playwright');
const browser = await chromium.launch();
for (const side of SIDES) {
  const p = launch(side); await ready(p, side); await fill(side);
  const html = await (await fetch(`http://127.0.0.1:${PORT}/`)).text();
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  let total = 0, js = 0, wasm = 0;
  page.on('response', async (r) => { try { const b = (await r.body()).length; total += b; const t = r.headers()['content-type'] || ''; if (/javascript/.test(t)) js += b; if (/wasm/.test(t)) wasm += b; } catch {} });
  await page.goto(`http://127.0.0.1:${PORT}/`);
  await page.getByText('Hello number 20').waitFor({ timeout: 15000 });
  await page.waitForLoadState('networkidle');
  out.sides[side].browser = { total, js, wasm, in_html: html.includes('Hello number 20') };
  await ctx.close(); await stop(p);
  console.log(side, 'browser', JSON.stringify(out.sides[side].browser));
}
await browser.close();
out.load = os.loadavg().map((x) => +x.toFixed(2));
out.when = new Date().toISOString();
fs.writeFileSync(path.join(here, 'MEASURE.json'), JSON.stringify(out, null, 1) + '\n');
console.log('wrote compare/MEASURE.json');
process.exit(0);
