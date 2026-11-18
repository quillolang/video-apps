# Lighthouse on one landing page, Next.js and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 16:55:42 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-next-app / Next.js:** 16.4.6; **React:** 19.3.0; **Lighthouse:** 13.6.0, in Playwright's Chromium (Chrome/153.0.0.0)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The pages

- **The photo** (`../app/public/hero.jpg`, 4,467,233 bytes, 2400×1350): made for this video with ffmpeg (a gradient
  with a little noise), so both pages have the same large photo to deal with.
- **Next.js** (`next/`): `npx create-next-app@latest next --js --eslint --app --no-tailwind --no-src-dir --import-alias
  "@/*" --use-npm --disable-git --no-agent-feedback --yes`. `app/page.js` is the bakery's page, with the photo imported
  and shown with `next/image` (`priority`, `sizes="100vw"`); `app/layout.js` has the title and description;
  `app/globals.css` is the same file as `../app/bakery.css`; `app/icon.png` is the icon (the starter's favicon removed).
- **Quillo** (`../app/main.qwe`): the same page. As it starts, `image.convert` writes `hero-828.jpg` (250,918 bytes)
  and `hero-1600.jpg` (1,493,540 bytes) at quality 75; the page lists both in `srcset` with `width`, `height` and
  `fetchpriority="high"`, and `/img/*path` serves them with a year's cache. `quillo check` prints `main.qwe: ok (3 routes, 0 functions, 0 components)`.

## Lighthouse (lh/run.mjs)

shots.mjs builds the Next.js page (`next build`) and runs it with `next start` (3000), and runs Quillo's page with
`quillo run main.qwe` (8080). `lh/run.mjs` runs Lighthouse (`npm install lighthouse chrome-launcher`) on each three
times, each in a fresh headless Chromium, with Lighthouse's default settings (a phone; simulated slow 4G and a 4×
slower CPU), and keeps the run with the median Performance score. Its table:

```
                      next            quillo          
performance           98              99              
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   2.4 s           2.1 s           
FCP                   0.8 s           0.6 s           
TBT                   27 ms           0 ms            
CLS                   0.000           0.000           
downloaded            261 KB          254 KB          
JavaScript            144 KB          0 KB            
requests              10              3               
(the median of 3 runs each; Performance, all runs: next 98/98/99, quillo 99/99/99)
```

The one audit below full marks on either page, in every run: `largest-contentful-paint`. What each page sent for the
photo: Next.js `/_next/image image/webp 111587` bytes, Quillo `/img/hero-828.jpg image/jpeg 251268` bytes.

## The photo at phone size (sizes/sizes.mjs)

The photo at 828 pixels wide, at quality 75, four ways: Quillo's `image.convert` (sizes/sizes.qwe, run with the app's
Quillo) as WebP and as JPEG, and sharp, the library next/image uses, as WebP and as JPEG. In bytes:

```
{"quillo webp": 1093156, "quillo jpeg": 250918, "sharp webp": 141888, "sharp jpeg": 120825}
```

Quillo's WebP is near the size of a lossless one: its `quality` seems not to apply to WebP. So Quillo's page uses JPEG.
