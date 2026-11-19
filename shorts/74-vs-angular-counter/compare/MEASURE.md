# Angular vs Quillo, signals or a let: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 13:46:34 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **Angular:** @angular/cli 21.2.30, @angular/core 21.2.26, TypeScript 5.9.3 (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

**Why Angular 21, not 22.** Angular 22.3.0 is the newest, but its CLI needs a newer Node than this machine's:

```
$ npx -y @angular/cli@22.3.0 new --help
Node.js version v24.11.0 detected.
The Angular CLI requires a minimum Node.js version of v22.22.3 or v24.15.0 or v26.0.0.
```

The machine's Node is shared with other work, so it stayed as it is, and the Short uses Angular 21.2, the newest
that runs on it (`npm view @angular/cli@21 engines`: `"node": "^20.19.0 || ^22.12.0 || >=24.0.0"`).

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-angular.mjs` (Angular's screenshots),
`measure-js.mjs` (the JavaScript) and `serve-dist.mjs` (serves Angular's build as it is, for measure-js).
Everything ran under `taskpolicy -b`.

## The two apps

The counter of `../../64-vs-svelte-counter` (Svelte's `$derived` example): a button that shows `doubled`, and
"{count} doubled is {doubled}".

- **Angular** (`counter/`): `ng new` with its defaults (standalone, zoneless, no SSR, CSS, Vitest), and the root
  component changed: `src/app/app.ts` has `count = signal(0)`, `doubled = computed(() => this.count() * 2)` and
  `increment()` with `this.count.update(...)`, as Angular's signals guide writes them (https://angular.dev/guide/signals);
  `src/app/app.html` (the template, in its own file, as the starter has it) calls `count()` and `doubled()`. The
  router import the starter's component had is gone, since the template has no `<router-outlet>`; the starter's
  `app.config.ts` still provides the router, so the build has it. Every other file is the starter's, unchanged.
  `npx ng build` builds it with no warnings.
- **Quillo** (`../app/main.qwe`): `state count = 0` and `let doubled = count * 2` in a component, and its route.
  `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.

Both were clicked three times in a browser, and say "6" and "3 doubled is 6"; `../shots.mjs` and
`shots-angular.mjs` check each page's text first. The screenshots are from `ng serve` (port 4201) and
`quillo run` (8116), both 320x128 at 3x. Every line of each file is 50 characters or less, for the Short's editor.

## 1. Files the starter makes

```
$ npx -y @angular/cli@21.2.30 new counter --defaults --skip-git --skip-install
CREATE counter/.prettierrc (161 bytes)
CREATE counter/README.md (1461 bytes)
CREATE counter/.editorconfig (314 bytes)
CREATE counter/.gitignore (622 bytes)
CREATE counter/angular.json (1906 bytes)
CREATE counter/package.json (784 bytes)
CREATE counter/tsconfig.json (957 bytes)
CREATE counter/tsconfig.app.json (429 bytes)
CREATE counter/tsconfig.spec.json (441 bytes)
CREATE counter/.vscode/extensions.json (130 bytes)
CREATE counter/.vscode/launch.json (470 bytes)
CREATE counter/.vscode/mcp.json (179 bytes)
CREATE counter/.vscode/tasks.json (978 bytes)
CREATE counter/src/main.ts (222 bytes)
CREATE counter/src/index.html (293 bytes)
CREATE counter/src/styles.css (80 bytes)
CREATE counter/src/app/app.css (0 bytes)
CREATE counter/src/app/app.spec.ts (674 bytes)
CREATE counter/src/app/app.ts (289 bytes)
CREATE counter/src/app/app.html (20144 bytes)
CREATE counter/src/app/app.config.ts (313 bytes)
CREATE counter/src/app/app.routes.ts (77 bytes)
CREATE counter/public/favicon.ico (15086 bytes)
```

23 files. Quillo's starter, `quillo new hello --minimal`, makes 4 (`.gitignore`, `lib/greet.qwe`, `main.qwe`,
`ui/page.qwe`; the same quillo, measured for `../../64-vs-svelte-counter/compare/MEASURE.md`).

## 2. What you install, and its size

```
$ npm install                      # whole output in install.txt
added 575 packages, and audited 576 packages in 1m

$ npm ls --depth=0
counter@0.0.0 .../compare/counter
├── @angular/build@21.2.30
├── @angular/cli@21.2.30
├── @angular/common@21.2.26
├── @angular/compiler-cli@21.2.26
├── @angular/compiler@21.2.26
├── @angular/core@21.2.26
├── @angular/forms@21.2.26
├── @angular/platform-browser@21.2.26
├── @angular/router@21.2.26
├── jsdom@28.1.0
├── prettier@3.10.1
├── rxjs@7.8.2
├── tslib@2.9.1
├── typescript@5.9.3
└── vitest@4.1.12

$ du -sh node_modules
298M	node_modules
```

575 packages, 298 MB, with Node itself installed first. Quillo is one file, 30,584,944 bytes, 29M.

## 3. Lines you write

```
$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c counter/src/app/app.ts; c counter/src/app/app.html
15
4
$ c ../app/main.qwe
11
```

Angular: 15 + 4 = 19. Quillo: 11.

## 4. JavaScript, up to the first click

`measure-js.mjs` opens the page in a fresh browser (no cache), clicks once, waits for the button to say 2, and one
more second for anything late; each script response and each inline `<script>` is saved and taken with
`gzip -9 -c FILE | wc -c`. Angular is its production build (`npx ng build`, served from `dist/counter/browser` by
`serve-dist.mjs`); Quillo is `quillo run`, as it serves the page. Whole outputs: `js-angular.txt`, `js-quillo.txt`.

```
$ npx ng build
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-6OCPU7DC.js    | main          | 190.94 kB |                51.98 kB
styles-5INURTSO.css | styles        |   0 bytes |                 0 bytes
...
$ node measure-js.mjs angular <out>
  the button says: 2
  ...
  JavaScript: 1 pieces, 190935 B raw, 58246 B gzip -9 (56.9 KiB)
$ node measure-js.mjs quillo <out>
  the button says: 2
  ...
  JavaScript: 4 pieces, 137386 B raw, 38968 B gzip -9 (38.1 KiB)
```

58.2 KB against 39.0 KB, both taken with gzip -9 (Angular's own "estimated transfer size", 52.0 kB, is its
estimate of a smaller compression). Angular's has the router the starter sets up in `app.config.ts`.
