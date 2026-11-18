# A Data Race in Go vs Quillo: hits++, go run -race, and Lost Visits

The bakery's hit counter in Quillo (main.qwe, on 8080): every visit adds one, is reported to a stats service (compare/stats.mjs, on 8099), and /hits says how many. compare/go is the same counter in Go 1.27.4 with net/http: main.go with sync/atomic, variants/racy.go.txt with a plain `hits++` (a data race), and variants/wait.go.txt, which reads the count, reports the visit, and sets the count (no data race, but lost visits). compare/load.sh sends 100,000 visits, 200 at a time, and asks how many were counted; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
(cd compare && node stats.mjs &)   # the stats service, on 8099
./run.sh   # Quillo's counter, on 8080
(cd compare/go && go run .)   # Go's, on 8090
(cd compare && ./load.sh 8080 && ./load.sh 8090)
# Windows (PowerShell), with Quillo from quillolang.org and Go from go.dev: quillo run main.qwe
```

## The versions in the video

The video builds the Quillo side in steps. Each is a folder that runs on its own (`cd steps/v1 && ./run.sh`; v2 and this folder report to compare/stats.mjs, on 8099):

- [`steps/v1`](steps/v1): `hits += 1`: one handler runs at a time, so 100,000 visits, 200 at a time, all count
- [`steps/v2`](steps/v2): each visit reported to the stats service, with hits read before that wait and set after it: most visits are lost
- this folder: counting first, then reporting: every visit counts

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
