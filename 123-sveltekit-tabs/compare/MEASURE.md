# SvelteKit vs Quillo, two tabs on one list: the measurements

Every result in the video comes from the runs below, copied from what they printed. `../shots.mjs` runs them and keeps
the results in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 13:15:26 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **Svelte:** 5.57.3; **SvelteKit:** 3.3.1; **Vite:** 8.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **SvelteKit** (`svelte/`): Svelte's own starter, `npx sv create svelte --template minimal --no-types --no-add-ons --install npm`
  (sv 1.5.0; 12.9 s with an empty npm cache; 79 packages in package-lock.json). `src/app.css` (the same file as
  `../app/groceries.css`) is added and imported by `src/routes/+layout.svelte`, which also gets `<title>Groceries</title>`.
  The database is SQLite through Node's built-in `node:sqlite` (Node prints "ExperimentalWarning: SQLite is an
  experimental feature" when the server starts). `variants/` holds the three versions; `serve-variant.sh` copies one in:
  - `stale`: `classic/db.js`, `classic/+page.server.js` (load, and the actions add and toggle) and `stale.svelte`
    (forms with `use:enhance`), as SvelteKit's docs ("Loading data", "Form actions") have them;
  - `poll`: the same, with `poll.svelte`, which calls `refreshAll` from `$app/navigation` every 2 seconds in an `$effect`;
  - `live`: `live/vite.config.js` turns on `experimental.remoteFunctions` and `compilerOptions.experimental.async`
    (the docs, "Remote functions"); `live/groceries.remote.js` has `getItems = query.live(...)`, an async generator that
    yields the list and then waits for `once(changes, 'change')`; `live/db.js` adds `changes`, an EventEmitter;
    `live/+page.server.js` has the same actions, each emitting `change` after it writes, and no load;
    `live/+page.svelte` reads `await getItems()`.
- **Quillo** (`../app/main.qwe`): the same list. `state items = live(load_items)`; `add` and `toggle` are server fns.
  `quillo check` prints `main.qwe: ok (1 route, 3 functions, 1 component)`.

Non-blank lines a person writes (the CSS, the same on both sides, is not counted):
- stale: `svelte/variants/classic/db.js` 4, `svelte/variants/classic/+page.server.js` 14, `svelte/variants/stale.svelte` 24 (total 42)
- poll: `svelte/variants/classic/db.js` 4, `svelte/variants/classic/+page.server.js` 14, `svelte/variants/poll.svelte` 30 (total 48)
- live: `svelte/variants/live/db.js` 7, `svelte/variants/live/+page.server.js` 13, `svelte/variants/live/groceries.remote.js` 9, `svelte/variants/live/+page.svelte` 25 (total 54)
- quillo: `../app/main.qwe` 33 (total 33)
- live also adds 6 lines to `vite.config.js`.

SvelteKit's docs, "Rerunning load functions": a load function reruns when a `params` or `url` property it reads changes,
when a parent reruns, or when `invalidate(url)` or `refreshAll()` is called; "Form actions": "After an action runs, the
page will be re-rendered ... This means that your page's load functions will run after the action completes." "Remote
functions": "This feature is currently experimental, meaning it is likely to contain bugs and is subject to change
without notice." The docs' `query.live` example yields and then waits a second (`await wait(1000)`) in a loop.

## 1. Two tabs (race.mjs)

`seed.sh` puts Eggs, Bread (bought) and Apples in a fresh database before each app starts. `serve-variant.sh <version>
4183` builds each SvelteKit version for production (`vite build`; adapter-auto says it found no production environment)
and serves it with `vite preview`, one at a time; Quillo runs with `quillo run main.qwe --port 8183`.

`race.mjs` opens tab A and tab B, each in its own browser context. A adds Milk; `sent` is the moment A shows it. B is
checked every 50 ms for 10 s (`added` is after that). If B never shows it, B adds Milk too (`again`). Then both tabs sit
still for 60 s and every HTTP request and WebSocket message is counted (`idle`). Then A adds ten
more items at uneven times, and B is checked every 20 ms for each: the ms until B showed it.

### stale: B showed Milk after never (10 s); ten more: (not run); idle 60 s: A 0 requests (0 bytes), 0 WebSocket messages; B 0 requests (0 bytes), 0 messages; console: nothing; the page downloaded 45451 bytes to start (as sent)

| Step | Tab A | Tab B |
|---|---|---|
| open | Eggs, Bread, Apples (2 to buy) | Eggs, Bread, Apples (2 to buy) |
| sent | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples (2 to buy) |
| added | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples (2 to buy) |
| again | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk, Milk (4 to buy) |
| idle | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk, Milk (4 to buy) |

### poll: B showed Milk after 349 ms; ten more: [2004, 669, 1497, 2027, 796, 1351, 444, 1039, 223, 1736]; idle 60 s: A 30 requests (15870 bytes), 0 WebSocket messages; B 30 requests (15870 bytes), 0 messages; console: nothing; the page downloaded 45492 bytes to start (as sent)
Requests while idle: `GET /__data.json?x-sveltekit-trailing-slash=1&x-sveltekit-invalidated=01`

| Step | Tab A | Tab B |
|---|---|---|
| open | Eggs, Bread, Apples (2 to buy) | Eggs, Bread, Apples (2 to buy) |
| sent | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples (2 to buy) |
| added | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |
| idle | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |

### live: B showed Milk after 178 ms; ten more: [25, 29, 22, 24, 28, 24, 25, 25, 24, 23]; idle 60 s: A 0 requests (0 bytes), 0 WebSocket messages; B 0 requests (0 bytes), 0 messages; console: nothing; the page downloaded 49314 bytes to start (as sent)

| Step | Tab A | Tab B |
|---|---|---|
| open | Eggs, Bread, Apples (2 to buy) | Eggs, Bread, Apples (2 to buy) |
| sent | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |
| added | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |
| idle | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |

### quillo: B showed Milk after 177 ms; ten more: [2, 2, 4, 31, 25, 26, 25, 44, 5, 24]; idle 60 s: A 0 requests (0 bytes), 0 WebSocket messages; B 0 requests (0 bytes), 0 messages; console: nothing; the page downloaded 49834 bytes to start (as sent)

| Step | Tab A | Tab B |
|---|---|---|
| open | Eggs, Bread, Apples (2 to buy) | Eggs, Bread, Apples (2 to buy) |
| sent | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |
| added | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |
| idle | Eggs, Bread, Apples, Milk (3 to buy) | Eggs, Bread, Apples, Milk (3 to buy) |

## 2. JavaScript off (nojs.mjs)

Type Tea, press Add, open the page again.
- SvelteKit (stale): landed on `/?/add`; Tea added: True
- Quillo: landed on `/?`; Tea added: False (the page shows the list from
  the server; its form's `onsubmit` needs JavaScript)

## 3. From a cold start to the first page (shots.mjs)

Three times each, ms until `GET /` answered 200:
- SvelteKit's dev server, `npx vite dev` with `node_modules/.vite` removed first: [2295, 1831, 1854]
- `npx vite build`: [2494, 3103, 2304]; then `npx vite preview`: [1093, 689, 907]
- `quillo run main.qwe`: [30, 38, 31]
