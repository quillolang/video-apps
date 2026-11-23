# How the numbers in the video were measured

Video: videos/206-go-bench. Quillo 0.8.10 (`main.qwe`) against Go 1.27.4's standard library (net/http, html/template, encoding/json) with modernc.org/sqlite v1.63.0, at GOMAXPROCS 1, 4 and every core, on one laptop: Apple M5, 10 cores, 16 GB, macOS.

## The five answers

The same five as [quillolang/quillo-benchmarks](https://github.com/quillolang/quillo-benchmarks)' server suite: `/text`,
`/json`, `/fortunes` (TechEmpower's Fortunes: twelve fortunes, one more added per request, sorted, as an escaped HTML table),
`/db` (the same page from SQLite, fortunes.db, written by `compare/make-db.mjs` from main.qwe's list) and `/compute` (a loop
of 10,000 multiplies and remainders, `{"total":335154}`).

compare/go/main.go. SQLite: modernc.org/sqlite, pure Go (the C driver, mattn/go-sqlite3, needs cgo; not measured).

`node compare/run-curl.mjs` saved what each one-process server answers (`runs/run-curl-*.txt`, `runs/run-size.txt`,
`runs/page-*.html`).

## The runs

`node compare/bench.mjs 10 3 final` (output `runs/bench-final.txt`, every figure in `runs/bench-final.json`; the servers are
`compare/sides.mjs`'s, the engine `compare/bench-core.mjs`, the same in each of these videos). For each setting and answer:
a warm-up, then 10 seconds of `load.rs` (64 keep-alive connections from 4 threads, one request in flight on each). Three
rounds, alternating the order; medians shown. Cores used = the server's CPU time (ps, every process and thread it started)
/ wall time. Memory = the resident memory of all its processes, under load.

## What to keep in mind

- The laptop was busy with other work: load average 6.8 to 17.0 during the run (`runs/bench-final-load.txt`), and the
  load generator runs on the same laptop: for text and JSON at four cores it is near its own limit (about 175-190k a second).
- html/template escapes by context (and escapes '+' as &#43;); encoding/json's Encoder adds a newline.
