# Go vs Quillo HTTP Benchmark: net/http, html/template and SQLite on 1, 4 and Every Core

The HTTP benchmark from the video comparing Go 1.27.4 (net/http, html/template, modernc.org/sqlite) with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). main.qwe is Quillo's; compare/go/main.go is Go's. compare/bench.mjs builds it and runs everything on compare/bench-core.mjs and load.rs (from quillolang/quillo-benchmarks); compare/runs/ has every result. For updates, see the official sites: https://go.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
node compare/make-db.mjs              # writes fortunes.db from main.qwe's list
./run.sh --port 8095 --log off         # Quillo's side: http://127.0.0.1:8095/fortunes

cd compare/go && go build -o server . && DB=../../fortunes.db PORT=8096 ./server      # GOMAXPROCS=1 for one core

# The benchmark (needs rustc, Node 24 and Go): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# Go for Windows: https://go.dev/dl/
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
