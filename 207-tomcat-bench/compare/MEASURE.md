# How the numbers in the video were measured

Video: videos/207-tomcat-bench. Quillo 0.8.10 (`main.qwe`) against Apache Tomcat 11.0.29 on Java 27 (Homebrew's openjdk): a servlet and a JSP with JSTL, SQLite through sqlite-jdbc 3.54.1.0, with maxThreads 1, 4 (and -XX:ActiveProcessorCount the same) and as it ships (200), on one laptop: Apple M5, 10 cores, 16 GB, macOS.

## The five answers

The same five as [quillolang/quillo-benchmarks](https://github.com/quillolang/quillo-benchmarks)' server suite: `/text`,
`/json`, `/fortunes` (TechEmpower's Fortunes: twelve fortunes, one more added per request, sorted, as an escaped HTML table),
`/db` (the same page from SQLite, fortunes.db, written by `compare/make-db.mjs` from main.qwe's list) and `/compute` (a loop
of 10,000 multiplies and remainders, `{"total":335154}`).

compare/tomcat: src/bench (the servlet), WEB-INF/fortunes.jsp. compare/get-jars.sh downloads sqlite-jdbc and JSTL 3.0 from Maven Central (SHA-1 checked); compare/sides.mjs compiles and assembles the webapp and writes a CATALINA_BASE per run.

`node compare/run-curl.mjs` saved what each one-process server answers (`runs/run-curl-*.txt`, `runs/run-size.txt`,
`runs/page-*.html`).

## The runs

`node compare/bench.mjs 10 3 final` (output `runs/bench-final.txt`, every figure in `runs/bench-final.json`; the servers are
`compare/sides.mjs`'s, the engine `compare/bench-core.mjs`, the same in each of these videos). For each setting and answer:
a warm-up, then 10 seconds of `load.rs` (64 keep-alive connections from 4 threads, one request in flight on each). Three
rounds, alternating the order; medians shown. Cores used = the server's CPU time (ps, every process and thread it started)
/ wall time. Memory = the resident memory of all its processes, under load.

## What to keep in mind

- The laptop was busy with other work: load average 8.3 to 21.9 during the run (`runs/bench-final-load.txt`), and the
  load generator runs on the same laptop: for text and JSON at four cores it is near its own limit (about 175-190k a second).
- Tomcat gets 10 s of warm-up per answer (Quillo 2 s): the JIT needs it.
- The JVM's default max heap here is 4 GB, a quarter of RAM (runs/run-maxheap.txt); Tomcat's memory under load is 2-2.8 GB on the pages. -Xmx caps it; not set here (as it ships).
