# Typed routes, Express and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:30:06 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **Express:** 5.3.0; **EJS:** 7.0.2 (`npm init -y`, `npm i express ejs`: 66 packages in node_modules)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

The Trail Guide of videos 128, 143 and 145: six trails, a page for each at `/trails/<its number>`.

- **Express** (`express/`): EJS views in `views/` (a layout's top and bottom, home, trail, missing: 19 lines), the style
  sheet in `public/`, `trails.json`. On 8090.
  - `variants/naive.js` (13 lines), the first try: `app.get('/trails/:id', ...)` finds
    `trails.find((t) => t.id == req.params.id)` and renders it, with no check.
  - `app.js` (17 lines), the fix: the id's text must match `/^[1-9][0-9]*$/` (or `next()`), a strict comparison with
    `Number(req.params.id)`, a 404 page for a missing trail, and a last `app.use` handler that renders the 404 page.
  - `variants/pattern.js`: the first try with `app.get('/trails/:id(\\d+)', ...)`.
- **Quillo** (`../app/main.qwe`, 25 lines, the same as in videos 128, 143 and 145): `route GET /trails/:id(int)`, a
  404 for a missing trail, and `route GET /*rest` for the rest. `quillo check` prints `main.qwe: ok (3 routes, 2
  functions, 0 components)`.

shots.mjs copies `express/` (with its node_modules) to the system's temp folder and runs it from there, so the error page
shows that folder and not this machine's home folder.

## Six addresses (status.sh)

`./status.sh <site>` asks six addresses with curl, and prints each one's status and heading, or the error's name. The
first try (8090):

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
200  /trails/0x2  Eagle Ridge
500  /trails/abc  TypeError
500  /trails/999  TypeError
404  /nope
```

The same with `NODE_ENV=production`: the same statuses, and the 500 page is only "Internal Server Error".

The fix (8090), and Quillo (8080), the same six lines:

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/0x2  404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

Tried by hand while making the video: the first try also serves Eagle Ridge at `/trails/+2` and `/trails/2.0`; the fix
answers both with 404.

The first try's page for `/trails/abc` (development, the default), its first lines as text:

```
TypeError: /private/var/folders/sn/97ygtwxj5cd6f9p3lq42mdc00000gn/T/trail-guide/views/trail.ejs:1
 >> 1| <%- include('layout-top', { title: trail.name }) %>
    2| <a href="/">← All trails</a>
    3| <h1><%= trail.name %></h1>
    4| <p class="facts"><%= trail.km %> km · <%= trail.climb %> m climb · <%= trail.level %></p>
Cannot read properties of undefined (reading 'name')
    at eval ("/private/var/folders/sn/97ygtwxj5cd6f9p3lq42mdc00000gn/T/trail-guide/views/trail.ejs":10:54)
    at trail (/private/var/folders/sn/97ygtwxj5cd6f9p3lq42mdc00000gn/T/trail-guide/node_modules/ejs/lib/cjs/ejs.js:649:23)
    ...
```

## A pattern in the path

`node variants/pattern.js 2>&1 | grep '^PathError'` (Express 5 stops at start):

```
PathError [TypeError]: Unexpected ( at index 11: /trails/:id(\d+); visit https://git.new/pathToRegexpError for info
```

## A POST to a trail

`curl -s -X POST -D - -o /dev/null localhost:<port>/trails/2 | grep -i -e '^HTTP' -e '^allow'`:

```
8090 (Express, each version):  HTTP/1.1 404 Not Found
8080 (Quillo):                 HTTP/1.1 405 Method Not Allowed
                               allow: GET, HEAD, OPTIONS
```
