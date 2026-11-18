# SvelteKit vs Quillo, layouts and error pages: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 13:50:59 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **sv:** 1.5.0; **SvelteKit:** 3.3.1; **Svelte:** 5.57.3; **Vite:** 8.3.8; **adapter-auto:** 8.0.1
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **SvelteKit** (`svelte/`): the official starter, `npx sv create svelte --template minimal --no-types --no-add-ons --install npm`.
  `src/app.css` is the guide's styles (the same file as `../app/trails.css`), `src/lib/trails.js` the six trails (the same
  as `../app/trails.json`), and these files make the guide: `src/routes/+layout.svelte` (the nav, marking the current link
  from `page.url.pathname`, and `{@render children()}`), `+page.svelte`, `about/+page.svelte`, `trails/+page.svelte`,
  `trails/[id=integer]/+page.js` (a load function that finds the trail or calls `error(404, 'No such trail')`) and its
  `+page.svelte`, `src/params.js` (the `integer` matcher, with `defineParams`: digits only, handed on as a number), and two
  error pages, `src/routes/+error.svelte` (the site's) and `src/routes/trails/+error.svelte` (the trails section's).
  `variants/rest/+page.js` is the route SvelteKit's docs give for a section's own 404s ("Advanced routing", "404 pages"):
  `build-variants.sh` puts it in `src/routes/trails/[...rest]/` for the second version.
- **Quillo** (`../app/main.qwe`, with `trails.css` and `trails.json`): a `Layout` view, `NoTrail` and `NotFound` views,
  `route GET /trails/:id(int)`, `route GET /trails/*rest` for the trails section's 404s, and a last `route GET /*rest`.
  `quillo check` prints `main.qwe: ok (6 routes, 3 functions, 0 components)`.

Files that make the app (leaving out the styles, the trails' data and the starter's own `app.html`, `lib/index.js` and
favicon), with their non-blank lines. SvelteKit, with the `[...rest]` route (10 files in 6 folders,
78 lines):

- `src/params.js`: 4
- `src/routes/+error.svelte`: 6
- `src/routes/+layout.svelte`: 27
- `src/routes/+page.svelte`: 3
- `src/routes/about/+page.svelte`: 3
- `src/routes/trails/+error.svelte`: 7
- `src/routes/trails/+page.svelte`: 10
- `src/routes/trails/[...rest]/+page.js`: 4
- `src/routes/trails/[id=integer]/+page.js`: 7
- `src/routes/trails/[id=integer]/+page.svelte`: 7

Quillo: `main.qwe`: 50 (1 file).

The routes, before the `[...rest]` route (`find svelte/src/routes svelte/src/params.js -type f | sort`, in `compare/`):

```
svelte/src/params.js
svelte/src/routes/+error.svelte
svelte/src/routes/+layout.svelte
svelte/src/routes/+page.svelte
svelte/src/routes/about/+page.svelte
svelte/src/routes/trails/+error.svelte
svelte/src/routes/trails/+page.svelte
svelte/src/routes/trails/[id=integer]/+page.js
svelte/src/routes/trails/[id=integer]/+page.svelte
```

## Eight addresses, each way (visit.mjs, status.sh)

`build-variants.sh` builds both SvelteKit versions for production (adapter-auto, as the starter has it, finds no production
environment and builds for `vite preview`); shots.mjs serves them with `vite preview` (4181 section, 4182 rest) and Quillo
with `quillo run main.qwe` (8080). `visit.mjs` asks each address with `fetch` (the status), then opens it in Chromium (the
title, the first heading and the nav link marked as current). On every 404 page the one console line is Chromium's own
note of the status ("Failed to load resource: ... 404").

### SvelteKit, with the trails section's error page (section)
| Address | Status | First heading | Nav marks | Title |
|---|---|---|---|---|
| / | 200 | Trail Guide | Home | Trail Guide |
| /trails | 200 | Trails | Trails | Trails · Trail Guide |
| /trails/3 | 200 | Lantern Lake | Trails | Lantern Lake · Trail Guide |
| /about | 200 | About | About | About · Trail Guide |
| /trails/999 | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /trails/abc | 404 | 404: Not Found | Trails | Not Found · Trail Guide |
| /trails/nope | 404 | 404: Not Found | Trails | Not Found · Trail Guide |
| /nope | 404 | 404: Not Found | (none) | Not Found · Trail Guide |

/trails/abc and /trails/nope show the site's error page: no route matched them (`[id=integer]` takes digits only), and a
nested error page is only used under a route that matched.

### SvelteKit, with `trails/[...rest]/+page.js` too (rest)
| Address | Status | First heading | Nav marks | Title |
|---|---|---|---|---|
| / | 200 | Trail Guide | Home | Trail Guide |
| /trails | 200 | Trails | Trails | Trails · Trail Guide |
| /trails/3 | 200 | Lantern Lake | Trails | Lantern Lake · Trail Guide |
| /about | 200 | About | About | About · Trail Guide |
| /trails/999 | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /trails/abc | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /trails/nope | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /nope | 404 | 404: Not Found | (none) | Not Found · Trail Guide |

### Quillo
| Address | Status | First heading | Nav marks | Title |
|---|---|---|---|---|
| / | 200 | Trail Guide | Home | Trail Guide |
| /trails | 200 | Trails | Trails | Trails · Trail Guide |
| /trails/3 | 200 | Lantern Lake | Trails | Lantern Lake · Trail Guide |
| /about | 200 | About | About | About · Trail Guide |
| /trails/999 | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /trails/abc | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /trails/nope | 404 | 404: That trail isn't in the guide | Trails | Trail not found · Trail Guide |
| /nope | 404 | 404: Not Found | (none) | Not Found · Trail Guide |

`status.sh`, with curl (each version printed the same):

```
/trails/3     200
/trails/999   404
/trails/abc   404
/trails/nope  404
/nope         404
```

## A five-page visit (clicks.mjs)

`clicks.mjs` puts a small proxy in front of each app, so every byte the server sends is counted (as sent, compressed
where the server compresses: `vite preview` gzips the JavaScript files, `quillo run` gzips its pages), what a page fetches ahead of a click included. It opens `/`
in Chromium, then clicks Trails, Lantern Lake, About and Home, each after the pointer has rested on the link for 300 ms.
SvelteKit's starter has `data-sveltekit-preload-data="hover"`, so it loads a page's code when the pointer rests on its
link; Quillo's pages carry a small inline script (1334 characters) that asks for the page itself (speculation
rules), which Quillo's log shows as `GET /about -> 200 prefetch`. Kilobytes are 1,000 bytes. With JavaScript on
(`node clicks.mjs sveltekit=http://localhost:4182 quillo=http://127.0.0.1:8080 > clicks.json`, its table):

```
sveltekit open /               40.6 KB  38.1 KB JavaScript  1 page
         click Trails          1.4 KB  1.4 KB JavaScript
         click Lantern Lake    1.1 KB  1.1 KB JavaScript
         click About           0.3 KB  0.3 KB JavaScript
         click Trail Guide     0.0 KB
         five pages, in all   43.4 KB
quillo   open /                1.4 KB  1 page
         click Trails          1.4 KB  1 page
         click Lantern Lake    1.4 KB  1 page
         click About           1.4 KB  1 page
         click Trail Guide     1.4 KB  1 page
         five pages, in all    6.9 KB
```

With JavaScript turned off, every click arrived on both (the same headings): SvelteKit's pages are rendered on the server,
open / 2511 bytes, click Trails 1781 bytes, click Lantern Lake 1745 bytes, click About 1720 bytes, click Trail Guide 0 bytes (its home page came back from
the browser's cache the second time); Quillo's the same as with JavaScript on.
