# Dioxus vs Quillo HTTP Benchmark: Rust Won the Loop, Quillo Won the Pages

The HTTP benchmark from the video comparing Dioxus 0.7.10 with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). app/ is Quillo's (main.qwe). compare/dioxus is the Dioxus fullstack app (server functions and app pages), with the same five as plain axum routes under /axum/. compare/load.rs is the load generator (from quillolang/quillo-benchmarks), compare/bench.mjs runs everything, and compare/runs/ has every result. For updates, see the official sites: https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
# Quillo's side: http://127.0.0.1:8095/fortunes (node compare/make-db.mjs writes fortunes.db first)
node compare/make-db.mjs
./run.sh --port 8095 --log off

# Dioxus (needs Rust and dx: cargo install dioxus-cli --locked)
sh compare/build.sh

# The benchmark (needs rustc and Node 24): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# Rust and dx install the same way on Windows (rustup from https://rustup.rs).
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
