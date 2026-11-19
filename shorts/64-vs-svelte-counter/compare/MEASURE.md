# Svelte 5 vs Quillo, a value that follows: the measurements

Every number in the Short (the `versus` scene in `../video.json`) comes from a command below, with what it
printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 12:44:05 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`)
- **sv:** 1.5.0; **SvelteKit:** 3.4.0; **Svelte:** 5.58.0; **Vite:** 8.3.8 (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

KB is 1,000 bytes. The scripts that measured are in this folder: `shots-svelte.mjs` (Svelte's screenshots, and
the plain-let variant's warning) and `measure-js.mjs` (the JavaScript). Everything ran under `taskpolicy -b`.

## The two apps

- **Svelte** (`svelte/`): Svelte's own starter, `npx sv create` with the minimal template and TypeScript, with
  `src/routes/+page.svelte` replaced by the example on https://svelte.dev/docs/svelte/$derived, verbatim:
  `let count = $state(0)`, `let doubled = $derived(count * 2)`, a button that shows `{doubled}`, and
  "{count} doubled is {doubled}". Every other file is the starter's, unchanged.
- **Quillo** (`../app/main.qwe`): the same counter, the same text, as one component and its route. A `let` in a
  component is derived already (the 0.8.6 guide: "There is no `useEffect`, no dependency list and no `useMemo`:
  `let` is already derived"). `quillo check` prints `main.qwe: ok (1 route, 0 functions, 1 component)`.
- **Svelte with a plain let** (`variants/plain-let/+page.svelte`): the docs' example with `$derived(...)` taken
  out, `let doubled = count * 2`, put in place of `+page.svelte` for its run and put back after.

Both were clicked in a browser three times and say "6" and "3 doubled is 6"; the plain-let one says "0" and
"3 doubled is 0", as Svelte's docs say it will ("Without the `$derived` rune, `doubled` would maintain its original
value even when `count` changes"). The screenshots are from `npm run dev` (port 5173) and `quillo run` (8111),
both 320x128 at 3x: `node ../shots.mjs` and `node shots-svelte.mjs`, which check each page's text first.

## 1. Files the starter makes

Svelte, in `compare/`, before `npm install`:

```
$ npx -y sv@latest create svelte --template minimal --types ts --no-add-ons --no-install
┌  Welcome to the Svelte CLI! (v1.5.0)
│
◆  Project created
...
└  You're all set!

$ find svelte -type f | sort
svelte/.gitignore
svelte/.npmrc
svelte/.vscode/extensions.json
svelte/README.md
svelte/package.json
svelte/src/app.d.ts
svelte/src/app.html
svelte/src/lib/assets/favicon.svg
svelte/src/lib/index.ts
svelte/src/routes/+layout.svelte
svelte/src/routes/+page.svelte
svelte/static/robots.txt
svelte/tsconfig.json
svelte/vite.config.ts
```

14 files. Quillo's starter, `quillo new --minimal`, in an empty scratch folder:

```
$ quillo new hello --minimal
made hello: cd hello && quillo run --watch, then open http://127.0.0.1:8080
$ find hello -type f | sort
hello/.gitignore
hello/lib/greet.qwe
hello/main.qwe
hello/ui/page.qwe
```

4 files.

## 2. What you install, and its size

```
$ npm install
added 86 packages, and audited 87 packages in 26s

23 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

$ npm ls --depth=0
svelte@0.0.1 .../compare/svelte
├── @sveltejs/adapter-auto@8.0.1
├── @sveltejs/kit@3.4.0
├── @sveltejs/vite-plugin-svelte@7.3.1
├── $app@ extraneous
├── svelte-check@4.7.8
├── svelte@5.58.0
├── typescript@6.0.3
└── vite@8.3.8

$ du -sh node_modules
 73M	node_modules
```

86 packages, 73 MB, right after the install (a build adds Vite's cache to node_modules: 81M after the runs
below), with Node itself installed first. Quillo is one file:

```
$ ls -l ../app/.quillo/bin/quillo
-rwxr-xr-x@ 1 you  staff  30584944 Nov 16 17:28 ../app/.quillo/bin/quillo
$ du -h ../app/.quillo/bin/quillo
 29M	../app/.quillo/bin/quillo
```

## 3. Lines you write

Non-blank lines, without comments, counted the same way for both:

```
$ grep -v '^\s*$' svelte/src/routes/+page.svelte | grep -cv '^\s*//'
8
$ grep -v '^\s*$' ../app/main.qwe | grep -cv '^\s*//'
11
```

Svelte wins: its page is a file in `src/routes/`, and SvelteKit routes it by its path. Quillo's 11 lines hold the
`route GET /` line and the `<div>` a component's one root element needs.

## 4. JavaScript, up to the first click

`measure-js.mjs` opens the page in a fresh browser (no cache), clicks once, waits for the button to say 2, and one
more second for anything late; each script response and each inline `<script>` is saved and taken with
`gzip -9 -c FILE | wc -c`. Svelte is SvelteKit's production build (`npm run build`, then `vite preview`); Quillo is
`quillo run`, as it serves the page. Whole outputs: `js-svelte.txt` and `js-quillo.txt`.

```
$ npm run build            # in svelte/
...
✓ built in 101ms
$ node measure-js.mjs svelte <out>
  the button says: 2
  ...
  JavaScript: 11 pieces, 84537 B raw, 33178 B gzip -9 (32.4 KiB)
$ node measure-js.mjs quillo <out>
  the button says: 2
  ...
  JavaScript: 4 pieces, 137386 B raw, 38968 B gzip -9 (38.1 KiB)
```

33.2 KB against 39.0 KB: Svelte wins.

## 5. Without $derived: Svelte's warning

With `variants/plain-let/+page.svelte` in place, all three of Svelte's tools warn, and the page stays at 0:

```
$ npm run check
...
1795063551045 WARNING "src/routes/+page.svelte" 3:16 "This reference only captures the initial value of `count`. Did you mean to reference it inside a closure instead?\nhttps://svelte.dev/e/state_referenced_locally"
1795063551045 COMPLETED 172 FILES 0 ERRORS 1 WARNINGS 1 FILES_WITH_PROBLEMS

$ npx vite build
...
12:45:53 PM [vite-plugin-svelte] src/routes/+page.svelte:3:15 This reference only captures the initial value of `count`. Did you mean to reference it inside a closure instead?
https://svelte.dev/e/state_referenced_locally
1: <script>
2:   let count = $state(0);
3:   let doubled = count * 2;
                        ^
4: </script>
```

The Short's terminal is the dev server's log from `shots-svelte.mjs` (`../assets/svelte-dev.txt`, whole), up to
the warning's link, without its blank lines.
