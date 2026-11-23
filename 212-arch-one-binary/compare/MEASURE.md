# How the numbers in "One Binary, One Command" were measured

All on one Mac (Apple M5, 10 cores, macOS 26), with Quillo 0.8.10 (61997ab) from its release and Node 24.11.0.
Other work was running on the machine at the same time (load average about 15), so take the times as
"about", not exact; the gaps between them held in every run.

## Times and memory: `measure.mjs`

`node measure.mjs` (in the video's folder) copies `app/` to a scratch folder and runs each step 11 times,
keeping the median:

| Number | What is timed |
|---|---|
| `quillo check` | `quillo check main.qwe`, from start to exit |
| start to the first page | `quillo run main.qwe`, from start until `GET /` answers 200 (the database already there) |
| with a new database | the same, with no `app.db`: the migration runs first |
| save to new page | under `--watch`: `main.qwe` saved with a new heading, until `GET /` shows it |
| Express | `node server.js` in `compare/express`, from start until `GET /` answers 200 |
| memory | `ps -o rss=` of the server, after its first answer |

It writes `MEASURE.json`. The run in the video:

```json
{"check": 8.88, "first": 22.45, "fresh": 23.54, "reload": 40.89, "rss": 21151744,
 "express": {"node": "v24.11.0", "first": 108.04, "rss": 68386816}}
```

`compare/express/server.js` is the same page for scale: Express 5.3.0, the count in `node:sqlite` (built into
Node; it prints an "experimental" warning), the button's script written by hand. `npm install` there first.

## Sizes

| Number | How |
|---|---|
| Quillo on disk, 33,158,032 bytes | `wc -c .quillo/bin/quillo` |
| Quillo's download, 13,300,226 bytes | the release's `quillo-v0.8.10-aarch64-apple-darwin.tar.gz` (Content-Length) |
| Node's binary, 117,561,568 bytes | `bin/node` in Node's official `node-v24.11.0-darwin-arm64.tar.gz` (51,168,984 bytes, SHA-256 checked against SHASUMS256.txt). Not the `node` on this Mac, which is a universal (x86_64 + arm64) build, twice the size |
| Express's `node_modules`, 2,319,000 bytes | the sum of its 566 files' sizes, 65 packages, after `npm install express@5 --ignore-scripts` |

## Quillo's source, by part

`git show 61997ab:<file> | wc -l` in Quillo's repository: lexer.rs 867, parser.rs 5,266, interp.rs 8,362,
httpd.rs + server.rs 10,350, client.rs + client/runtime.js 16,361, check.rs 16,191; all of `src/` 141,033 lines
in 88 `.rs` and `.js` files. Cargo.toml names 48 dependencies; Cargo.lock lists 514 packages.
