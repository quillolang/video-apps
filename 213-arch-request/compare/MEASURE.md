# How the numbers in "A Request's Journey" were measured

One Mac (Apple M5, 10 cores, macOS 26), Quillo 0.8.10 (61997ab) from its release, Node 24.11.0 with Express 5.3.0.
Other work was running on the machine at the same time. `MEASURE.json` is the run the video shows.

`node compare/measure.mjs` (macOS or Linux: it reads memory with `ps`) starts a fresh server for each experiment,
on port 8241, and a slow API of its own (`upstream.mjs`, port 8242, one second an answer). Before it: `sh
get-quillo.sh` (so `.quillo/bin/quillo` is there) and `npm install` in `compare/express`.

| Experiment | What it does | Rounds |
|---|---|---|
| waits | 100 requests to `/slow` (`sleep(1000)`) at once; `/fast` 100 ms later. How long `/fast` took; when the last slow one finished; how many finished within 1.5 s | 5, median |
| network | the same with `/weather`, which calls the slow API (`http.get`; `fetch` in Express) | 5, median |
| compute | `/busy` (computes for 800 ms by the clock, `spin(800)`); `/fast` 50 ms later | 11, median |
| both | `/both`, two `spin(800)` in `parallel(...)` (`Promise.all` in Express); `/fast` 50 ms later | 3, median |
| memory | the server's RSS idle, and the most it reached (sampled every 50 ms) while 1,000 requests to `/slow` slept | 1 |
| count | 1,000 requests to `/count` (`hits += 1`) at once; the highest count any answer showed | 1 |
| lost | 200 requests to `/lost` (read `hits`, `sleep(5)`, write it + 1) at once | 1 |
| safe | 200 requests to `/safe` (`sleep(5)`, then `hits += 1`) at once | 1 |
| limit | `/busy` on a server started with `--max-compute 500ms`: its status and time | 1 |

Each is run on four sides: Quillo as it starts (64 workers), `--workers 128`, `--instances 2`, and Express.

What the run shows, in short (milliseconds unless said):

| | Quillo | --workers 128 | --instances 2 | Express |
|---|---|---|---|---|
| `/fast` while 100 sleep | 0.5 | 0.5 | 0.8 | 0.7 |
| `/fast` while 100 call the API | 0.6 | 2.8 | 1.5 | 1.0 |
| last of 100 API calls | 2,023 | 1,016 | 1,014 | 1,035 |
| of them, done within 1.5 s | 65 | 100 | 100 | 100 |
| `/fast` while `/busy` computes | 750 | 749 | 1.1 | 750 |
| `/both` took / `/fast` meanwhile | 1,607 / 1,562 | 1,602 / 1,551 | 1,604 / 1 | 1,601 / 1,551 |
| memory idle → 1,000 asleep (MB) | 16.0 → 38.0 | 16.0 → 38.0 | 16.4 → 38.8 | 66.8 → 90.9 |
| count after 1,000 | 1,000 | 1,000 | 500 (each instance its own) | 1,000 |
| lost after 200 | 1 | 1 | 1 | 3 |
| safe after 200 | 200 | 200 | 100 (each instance its own) | 200 |
| `/busy` under `--max-compute 500ms` | 500, after 514 ms | | | |

The terminal scenes' output (the routes, the 404 and 405, the `--max-compute` error) is in `logs/log-routes.txt` and
`logs/log-limit.txt`, as `quillo run` printed it; `logs/measure-run.txt` holds lines of this run's output.
