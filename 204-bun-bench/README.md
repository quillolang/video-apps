# Bun vs Quillo HTTP Benchmark: Bun.serve, Hono, and a reusePort Surprise

The HTTP benchmark from the video comparing Bun 1.4.5 (Bun.serve and Hono 4.13) with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). main.qwe is Quillo's; compare/bun has Bun.serve (serve.ts) and Hono (hono.tsx). compare/bench.mjs runs everything on compare/bench-core.mjs and load.rs (from quillolang/quillo-benchmarks); compare/runs/ has every result. For updates, see the official sites: https://bun.sh and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
node compare/make-db.mjs              # writes fortunes.db from main.qwe's list
./run.sh --port 8095 --log off         # Quillo's side: http://127.0.0.1:8095/fortunes

cd compare/bun && bun install && DB=../../fortunes.db bun serve.ts 8096    # or hono.tsx; add 4 for four processes

# The benchmark (needs rustc, Node 24 and Bun): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# Bun for Windows: https://bun.sh
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
