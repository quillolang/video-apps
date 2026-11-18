# Routes and 404s, Fresh and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` builds and runs each version and
keeps the results in `../assets/runs.json`. Measured on one machine.

- **When:** Thu Nov 19 2026 00:57:38 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Deno:** deno 2.9.8 (stable, release, aarch64-apple-darwin); **Fresh:** @fresh/core 2.3.3 (with Vite)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

The Trail Guide of videos 128, 143, 145, 146 and 147: six trails, a page for each at `/trails/<its number>`.

- **Fresh** (`fresh/`): the official starter, `deno run -Ar jsr:@fresh/init fresh` (Fresh 2.3.3), its demo routes,
  island and component taken out, `main.ts` down to `staticFiles()` and `fsRoutes()`, and its style sheet
  (`assets/styles.css`) the Trail Guide's. Added: `routes/index.tsx` (13 non-blank lines), `routes/trails/[id].tsx`
  (22 lines: a `RouteConfig` with `routeOverride: "/trails/:id([1-9][0-9]*)"`, a GET handler that finds the trail by
  `Number(ctx.params.id)` or throws `new HttpError(404, "No such trail")`, and the page) and `routes/_error.tsx`
  (16 lines, the site's own error page). `variants/naive/[id].tsx` is the first try: the same with no pattern,
  and no `_error.tsx` (shots.mjs puts it in place for that build, and puts the files back after). Built with
  `deno task build` and run with `deno task start` (8000). `deno check routes main.ts` passes.
- **Quillo** (`../app/main.qwe`, 25 lines, video 147's): `route GET /trails/:id(int)`, a 404 for a missing trail, and
  `route GET /*rest`. `quillo check`: `main.qwe: ok (3 routes, 2 functions, 0 components)`. On 8080.

`./status.sh <address>` asks six addresses with curl and prints the status and the page's heading.

## Fresh, the first try

`./status.sh http://localhost:8000`:

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
200  /trails/0x2  Eagle Ridge
404  /trails/abc  
404  /trails/999  
404  /nope
```

`curl -s -X POST -o /dev/null -w '%{http_code}\n' localhost:8000/trails/2`: `404`. Its 404s are the error's
message as plain text (`/trails/999`: "No such trail").

## Fresh, with the pattern and _error.tsx

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/0x2  404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

The POST: `405`.

## Quillo

`./status.sh http://localhost:8080`:

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/0x2  404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

The POST: `405`.
