# Islands, Fresh and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:48:20 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Deno:** 2.9.8; **Fresh:** @fresh/core 2.3.3; **Preact:** 10.29.8; **@preact/signals:** 2.11.4; **Vite:** 7.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Playwright's Chromium

## The apps

- **Fresh** (`fresh/`): the official starter, `deno run -Ar jsr:@fresh/init fresh` (Fresh 2.3.3, with Vite), unchanged:
  its home page (`routes/index.tsx`, a signal starting at 3 and the `Counter` island), `islands/Counter.tsx` and
  `components/Button.tsx` (59 non-blank lines together). Added: `routes/about.tsx`, a page with no island. Built with
  `deno task build` and served with `deno task start` (`deno serve -A _fresh/server.js`, on 8000). The build's client
  JavaScript, as Vite printed it:

```
_fresh/client/assets/fresh-island__Counter-DJbHjyow.js 0.82 kB │ gzip: 0.50 kB
_fresh/client/assets/preact.module-DADv7Q-6.js 11.03 kB │ gzip: 4.64 kB
_fresh/client/assets/client-entry-wPLSZtLp.js 35.30 kB │ gzip: 13.28 kB
```

- **Quillo** (`../app/main.qwe`, 34 lines): the starter's styles (`../app/styles.css`, with `.fresh-gradient` renamed
  `.gradient`), a `component Counter(start: int)` with `state count = start` and the same two buttons, a `Page` view, the
  home page with `<Counter start={3}/>`, and `/about` with no component. `quillo check` prints `main.qwe: ok (2 routes,
  1 function, 1 component)`. Run with `quillo run main.qwe` (8080).

Both counters start at 3; after two clicks on +1, both say 5.

## The JavaScript (js.mjs)

`js.mjs` loads each page in Chromium and counts, through the DevTools protocol, each script file the page loads (its
size, and the bytes sent for it) and each script written into the page; then it clicks +1 and counts the script files
that came for it. `node js.mjs http://localhost:8000/ http://localhost:8080/`:

```
http://localhost:8000/  as it loads: 47.3 KB of JavaScript (3 files, 1 in the page); 53.0 KB sent in all
  after a click on +1: the counter says 4; 0 more files
http://localhost:8080/  as it loads: 3.3 KB of JavaScript (0 files, 2 in the page); 3.1 KB sent in all
  after a click on +1: the counter says 4; 2 more files, 136.2 KB (38.6 KB sent)
```

`node js.mjs http://localhost:8000/about http://localhost:8080/about`:

```
http://localhost:8000/about  as it loads: 0.0 KB of JavaScript (0 files, 0 in the page); 2.8 KB sent in all
http://localhost:8080/about  as it loads: 1.3 KB of JavaScript (0 files, 1 in the page); 2.2 KB sent in all
```

- Fresh's three files are its island (818 bytes), Preact (11,031) and its client entry (35,296), sent as they are:
  `deno serve` doesn't compress them here (Vite counts 18.4 KB gzipped for the three).
- Quillo's page carries two scripts: its link-prefetch script (1,317 bytes, on every page) and a 1,982-byte loader that
  fetches `/_quillo/r/1f455fc7eaaae582.js` (the runtime) and `/_quillo/b/81c98c3280c88d43.js` (the page's components)
  when someone reaches for the counter (points at it, touches it, focuses it, or presses a key in it), and plays the
  click again once they're there. With curl: the runtime is 134,945 bytes (37,372 gzipped, as Quillo sends it), the
  components' file 1,265 (621).
- Quillo's guide (0.8.6) says the runtime is "about 35 KB, 11 KB gzipped, for a page with one counter"; on this page it
  measured 134,945 bytes.
