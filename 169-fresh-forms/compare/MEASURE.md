# Forms, Fresh and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `forms.mjs` posts eight sign-ups to a side
and one from a page on another site in a real browser; its tables are `forms-<side>.txt`, and what each case got is in
`../assets/forms-<side>.json`. Measured on one machine.

- **When:** Thu Nov 19 2026, 20:28 +08 (Fresh's starter), the runs at 20:32 and the screenshots at 20:33
- **Machine:** Apple M5, arm64; macOS 26.7.1
- **Deno:** deno 2.9.8 (stable, release, aarch64-apple-darwin); **Fresh:** @fresh/core 2.3.3 (with Vite 7.3.8)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)
- **Browser:** Chromium (Playwright's), headless

## The two sign-ups

Trail Club's sign-up for Saturday's hike: a name, and how many guests (1 to 12). A form that's wrong comes back with a
400, a message by each wrong field ("Your name, please", "From 1 to 12") and what was typed; one that's right is added,
and a 303 back to the list.

- **Fresh** (`fresh/`): the official starter, `deno run -Ar jsr:@fresh/init fresh` (`init.txt`), its demo routes,
  island and component taken out, `main.ts` down to `staticFiles()` and `fsRoutes()`, `assets/styles.css` emptied (the
  page uses the browser's own styles, as the Quillo page does), and the title in `routes/_app.tsx`. `deno add --dev
  npm:@types/node` for `node:sqlite`'s types. `routes/index.tsx`: Deno's built-in SQLite (`node:sqlite`), a
  `define.handlers` with `GET` (the list, with `page()`) and `POST`, which reads the form the way Fresh's forms guide
  does (`const form = await ctx.req.formData()`, `form.get("name")?.toString()`), checks the guests with `Number()` and
  `Number.isInteger`, answers `page(data, { status: 400 })` or adds the hiker and `ctx.redirect("/", 303)`; and the
  page, `define.page<typeof handler>`. `deno check main.ts routes` and `deno lint main.ts routes` pass. Built with
  `deno task build`, run with `deno serve -A --port 8000 _fresh/server.js` (what `deno task start` runs).
  Variants (`variants/`, put in place for a build by forms.mjs and shots.mjs, and the files put back after):
  - `strict-index.tsx`: a field only if it's text (`typeof v === "string"`), and guests only as digits
    (`/^[0-9]+$/`), three lines in place of two
  - `main-csrf.ts`: `app.use(csrf())` (Fresh's own middleware: it answers a 403 when `Sec-Fetch-Site` isn't
    `same-origin` or `none` and the `Origin` isn't the site's own)
- **Quillo** (`../app/`): `main.qwe`, `problems(name, guests)` (a message for each wrong field; `int()` for the guests),
  a `view Page`, `route GET /`, and `route POST /signup { form: { name: str = "", guests: str = "" } }`;
  `migrations/001_hikers.sql` makes the table. `quillo check`: `main.qwe: ok (2 routes, 2 functions, 0 components)`.
  Quillo refuses form posts from other sites' pages unless `allow_cross_site(path)` lets them in (its guide).

## The runs (forms.mjs)

Each side from a fresh `club.db`, its server started by the script. The eight sign-ups are sent as a form (the file one
as multipart); "added" is the list's new last line. Then the page at `http://127.0.0.1:9000/?to=<the form's address>`
(`other-site/index.html`, served by the script; the club is at `localhost`, another site to the browser) posts
`name=Someone else`, `guests=12` as it opens.

```
$ node forms.mjs fresh out.json
fresh
  guests=2        303  added "Ada: 2"
  guests=abc      400  From 1 to 12
  guests=1e1      303  added "Cy: 10"
  guests=0x0A     303  added "Dee: 10"
  guests=12.0     303  added "Eli: 12"
  no guests       400  From 1 to 12
  name=(spaces)   400  Your name, please
  name=(a file)   303  added "[object File]: 2"
  other site      303  added "Someone else: 12"
$ node forms.mjs fresh-strict out.json
fresh-strict
  guests=2        303  added "Ada: 2"
  guests=abc      400  From 1 to 12
  guests=1e1      400  From 1 to 12
  guests=0x0A     400  From 1 to 12
  guests=12.0     400  From 1 to 12
  no guests       400  From 1 to 12
  name=(spaces)   400  Your name, please
  name=(a file)   400  Your name, please
  other site      303  added "Someone else: 12"
$ node forms.mjs fresh-csrf out.json
fresh-csrf
  guests=2        303  added "Ada: 2"
  guests=abc      400  From 1 to 12
  guests=1e1      303  added "Cy: 10"
  guests=0x0A     303  added "Dee: 10"
  guests=12.0     303  added "Eli: 12"
  no guests       400  From 1 to 12
  name=(spaces)   400  Your name, please
  name=(a file)   303  added "[object File]: 2"
  other site      403  not added
$ node forms.mjs quillo out.json
quillo
  guests=2        303  added "Ada: 2"
  guests=abc      400  From 1 to 12
  guests=1e1      400  From 1 to 12
  guests=0x0A     400  From 1 to 12
  guests=12.0     400  From 1 to 12
  no guests       400  From 1 to 12
  name=(spaces)   400  Your name, please
  name=(a file)   400  Your name, please
  other site      403  not added
```

The page the browser was left on after the other site's post: Fresh with csrf(), `Forbidden`; Quillo,
`this site does not take form posts from other sites` (both 403).

## Where Quillo puts a file (files-check/)

A multipart post with a file in `name`, to a route that answers `request.form` and `request.files`:

```
$ curl -s -F name=@hello.txt -F guests=2 http://127.0.0.1:8141/x
{"form":{"guests":"2"},"files":{"name":{"field":"name","filename":"hello.txt","type":"text/plain","size":6,"start":145,"end":151}}}
```

So the sign-up's `name` was missing, took its default `""`, and got "Your name, please".

## The screenshots (../shots.mjs)

Fresh (the guide's build) and Quillo, each from a fresh `club.db`, in a browser: `*_form` (Ada signs up for 2, then the
form sent with no name and "abc"), `*_list` (then Cy types 1e1, a file is posted as the name, and the other site's page
posts), and `*_403` (the other site's post: Fresh with `main-csrf.ts`, and Quillo).

## Not measured

No speed numbers: other work was running on the machine (everything here ran at background priority).
