# React vs Quillo, one keystroke: the measurements

Every number in the video (its `measured` terminal scenes and the `versus` scene in `../video.json`) comes from the
runs below, with what they printed, copied from the run. `../shots.mjs` runs them all and keeps the results in
`../assets/runs.json`. Measured on one machine; your numbers will vary.

- **When:** Wed Nov 18 2026 10:35:34 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB (17179869184 bytes), arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vite:** 9.3.4; **Vite:** 8.3.8; **React and react-dom:** 19.3.1; **babel-plugin-react-compiler:** 1.0.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium 153.0.8010.12 (Playwright's), headless

KB is 1,000 bytes.

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive --no-immediate`,
  then `npm install`. `src/App.jsx` is replaced by the shop (`variants/plain.jsx`), `src/index.css` by the shop's
  styles (the same file as `../app/shop.css`), `src/products.json` is added (`node make-products.mjs`), and
  `index.html`'s title is "The Corner Shop". Every other file is the starter's (its `App.css` is no longer imported).
  `variants/` holds the three versions measured: `plain.jsx`, `memo.jsx` (Row wrapped in `memo`) and `fixed.jsx`
  (`memo`, and `add` in `useCallback` with the updater form, `setCart((cart) => [...cart, product])`).
- **React Compiler** (`react-compiler/`): Vite's starter with the compiler,
  `npm create vite@latest react-compiler -- --template react-compiler --no-interactive --no-immediate`, changed the
  same way. `variants/plain.jsx` is the same file as React's; `variants/functional.jsx` writes `add` with the updater
  form, and nothing else.
- **Quillo** (`../app/main.qwe`): the same shop. `quillo check` prints `main.qwe: ok (1 route, 1 function, 1 component)`.
  (Reading products.json at the top and using it straight in the component, `quillo check` said ok, but `quillo run`
  refused: "`products` is read from the server's environment, files, database or a service, and would be sent to every
  browser; pass what the page needs as a prop or read it with a `server fn`". So the route passes it as a prop.)

`npx oxlint` (the starters' linter) prints nothing for `src/` and `variants/` in both. Non-blank lines a person writes:
React's App.jsx 37 (plain) and 37 (fixed); Quillo's main.qwe 30, with its route.

## How it measured

`build-variants.sh` builds each version for production (`vite build`) into a scratch folder, each `App.jsx` copied in
turn and the plain one put back; with a second argument, the same with 10,000 products (`node make-products.mjs <file>
10000`: the 1,000, then "pack 2" to "pack 10"). shots.mjs serves the builds with `vite preview` (4173 to 4177, and 4183
to 4187 for 10,000) and runs Quillo with `quillo run` (8080; a copy with 10,000 products on 8180), with no `--watch`.

`measure.mjs` (run by `measure.sh`) opens each app in Chromium with `counters.js` put in before the page's own scripts:

- **renders:** React components that ran, counted from React's own commits through the hook React DevTools uses
  (`__REACT_DEVTOOLS_GLOBAL_HOOK__`): a function component's fiber with the PerformedWork flag, in a part of the tree
  the commit made again, as DevTools' `didFiberRender` decides. A page without React has none to count. The development
  builds (`npm run dev`) gave the same counts, named: App 1 and Row 1000 for a keystroke in the plain version, App 1 in
  the compiled one.
- **DOM:** the MutationObserver records under `<body>`. React's 6 for a keystroke are the input's `name` and `value`
  attributes and the total's text; Quillo's 1 is the total's text (the browser changes the input itself).
- **ms:** from the keydown or pointerdown to the last DOM change, the median of 19 keystrokes (" Lovelace Byron Kin",
  after "Ada") and of 20 clicks on Add.
- **KB:** the response bodies the page downloaded to start, as sent (compressed where the server compressed them:
  Quillo's HTML and scripts, and Vite's JavaScript, are gzipped; vite preview sends index.html and the CSS as they are).

The table's keystroke and Add columns are the second of three keystrokes ("d") and the second of three clicks.

## 1. A thousand products

```
$ ./measure.sh
1000 rows, in Chromium. renders: React components that ran;
DOM: changes to the page; ms: from the key or click (median); KB: download
                      a keystroke   an Add      median ms
app                   renders DOM  renders DOM   key  Add     KB
react                    1001   6     1001   4   1.1  1.0   78.7
memo                     1001   6     1001   4   1.2  1.1   78.7
memo+useCallback            1   6        1   4   0.5  0.4   78.8
compiler                    1   6     1001   2   0.4  1.1   79.5
compiler+updater            1   6        1   2   0.4  0.4   79.5
quillo                      0   1        0   2   0.3  0.4   63.9
```

## 2. Ten thousand products

```
$ ROWS=10000 ./measure.sh
10000 rows, in Chromium. renders: React components that ran;
DOM: changes to the page; ms: from the key or click (median); KB: download
                      a keystroke   an Add      median ms
app                   renders DOM  renders DOM   key  Add     KB
react                   10001   6    10001   4   7.6  9.2  151.2
memo                    10001   6    10001   4  13.2 10.0  151.2
memo+useCallback            1   6        1   4   3.5  3.2  151.2
compiler                    1   6    10001   2   0.6 10.6  151.9
compiler+updater            1   6        1   2   0.4  1.2  151.9
quillo                      0   1        0   2   0.4  1.6  194.6
```

## 3. The screenshots

shots.mjs sets `window.__highlight`, so counters.js outlines what it counted: orange around each component that ran
(its first element; App's is the whole page), green around each element the DOM changes touched. Counting stops while a
screenshot is taken (Playwright hides the caret by changing the focused input's style). What each screenshot counted:

| Screenshot | Components that ran | DOM changes |
|---|---|---|
| react_typed (plain, "A") | 1001 | 6 |
| react_added (plain, Add) | 1001 | 4 |
| fixed_typed / fixed_added (memo + useCallback) | 1 / 1 | 6 / 4 |
| compiler_typed / compiler_added | 1 / 1001 | 6 / 2 |
| updater_added (compiler + updater form) | 1 | 2 |
| quillo_typed / quillo_added | 0 / 0 | 1 / 2 |
