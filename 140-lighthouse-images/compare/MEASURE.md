# Images that jump, SvelteKit and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 21:01:25 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **sv:** 1.5.0; **SvelteKit:** 3.3.1; **Svelte:** 5.58.0; **Vite:** 8.3.8; **adapter-auto:** 8.0.1; **@sveltejs/enhanced-img:** 1.0.1
- **Lighthouse:** 13.6.0, with chrome-launcher, in Playwright's Chromium (Chrome/153.0.0.0)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (each folder's own, from its get-quillo.sh)

## The photos

Four photos, 1600×1200 JPEGs of 226 to 259 KB each (`photos/make.mjs`: each drawn as an SVG, shot with Playwright's
Chromium, and saved by ffmpeg with a little noise). The same four files are in `../app/photos/`, `../steps/plain/photos/`
and `svelte/src/lib/photos/`.

## The pages

The bakery's journal: a header, then four posts, each a photo, a heading and a line. The same styles in each
(`../app/journal.css`, and `svelte/src/app.css`, the same file): every `img` is `width: 100%; height: auto`, with a beige
background, so a photo's kept place shows as a beige box.

- **SvelteKit, no sizes** (`svelte/variants/plain/+page.svelte`, 17 non-blank lines): the official starter, `npx sv create
  svelte --template minimal --no-types --no-add-ons --install npm`, with `src/lib/posts.js` (the posts), `src/app.css`
  imported in `+layout.svelte`, and the photos in `static/photos/`, each shown with `<img src="/photos/{p.photo}.jpg"
  alt={p.alt} />`.
- **SvelteKit, enhanced:img** (`svelte/src/routes/+page.svelte`, 22 lines): `npm i -D @sveltejs/enhanced-img`, and
  `enhancedImages()` in `vite.config.js` before `sveltekit()`, as SvelteKit's docs ("Images") say
  (`svelte/variants/starter/vite.config.js` is the starter's own, for the difference); the photos in `src/lib/photos/`,
  each imported with `?enhanced` and shown with `<enhanced:img src={photos[p.photo]} alt={p.alt} />`.
- **Quillo, no sizes** (`../steps/plain/main.qwe`, 25 lines): the same page, `<img src={`/photos/${p.photo}.jpg`}
  alt={p.alt}/>`, and `route GET /photos/*path = files("photos", path, { cache: "1y" })`. `quillo check` prints
  `main.qwe: ok (3 routes, 0 functions, 0 components)`.
- **Quillo, with sizes** (`../app/main.qwe`, 35 lines): as it starts, `image.convert` writes an 800-pixel copy of each
  photo at quality 75 into `photos/800/`; a `Photo` view reads the photo's `width` and `height` with `image.info` and puts
  them on its `<img>`, with the copy as `src` and both in `srcset` (`sizes="(max-width: 720px) 100vw, 720px"`).
  `quillo check` prints `main.qwe: ok (3 routes, 1 function, 0 components)`.

Neither build warned about the images without sizes (no line of either SvelteKit build's log has "warn"), and `quillo
check` passes both Quillo versions without a warning.

`compare/build-variants.sh <dir>` builds both SvelteKit versions for production in their own copies (adapter-auto, as
the starter has it, builds for `vite preview`). shots.mjs serves them with `vite preview` (plain on 4182, enhanced on
4181), and runs Quillo's with `quillo run main.qwe` (steps/plain on 8081, app on 8080).

## Lighthouse (lh/run.mjs)

`lh/run.mjs` runs Lighthouse (`npm install lighthouse chrome-launcher`) on each page three times, each in a fresh
headless Chromium, with its phone settings, and prints the run with the median Performance score; and each run's CLS, how
many images its `unsized-images` audit ("Image elements do not have explicit `width` and `height`") lists, and the
requests its "Render-blocking requests" insight lists. Default (simulated) throttling, then `--applied` (Lighthouse's
"devtools" throttling: the network and CPU really slowed while the page loads).

The pages without sizes, default:

```
                      svelte_plain    quillo_plain    
performance           54              65              
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   6.5 s           6.0 s           
FCP                   0.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.717           0.256           
CLS, each run         0.00 0.72 0.72  0.26 0.72 0.00  
unsized images        4               4               
downloaded            997 KB          958 KB          
JavaScript            39 KB           0 KB            
requests              16              6               
(the median of 3 runs each; Performance, all runs: svelte_plain 54/54/77, quillo_plain 55/65/78)
```

The same, `--applied`:

```
                      svelte_plain    quillo_plain    
performance           75              56              
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   6.6 s           6.2 s           
FCP                   1.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.000           0.497           
CLS, each run         0.00 0.00 0.00  0.50 0.50 0.40  
unsized images        4               4               
downloaded            997 KB          958 KB          
JavaScript            39 KB           0 KB            
requests              16              6               
(applied throttling; the median of 3 runs each; Performance, all runs: svelte_plain 75/75/75, quillo_plain 56/56/59)
```

Render-blocking requests, in the median runs: SvelteKit's stylesheet, `_app/immutable/assets/0.hN-2UK5n.css` (653 bytes),
731 ms with applied throttling and 151 ms by default; none on Quillo's page, whose styles are in the page.

The pages with sizes, default:

```
                      svelte_enhanced quillo_sized    
performance           98              99              
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   2.4 s           2.1 s           
FCP                   0.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.000           0.000           
CLS, each run         0.00 0.00 0.00  0.00 0.00 0.00  
unsized images        0               0               
downloaded            232 KB          198 KB          
JavaScript            39 KB           0 KB            
requests              16              6               
(the median of 3 runs each; Performance, all runs: svelte_enhanced 98/98/98, quillo_sized 99/99/99)
```

The same, `--applied`:

```
                      svelte_enhanced quillo_sized    
performance           96              99              
accessibility         100             100             
best-practices        100             100             
seo                   100             100             
LCP                   2.6 s           2.2 s           
FCP                   1.8 s           0.6 s           
TBT                   0 ms            0 ms            
CLS                   0.000           0.000           
CLS, each run         0.00 0.00 0.00  0.00 0.00 0.00  
unsized images        0               0               
downloaded            232 KB          198 KB          
JavaScript            39 KB           0 KB            
requests              16              6               
(applied throttling; the median of 3 runs each; Performance, all runs: svelte_enhanced 96/96/96, quillo_sized 99/99/99)
```

What each page sent Lighthouse's phone for its photos (the same in both modes): SvelteKit, no sizes, and Quillo, no
sizes, the 1600-pixel JPEGs (226 to 259 KB); SvelteKit with enhanced:img, its 2x AVIFs, 1600 pixels wide (41 to 56 KB);
Quillo with sizes, its 800-pixel JPEGs (44 to 59 KB).

## Why SvelteKit's page scored 0 there: a race (filmstrip.mjs)

`filmstrip.mjs` loads each page with the network and CPU slowed as applied throttling slows them (562.5 ms latency,
1.47 Mbit/s down, 0.68 up, a 4× slower CPU), in a 640×440 window at 3× scale. One load of each is recorded with
Chromium's screencast and the browser's own record (first paint, each photo's first and last bytes, each layout shift
from a PerformanceObserver set up before the page runs); then a fresh load and a screenshot for each moment after the
first frame (before it, the screen is still white). Its output:

```
svelte_plain: first paint 1776 ms, its first frame 1772 ms; Monday's heading from the top: 0.5 s white | 1 s white | 1.5 s white | 2 s 579 (taken 2060) | 3 s 579 (taken 3182) | 4 s 579 (taken 4250) | 6 s 579 (taken 6330)
  the photos' first bytes 1351/1356/1747/1755 ms, last 6379/6584/6834/7005 ms; layout shifts: 0.354 at 1944 ms (total 0.354)
quillo_plain: first paint 604 ms, its first frame 604 ms; Monday's heading from the top: 0.5 s white | 1 s 123 (taken 1050) | 1.5 s 579 (taken 1559) | 2 s 579 (taken 2050) | 3 s 579 (taken 3144) | 4 s 579 (taken 4226) | 6 s 579 (taken 6357)
  the photos' first bytes 584/588/584/588 ms, last 5990/5973/6125/6235 ms; layout shifts: 0.354 at 1191 ms (total 0.354)
svelte_enhanced: first paint 1764 ms, its first frame 1764 ms; Monday's heading from the top: 0.5 s white | 1 s white | 1.5 s white | 2 s 579 (taken 2053) | 3 s 579 (taken 3314) | 4 s 579 (taken 4306) | 6 s 579 (taken 6311)
  the photos' first bytes 1349/1357/1748/1756 ms, last 2423/2534/2851/2939 ms; layout shifts: none (total 0)
quillo_sized: first paint 604 ms, its first frame 604 ms; Monday's heading from the top: 0.5 s white | 1 s 579 (taken 1042) | 1.5 s 579 (taken 1550) | 2 s 579 (taken 2062) | 3 s 579 (taken 3148) | 4 s 579 (taken 4230) | 6 s 579 (taken 6332)
  the photos' first bytes 585/589/585/589 ms, last 5991/5974/6124/6238 ms; layout shifts: none (total 0)
```

Without a width and height, a photo takes no room until its first bytes tell the browser its size; a page that has
painted by then jumps. SvelteKit's page paints only once its stylesheet has come (a second request): in Lighthouse's
applied runs (a 412-pixel-wide phone), its photos' sizes were known by then, and it never jumped; in this wider window it
painted at 1.78 s, and jumped 0.17 s later, by as much as Quillo's. Quillo's styles are in its page, so it paints at
0.6 s, before the photos, and jumps once they start to arrive. A screenshot taken before a page can paint waits until
it can, so the white frames come from the screencast, not from screenshots; and the screencast's own frames are only
640×440.

## What each fix made (shots.mjs)

`npx vite build | grep 'client.*sourdough'`, in the enhanced copy (enhanced-img's files for one photo; ffprobe says the
first three are 800×600, the last three 1600×1200):

```
.svelte-kit/output/client/_app/immutable/assets/sourdough.CE90fczn.avif     7.92 kB
.svelte-kit/output/client/_app/immutable/assets/sourdough.Br7vxUxc.webp    12.10 kB
.svelte-kit/output/client/_app/immutable/assets/sourdough.BU7aoPbt.jpg     33.91 kB
.svelte-kit/output/client/_app/immutable/assets/sourdough.C4Lr2qTC.avif    42.73 kB
.svelte-kit/output/client/_app/immutable/assets/sourdough.D35CgK2F.webp    80.99 kB
.svelte-kit/output/client/_app/immutable/assets/sourdough.DAb67jJc.jpg    161.96 kB
```

Its page: each photo is a `<picture>` with AVIF, WebP and JPEG sources at 1x and 2x, and an
`<img src="/_app/immutable/assets/sourdough.DAb67jJc.jpg" alt="..." width="1600" height="1200"/>`.

Quillo (in `../app`): `echo 'image.info("photos/sourdough.jpg")' | quillo repl` prints
`{ width: 1600, height: 1200, format: "jpeg", alpha: false }`, and `wc -c photos/800/*.jpg`:

```
47869 photos/800/croissants.jpg
43735 photos/800/rye.jpg
44197 photos/800/sourdough.jpg
58658 photos/800/tart.jpg
194459 total
```

`curl -s <page> | grep -o 'width="[0-9]*" height="[0-9]*"'` prints `width="1600" height="1200"` four times for each fixed
page, and nothing for either page without sizes.

Quillo's `image.convert` writes JPEG, PNG or WebP; its WebP ignores `quality` (video 138 measured it: 1,093 KB against
sharp's 142 KB at 828 pixels), so the copies are JPEG. SvelteKit's docs say of enhanced-img: "As a build plugin,
`@sveltejs/enhanced-img` can only optimize files located on your machine during the build process"; Quillo's
`image.info` reads any file in the program's folder while it runs, an upload too.
