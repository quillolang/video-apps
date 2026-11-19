# Live updates, Express and server-sent events vs Quillo's live(): the measurements

Every result in the video comes from the runs below, copied from the run. `live.mjs` tried each side; its tables are
`live-<side>.txt`, and what each step saw is in `../assets/live-<side>.json`. Measured on one machine.

- **When:** Thu Nov 19 2026, 19:34 +08 (Express's `npm init`), the runs and screenshots after it
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0; **Express** 5.3.0, **better-sqlite3** 13.2.0, **compression** 1.8.2 (for the variant)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The two boards

Trail Club's conditions: three trails (Coastal Path open, Fern Gully muddy, Ridge Loop open). A ranger's form posts
`POST /status` with `id` and `status`; every open page shows the change, with no reload.

- **Express** (`express/`, `npm init`, `npm install express better-sqlite3`; 67 packages): `app.js` makes and fills the
  table, keeps the open pages (a `Set` of responses), and answers `GET /events` as server-sent events (MDN's way: the
  `text/event-stream` headers, flushed at once, the board sent as one `data:` event as the page opens, the page added,
  and `req.on('close')` to take it out again). `POST /status` updates the table, writes the board to every open page,
  and logs `sent to N open pages`. `public/index.html` opens an `EventSource('/events')` and builds the list from each
  event. Variants (`variants/`): `no-cleanup.js` (without the `req.on('close')` line), `compression.js` (with
  `app.use(compression())`; `npm install compression` added 8 packages), and `compression-flush.js` (that, and
  `res.flush()` after each event, as compression's README says under "Server-Sent Events").
- **Quillo** (`../app/`): `main.qwe`, a server fn `conditions()`, a `Board` component whose
  `state trails = live(conditions)` runs again whenever the trails table changes, on every open page, and
  `route POST /status { form: { id: int, status: str } }`; `migrations/001_trails.sql` makes and fills the table.
  `quillo check`: `main.qwe: ok (2 routes, 1 function, 1 component)`.

## The steps (live.mjs)

Each side from a fresh `club.db`, its server started by the script:

- **opened**: do the first two tabs show the board within 5 s?
- **two tabs**: Fern Gully set to closed: does each tab show it within 3 s, unreloaded?
- **late tab**: a third tab opened after that: does it show closed?
- **closed tabs**: ten more tabs opened and closed, then another change: what Express's log says it wrote to, with
  two tabs open (Quillo has no such log line)
- **restart**: the server stopped and started again under an open tab; five seconds later, a change: does the tab
  show it within 8 s?

```
$ node live.mjs express out.json
express
  opened:      the board shows
  two tabs:    tab A yes, tab B yes
  late tab:    yes
  closed tabs: 2 open, sent to 2; tab A yes
  restart:     yes
$ node live.mjs no-cleanup out.json
no-cleanup
  opened:      the board shows
  two tabs:    tab A yes, tab B yes
  late tab:    yes
  closed tabs: 2 open, sent to 13; tab A yes
  restart:     yes
$ node live.mjs compression out.json
compression
  opened:      the board stays empty
  two tabs:    tab A no, tab B no
  late tab:    no
  closed tabs: 2 open, sent to 2; tab A no
  restart:     no
$ node live.mjs compression-flush out.json
compression-flush
  opened:      the board shows
  two tabs:    tab A yes, tab B yes
  late tab:    yes
  closed tabs: 2 open, sent to 2; tab A yes
  restart:     yes
$ node live.mjs quillo out.json
quillo
  opened:      the board shows
  two tabs:    tab A yes, tab B yes
  late tab:    yes
  closed tabs: 2 open, no count in the log; tab A yes
  restart:     yes
```

Without `req.on('close')`, the 11 closed tabs stay in the set (2 open + 11 = 13 written to). With `compression()`, the
compressor holds the stream back to fill its window, so no event reaches the page, not even the first. The restart
step passes on Express because the browser's EventSource reconnects by itself and the server sends the board as a page
connects.

The screenshots (`../shots.mjs`, 420x230 at 3x): two tabs on each board before and after the change, and a tab of the
`compression()` variant three seconds after it opened, with its list still empty.

## Lines and packages

Non-blank lines, without `//` comments: `app.js` 28 and `public/index.html` 20 (48 for Express); `main.qwe` 12 and the
migration 9 (21 for Quillo). Express installs 67 packages (`npm install express better-sqlite3`, `install.txt`).
