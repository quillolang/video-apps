# PHP vs Quillo HTTP Benchmark: php-fpm, nginx and FrankenPHP Workers, Measured

The HTTP benchmark from the video comparing PHP (php-fpm 8.5 behind nginx, and FrankenPHP 1.14's worker mode) with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). main.qwe is Quillo's; compare/php has the PHP app (app.php, from quillolang/quillo-benchmarks), with index.php for php-fpm and worker.php for FrankenPHP. compare/sides.mjs writes each server's configuration; compare/bench.mjs runs everything on compare/bench-core.mjs and load.rs; compare/runs/ has every result. For updates, see the official sites: https://www.php.net, https://frankenphp.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
node compare/make-db.mjs              # writes fortunes.db from main.qwe's list
./run.sh --port 8095 --log off         # Quillo's side: http://127.0.0.1:8095/fortunes

# The benchmark (needs rustc, Node 24, php-fpm, nginx and frankenphp on the PATH): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# PHP for Windows: https://windows.php.net
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
