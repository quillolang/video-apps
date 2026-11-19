# Vue vs Quillo, the tutorial's to-do list: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 12:57:28 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **create-vue:** 3.24.0; **Vue:** 3.5.45; **Vite:** 8.3.8; **TypeScript:** 6.0.3 (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-vue.mjs` (Vue's screenshots) and
`measure-js.mjs` (the JavaScript). Everything ran under `taskpolicy -b`.

## The two apps

- **Vue** (`vue/`): Vue's own starter, `npm create vue@latest -- --default --bare vue`. `--default` is create-vue's
  default configuration, which is TypeScript (asked without flags, it offers "Use TypeScript? Yes" first);
  `--bare` leaves out the example components, so the starter makes fewer files. `src/App.vue` is the solution of
  step 7 of Vue's tutorial (https://vuejs.org/tutorial/#step-7, "List Rendering", as `<script setup>`), with two
  changes: `lang="ts"` and a `type Todo` line, since the starter is TypeScript and `npm run build` type-checks
  (`removeTodo(todo)` is otherwise error TS7006, and with the script left as JavaScript, `vue-tsc` fails on
  `main.ts` with TS7016); and its three lines longer than 50 characters broken in two, as the Quillo file's
  are, to fit the Short's editor. Every other file is the starter's, unchanged.
- **Quillo** (`../app/main.qwe`): the same list, the same text but "Learn Quillo", as one component and its
  route: two states and an id, `add` and `remove`, a form with its own `onsubmit`, `value={draft}` (two-way by
  itself, since 0.7), and `{for t in todos => ...}`. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were used in a browser the same way, by `../shots.mjs` and `shots-vue.mjs`, which check the list after
each step: the three to-dos; "Make a Short" typed; added (four, and the box emptied); "Learn HTML" taken off
(three). The screenshots are from `npm run dev` (port 5174) and `quillo run` (8112), both 320x200 at 3x. Vue's
dev page shows the Vue DevTools button at the bottom: the default starter includes vite-plugin-vue-devtools.

npm warns that this Node is older than the starter asks for (`"engines": { "node": "^22.18.0 || >=24.12.0" }`,
and some of its tools want 24.15); everything ran and built anyway:

```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'vue@0.0.0',
npm warn EBADENGINE   required: { node: '^22.18.0 || >=24.12.0' },
npm warn EBADENGINE   current: { node: 'v24.11.0', npm: '11.6.1' }
npm warn EBADENGINE }
```

## 1. Files the starter makes

```
$ npm create vue@latest -- --default --bare vue
...
Scaffolding project in .../compare/vue...
│
└  Done. Now run:

   cd vue
   npm install
   npm run dev

$ find vue -type f | sort
vue/.gitignore
vue/.vscode/extensions.json
vue/.vscode/settings.json
vue/README.md
vue/env.d.ts
vue/index.html
vue/package.json
vue/public/favicon.ico
vue/src/App.vue
vue/src/main.ts
vue/tsconfig.app.json
vue/tsconfig.json
vue/tsconfig.node.json
vue/vite.config.ts
$ npx -y create-vue@latest --version
create-vue v3.24.0
```

14 files. Quillo's starter, `quillo new hello --minimal`, makes 4 (`.gitignore`, `lib/greet.qwe`, `main.qwe`,
`ui/page.qwe`; the same quillo, measured for `../../64-vs-svelte-counter/compare/MEASURE.md`).

## 2. What you install, and its size

```
$ npm install
...
added 187 packages, and audited 188 packages in 45s

47 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

$ npm ls --depth=0
vue@0.0.0 .../compare/vue
├── @tsconfig/node24@24.0.6
├── @types/node@24.19.2
├── @vitejs/plugin-vue@6.0.11
├── @vue/tsconfig@0.9.1
├── npm-run-all2@9.0.4
├── typescript@6.0.3
├── vite-plugin-vue-devtools@8.2.1
├── vite@8.3.8
├── vue-tsc@3.3.14
└── vue@3.5.45

$ du -sh node_modules
110M	node_modules
```

187 packages, 110 MB, with Node itself installed first. Quillo is one file, 30,584,944 bytes (`ls -l`), 29M
(`du -h ../app/.quillo/bin/quillo`).

## 3. Lines you write

Non-blank lines, without `//` comments, counted the same way for both, as the Short shows them (both files with
their lines of more than 50 characters broken in two):

```
$ grep -v '^\s*$' vue/src/App.vue | grep -cv '^\s*//'
33
$ grep -v '^\s*$' ../app/main.qwe | grep -cv '^\s*//'
31
```

About even. Vue's count has `<script setup>`, the import, the type line and `<template>`'s tags; Quillo's has
the route and the `<div>` a component's one root element needs. With its long lines kept whole, Vue's would be 30.

## 4. JavaScript, up to the first to-do added

`measure-js.mjs` opens the page in a fresh browser (no cache), types "Make a Short", clicks Add Todo, waits for
the fourth item, and one more second for anything late; each script response and each inline `<script>` is
saved and taken with `gzip -9 -c FILE | wc -c`. Vue is Vite's production build (`npm run build`, which
type-checks first, then `vite preview`); Quillo is `quillo run`, as it serves the page. Whole outputs:
`js-vue.txt` and `js-quillo.txt`.

```
$ npm run build            # in vue/
> vue@0.0.0 type-check
> vue-tsc --build
...
dist/index.html                 0.35 kB │ gzip:  0.25 kB
dist/assets/index-D0aBTXMw.js  66.39 kB │ gzip: 26.17 kB
✓ built in 195ms
$ node measure-js.mjs vue <out>
  the list: Learn HTML, Learn JavaScript, Learn Vue, Make a Short
  ...
  JavaScript: 1 pieces, 66392 B raw, 25860 B gzip -9 (25.3 KiB)
$ node measure-js.mjs quillo <out>
  the list: Learn HTML, Learn JavaScript, Learn Quillo, Make a Short
  ...
  JavaScript: 4 pieces, 149769 B raw, 42814 B gzip -9 (41.8 KiB)
```

25.9 KB against 42.8 KB: Vue wins, clearly.
