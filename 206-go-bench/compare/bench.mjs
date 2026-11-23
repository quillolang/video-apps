// The Go benchmark: Quillo (main.qwe) against Go's standard library (go/main.go: net/http, html/template, and SQLite
// through modernc.org/sqlite), built with go build. Go on one core (GOMAXPROCS=1), on four, and as it ships (every
// core); Quillo on one process and on four (--instances 4). The engine is bench-core.mjs.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]          (needs Go: https://go.dev/dl/)
import { bench } from './bench-core.mjs';
import { here, build, settings } from './sides.mjs';

const [secs, rounds, label] = [Number(process.argv[2] || 10), Number(process.argv[3] || 3), process.argv[4] || 'final'];
await bench({ here, build, settings, secs, rounds, label });
