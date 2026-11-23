# Node.js vs Quillo HTTP Benchmark: node:http, Express 5 and a Cluster, Measured

The HTTP benchmark from the video comparing Node.js 26.13.1 (node:http and Express 5.3) with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). main.qwe is Quillo's; compare/node has node:http (http.mjs) and Express (express.mjs), sharing the page and the data (fortunes.mjs). compare/bench.mjs runs everything on compare/bench-core.mjs and load.rs (from quillolang/quillo-benchmarks); compare/runs/ has every result. For updates, see the official sites: https://nodejs.org and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
node compare/make-db.mjs              # writes fortunes.db from main.qwe's list
./run.sh --port 8095 --log off         # Quillo's side: http://127.0.0.1:8095/fortunes

cd compare/node && npm install && node http.mjs 8096    # or express.mjs; add 4 for a cluster of four

# The benchmark (needs rustc and Node 24 or later): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# Node.js for Windows: https://nodejs.org
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
