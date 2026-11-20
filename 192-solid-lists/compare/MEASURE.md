# Solid 2.0 Quirks #3: what was run

Every page in the video was used in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed, the
fields' values and focus, and what the browser's console said, in `../assets/runs.json`; `../make-video.py` checks the narration against it.

- **When:** Fri Nov 20 2026 21:48:14 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **solid-js and @solidjs/web:** 2.0.3; **@solidjs/vite-plugin:** 3.0.1; **Vite:** 8.3.8; **oxlint:** 1.92.0; **eslint-plugin-solid:** 0.20.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **Solid** (`solid/`): Solid's own starter, `npm create solid@0.13.0 -- -p solid --solid -t bare --js --no-devtools`, then `npm install`.
  Each quirk is a file in `src/` with its fix beside it; `App.jsx` shows one by the address's hash. Menu and News use stand-in APIs (a
  promise that resolves after 2 s, and one that rejects after 0.5 s). Run as `npm run dev` runs it; production: `vite build`, `vite preview`.
- **Quillo** (`../app/main.qwe`): the same pages; `load_menu` sleeps 2 s, `load_news` gives `err("503 Service Unavailable")`. `/menu-waits`
  is the menu without `defer`, `/news-raw` the news without `is_err`.

## What each page did

- Guests (click at the end of Ana, type "na"): Solid ['Anan', 'Ben'] (focus on `body`), fixed ['Anana', 'Ben'] (`input`), Quillo ['Anana', 'Ben'] (`input`); production ['Anan', 'Ben'].
- Team (a note "On holiday" for Ana, then Refresh): Solid ['', ''], fixed ['On holiday', ''], Quillo ['On holiday', ''].
- Pantry (Add jam): Solid Pantry / rice / tea / Add jam; fixed Pantry / rice / tea / jam / Add jam; Quillo Pantry / rice / tea / jam / Add jam.
- Menu, 0.5 s / 3 s after it was asked for: Solid "(a blank page)" / "Menu / Welcome! Today we have: / Soup / Pie"; fixed "Menu / Welcome! Today we have: / Loading the menu…" / "Menu / Welcome! Today we have: / Soup / Pie"; Quillo with defer "Menu / Welcome! Today we have: / Loading the menu…" / "Menu / Welcome! Today we have: / Soup / Pie"; Quillo without (`/menu-waits`) (still loading) / "Menu / Welcome! Today we have: / Soup / Pie".
- News, 3 s after: Solid "Home / Welcome back! / Loading the news…" (production: "(a blank page)"); fixed "Home / Welcome back! / No news right now."; Quillo "Home / Welcome back! / No news right now."; Quillo without is_err "Home / Welcome back! / News: err("503 Service Unavailable")".

## The browser's console (npm run dev)

First lines; the full text is in runs.json. Guests logged nothing.

**team:**

```
[warning] [UNSTABLE_LIST_IDENTITY] list "<For>" recreated 2 of 2 rows on an update where the entering items are equivalent to the ones they replaced (2 of 2 sampled pairs identical field-for-field) — fresh objects for the same records, so identity keying threw away every row's DOM and state and rebuilt it. Key the list by a stable field (`keyed: item => item.id`), or merge the data into a store with reconcile(data, "id") so the same records keep the same identity.
```

**pantry:**

```
[pageerror] fn is not a function
```

**menu:**

```
[warning] [ASYNC_OUTSIDE_LOADING_BOUNDARY] An async value was read outside a Loading boundary. The root mount will be deferred until all pending async settles.
```

**news:**

```
[error] [REACTIVITY_HALTED] An uncaught error halted the reactive system. No further updates will be processed. Handle errors with <Errored> or treat this as a crash.
[pageerror] 503 Service Unavailable
[warning] [REACTIVITY_HALTED] what it means and how to fix it: https://docs.solidjs.com/reference/solid-js/diagnostics/reactivity-halted
[pageerror] 503 Service Unavailable
```

**news_fixed:**

```
[error] Error: 503 Service Unavailable
```

Production build:

```
pantry: [pageerror] t is not a function
news: [error] Error: 503 Service Unavailable
```

## The checkers

`quillo check main.qwe`: `main.qwe: ok (8 routes, 4 functions, 7 components)`.

`npm run lint` (the starter's own script) printed no findings. With the config named, `npx oxlint -c oxlint.config.js src`:

```
src/Guests.jsx:10:8: error solid(prefer-for): Use Solid's `<For />` component, or `<For keyed={false} />` for index-keyed lists, for rendering lists. Array#map causes DOM elements to be recreated.
```
