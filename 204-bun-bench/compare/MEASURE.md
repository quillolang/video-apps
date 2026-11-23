# How the numbers in the video were measured

Video: videos/204-bun-bench. Quillo 0.8.10 (`main.qwe`) against Bun 1.4.5 (Bun.serve with its routes table, and Hono 4.13.20), on one process and four (processes sharing the port with reusePort), on one laptop: Apple M5, 10 cores, 16 GB, macOS.

## The five answers

The same five as [quillolang/quillo-benchmarks](https://github.com/quillolang/quillo-benchmarks)' server suite: `/text`,
`/json`, `/fortunes` (TechEmpower's Fortunes: twelve fortunes, one more added per request, sorted, as an escaped HTML table),
`/db` (the same page from SQLite, fortunes.db, written by `compare/make-db.mjs` from main.qwe's list) and `/compute` (a loop
of 10,000 multiplies and remainders, `{"total":335154}`).

compare/bun: serve.ts (Bun.serve), hono.tsx (Hono, its JSX for the page), fortunes.mjs. SQLite: bun:sqlite.

`node compare/run-curl.mjs` saved what each one-process server answers (`runs/run-curl-*.txt`, `runs/run-size.txt`,
`runs/page-*.html`).

## The runs

`node compare/bench.mjs 10 3 final` (output `runs/bench-final.txt`, every figure in `runs/bench-final.json`; the servers are
`compare/sides.mjs`'s, the engine `compare/bench-core.mjs`, the same in each of these videos). For each setting and answer:
a warm-up, then 10 seconds of `load.rs` (64 keep-alive connections from 4 threads, one request in flight on each). Three
rounds, alternating the order; medians shown. Cores used = the server's CPU time (ps, every process and thread it started)
/ wall time. Memory = the resident memory of all its processes, under load.

## What to keep in mind

- The laptop was busy with other work: load average 6.0 to 11.7 during the run (`runs/bench-final-load.txt`), and the
  load generator runs on the same laptop: for text and JSON at four cores it is near its own limit (about 175-190k a second).
- On macOS reusePort doesn't spread connections: `node compare/reuseport.mjs` (runs/run-reuseport.txt) shows one of the four Bun processes doing all the work. On Linux the kernel shares them out.
