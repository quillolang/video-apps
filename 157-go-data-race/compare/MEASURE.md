# A hit counter under load, Go and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs each command as the
video's terminals show it, in zsh, in a copy under the temp folder (shown as `~/bakery`), with `main.go` and `main.qwe`
changed between runs as the video edits them, and keeps what it printed in `../assets/runs.json`. Measured on one machine.

- **When:** Thu Nov 19 2026 00:16:30 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Go:** go version go1.27.4 darwin/arm64 (from go.dev); **Node:** v24.11.0 (load.mjs, stats.mjs)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh; `quillo` in the terminals is it)

## The apps

A hit counter: `GET /` adds one and says "Welcome! You're visitor number N.", and `GET /hits` gives the count.

- **Go** (`go/`, net/http): `variants/racy.go.txt` (17 non-blank lines), `var hits int` and `hits++` in the
  handler; `main.go` (18 lines), `var hits atomic.Int64` and `hits.Add(1)`; `variants/wait.go.txt`, which
  reads the count (`hits.Load() + 1`), posts the visit to the stats service, then stores it (`hits.Store(n)`). `go vet`:
  ok. Each is run as `main.go` with `go run .` (8090).
- **Quillo**: `../steps/v1` (7 lines), `hits += 1` in the route; `../steps/v2`, which works out
  `let n = hits + 1`, reports the visit to the stats service (`http.post`, a wait), then sets `hits = n`; `../app`
  (11 lines), `hits += 1` first, then the report. `quillo check`: steps/v1: `main.qwe: ok (2 routes, 0 functions, 0 components)`, steps/v2: `main.qwe: ok (2 routes, 1 function, 0 components)`, app: `main.qwe: ok (2 routes, 1 function, 0 components)`.
  Run with `quillo run main.qwe` (8080).
- **The stats service** (`stats.mjs`, 8099): answers each `POST /visit` and counts them (`GET /seen`).
- **`load.sh <port> [visits] [at once]`** (`load.mjs`): sends that many `GET /`, 100,000 and 200 at a time unless given,
  then asks `/hits` how many were counted. The runs with the stats service send 10,000: each visit makes a new connection
  to it, and at 100,000 visits a run the machine ran out of local ports (closed connections wait in TIME_WAIT), so some
  visits failed; shots.mjs also waits 35 seconds before each of those runs.

## Go, hits++

```
~/bakery/go $ go run . &> go.log &
~/bakery $ ./load.sh 8090
100,000 visits, 200 at a time, in 2.7 s (37,293 a second)
counted: 99,930: 70 lost
```

```
~/bakery/go $ go run -race . &> race.log &
~/bakery $ ./load.sh 8090 1000 10
1,000 visits, 10 at a time, in 0.1 s (11,022 a second)
counted: 822: 178 lost
~/bakery/go $ grep -E "DATA RACE|by goroutine|main.go" race.log | head -5
WARNING: DATA RACE
Read at 0x000100ec0620 by goroutine 14:
      ~/bakery/go/main.go:13 +0x30
Previous write at 0x000100ec0620 by goroutine 13:
      ~/bakery/go/main.go:13 +0x48
```

## Go, sync/atomic

```
~/bakery/go $ go run . &> go.log &
~/bakery $ ./load.sh 8090
100,000 visits, 200 at a time, in 2.8 s (35,943 a second)
counted: 100,000, every one
~/bakery/go $ go run -race . &> race.log &
~/bakery $ ./load.sh 8090 1000 10
1,000 visits, 10 at a time, in 0.1 s (16,306 a second)
counted: 1,000, every one
~/bakery/go $ grep -c "DATA RACE" race.log
0
```

## Quillo, hits += 1

```
~/bakery/quillo $ quillo run main.qwe &> quillo.log &
~/bakery $ ./load.sh 8080
100,000 visits, 200 at a time, in 2.7 s (36,462 a second)
counted: 100,000, every one
```

## Quillo, a wait in the middle (steps/v2), and counting first (app)

```
~/bakery $ node stats.mjs &
~/bakery/quillo $ quillo run main.qwe &> quillo.log &
~/bakery $ ./load.sh 8080 10000
10,000 visits, 200 at a time, in 0.6 s (16,999 a second)
counted: 467: 9,533 lost
~/bakery $ curl -s localhost:8099/seen
10000
```

```
~/bakery $ node stats.mjs &
~/bakery/quillo $ quillo run main.qwe &> quillo.log &
~/bakery $ ./load.sh 8080 10000
10,000 visits, 200 at a time, in 0.6 s (17,522 a second)
counted: 10,000, every one
```

## Go, the same read, wait, write (variants/wait.go.txt)

```
~/bakery $ node stats.mjs &
~/bakery/go $ go run -race . &> race.log &
~/bakery $ ./load.sh 8090 10000
10,000 visits, 200 at a time, in 0.7 s (14,636 a second)
counted: 71: 9,929 lost
~/bakery/go $ grep -c "DATA RACE" race.log
0
```

## Also seen

- Under the race detector, the plain `hits++` lost more (a thousand visits, ten at a time), since it changes the timing;
  the video's counts come from the plain build.
- A first version of steps/v2 wrote each visit to a SQLite table (`db.exec`) between reading and setting `hits`: nothing
  was lost, 10,000 of 10,000. In 0.8.6 that write didn't let another handler in; an `http.post` did.
