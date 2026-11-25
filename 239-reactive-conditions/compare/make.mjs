// Makes each mistake of mistakes.json in a copy of one app (build/<round>-<app>), then runs what that app's own tools
// run (the linter its starter came with, the build, quillo check), serves it, and plays its box with run.mjs, on the
// production build and, for the four Vite apps, on the dev server too. Results go in runs/variants.json.
//   node make.mjs [round ...] [--only=react,vue]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(here, 'build');   // not .build: oxlint skips hidden folders
const M = JSON.parse(fs.readFileSync(path.join(here, 'mistakes.json'), 'utf8'));
const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
const rounds = args.filter((a) => !a.startsWith('--')).length ? args.filter((a) => !a.startsWith('--')) : Object.keys(M).filter((k) => k !== '_');
const BOX = { zero: 'zero', zeroshow: 'zero', once: 'details', keep: 'keep' };
const HOME = process.env.HOME;
const scrub = (s) => s.split(HOME).join('/Users/you').replace(/\x1b\[[0-9;]*m/g, '');
const run = (cmd, a, cwd, env = {}) => {
  const r = spawnSync(cmd, a, { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 1 << 26, timeout: 900000 });
  return { cmd: [cmd, ...a].join(' '), code: r.status, out: scrub((r.stdout || '') + (r.stderr || '')).trimEnd() };
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (url, kid, ms = 180000) => { const t = Date.now(); while (Date.now() - t < ms) { if (kid && kid.exitCode !== null) return false; try { const r = await fetch(url); await r.arrayBuffer(); if (r.ok) return true; } catch {} await sleep(400); } return false; };
const skip = /\/(node_modules|dist|target|\.venv|build|\.build|shots|runs|__pycache__)$/;
const copy = (from, to) => fs.cpSync(from, to, { recursive: true, filter: (f) => !skip.test(f) && !f.endsWith('/.web/node_modules') && !f.endsWith('/.web/build') && !f.endsWith('/.quillo') });
const PY = path.join(here, '.venv/bin');
const QUILLO = path.resolve(here, '../app/.quillo/bin/quillo');
const resultsFile = path.join(here, 'runs/variants.json');
const results = fs.existsSync(resultsFile) ? JSON.parse(fs.readFileSync(resultsFile, 'utf8')) : {};
let port = 5211;

const play = (name, url, box, wait) => {
  const out = path.join(here, 'runs', `play-${name}.json`);
  run('node', [path.join(here, 'run.mjs'), name, url, '--only', box, '--shots', path.join(here, 'shots-variants'), '--out', out, '--wait', String(wait)], here);
  return fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : { error: 'no result' };
};

for (const round of rounds) {
  for (const [app, edits] of Object.entries(M[round])) {
    if (only.length && !only.includes(app)) continue;
    const name = `${round}-${app}`, dir = path.join(work, name);
    fs.rmSync(dir, { recursive: true, force: true });
    copy(app === 'quillo' ? path.resolve(here, '../app') : path.join(here, app), dir);
    if (fs.existsSync(path.join(here, app, 'node_modules'))) fs.symlinkSync(path.join(here, app, 'node_modules'), path.join(dir, 'node_modules'));
    if (app === 'reflex') fs.symlinkSync(path.join(here, 'reflex/.web/node_modules'), path.join(dir, '.web/node_modules'));
    for (const [file, from, to] of edits) {
      const f = path.join(dir, file), s = fs.readFileSync(f, 'utf8');
      if (!s.includes(from)) throw new Error(`${name}: ${file} has no ${JSON.stringify(from)}`);
      fs.writeFileSync(f, s.replace(from, to));
    }
    const r = { round, app, edits, when: new Date().toISOString() };
    const kids = [];
    const start = (cmd, a, cwd, env = {}) => { const k = spawn(cmd, a, { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] }); k.log = ''; k.stdout.on('data', (d) => { k.log += d; }); k.stderr.on('data', (d) => { k.log += d; }); kids.push(k); return k; };
    const box = BOX[round];
    try {
      if (['react', 'vue', 'svelte', 'solid'].includes(app)) {
        if (app === 'react') r.lint = run('npx', ['oxlint', 'src/App.jsx', 'src/main.jsx'], dir);
        if (app === 'vue') r.lint = run('npx', ['eslint', 'src'], dir);
        if (app === 'solid') r.lint = run('npx', ['oxlint', '-c', 'oxlint.config.js', 'src/App.jsx'], dir);
        r.build = run('npx', ['vite', 'build'], dir);
        const dev = port++, prod = port++;
        const dk = start('npx', ['vite', '--port', String(dev), '--strictPort', '--host', '127.0.0.1'], dir);
        if (await until(`http://127.0.0.1:${dev}/`, dk)) r.dev = play(`${name}-dev`, `http://127.0.0.1:${dev}/`, box, 500);
        if (r.build.code === 0) {
          start('node', [path.join(here, 'serve.mjs'), path.join(dir, app === 'solid' ? 'dist/client' : 'dist'), String(prod)], here);
          if (await until(`http://127.0.0.1:${prod}/`)) r.prod = play(name, `http://127.0.0.1:${prod}/`, box, 500);
        }
      } else if (app === 'leptos' || app === 'dioxus') {
        r.build = run('sh', [path.join(here, 'build-rust.sh'), app, dir, name], here);
        r.build.log = fs.readFileSync(path.join(here, `runs/build-${name}.txt`), 'utf8');
        if (r.build.code === 0) {
          const p = port++;
          start('node', [path.join(here, 'serve.mjs'), path.join(here, '.build', name), String(p)], here);
          if (await until(`http://127.0.0.1:${p}/`)) r.prod = play(name, `http://127.0.0.1:${p}/`, box, 500);
        }
      } else if (app === 'quillo') {
        r.check = run(QUILLO, ['check', 'main.qwe'], dir);
        const p = port++, k = start(QUILLO, ['run', 'main.qwe', '--port', String(p)], dir);
        if (await until(`http://127.0.0.1:${p}/`, k)) r.prod = play(name, `http://127.0.0.1:${p}/`, box, 500);
        r.server = scrub(k.log).slice(0, 4000);
      } else if (app === 'nicegui') {
        const p = port++, k = start(path.join(PY, 'python'), ['main.py'], dir, { PORT: String(p) });
        if (await until(`http://127.0.0.1:${p}/`, k)) r.prod = play(name, `http://127.0.0.1:${p}/`, box, 500);
        await sleep(300); r.server = scrub(k.log).slice(-4000);
      } else if (app === 'streamlit') {
        const p = port++, k = start(path.join(PY, 'streamlit'), ['run', 'app.py', '--server.port', String(p), '--server.address', '127.0.0.1', '--server.headless', 'true', '--browser.gatherUsageStats', 'false'], dir);
        if (await until(`http://127.0.0.1:${p}/`, k)) r.prod = play(name, `http://127.0.0.1:${p}/`, box, 900);
        await sleep(300); r.server = scrub(k.log).slice(-6000);
      } else if (app === 'reflex') {
        const p = port++, cfg = path.join(dir, 'rxconfig.py');
        fs.writeFileSync(cfg, fs.readFileSync(cfg, 'utf8').replaceAll('8134', String(p)));
        const k = start(path.join(PY, 'reflex'), ['run', '--env', 'prod', '--backend-host', '127.0.0.1'], dir, { REFLEX_TELEMETRY_ENABLED: 'false' });
        if (await until(`http://127.0.0.1:${p}/`, k, 300000)) r.prod = play(name, `http://127.0.0.1:${p}/`, box, 600);
        await sleep(500); r.server = scrub(k.log).slice(-6000); r.serverExit = k.exitCode;
      }
    } catch (e) { r.error = String(e.message).split('\n')[0]; }
    for (const k of kids) { try { process.kill(k.pid); } catch {} }
    await sleep(800);
    results[name] = r;
    fs.mkdirSync(path.dirname(resultsFile), { recursive: true });
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 1) + '\n');
    const v = (x) => x ? JSON.stringify(x.steps || x.error).slice(0, 300) : '-';
    console.log(`${name}: lint ${r.lint ? r.lint.code : '-'} build ${r.build ? r.build.code : '-'} check ${r.check ? r.check.code : '-'}\n  dev ${v(r.dev)}\n  prod ${v(r.prod)}`);
  }
}
