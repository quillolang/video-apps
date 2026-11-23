// The Go benchmark's servers: Quillo (main.qwe) against Go's standard library (go/main.go: net/http, html/template, and SQLite
// through modernc.org/sqlite), built with go build. Go on one core (GOMAXPROCS=1), on four, and as it ships (every
// core); Quillo on one process and on four (--instances 4). The engine is bench-core.mjs.
//   (bench.mjs runs them; run-curl.mjs and the video's shots.mjs start them too)          (needs Go: https://go.dev/dl/)
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDir } from './make-db.mjs';   // writes fortunes.db beside main.qwe
import { buildDir, detached, quilloSetting } from './bench-core.mjs';

export const here = path.dirname(fileURLToPath(import.meta.url)), build = buildDir(here, 'v206');
const server = path.join(build, 'go-server');
execFileSync('go', ['build', '-o', server, '.'], { cwd: path.join(here, 'go'), stdio: 'inherit' });
const goSetting = (procs) => ({
  key: `go-${procs || 'default'}`, name: 'go', procs,
  start: (port) => [detached(server, [], { env: { ...process.env, PORT: String(port), DB: path.join(appDir, 'fortunes.db'), ...(procs ? { GOMAXPROCS: String(procs) } : {}) } })],
});
export const settings = [quilloSetting(appDir, 1), quilloSetting(appDir, 4), goSetting(1), goSetting(4), goSetting(0)];
export { appDir };
