// The PHP benchmark: Quillo (main.qwe) against plain PHP (php/) served two ways, each with one worker and with four:
// php-fpm behind nginx, as most PHP is served (each request starts fresh; OPcache keeps the compiled code), and
// FrankenPHP in worker mode (the program stays loaded between requests, as Quillo's does). Both with OPcache and its
// JIT on, files never checked for changes; the setups are quillo-benchmarks' (server/run.cjs). Engine: bench-core.mjs.
//   node compare/bench.mjs [seconds=10] [rounds=3] [label=final]
// PHP_FPM, NGINX and FRANKENPHP name the programs (else php-fpm, nginx and frankenphp on the PATH; inside
// quillo-videos, FrankenPHP 1.14.0 in .cache/dl-bench).
import { bench } from './bench-core.mjs';
import { here, build, settings } from './sides.mjs';

const [secs, rounds, label] = [Number(process.argv[2] || 10), Number(process.argv[3] || 3), process.argv[4] || 'final'];
await bench({ here, build, settings, secs, rounds, label });
