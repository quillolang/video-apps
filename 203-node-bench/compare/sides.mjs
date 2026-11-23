// The Node.js benchmark's servers: Quillo (main.qwe) against Node's own http module and Express 5 (node/), each on one process
// and on four (Node's cluster module; Quillo's --instances 4). The engine is bench-core.mjs.
//   (bench.mjs runs them; run-curl.mjs and the video's shots.mjs start them too)
// NODE names the node to run the servers with (inside quillo-videos: .cache/node26, Node 26.13.1).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
import { buildDir, detached, quilloSetting } from './bench-core.mjs';

export const here = path.dirname(fileURLToPath(import.meta.url)), build = buildDir(here, 'v203');
const own = path.resolve(here, '../../../.cache/node26/bin/node');
const node = process.env.NODE || (fs.existsSync(own) ? own : 'node');
const db = path.join(appDir, 'fortunes.db');
const nodeSetting = (file, procs) => ({
  key: `${file}-${procs}`, name: file, procs,
  start: (port) => [detached(node, [`${file}.mjs`, String(port), String(procs)], { cwd: path.join(here, 'node'), env: { ...process.env, DB: db, NODE_NO_WARNINGS: '1' } })],
});
export const settings = [quilloSetting(appDir, 1), quilloSetting(appDir, 4), nodeSetting('http', 1), nodeSetting('http', 4), nodeSetting('express', 1), nodeSetting('express', 4)];
export { appDir };
