// What each Groceries app costs to write and to ship: the apps are videos/208-reactivity-models/compare/ (and its app/
// for Quillo). For each it measures, and prints as a table (and JSON with JSON_FILE=...):
//   starter    the files a fresh starter gives (made again in a scratch folder by the same command, lockfiles counted)
//   code       the app's own code, the page's HTML shell included (index.html; Solid's Document.jsx; Quillo's route):
//              its files, and their lines that aren't blank (the shared items, stylesheet and
//              count.js left out, and the lines that only measure: ran(...), onBeforeUpdate(...), their imports)
//   packages   what npm installed (node_modules/.package-lock.json's entries) and node_modules' size on disk;
//              for Dioxus the crates the web build compiled (Cargo.lock lists more: desktop, mobile), and the
//              release build's target folder; the direct dependency is dioxus (wasm-bindgen is only for counting)
//   build      a production build from cold (Vite's cache and dist removed; Dioxus in an empty CARGO_TARGET_DIR,
//              crates already downloaded), and again with nothing changed
//   shipped    the bytes a browser downloads to show the page, as sent (gzip): JavaScript and wasm, and everything,
//              from videos/208's assets/runs.json
//   node size.mjs <scratch dir>
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const apps = path.resolve(here, '../../208-reactivity-models/compare');
const qapp = path.resolve(here, '../../208-reactivity-models/app');
const scratch = path.resolve(process.argv[2] || fs.mkdtempSync('/tmp/v209-'));
fs.mkdirSync(scratch, { recursive: true });
const sh = (cmd, args, cwd, env = {}) => {
  const t = performance.now();
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 1 << 26 });
  if (r.status) throw new Error(`${cmd} ${args.join(' ')} in ${cwd}: ${r.stderr || r.stdout}`);
  return { out: r.stdout + r.stderr, secs: (performance.now() - t) / 1000 };
};
const du = (p) => Number(execFileSync('du', ['-sk', p], { encoding: 'utf8' }).split('\t')[0]) * 1024;
const files = (dir, skip = /node_modules|\/dist|\/target|\/\.git\/|\.build/) => {
  const out = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (skip.test(f)) continue; e.isDirectory() ? walk(f) : out.push(f); } };
  walk(dir);
  return out.sort();
};

const STARTERS = {
  react: ['npm', ['create', 'vite@9.3.4', 'react', '--', '--template', 'react', '--no-interactive', '--no-immediate']],
  vue: ['npm', ['create', 'vue@3.24.0', 'vue', '--', '--eslint']],
  svelte: ['npm', ['create', 'vite@9.3.4', 'svelte', '--', '--template', 'svelte', '--no-interactive', '--no-immediate']],
  solid: ['npm', ['create', 'solid@0.13.0', '--', '-p', 'solid', '--solid', '-t', 'bare', '--js', '--no-devtools']],
  dioxus: ['dx', ['new', 'dioxus', '--subtemplate', 'Bare-Bones', '--yes', '--vcs', 'none', '-o', 'is_fullstack=false', '-o', 'is_router=false', '-o', 'is_tailwind=false', '-o', 'default_platform=web']],
  quillo: ['quillo', ['new', 'quillo', '--minimal']],
};
const CODE = {
  react: ['react/index.html', 'react/src/App.jsx', 'react/src/main.jsx'],
  vue: ['vue/index.html', 'vue/src/App.vue', 'vue/src/components/GroceryRow.vue', 'vue/src/main.js'],
  svelte: ['svelte/index.html', 'svelte/src/App.svelte', 'svelte/src/Row.svelte', 'svelte/src/main.js'],
  solid: ['solid/src/App.jsx', 'solid/src/Document.jsx'],
  dioxus: ['dioxus/src/main.rs'],
  quillo: ['main.qwe'],
};
const MEASURING = /\bran\(|onBeforeUpdate\(|from '\.\/count\.js'|from '\.\.\/count\.js'|^mod count;|^use count::ran;|js\("ran"/;
const result = {};
for (const name of Object.keys(STARTERS)) {
  const r = (result[name] = {});
  // the starter, fresh
  const dir = path.join(scratch, 'starters');
  fs.mkdirSync(dir, { recursive: true });
  fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  sh(STARTERS[name][0], STARTERS[name][1], dir);
  r.starterFiles = files(path.join(dir, name), /node_modules|\/\.git\//).map((f) => path.relative(path.join(dir, name), f));
  // the code written
  const base = name === 'quillo' ? qapp : apps;
  r.code = CODE[name].map((f) => {
    const lines = fs.readFileSync(path.join(base, f), 'utf8').split('\n');
    const kept = lines.filter((l) => l.trim() !== '' && !MEASURING.test(l.trim()));
    return { file: f, lines: kept.length, chars: kept.join('\n').length };
  });
  r.codeLines = r.code.reduce((a, c) => a + c.lines, 0);
  r.codeFiles = r.code.length;
  // packages
  if (fs.existsSync(path.join(apps, name, 'package.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(apps, name, 'package.json'), 'utf8'));
    r.direct = Object.keys(pkg.dependencies || {}).length + Object.keys(pkg.devDependencies || {}).length;
    const lock = JSON.parse(fs.readFileSync(path.join(apps, name, 'node_modules/.package-lock.json'), 'utf8'));
    r.installed = Object.keys(lock.packages).filter((k) => k.startsWith('node_modules/')).length;
    r.modulesBytes = du(path.join(apps, name, 'node_modules'));
  }
  if (name === 'dioxus') {
    const lock = fs.readFileSync(path.join(apps, 'dioxus/Cargo.lock'), 'utf8');
    r.direct = (fs.readFileSync(path.join(apps, 'dioxus/Cargo.toml'), 'utf8').split('[dependencies]')[1].split('[')[0].match(/^\w[\w-]* =/gm) || []).length;
    r.locked = (lock.match(/^\[\[package\]\]/gm) || []).length - 1;
  }
  if (name === 'quillo') { r.direct = 0; r.installed = 0; r.modulesBytes = 0; }
  // builds
  if (['react', 'vue', 'svelte', 'solid'].includes(name)) {
    const cwd = path.join(apps, name);
    fs.rmSync(path.join(cwd, 'dist'), { recursive: true, force: true });
    fs.rmSync(path.join(cwd, 'node_modules/.vite'), { recursive: true, force: true });
    r.buildCold = sh('npx', ['vite', 'build'], cwd).secs;
    r.buildAgain = sh('npx', ['vite', 'build'], cwd).secs;
  }
  if (name === 'dioxus') {
    const target = path.join(scratch, 'dx-target');
    fs.rmSync(target, { recursive: true, force: true });
    const env = { CARGO_TARGET_DIR: target };
    const cold = sh('dx', ['build', '--release', '--platform', 'web', '--debug-symbols', 'false'], path.join(apps, 'dioxus'), env);
    r.buildCold = cold.secs;
    r.crates = Number((cold.out.match(/Compiled \[\s*\d+\/(\d+)\]/) || [])[1]);
    r.installed = r.crates;
    r.buildAgain = sh('dx', ['build', '--release', '--platform', 'web', '--debug-symbols', 'false'], path.join(apps, 'dioxus'), env).secs;
    r.targetBytes = du(target);
  }
  if (name === 'quillo') {
    r.check = sh('quillo', ['check', 'main.qwe'], qapp).secs;
  }
}
// shipped: from 208's shots.mjs (each URL a page used, downloaded again asking for gzip; count.js left out)
const shots = JSON.parse(fs.readFileSync(path.resolve(here, '../../208-reactivity-models/assets/runs.json'), 'utf8')).shots;
for (const name of Object.keys(result)) { result[name].shippedCode = shots[name].code; result[name].shippedAll = shots[name].total; }
const version = 'see 208';
const kb = (b) => (b / 1024).toFixed(1);
const mb = (b) => (b / 1048576).toFixed(1);
console.log(new Date().toISOString().slice(0, 16));
console.log('app      starter files  code files/lines  direct/installed  node_modules  build cold/again (s)  shipped JS+wasm / all (KB)');
for (const [n, r] of Object.entries(result)) {
  console.log(`${n.padEnd(9)}${String(r.starterFiles.length).padEnd(15)}${`${r.codeFiles} / ${r.codeLines}`.padEnd(18)}${`${r.direct} / ${r.installed}`.padEnd(18)}${(r.modulesBytes != null ? mb(r.modulesBytes) + ' MB' : n === 'dioxus' ? `target ${mb(r.targetBytes)} MB` : '').padEnd(14)}${(r.buildCold != null ? `${r.buildCold.toFixed(1)} / ${r.buildAgain.toFixed(1)}` : 'none').padEnd(22)}${kb(r.shippedCode)} / ${kb(r.shippedAll)}`);
}
if (process.env.JSON_FILE) fs.writeFileSync(process.env.JSON_FILE, JSON.stringify({ result }, null, 2));
