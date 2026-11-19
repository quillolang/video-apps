# A page from a table, Next.js 16 vs Quillo: the measurements

Every number and list in the Short (the browser windows and the `versus` scene in `../video.json`) comes from a
command below, with what it printed, copied from the run. Measured on one machine; your numbers will vary.

- **When:** Thu Nov 19 14:04:12 +08 2026 (`date`, as the first command ran)
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Node:** v24.11.0 (`node -v`); **npm:** 11.6.1 (`npm -v`); **sqlite3** (the command): macOS's own
- **Next.js:** 16.4.6, React 19.3.0, better-sqlite3 13.2.0 (`npm ls --depth=0`, below)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (`.quillo/bin/quillo --version`)

The scripts that measured are in this folder: `fresh.mjs` (does the page show a trail added while it runs?) and
`shots-next.mjs` (Next.js's screenshots, from both builds). Everything ran under `taskpolicy -b`.

## The two apps

A page that lists the trails in a SQLite table, three to start with (`seed.sql`).

- **Next.js** (`next/`): `create-next-app@16.4.6 next --yes` (its recommended defaults: TypeScript, the App Router,
  Tailwind, ESLint, and `cacheComponents: true` in `next.config.ts`), with `better-sqlite3` added and `app/page.tsx`
  replaced. The table is made with `sqlite3 trails.db < ../seed.sql`, since Next.js has no migrations of its own.
  - **The first try** (`variants/static/page.tsx`): a server component that reads the table with better-sqlite3 and
    lists it.
  - **As it is** (`next/app/page.tsx`): the same read in an async component that first calls
    `await connection()` (from `next/server`), which tells Next.js to render it on each request, inside a
    `<Suspense>` boundary, which Cache Components asks for around request-time data.
  Every other file is the starter's, unchanged. (`next build` warns that it found two lockfiles and took
  ~/dev/quillo-videos as the workspace root: that's this folder sitting inside another project, not the app.)
- **Quillo** (`../app/`): `main.qwe` opens the database and runs `migrations/001_trails.sql` (the same SQL as
  `seed.sql`), and `route GET / with db` reads the table and lists it. `quillo check` prints
  `main.qwe: ok (1 route, 0 functions, 0 components)`.

Every line of each file is 50 characters or less, for the Short's editor.

## Does the page show a trail added while it runs?

`fresh.mjs` makes each side's `trails.db` afresh with the three trails, starts the server, and fetches the page;
then inserts a fourth trail with the `sqlite3` command, and fetches the page again, at once and two seconds later.
For Next.js in production, the page was built from the three trails first (`next build`).

```
$ npx next build                    # the first try (whole output: build-static.txt)
Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content

$ node fresh.mjs next               # next start -p 3010 (fresh-static.txt)
before:        Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8 km
added a trail: Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8 km
2 s later:     Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8 km

$ node fresh.mjs next-dev           # the first try in next dev -p 3011 (fresh-static-dev.txt)
before:        Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8 km
added a trail: Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8 km
2 s later:     Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8 km

$ npx next build                    # as it is, with connection() (build-dynamic.txt)
Route (app)
┌ ◐ /
└ ○ /_not-found

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content

$ node fresh.mjs next               # fresh-dynamic.txt
before:        Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8 km
added a trail: Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8 km
2 s later:     Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8 km

$ node fresh.mjs quillo             # quillo run main.qwe --port 8118 (fresh-quillo.txt)
before:        Coastal Path: 12.5 km · Fern Gully: 4.2 km · Ridge Loop: 8.0 km
added a trail: Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8.0 km
2 s later:     Coastal Path: 12.5 km · Fern Gully: 4.2 km · Lake Trail: 6.1 km · Ridge Loop: 8.0 km
```

The first try looked right while working (`next dev` renders on each request), and stayed at the build's three
trails in production: `next build` marked it Static and prerendered it, since nothing in it reads the request (the
database read is a plain synchronous call). The screenshots are from the same steps, by `shots-next.mjs` (both
builds; it checks for 3 and 3 trails, then 3 and 4) and `../shots.mjs` (3, then 4), all 320x160 at 3x.

(Quillo prints the `real` 8 as "8.0", JavaScript as "8".)

## Files, packages, size and lines

```
$ npx -y create-next-app@16.4.6 next --yes --skip-install --disable-git </dev/null
...
Success! Created next at .../compare/next
$ find next -type f | sort
next/.gitignore
next/AGENTS.md
next/README.md
next/app/favicon.ico
next/app/globals.css
next/app/layout.tsx
next/app/page.tsx
next/eslint.config.mjs
next/next-env.d.ts
next/next.config.ts
next/package.json
next/public/file.svg
next/public/globe.svg
next/public/next.svg
next/public/vercel.svg
next/public/window.svg
next/tsconfig.json

$ npm install                               # in next/; install-1.txt
added 432 packages, and audited 433 packages in 3m
$ npm install better-sqlite3 @types/better-sqlite3      # install-2.txt
added 3 packages, and audited 436 packages in 4s

$ npm ls --depth=0
next@0.1.0 .../compare/next
├── @tailwindcss/turbopack@4.3.3
├── @types/better-sqlite3@9.6.0
├── @types/node@20.19.43
├── @types/react-dom@19.3.0
├── @types/react@19.3.0
├── better-sqlite3@13.2.0
├── eslint-config-next@16.4.6
├── eslint@9.39.5
├── next@16.4.6
├── react-dom@19.3.0
├── react@19.3.0
├── tailwindcss@4.3.3
└── typescript@5.9.3
$ du -sh node_modules
512M	node_modules

$ c() { grep -v '^\s*$' "$1" | grep -cv '^\s*//'; }
$ c next/app/page.tsx; c seed.sql
27
9
$ c ../app/main.qwe; c ../app/migrations/001_trails.sql
9
9
```

- Files the starter makes: 17. Quillo's starter, `quillo new hello --minimal`, makes 4.
- What you install: 432 + 3 = 435 packages, 512 MB, with Node itself installed first. Quillo is one file,
  30,584,944 bytes, 29M, with SQLite built in.
- Lines you write: Next.js 27 + 9 = 36 (the page as it is; the first try was 17); Quillo 9 + 9 = 18.
