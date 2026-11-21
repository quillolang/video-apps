// Starts the three Trail Guides, each from its own build, and stops only what it started.
//   import { start } from './servers.mjs';  const s = await start(['leptos', 'dioxus', 'quillo']); ... s.stop()
// The Rust builds are copied out of their target folders by build.sh into ../../../.cache/rust-target/v200/<side>/
// (a server binary and the files it serves); Quillo runs ../app (or .. in the published layout) with its own quillo.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
export const BUILDS = path.join(root, '.cache/rust-target/v200');
const appDir = fs.existsSync(path.join(here, '..', 'app', 'main.qwe')) ? path.join(here, '..', 'app') : path.join(here, '..');

export const PORTS = { leptos: 8210, 'leptos-async': 8212, dioxus: 8211, 'dioxus-tuned': 8213, quillo: 8200, 'quillo-title': 8201, 'quillo-fold': 8202 };

function command(side) {
  const port = PORTS[side];
  if (side === 'leptos' || side === 'leptos-async') {
    const dir = path.join(BUILDS, side);
    return { cmd: path.join(dir, 'trails'), args: [], cwd: dir, env: {
      LEPTOS_OUTPUT_NAME: 'trails', LEPTOS_SITE_ROOT: 'site', LEPTOS_SITE_PKG_DIR: 'pkg',
      LEPTOS_SITE_ADDR: `127.0.0.1:${port}`, LEPTOS_RELOAD_PORT: '3001', LEPTOS_ENV: 'PROD' } };
  }
  if (side === 'dioxus' || side === 'dioxus-tuned') {
    const dir = path.join(BUILDS, side);
    return { cmd: path.join(dir, 'server'), args: [], cwd: dir, env: { IP: '127.0.0.1', PORT: String(port) } };
  }
  const dir = side === 'quillo' ? appDir : path.join(here, side);
  return { cmd: path.join(appDir, '.quillo/bin/quillo'), args: ['run', 'main.qwe', '--port', String(port)], cwd: dir, env: {} };
}

export async function start(sides) {
  const kids = [];
  const stop = () => { for (const c of kids) { try { process.kill(-c.pid, 'SIGTERM'); } catch {} } kids.length = 0; };
  process.on('exit', stop);
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(1));
  const urls = {};
  for (const side of sides) {
    const { cmd, args, cwd, env } = command(side);
    const c = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, stdio: 'ignore', detached: true });
    kids.push(c);
    urls[side] = `http://127.0.0.1:${PORTS[side]}`;
  }
  for (const side of sides) {
    for (let i = 0; ; i++) {
      try { const r = await fetch(urls[side] + '/'); await r.arrayBuffer(); if (r.ok) break; } catch {}
      if (i > 300) { stop(); throw new Error(`${side}: nothing at ${urls[side]}`); }
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  return { urls, stop };
}

// From the command line: node servers.mjs leptos dioxus quillo   (runs until stopped; stopping it stops them)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const s = await start(process.argv.slice(2));
  console.log(Object.entries(s.urls).map(([k, v]) => `${k} ${v}`).join('\n'));
  setInterval(() => {}, 1 << 30);
}
