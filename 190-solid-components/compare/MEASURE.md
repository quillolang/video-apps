# Solid 2.0 Quirks #2: what was run

Every page in the video was used in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed, and what
the browser's console said, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 21:19:20 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **solid-js and @solidjs/web:** 2.0.3; **@solidjs/vite-plugin:** 3.0.1; **Vite:** 8.3.8; **oxlint:** 1.92.0; **eslint-plugin-solid:** 0.20.0
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`

## The apps

- **Solid** (`solid/`): Solid's own starter, `npm create solid@0.13.0 -- -p solid --solid -t bare --js --no-devtools`, then `npm install`.
  Each quirk is a file in `src/` with its fix beside it; `App.jsx` shows one by the address's hash (`#cart`, `#cart-fixed`, ...).
  `Size.jsx` (Solid 1.x's `onMount`) is not imported: `shots.mjs` adds `import Size from './Size.jsx'` to `App.jsx` for a moment, opens
  `#size` and `#cart`, and puts `App.jsx` back. `SizeSettled.jsx` is `onMount` renamed to `onSettled`; `SizeFixed.jsx` adds braces.
  Run as `npm run dev` runs it: `vite` on 3000. The production build: `npx vite build`, then `npx vite preview` on 4173.
- **Quillo** (`../app/main.qwe`): the same pages but Size, at `/cart` and so on, run with `./run.sh --watch` on 8080.

## What each page showed

| Page | Solid, as written (npm run dev) | Solid, fixed | Solid, as written (production) | Quillo |
|---|---|---|---|---|
| Cart (One more, twice) | Cart / 3 × $5 / $5 / One more | Cart / 3 × $5 / $15 / One more | Cart / 3 × $5 / $5 / One more | Cart / 3 × $5 / $15 / One more |
| Welcome (Log in as Ana) | Welcome / Log in as Ana | Welcome / Hi, Ana! | Welcome / Log in as Ana | Welcome / Hi, Ana! |
| Ranking | Ranking / function () { [native code] }1. Ana / function () { [native code] }1. Ben / function () { [native code] }1. Cy | Ranking / 1. Ana / 2. Ben / 3. Cy | Ranking / function () { [native code] }1. Ana / function () { [native code] }1. Ben / function () { [native code] }1. Cy | Ranking / 1. Ana / 2. Ben / 3. Cy |
| Profile (Switch to Ben) | Profile / Hi, ! / Switch to Ben | Profile / Hi, Ben! / Switch to Ben | Profile / Hi, ! / Switch to Ben | Profile / Hi, Ben! / Switch to Ben |
| Size (onMount imported) | (a blank page); #cart: (a blank page) | Size / 600 px (braces) | – | – |
| Size (renamed to onSettled) | Size / 0 px | | | |

## The browser's console (npm run dev)

Warnings and errors, first lines (the full text is in runs.json). Ranking and Profile logged nothing; the fixed pages nothing.

**cart:**

```
[warning] [STRICT_READ_UNTRACKED] Reactive value "qty" read directly in <Price> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

**welcome:**

```
[warning] [STRICT_READ_UNTRACKED] Reactive value "user" read directly in <Welcome> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

**with_size_size:**

```
[pageerror] The requested module '/node_modules/.vite/deps/solid-js.js?v=2b91d981' does not provide an export named 'onMount'
```

**size_settled:**

```
[error] [REACTIVITY_HALTED] An uncaught error halted the reactive system. No further updates will be processed. Handle errors with <Errored> or treat this as a crash.
[pageerror] onSettled callback returned an invalid cleanup value. Return a cleanup function or undefined.
[error] [REACTIVITY_HALTED] Update ignored: the reactive system was halted by an earlier uncaught error.
[warning] [REACTIVITY_HALTED] what it means and how to fix it: https://docs.solidjs.com/reference/solid-js/diagnostics/reactivity-halted
[pageerror] onSettled callback returned an invalid cleanup value. Return a cleanup function or undefined.
```

In the production build, nothing was logged.

## The checkers

`quillo check main.qwe`: `main.qwe: ok (5 routes, 2 functions, 4 components)`.

`npm run lint` in `solid/` (the starter's own script, `oxlint src`):

```
> example-bare@0.0.0 lint
> oxlint src
```

With the starter's config named, `npx oxlint -c oxlint.config.js src`:

```
src/Size.jsx:1:24: error solid(removed-api): 'onMount' was replaced by 'onSettled' in Solid 2.0, which behaves differently: `onSettled` runs after the tree settles, and its return value is treated as a cleanup, so a callback that returns a non-function value is an error in dev. Check each call site before renaming.
src/Ranking.jsx:10:46: warning solid(reactivity): The reactive variable 'i' should be called as a function when used in arithmetic or comparisons.
src/Cart.jsx:3:16: error solid(no-destructure): Destructuring component props breaks Solid's reactivity; use property access instead.
src/Welcome.jsx:7:5: warning solid(components-return-once): Solid components run once, so an early return breaks reactivity. Move the condition inside a JSX element, such as a fragment or <Show />.
src/Welcome.jsx:6:8: warning solid(reactivity): The reactive variable 'user' should be used within JSX, a tracked scope (like createEffect), or inside an event handler function, or else changes will be ignored.
```
