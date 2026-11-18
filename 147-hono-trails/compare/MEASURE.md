# Typed routes, Hono and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:36:28 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Bun:** 1.4.3; **Hono:** 4.13.19 (5 packages in node_modules: hono, @types/bun, bun-types, @types/node, undici-types)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

The Trail Guide of videos 128, 143, 145 and 146: six trails, a page for each at `/trails/<its number>`.

- **Hono** (`hono/`): the official starter, `bunx create-hono@latest hono --template bun --install --pm bun` (its
  tsconfig already has `"jsxImportSource": "hono/jsx"`). `src/index.ts` became `src/index.tsx` (38 non-blank lines): a
  `Page` and a `Missing` component in hono/jsx, the trails imported from `trails.json`, the style sheet from `public/`
  with `serveStatic` from `hono/bun`, `app.get('/trails/:id{[0-9]+}', ...)` (find the trail by `Number(c.req.param('id'))`,
  or a 404 page), and `app.notFound(...)` for the site's own 404 page; `export default { port: 8090, fetch: app.fetch }`.
  Run with `bun run src/index.tsx` (the `start` script added to package.json).
- **Quillo** (`../app/main.qwe`, 25 lines, the same as in the earlier Trail Guide videos): `route GET /trails/:id(int)`,
  a 404 for a missing trail, and `route GET /*rest`. `quillo check` prints `main.qwe: ok (3 routes, 2 functions, 0
  components)`.

shots.mjs also runs a strict copy in `build/strict/` (its node_modules linked to hono's), made with sed.
`diff hono/src/index.tsx build/strict/src/index.tsx`:

```
31c31
< app.get('/trails/:id{[0-9]+}', (c) => {
---
> app.get('/trails/:id{[1-9][0-9]*}', (c) => {
45c45
< export default { port: 8090, fetch: app.fetch }
---
> export default { port: 8092, fetch: app.fetch }
```

## Six addresses (status.sh)

`./status.sh <site>` asks six addresses with curl and prints each one's status and heading. Hono (8090):

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
404  /trails/0x2  404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

The strict copy (8092), and Quillo (8080), the same six lines:

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/0x2  404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

Tried by hand while making the video: Hono's first version also answers `/trails/+2` and `/trails/2.0` with 404.

## A POST to a trail

`curl -s -X POST -D - -o /dev/null localhost:<port>/trails/2 | grep -i -e '^HTTP' -e '^allow'`:

```
8090 (Hono):    HTTP/1.1 404 Not Found
8080 (Quillo):  HTTP/1.1 405 Method Not Allowed
                allow: GET, HEAD, OPTIONS
```
