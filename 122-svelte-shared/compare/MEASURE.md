# Svelte 5 vs Quillo, sharing state between files: the measurements

Every result in the video comes from the runs below, copied from the run (this machine's folders shortened to `…/`, and
the stack lines after each error left out). `../shots.mjs` runs them and keeps the results in `../assets/runs.json`.

- **When:** Wed Nov 18 2026 12:01:14 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **sv:** 1.5.0; **Svelte:** 5.57.3; **SvelteKit:** 3.3.1; **Vite:** 8.3.8
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **Svelte** (`svelte/`): Svelte's own starter, `npx sv create svelte --template minimal --no-types --no-add-ons --install npm`.
  `src/app.css` (the same file as `../app/club.css`) is added and imported by `src/routes/+layout.svelte`, which also gets
  `<title>Book Club</title>`; `use-variant.sh <version>` puts a version's `list.svelte.js`, `Header.svelte`,
  `BookCard.svelte` and `MyList.svelte` in `src/lib/`, with `books.js`, and `variants/page.svelte` as
  `src/routes/+page.svelte`. The versions:
  - `reassign/`: `export let picks = $state([]);` and `add` does `picks = [...picks, book];`
  - `derived/`: `export const club = $state({ picks: [] });`, `add` pushes onto `club.picks`, and
    `export const pages = $derived(...)`;
  - `fixed/`: the same, with `export function pages()`; `src/lib` holds this one.
- **Quillo** (`../app/main.qwe`, with `books.json`): `state picks = []` at the top of the program (the page's state),
  `fn pages() = sum(map(picks, (b) => b.pages))`, and three components. `quillo check` prints `main.qwe: ok (1 route, 2 functions, 3 components)`.

Files and non-blank lines: Svelte's fixed version 5 files (list.svelte.js, three components,
+page.svelte), 50 lines; Quillo 1 file, 33 lines.

Svelte's docs, "$state", "Passing state across modules" (svelte.dev/docs/svelte/$state): "you can only _export_ that
state if it's not directly reassigned", because "every reference to `count` is transformed by the Svelte compiler".

## 1. reassign: `npm run build` (exit 1)

```
> svelte@0.0.1 build
> vite build
vite v8.3.8 building ssr environment for production...
transforming...
✓ 142 modules transformed.
✗ Build failed in 213ms
error during build:
Build failed with 1 error:
[plugin vite-plugin-svelte:compile-module] …/compare/svelte/src/lib/list.svelte.js:2:0
RolldownError: src/lib/list.svelte.js:2:0 Cannot export state from a module if it is reassigned. Either export a function returning the state value or only mutate the state value's properties
https://svelte.dev/e/state_invalid_export
 1 |  // The books on my list, shared by every component that imports them.
 2 |  export let picks = $state([]);
                                    ^
 3 |  
 4 |  export function add(book) {
  errors: [Getter/Setter]
}
```

Vite's dev server (`npx vite dev`) showed the same in its error overlay (`../assets/reassign_overlay.png`):
`[plugin:vite-plugin-svelte:compile-module] src/lib/list.svelte.js:2:0 Cannot export state from a module if it is reassigned. Either export a function returning the state value or only mutate the state value's properties
https://svelte.dev/e/state_invalid_export`

## 2. derived: `npm run build` (exit 1)

```
> svelte@0.0.1 build
> vite build
vite v8.3.8 building ssr environment for production...
transforming...
✓ 142 modules transformed.
✗ Build failed in 85ms
error during build:
Build failed with 1 error:
[plugin vite-plugin-svelte:compile-module] …/compare/svelte/src/lib/list.svelte.js:4:0
RolldownError: src/lib/list.svelte.js:4:0 Cannot export derived state from a module. To expose the current derived value, export a function returning its value
https://svelte.dev/e/derived_invalid_export
 2 |  export const club = $state({ picks: [] });
 3 |  
 4 |  export const pages = $derived(club.picks.reduce((sum, b) => sum + b.pages, 0));
                                                                                     ^
 5 |  
 6 |  export function add(book) {
  errors: [Getter/Setter]
}
```

## 3. fixed: `npm run build` (exit 0), then used (play.mjs)

shots.mjs serves the build with `vite preview` (4173) and Quillo with `quillo run main.qwe` (8080); `play.mjs` clicks
Add on Tea for Two Robots, then on The Long Picnic, reading the header and My list after each. Page changes are
MutationObserver records since the step before (the start counts from the page's load). Console errors and warnings: none.

### Svelte (37709 bytes)
| After | Header | My list | Page changes |
|---|---|---|---|
| start | 📚 0 on my list · 0 pages | Nothing yet | 1 |
| add1 | 📚 1 on my list · 192 pages | Tea for Two Robots | 3 |
| add2 | 📚 2 on my list · 448 pages | Tea for Two Robots, The Long Picnic | 2 |

### Quillo (44394 bytes)
| After | Header | My list | Page changes |
|---|---|---|---|
| start | 📚 0 on my list · 0 pages | Nothing yet | 12 |
| add1 | 📚 1 on my list · 192 pages | Tea for Two Robots | 4 |
| add2 | 📚 2 on my list · 448 pages | Tea for Two Robots, The Long Picnic | 3 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped where the server gzipped them).
