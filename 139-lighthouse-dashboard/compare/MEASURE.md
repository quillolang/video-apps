# A dashboard on a slow phone: React SPA and Quillo under Lighthouse, the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 17:11:31 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **Vite:** 8.3.8; **React:** 19.3.1; **Lighthouse:** 13.6.0, in Playwright's Chromium (Chrome/153.0.0.0)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The dashboards

- **The data** (`../app/sales.json`): 1,080 sales for October, made for this video (a seeded random list).
- **React** (`react/`): Vite's own starter, `npm create vite@latest react -- --template react --no-interactive
  --no-immediate`, then `npm install`. `src/App.jsx` is the dashboard: it fetches `/sales.json` (in `public/`) once it has
  mounted, shows "Loading…" until then, and adds the sales up in the browser. `src/index.css` is the same file as
  `../app/dash.css`; `index.html` has the title, a description and the icon. The build (`npx vite build`):

```
dist/index.html 0.59 kB │ gzip: 0.36 kB
dist/assets/index-CF8Ooq6Y.css 1.14 kB │ gzip: 0.52 kB
dist/assets/index-BparXtQF.js 221.79 kB │ gzip: 69.26 kB
```

- **Quillo** (`../app/main.qwe`): the same sums, made once as the server starts, and the page sent with them in it.
  `quillo check` prints `main.qwe: ok (2 routes, 1 function, 0 components)`.

Both pages showed the same four figures: React ['$13,017.40', '1080', '2772', '$12.05'], Quillo ['$13,017.40', '1080', '2772', '$12.05'].

## Lighthouse (lh/run.mjs)

shots.mjs serves the React build with `vite preview` (4173) and runs `quillo run main.qwe` (8080). `lh/run.mjs` runs
Lighthouse on each three times, each in a fresh headless Chromium, with its phone settings, and keeps the run with the
median Performance score. First with Lighthouse's default throttling, "simulate" (the page loads at full speed, and its
times are worked out for a slow phone):

```
                      react           quillo          
performance           100             100             
accessibility         100             100             
best-practices        100             100             
seo                   91              100             
LCP                   1.5 s           0.6 s           
FCP                   0.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.018           0.000           
downloaded            80 KB           2 KB            
JavaScript            69 KB           0 KB            
requests              5               2               
(the median of 3 runs each; Performance, all runs: react 100/100/100, quillo 100/100/100)
```

Then with `--applied` (`throttlingMethod: 'devtools'`: the network and CPU really slowed while the page loads):

```
                      react           quillo          
performance           96              100             
accessibility         100             100             
best-practices        100             100             
seo                   91              100             
LCP                   2.5 s           0.8 s           
FCP                   1.8 s           0.8 s           
TBT                   0 ms            0 ms            
CLS                   0.018           0.000           
downloaded            80 KB           2 KB            
JavaScript            69 KB           0 KB            
requests              5               2               
(applied throttling; the median of 3 runs each; Performance, all runs: react 96/96/96, quillo 100/100/100)
```

React's SEO audit that fails, in every run: `robots-txt`. `/robots.txt`, asked with fetch: React `200 text/html <!doctype html>...`
(vite preview's single-page fallback sends the app's page for any address), Quillo `404 text/plain; charset=utf-8 not found `.

## What the screen shows, second by second (filmstrip.mjs)

Each moment is a fresh load in Chromium with the network and CPU slowed as Lighthouse's applied throttling slows them
(562.5 ms latency, 1.47 Mbit/s down, 0.68 Mbit/s up, the CPU 4× slower), and a screenshot that many seconds after the
load starts:

```
react: 0.5 s: (blank) | 1 s: (blank) | 1.5 s: Loading… | 2 s: Loading… | 2.5 s: Hearth Bakery: October | 3 s: Hearth Bakery: October
  its first HTML: 599 characters, the revenue in it: no
quillo: 0.5 s: Hearth Bakery: October | 1 s: Hearth Bakery: October | 1.5 s: Hearth Bakery: October | 2 s: Hearth Bakery: October | 2.5 s: Hearth Bakery: October | 3 s: Hearth Bakery: October
  its first HTML: 4144 characters, the revenue in it: yes
```
