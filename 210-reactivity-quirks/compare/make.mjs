// Makes each mistake of mistakes.json in each Groceries app (videos/208-reactivity-models), and records what happens:
// what the linter that came with the starter says (React and Solid: oxlint; Vue: eslint; Svelte's starter has none),
// what the build says (compiler warnings and errors: Svelte's, rustc's), what quillo check says, and then, in
// Chromium, what the page shows and what the console says, on a dev server (`vite`; for Dioxus and Quillo, their
// one build) and on the production build. Writes runs/<round>-<app>.txt (every command and its output) and
// runs/results.json.
//   node make.mjs [round ...] [--only react,vue]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const apps = path.resolve(here, '../../208-reactivity-models/compare');
const qapp = path.resolve(here, '../../208-reactivity-models/app');
const work = path.join(here, 'build');   // not .build: oxlint skips hidden folders
const M = JSON.parse(fs.readFileSync(path.join(here, 'mistakes.json'), 'utf8'));
const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const rounds = args.filter((a) => !a.startsWith('--')).length ? args.filter((a) => !a.startsWith('--')) : Object.keys(M).filter((k) => k !== '_');
const HOME = process.env.HOME;
const scrub = (s) => s.split(HOME).join('/Users/you').replace(/\x1b\[[0-9;]*m/g, '');
const run = (cmd, a, cwd, env = {}) => {
  const r = spawnSync(cmd, a, { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 1 << 26 });
  return { code: r.status, out: scrub((r.stdout || '') + (r.stderr || '')).trimEnd() };
};
const until = async (url, ms = 120000) => { const t = Date.now(); while (Date.now() - t < ms) { try { await (await fetch(url)).arrayBuffer(); return true; } catch { await new Promise((r) => setTimeout(r, 300)); } } return false; };
const copy = (from, to) => fs.cpSync(from, to, { recursive: true, filter: (f) => !/node_modules|\/dist$|\/target$|\.build|\/build$/.test(f) });

const SCENARIO = {
  async inplace(page) {
    await page.getByRole('checkbox').nth(1).click();
    await page.waitForTimeout(800);
    return { rowDone: await page.locator('.list li').nth(1).evaluate((li) => li.classList.contains('done')),
             boxChecked: await page.getByRole('checkbox').nth(1).isChecked() };
  },
  async push(page) {
    await page.fill('.add input', 'Basil');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.waitForTimeout(800);
    return { rows: await page.locator('.list .name').count(), last: await page.locator('.list .name').last().textContent(), draft: await page.inputValue('.add input') };
  },
  async derived(page) {
    await page.getByRole('checkbox').nth(1).click();
    await page.waitForTimeout(800);
    return {};
  },
  async race(page) {
    await page.waitForTimeout(1200);
    await page.click('.filter');
    await page.keyboard.press('a');
    await page.waitForTimeout(60);
    await page.keyboard.press('p');
    await page.waitForTimeout(400);
    const early = (await page.locator('.summary').textContent()).replace(/\s+/g, ' ').trim();
    await page.waitForTimeout(1500);
    return { early, rows: await page.locator('.list .name').count() };
  },
  async effect(page) {
    await page.waitForTimeout(1500);
    const before = await page.locator('.summary').textContent().catch(() => null);
    await page.getByRole('checkbox').nth(1).click({ timeout: 5000 }).catch((e) => null);
    await page.waitForTimeout(1500);
    return { before: before && before.replace(/\s+/g, ' ').trim() };
  },
};
const shots = path.resolve(here, '../assets');
const play = async (browser, url, round, shot) => {
  const ctx = await browser.newContext({ viewport: { width: 700, height: 490 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const console_ = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console_.push(`${m.type()}: ${m.text().split('\n')[0].slice(0, 300)}`); });
  page.on('pageerror', (e) => console_.push(`pageerror: ${String(e.message).split('\n')[0].slice(0, 300)}`));
  const r = { url };
  try {
    await page.goto(url, { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll('.list li').length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(500);
    Object.assign(r, await SCENARIO[round](page));
    r.summary = await Promise.race([page.locator('.summary').textContent(), new Promise((ok) => setTimeout(() => ok('(no answer: the page is busy)'), 5000))]);
    r.summary = r.summary && r.summary.replace(/\s+/g, ' ').trim();
    r.alive = await Promise.race([page.evaluate(() => 'yes'), new Promise((ok) => setTimeout(() => ok('no: still busy after 5 s'), 5000))]);
    if (shot) { await page.evaluate(() => document.activeElement && document.activeElement.blur()).catch(() => {}); await page.screenshot({ path: path.join(shots, `${shot}.png`), timeout: 10000 }).catch(() => {}); r.shot = shot; }
  } catch (e) {
    r.error = String(e.message).split('\n')[0];
    if (shot) { await page.screenshot({ path: path.join(shots, `${shot}.png`), timeout: 10000 }).catch(() => {}); r.shot = shot; }
  }
  r.console = [...new Set(console_)].slice(0, 12);
  r.consoleCount = console_.length;
  await ctx.close().catch(() => {});
  return r;
};

fs.mkdirSync(path.join(here, 'runs'), { recursive: true });
const resultsFile = path.join(here, 'runs/results.json');
const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, 'utf8')) : {};
const browser = await chromium.launch();
let port = 5281;
for (const round of rounds) {
  for (const [app, edits] of Object.entries(M[round])) {
    if (only.length && !only.includes(app)) continue;
    const dir = path.join(work, `${round}-${app}`);
    fs.rmSync(dir, { recursive: true, force: true });
    if (app === 'quillo') { copy(qapp, dir); } else { copy(path.join(apps, app), dir); }
    if (['react', 'vue', 'svelte', 'solid'].includes(app)) fs.copyFileSync(path.join(here, 'shared/search.js'), path.join(dir, 'src/search.js'));
    if (fs.existsSync(path.join(apps, app, 'node_modules'))) fs.symlinkSync(path.join(apps, app, 'node_modules'), path.join(dir, 'node_modules'));
    for (const [file, from, to] of edits) {
      const f = path.join(dir, file), s = fs.readFileSync(f, 'utf8');
      if (!s.includes(from)) throw new Error(`${round}/${app}: ${file} has no ${JSON.stringify(from)}`);
      fs.writeFileSync(f, s.replace(from, to));
    }
    const log = [];
    const r = { round, app, changed: edits.length > 0 };
    const step = (title, res) => { log.push(`$ ${title}`, res.out); return res; };
    const kids = [];
    try {
      if (['react', 'vue', 'svelte', 'solid'].includes(app)) {
        // oxlint finds no files when it walks folders in this repository, so it is given each file by name
        const srcs = fs.readdirSync(path.join(dir, 'src'), { recursive: true }).filter((f) => /\.(jsx?|vue|svelte)$/.test(f)).map((f) => path.join('src', f));
        if (app === 'react') r.lint = step(`npx oxlint ${srcs.join(' ')}`, run('npx', ['oxlint', ...srcs], dir));
        if (app === 'vue') r.lint = step('npx eslint src', run('npx', ['eslint', 'src'], dir));
        if (app === 'solid') r.lint = step(`npx oxlint -c oxlint.config.js ${srcs.join(' ')}`, run('npx', ['oxlint', '-c', 'oxlint.config.js', ...srcs], dir));
        r.build = step('npx vite build', run('npx', ['vite', 'build'], dir));
        const dev = port++, prod = port++;
        kids.push(spawn('npx', ['vite', '--port', String(dev), '--strictPort', '--host', '127.0.0.1'], { cwd: dir, stdio: 'ignore' }));
        const dist = app === 'solid' ? path.join(dir, 'dist/client') : path.join(dir, 'dist');
        if (r.build.code === 0) kids.push(spawn('node', [path.join(apps, 'serve.mjs'), dist, String(prod)], { stdio: 'ignore' }));
        if (await until(`http://127.0.0.1:${dev}/`)) r.dev = await play(browser, `http://127.0.0.1:${dev}/`, round);
        if (r.build.code === 0 && await until(`http://127.0.0.1:${prod}/`)) r.prod = await play(browser, `http://127.0.0.1:${prod}/`, round, `${round}-${app}`);
      }
      if (app === 'dioxus') {
        const target = path.join(HOME, 'dev/quillo-videos/.cache/rust-target', 'v210');   // one target: each build is copied out at once
        fs.rmSync(path.join(target, 'dx/groceries/release/web/public'), { recursive: true, force: true });
        r.build = step('dx build --release --platform web --debug-symbols false', run('dx', ['build', '--release', '--platform', 'web', '--debug-symbols', 'false'], dir, { CARGO_TARGET_DIR: target }));
        r.compileError = (r.build.out.match(/error\[E\d+\][^\n]*/g) || []).map((x) => x.trim());
        if (r.build.code === 0) {
          const pub = path.join(dir, 'public');
          fs.cpSync(path.join(target, 'dx/groceries/release/web/public'), pub, { recursive: true });
          const prod = port++;
          kids.push(spawn('node', [path.join(apps, 'serve.mjs'), pub, String(prod)], { stdio: 'ignore' }));
          if (await until(`http://127.0.0.1:${prod}/`)) r.prod = await play(browser, `http://127.0.0.1:${prod}/`, round, `${round}-${app}`);
        }
      }
      if (app === 'quillo') {
        r.check = step('quillo check main.qwe', run('quillo', ['check', 'main.qwe'], dir));
        const prod = port++;
        kids.push(spawn('quillo', ['run', 'main.qwe', '--port', String(prod), '--log', 'off'], { cwd: dir, stdio: 'ignore' }));
        if (await until(`http://127.0.0.1:${prod}/`, 20000)) r.prod = await play(browser, `http://127.0.0.1:${prod}/`, round, `${round}-${app}`);
        else r.run = step('quillo run main.qwe', run('quillo', ['run', 'main.qwe', '--port', String(port++), '--log', 'off'], dir, {}));
      }
    } finally {
      for (const k of kids) k.kill();
    }
    for (const k of ['lint', 'build', 'check']) if (r[k]) r[k] = { code: r[k].code, out: r[k].out.split('\n').slice(-40).join('\n') };
    fs.writeFileSync(path.join(here, `runs/${round}-${app}.txt`), log.join('\n') + '\n');
    results[`${round}-${app}`] = r;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    const show = (x) => x ? `${x.summary || x.error} ${x.rows != null ? `rows ${x.rows} last ${x.last}` : ''} alive ${x.alive} console ${x.consoleCount}${x.console.length ? ': ' + x.console[0] : ''}` : '-';
    console.log(`${round}/${app}: lint ${r.lint ? r.lint.code : '-'} build ${r.build ? r.build.code : '-'} check ${r.check ? r.check.code : '-'}\n  dev:  ${show(r.dev)}\n  prod: ${show(r.prod)}`);
  }
}
await browser.close();
