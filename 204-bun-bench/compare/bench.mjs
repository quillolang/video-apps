// The Bun benchmark: Quillo (main.qwe) against Bun.serve and Hono on Bun (bun/), each on one process and on four
// (processes sharing the port with reusePort; Quillo's --instances 4). The engine is bench-core.mjs.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]
// BUN names the bun to run the servers with (inside quillo-videos: Bun 1.4.5, in .cache/dl-bench).
import { bench } from './bench-core.mjs';
import { here, build, settings } from './sides.mjs';

const [secs, rounds, label] = [Number(process.argv[2] || 10), Number(process.argv[3] || 3), process.argv[4] || 'final'];
await bench({ here, build, settings, secs, rounds, label });
