# SolidJS 2.0 vs Quillo, signals or a let: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 13:55:25 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **create-solid:** 0.13.0; **solid-js** and **@solidjs/web:** 2.0.1; **Vite:** 8.3.8 (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-solid.mjs` (Solid's screenshots, and the
body-read variant's console warning) and `measure-js.mjs` (the JavaScript). Everything ran under `taskpolicy -b`.

## The two apps

The counter of `../../64-vs-svelte-counter`: a button that shows `doubled`, and "{count} doubled is {doubled}".

- **Solid** (`solid/`): Solid's own starter, `npm create solid@latest -- --solid --ts --no-devtools -p solid -t bare`
  (the `bare` shape, "Solid, nothing else", which Solid's docs suggest for a single page), with `src/App.tsx`
  replaced: `createSignal(0)`, and `doubled` as a plain function, `() => count() * 2`, called in the JSX, as Solid's
  reactivity guide says most derived values should be (https://docs.solidjs.com/concepts/reactivity, "Derived
  values"); the click uses the setter's updater form, which the guide prefers. Every other file is the starter's,
  unchanged (`App.css` is no longer imported).
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.
- **Solid, read in the body** (`variants/body-read/App.tsx`): `const doubled = count() * 2`, read once as the
  component runs, put in place of `App.tsx` for its run and put back after.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6"; the body-read one says "0" and
"3 doubled is 0", and Solid's development build warns in the browser console (from `shots-solid.mjs`, whole in
`../assets/solid-console.txt`):

```
[warning] [STRICT_READ_UNTRACKED] Reactive value "count" read directly in <App> will not update. Move it into a tracking scope (JSX, a memo, or an effect's compute function).
  in <App>
  at http://localhost:3001/virtual:solid-ssr-entry-client.tsx:6:14
```

(`[warning]` is the console message's type, as the script writes it.) The page as it is gives no such warning.
The screenshots are from `npm run dev` (port 3001) and `quillo run` (8117), both 320x128 at 3x. Every line of
each file is 50 characters or less, for the Short's editor.

## 1. Files the starter makes

```
$ npm create solid@latest -- --solid --ts --no-devtools -p solid -t bare </dev/null
┌
 Create-Solid v0.13.0
│
◇  Project created 🎉
...
$ find solid -type f | sort
solid/.gitignore
solid/AGENTS.md
solid/README.md
solid/oxlint.config.ts
solid/package.json
solid/pnpm-lock.yaml
solid/pnpm-workspace.yaml
solid/public/favicon.ico
solid/src/App.css
solid/src/App.tsx
solid/src/Document.tsx
solid/src/logo.svg
solid/tsconfig.json
solid/vite.config.ts
```

14 files. (Without `--no-devtools`, the CLI stops to ask whether to add the development toolbar.) Quillo's
starter, `quillo new hello --minimal`, makes 4.

## 2. What you install, and its size

```
$ npm install                      # whole output in install.txt
added 128 packages, and audited 129 packages in 30s

$ npm ls --depth=0
example-bare@0.0.0 .../compare/solid
├── @solidjs/diagnostics@2.0.1
├── @solidjs/vite-plugin@3.0.1
├── @solidjs/web@2.0.1
├── eslint-plugin-solid@0.20.0
├── oxlint@1.92.0
├── solid-js@2.0.1
├── typescript@7.0.2
└── vite@8.3.8

$ du -sh node_modules
116M	node_modules
```

128 packages, 116 MB, with Node itself installed first. Quillo is one file, 30,584,944 bytes, 29M.

## 3. Lines you write

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c solid/src/App.tsx
15
$ c ../app/main.qwe
11
```

## 4. JavaScript, up to the first click

`measure-js.mjs` opens the page in a fresh browser (no cache), clicks once, waits for the button to say 2, and one
more second for anything late; each script response and each inline `<script>` is saved and taken with
`gzip -9 -c FILE | wc -c`. Solid is its production build (`npm run build`, then `vite preview`); Quillo is
`quillo run`, as it serves the page. Whole outputs: `js-solid.txt` and `js-quillo.txt`.

```
$ npm run build            # in solid/
vite v8.3.8 building client environment for production...
dist/client/assets/virtual_solid-ssr-entry-client-CuB-mLFF.js  33.81 kB │ gzip: 13.87 kB
...
$ node measure-js.mjs solid <out>
  the button says: 2
  ...
  JavaScript: 1 pieces, 33810 B raw, 13762 B gzip -9 (13.4 KiB)
$ node measure-js.mjs quillo <out>
  the button says: 2
  ...
  JavaScript: 4 pieces, 137386 B raw, 38968 B gzip -9 (38.1 KiB)
```

13.8 KB against 39.0 KB: Solid wins, by a lot.
