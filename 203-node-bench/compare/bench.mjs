// The Node.js benchmark: Quillo (main.qwe) against Node's own http module and Express 5 (node/), each on one process
// and on four (Node's cluster module; Quillo's --instances 4). The engine is bench-core.mjs.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]
// NODE names the node to run the servers with (inside quillo-videos: .cache/node26, Node 26.13.1).
import { bench } from './bench-core.mjs';
import { here, build, settings } from './sides.mjs';

const [secs, rounds, label] = [Number(process.argv[2] || 10), Number(process.argv[3] || 3), process.argv[4] || 'final'];
await bench({ here, build, settings, secs, rounds, label });
