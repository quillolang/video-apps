# React Router SPA vs Quillo's plain links: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 14:39:41 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **Vite:** 8.3.8; **React:** 19.3.1; **React Router:** 8.5.1
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`
- **Browser:** Chromium (Playwright's), headless, 640×440

## The sites

- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive --no-immediate`,
  then `npm install` and `npm install react-router`. `src/App.jsx` is replaced by the site, `src/index.css` by its styles
  (the same file as `../app/soup.css`), `src/soups.js` holds the thirty soups (the same as `../app/soups.json`), and
  `index.html`'s title is "Soup Kitchen". `variants/`: `naive.jsx` (createBrowserRouter: a layout with links and an
  `<Outlet />`, and five kinds of page) and `restore.jsx` (the same, with `<ScrollRestoration />` in the layout).
- **Quillo** (`../app/main.qwe`, with `soup.css` and `soups.json`): a `Page` view and five routes, with plain links.
  `quillo check` prints `main.qwe: ok (5 routes, 1 function, 0 components)`.

## Where a clicked page opens, and where Back goes (scroll.mjs)

`build-variants.sh` builds both React versions for production; shots.mjs serves them with `vite preview` (4177 naive,
4178 restore) and Quillo with `quillo run main.qwe` (8080). `scroll.mjs` opens `/soups`, scrolls until soup 25's link
(Wonton) is in the middle, clicks it, notes where its page opens (scrollY, and whether the heading is in view), presses
Back and notes where the list is. Then it opens `/soups/25` in a browser with JavaScript off.

| Site | List, scrollY | Soup page, scrollY | Heading in view | After Back, scrollY | Soup page's title | JavaScript off |
|---|---|---|---|---|---|---|
| naive | 1084 | 437 | no | 1084 | Soup Kitchen | (nothing: 0 characters) |
| restore | 1084 | 0 | yes | 1084 | Soup Kitchen | (nothing: 0 characters) |
| quillo | 1084 | 0 | yes | 1084 | Wonton · Soup Kitchen | Wonton |

## A six-page visit (clicks.mjs)

`clicks.mjs` puts a small proxy in front of each site, so every byte the server sends is counted (as sent, compressed
where the server compresses), what a page fetches ahead of a click included. It opens `/` in Chromium, then clicks Soups,
Wonton, About, Contact and the Soup Kitchen link, each after the pointer has rested on the link for 300 ms. Kilobytes
are 1,000 bytes. With JavaScript on (`node clicks.mjs react=http://localhost:4178 quillo=http://127.0.0.1:8080 > clicks.json`,
its table):

```
react    open /              101.7 KB  100.5 KB JavaScript  1 page
         click Soups           0.0 KB
         click Wonton          0.0 KB
         click About           0.0 KB
         click Contact         0.0 KB
         click Soup Kitchen    0.0 KB
         six pages, in all   101.7 KB
quillo   open /                1.3 KB  1 page
         click Soups           1.8 KB  1 page
         click Wonton          1.7 KB  1 page
         click About           1.3 KB  1 page
         click Contact         1.3 KB  1 page
         click Soup Kitchen    1.3 KB  1 page
         six pages, in all     8.7 KB
```

With JavaScript off, the React site's `/` had no heading and no links to click; Quillo's every click arrived, with the
same headings as with JavaScript on.
