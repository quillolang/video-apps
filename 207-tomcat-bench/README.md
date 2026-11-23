# Tomcat vs Quillo HTTP Benchmark: Servlets, JSP and 2 GB of Heap, Measured

The HTTP benchmark from the video comparing Apache Tomcat 11.0.29 on Java 27 (a servlet and a JSP page with JSTL) with Quillo 0.8.10: the same five answers (text, JSON, TechEmpower's Fortunes, Fortunes from SQLite, a loop of arithmetic). main.qwe is Quillo's; compare/tomcat has the servlet (src/bench) and the JSP (WEB-INF/fortunes.jsp); compare/get-jars.sh downloads sqlite-jdbc and JSTL from Maven Central, checked against their SHA-1s. compare/bench.mjs builds the webapp and runs everything on compare/bench-core.mjs and load.rs (from quillolang/quillo-benchmarks); compare/runs/ has every result. For updates, see the official sites: https://tomcat.apache.org and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
node compare/make-db.mjs              # writes fortunes.db from main.qwe's list
./run.sh --port 8095 --log off         # Quillo's side: http://127.0.0.1:8095/fortunes

# The benchmark (needs rustc, Node 24, a JDK 21 or later and Tomcat 11: TOMCAT_HOME, BENCH_JAVA_HOME): 10 s each, 3 rounds
node compare/bench.mjs 10 3 mine

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8095
# Tomcat for Windows: https://tomcat.apache.org
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
