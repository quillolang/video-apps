// The Bun benchmark's servers: Quillo (main.qwe) against Bun.serve and Hono on Bun (bun/), each on one process and on four
// (processes sharing the port with reusePort; Quillo's --instances 4). The engine is bench-core.mjs.
//   (bench.mjs runs them; run-curl.mjs and the video's shots.mjs start them too)
// BUN names the bun to run the servers with (inside quillo-videos: Bun 1.4.5, in .cache/dl-bench).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
import { buildDir, detached, quilloSetting } from './bench-core.mjs';

export const here = path.dirname(fileURLToPath(import.meta.url)), build = buildDir(here, 'v204');
const own = path.resolve(here, '../../../.cache/dl-bench/bun/bun-darwin-aarch64/bun');
const bun = process.env.BUN || (fs.existsSync(own) ? own : 'bun');
const db = path.join(appDir, 'fortunes.db');
const bunSetting = (name, file, procs) => ({
  key: `${name}-${procs}`, name, procs,
  start: (port) => [detached(bun, [file, String(port), String(procs)], { cwd: path.join(here, 'bun'), env: { ...process.env, DB: db } })],
});
export const settings = [quilloSetting(appDir, 1), quilloSetting(appDir, 4), bunSetting('serve', 'serve.ts', 1), bunSetting('serve', 'serve.ts', 4), bunSetting('hono', 'hono.tsx', 1), bunSetting('hono', 'hono.tsx', 4)];
export { appDir };
