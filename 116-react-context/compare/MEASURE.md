# React vs Quillo, one cart badge: the measurements

Every number in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 11:42:17 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-vite:** 9.3.4; **Vite:** 8.3.8; **React and react-dom:** 19.3.1; **Zustand:** 5.1.0
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless

## The apps

- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive --no-immediate`,
  then `npm install` and `npm install zustand`. `src/App.jsx` is replaced by the bakery, `src/index.css` by its styles
  (the same file as `../app/bakery.css`), `src/pastries.js` is added, and `index.html`'s title is "The Little Bakery".
  Every other file is the starter's. `variants/` holds the three versions: `drilling.jsx` (the cart and add passed down
  as props), `context.jsx` (a CartContext, with `useCallback` and `useMemo` for its value, and React 19's
  `<CartContext value>`), and `zustand.jsx` (a `create` store, read with selectors).
- **Quillo** (`../app/main.qwe`, with `pastries.json`): `state cart = []` at the top of the program, the page's state
  (since Quillo 0.8.5), read by `<Badge>` and set by `<AddButton>`. `quillo check` prints `main.qwe: ok (1 route, 2 functions, 2 components)`.

Non-blank lines: drilling.jsx 52, context.jsx 59, zustand.jsx 56 (and pastries.js
15); Quillo's main.qwe 28, with its route.

## How it measured

`build-variants.sh` builds each version for production (`vite build`); shots.mjs serves them with `vite preview` (4173 to
4175) and Quillo with `quillo run main.qwe` (8080). `measure.mjs` opens each with `counters.js` (the same as video 115's:
React components that ran, counted from React's own commits through React DevTools' hook, and MutationObserver records)
and clicks Add on the Croissant, the Apple Pie and the Cheesecake.

### drilling.jsx (downloaded 69898 bytes)
| Click | Ran | Page changes | Badge |
|---|---|---|---|
| Croissant | 29 | 2 | 🛒 1 · $3.25 |
| Apple Pie | 29 | 2 | 🛒 2 · $7.75 |
| Cheesecake | 29 | 2 | 🛒 3 · $13.00 |

### context.jsx (69950 bytes)
| Click | Ran | Page changes | Badge |
|---|---|---|---|
| Croissant | 14 | 2 | 🛒 1 · $3.25 |
| Apple Pie | 14 | 2 | 🛒 2 · $7.75 |
| Cheesecake | 14 | 2 | 🛒 3 · $13.00 |

### zustand.jsx (70404 bytes)
| Click | Ran | Page changes | Badge |
|---|---|---|---|
| Croissant | 1 | 2 | 🛒 1 · $3.25 |
| Apple Pie | 1 | 2 | 🛒 2 · $7.75 |
| Cheesecake | 1 | 2 | 🛒 3 · $13.00 |

### Quillo (45326 bytes)
| Click | Ran | Page changes | Badge |
|---|---|---|---|
| Croissant | 0 | 2 | 🛒 1 · $3.25 |
| Apple Pie | 0 | 2 | 🛒 2 · $7.75 |
| Cheesecake | 0 | 2 | 🛒 3 · $13.00 |

Bytes are the response bodies the page downloaded to start, as sent (gzipped where the server gzipped them).

The same first click in Vite's dev server (`npx vite`), where the components keep their names:

- drilling.jsx: `{"App": 1, "Header": 1, "CartBadge": 1, "Shop": 1, "ProductGrid": 1, "ProductCard": 12, "AddButton": 12}`
- context.jsx: `{"CartProvider": 1, "CartBadge": 1, "AddButton": 12}`
- zustand.jsx: `{"CartBadge": 1}`
