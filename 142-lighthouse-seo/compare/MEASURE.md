# SEO with JavaScript off, a React SPA and a Quillo site: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 21:45:23 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **Vite:** 8.3.8; **React:** 19.3.1; **React Router:** 8.5.1; **Lighthouse:** 13.6.0, in Playwright's Chromium (Chrome/153.0.0.0)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

Hearth Bakery's breads: a home page with a link to each of four breads, and a page for each bread (`/breads/sourdough`
and so on) with its own title ("Sourdough · Hearth Bakery") and description; the same styles in each (`../app/site.css`,
and `spa/src/site.css`, the same file), and a `robots.txt` in each.

- **React** (`spa/`): Vite's starter, `npm create vite@latest spa -- --template react --no-interactive --no-immediate`,
  then `npm install` and `npm install react-router`. `src/App.jsx` (50 non-blank lines) is the site, with React Router's
  `BrowserRouter`, `Routes` and `Link`; each page renders its own `<title>` and `<meta name="description">`, which React
  19 puts into the head. `src/breads.js` is the breads (the same as `../app/breads.json`); `index.html`'s title is
  "Hearth Bakery" (the starter's was "spa"); `public/robots.txt` is the robots file; the starter's `App.css`,
  `index.css` and `assets/` are removed. `npx vite build` makes `dist/assets/index-BAwUzfEG.js` (258.09 kB, 82.15 kB
  gzipped), served with `vite preview` (4173).
- **Quillo** (`../app/main.qwe`, 35 lines): a `Page` view given each page's title and description; `route GET /`,
  `route GET /breads/:slug` (a 404 page for a slug it doesn't have), `/robots.txt` and the icon. `quillo check` prints
  `main.qwe: ok (4 routes, 1 function, 0 components)`. Run with `quillo run main.qwe` (8080).

With JavaScript on, a browser shows the same sourdough page from each, titled "Sourdough · Hearth Bakery" in the tab;
React's title stays right after a click (its `<title>` is put before index.html's in the head).

## Lighthouse, with JavaScript (lh/run.mjs, lh/seo.mjs)

Run as the video shows them, in a shell with `P=/breads/sourdough` set first. `node run.mjs
spa=http://localhost:4173$P quillo=http://localhost:8080$P` (three runs each, Lighthouse's phone settings, the median
run):

```
                      spa             quillo          
performance           100             100             
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   1.4 s           0.6 s           
FCP                   0.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.000           0.000           
CLS, each run         0.00 0.00 0.00  0.00 0.00 0.00  
unsized images        0               0               
downloaded            85 KB           2 KB            
JavaScript            82 KB           0 KB            
requests              4               2               
(the median of 3 runs each; Performance, all runs: spa 100/100/100, quillo 100/100/100)
```

Lighthouse 13.6 also has an "Agentic Browsing" category ("still under development and subject to change", it says),
not shown in the table or the video: the SPA's scored 50, since its `llms-txt` and `ard-schema` audits failed (vite
preview answers `/llms.txt` and `/.well-known/ard.json` with the app's HTML), and Quillo's 100.

`node seo.mjs spa=http://localhost:4173$P quillo=http://localhost:8080$P` (the SEO category alone):

```
spa: seo 100
quillo: seo 100
```

## Without JavaScript

`./seen.sh <site>` (curl: the sourdough page's title, description and heading, the home page's links to breads, and
what `/breads/nope` answers):

```
$ ./seen.sh http://localhost:4173
title:        <title>Hearth Bakery</title>
description:  (none)
heading:      (none)
links:        0 to breads, on the home page
/breads/nope: 200
$ ./seen.sh http://localhost:8080
title:        <title>Sourdough · Hearth Bakery</title>
description:  <meta name="description" content="Our twelve-year-old starter, a long rest, and a dark, crackling crust.">
heading:      Sourdough
links:        4 to breads, on the home page
/breads/nope: 404
```

The SPA's whole answer for `/breads/sourdough` is its index.html, the same for every address:

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hearth Bakery</title>
    <script type="module" crossorigin src="/assets/index-BAwUzfEG.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BXhdizqg.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`node seo.mjs spa=http://localhost:4173$P quillo=http://localhost:8080$P --no-scripts` (the page's script files blocked
with Lighthouse's `blockedUrlPatterns: ['*.js']`; Chromium with JavaScript turned off can't be audited at all, since
Lighthouse needs it itself: "Script execution is prohibited"):

```
spa: no score: The page did not paint any content (NO_FCP) (scripts blocked)
quillo: seo 100 (scripts blocked)
```

In Playwright's Chromium with `javaScriptEnabled: false` (the screenshots `*_nojs.png`): React's home and sourdough
pages are empty (the body's text is empty; the title is index.html's "Hearth Bakery"), with no link to follow. Quillo's
are whole, and the home page's "Seeded" link opens the seeded loaf's page.

## Google's docs

Google Search Central, "Understand JavaScript SEO basics"
(https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), read 2026-11-18:
"Googlebot queues all pages with a 200 HTTP status code for rendering"; "The page may stay on this queue for a few
seconds, but it can take longer than that."; "You can use JavaScript to set or change the meta description as well as
the <title> element."; and server-side or pre-rendering "is still a great idea because it makes your website faster for
users and crawlers, and not all bots can run JavaScript."
