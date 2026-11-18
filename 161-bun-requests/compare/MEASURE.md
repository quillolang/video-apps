# Requests a second, Hono on Bun and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine, with wrk on the same machine.

- **When:** Thu Nov 19 2026 00:46:33 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5 (10 cores: 4 performance, 6 efficiency), 16 GB, arm64; macOS 26.7.1 (25G241)
- **Bun:** 1.4.3; **Hono:** 4.13.19; **wrk:** wrk 4.2.0 [kqueue] Copyright (C) 2012 Will Glozer
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **The machine's load** (`uptime`, 1, 5 and 15 minutes): 5.31 10.94 13.44 before, 5.70 8.54 11.96 after. Busy processes
  (50% of a core or more) before: 97.5% quillo, 53.9% node; after: 100.0% quillo. The busy
  `quillo` was another session's (a fuzz run); the `node` before was shots.mjs itself starting. Nothing else of this
  session ran meanwhile.

## The sites

The Trail Guide of videos 128, 143 and 147: a page for each trail. Measured: `/trails/2`, Eagle Ridge.

- **Hono** (`hono/src/index.tsx`, video 147's, with the styles now in the page and `<!doctype html>`, as Quillo's page
  has them): `bun run src/index.tsx`, on 8090. Its page is 740 bytes.
- **Quillo** (`../app/main.qwe`, video 147's): `quillo run main.qwe`, on 8080. `quillo check`: `main.qwe: ok (3 routes, 2 functions, 0 components)`. Its page is
  2,074 bytes: the same HTML (checked by removing Quillo's `<script>` and comparing), and Quillo's
  link-prefetch script, 1,334 bytes.

`./bench.sh <port>`: `wrk -t4 -c100 -d10s --latency http://localhost:<port>/trails/2`, its 50% and 99% latency lines and
its requests a second (and any non-2xx answers or socket errors, of which there were none). The CPU-seconds are each
server's (every thread, from `ps -o time`) during the ten seconds.

## One process each: five rounds, in turn (Bun, Quillo, Bun, ...)

Hono on Bun:

| round | requests a second | 50% | 99% | CPU-seconds |
|---|---|---|---|---|
| 1 | 112,329 | 0.830 ms | 9.460 ms | 10.5 |
| 2 | 115,267 | 0.824 ms | 1.680 ms | 10.7 |
| 3 | 115,882 | 0.830 ms | 1.650 ms | 10.7 |
| 4 | 112,948 | 0.850 ms | 1.680 ms | 10.7 |
| 5 | 111,991 | 0.850 ms | 1.750 ms | 10.7 |

Quillo:

| round | requests a second | 50% | 99% | CPU-seconds |
|---|---|---|---|---|
| 1 | 175,481 | 0.551 ms | 0.870 ms | 10 |
| 2 | 174,427 | 0.559 ms | 0.735 ms | 10.1 |
| 3 | 174,960 | 0.562 ms | 0.667 ms | 10.1 |
| 4 | 174,512 | 0.564 ms | 0.677 ms | 10.1 |
| 5 | 175,005 | 0.563 ms | 0.649 ms | 10.1 |

Medians: Bun 112,948 a second (0.830 ms, 1.680 ms), Quillo
174,960 (0.562 ms, 0.677 ms). The video's terminals show
the median round of each, as bench.sh printed it:

```
     50%    0.85ms
     99%    1.68ms
Requests/sec: 112948.48
```

```
     50%  562.00us
     99%  667.00us
Requests/sec: 174960.39
```

## All the cores: three rounds, in turn

Quillo with `--instances 4` (one process; its CPU-seconds):

| round | requests a second | 50% | 99% | CPU-seconds |
|---|---|---|---|---|
| 1 | 200,280 | 0.467 ms | 0.751 ms | 39.2 |
| 2 | 199,371 | 0.471 ms | 0.765 ms | 39.1 |
| 3 | 199,581 | 0.468 ms | 0.754 ms | 39.1 |

Hono on Bun, four processes of `src/reuse.tsx` (index.tsx with `reusePort: true`), each one's CPU-seconds:

| round | requests a second | 50% | 99% | CPU-seconds, each process |
|---|---|---|---|---|
| 1 | 112,084 | 0.850 ms | 1.710 ms | 0 + 0 + 0 + 10.7 |
| 2 | 113,914 | 0.836 ms | 1.730 ms | 10.7 + 0 + 0 + 0 |
| 3 | 113,197 | 0.832 ms | 2.170 ms | 0 + 0 + 0 + 10.6 |

On this Mac, all four processes listened on 8090, and one of them took every request.
