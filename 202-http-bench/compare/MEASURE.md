# How the numbers in the video were measured

Video: *Dioxus vs Quillo HTTP Benchmark* (videos/202-http-bench). Quillo 0.8.10 (`app/main.qwe`) against Dioxus 0.7.10
fullstack (`compare/dioxus`), on one laptop: Apple M5, 10 cores (4 performance, 6 efficiency), 16 GB, macOS.

## The five answers

The same five as [quillolang/quillo-benchmarks](https://github.com/quillolang/quillo-benchmarks)' server suite:
`/text` (Hello, World!), `/json` ({"message":"Hello, World!"}), `/fortunes` (TechEmpower's Fortunes: twelve fortunes, one
more added per request, sorted, as an escaped HTML table), `/db` (the same page, the rows read from SQLite, `fortunes.db`),
and `/compute` (a loop of 10,000 multiplies and remainders, `{"total":335154}`).

- Quillo: routes and a view, as its guide writes them.
- Dioxus: server functions (`#[get]`) for text, JSON and compute; app pages (a `Routable` route each) for the two pages,
  rendered on the server with hydration; SQLite through rusqlite with a connection per thread, as Dioxus's tutorial does.
  `Text<String>` for plain text (a `String` alone goes out as JSON, in quotes). `std::hint::black_box` keeps the compiler
  from working out the loop's answer ahead of time.
- The same Dioxus server also serves the five as plain axum routes under `/axum/` (`dioxus::serve` with a router), the
  table rendered by `dioxus::ssr` from the same `Rows` component, with no hydration.

`compare/run-curl.sh` saved what each answers (`runs/run-*.txt`, `runs/page-*.html`): the same bytes for text, JSON and
compute; the Fortunes page is 1226 bytes from Quillo, 3073 from Dioxus's app page (3 scripts, 14 hydration markers),
1228 from the axum route.

## The runs

`node compare/bench.mjs 10 3 final` (output: `runs/bench-final.txt`, every figure in `runs/bench-final.json`). For each
setting and answer: a 2-second warm-up, then 10 seconds of `load.rs` (64 keep-alive connections from 4 threads, one
request in flight on each). Three rounds, alternating the order. Medians are shown. Settings:

| setting | what |
|---|---|
| quillo-1 | `quillo run` (one process, the default) |
| quillo-4 | `quillo run --instances 4` |
| dioxus-4 | the Dioxus server with `TOKIO_WORKER_THREADS=4` |
| dioxus-default | the Dioxus server as it ships (a worker per core) |
| axum-1 / axum-4 | the `/axum/` routes, 1 or 4 Tokio workers |

Cores used = the server's CPU time (ps, all threads) / wall time, during each 10 s run.

Dioxus 0.7.10 renders pages and runs server functions on a `LocalPoolHandle` sized to `available_parallelism()`
(dioxus-server src/server.rs, src/serverfn.rs; `compare/snippets/dioxus-server.rs`), whatever `TOKIO_WORKER_THREADS`
says: `node compare/one-worker.mjs` (`runs/run-dioxus-one-worker.txt`) shows 12 threads and 2.0 to 3.6 cores used with
one worker. So its fullstack layer has no one-core setting; the axum routes do.

## What to keep in mind

- The laptop was busy with other work: load average 8.7 to 18.8 during the final run (`runs/bench-final-load.txt`), and
  the load generator runs on the same laptop. For text and JSON at four cores, the generator (about 175 to 185k a second
  here) is the limit.
- `runs/bench-run1.*` is an earlier run of the first four settings, under the same conditions; it agrees within 13% on every figure.
- The Dioxus build: `sh compare/build.sh` (dx build --release --platform web; log in `runs/build-dioxus.txt`). `node compare/make-db.mjs` writes fortunes.db from the list in main.qwe; bench.mjs and run-curl.sh run it first.
