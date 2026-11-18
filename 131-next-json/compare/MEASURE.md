# Next.js route handlers and zod vs Quillo's typed routes: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 14:29:11 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **npm:** 11.6.1
- **create-next-app:** 16.4.6; **Next.js:** 16.4.6; **React:** 19.3.1; **zod:** 4.6.7
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)`

## The apps

- **Next.js** (`next/`): the official API starter, `npx create-next-app@latest next --api --js --eslint --use-npm
  --disable-git --no-agent-feedback --no-tailwind --no-src-dir --import-alias "@/*" --yes`, then `npm install zod`
  (dependencies: next, zod). The starter's own routes stay; `app/api/signups/route.js` is added, two ways
  (`variants/`): `naive.js` reads the body with `await request.json()`, as the route.js reference reads a body, and saves
  it; `zod.js` checks it with a zod schema (`name: z.string().min(1)`, `email: z.email()`, `guests: z.int().min(0).max(8)`),
  `safeParse`, and answers 400 with `z.flattenError(result.error)`, as Next's docs suggest a schema library like Zod for
  server-side validation. `next.config.mjs` takes its `distDir` from `DIST`, so `build-variants.sh` builds each into its
  own folder (`.next/naive`, `.next/zod`). (The starter's `--eslint` made no ESLint config in the API starter, so nothing
  is linted.)
- **Quillo**: `../steps/pattern/main.qwe`, `route POST /api/signups { json: Signup }` with
  `type Signup = { name: str, email: str, guests: int }` (`quillo check`: `main.qwe: ok (2 routes, 0 functions, 0 components)`); and
  `../app/main.qwe`, `Signup(request.json)` with its error as a 400, and a `problems` function for an empty name, an
  email that isn't one, and guests outside 0 to 8 (`quillo check`: `main.qwe: ok (2 routes, 1 function, 0 components)`).

Non-blank lines: naive.js 10, zod.js 19; Quillo's pattern 8, with messages and rules 17.

## The same six bodies (send.sh)

shots.mjs runs the two Next.js builds with `next start` (3101 naive, 3102 zod) and the two Quillo versions with
`quillo run main.qwe` (8081 the pattern, 8080 with rules), each fresh, then `send.sh` sends each the same six bodies to
`POST /api/signups` with curl (`Content-Type: application/json`), and lists what was saved (`GET /api/signups`). Each
line: the body's name, the status, and the answer's first 96 characters (the saved list's first 100).

`./send.sh http://localhost:3101` (Next.js, request.json()):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       201 {"name":"Ben","guests":1}
guests: two    201 {"name":"Cy","email":"cy@example.com","guests":"two"}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0,"paid":true}
bad values     201 {"name":"","email":"nope","guests":-3}
not JSON       500 
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Ben","guests":1},{"name":"Cy","email":
```

For the body that isn't JSON, Next.js's server log printed `⨯ SyntaxError: Expected double-quoted property name in JSON at position 13 (line 1 column 14)` and a stack, and answered 500 with an
empty body.

`./send.sh http://localhost:3102` (Next.js, zod):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"formErrors":[],"fieldErrors":{"email":["Invalid input: expected string, received undefined"]}}
guests: two    400 {"formErrors":[],"fieldErrors":{"guests":["Invalid input: expected number, received string"]}}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"formErrors":[],"fieldErrors":{"name":["Too small: expected string to have >=1 characters"],"em
not JSON       500 
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

`./send.sh http://localhost:8081` (Quillo, `{ json: Signup }`):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 bad request: no route pattern matches this request
guests: two    400 bad request: no route pattern matches this request
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     201 {"name":"","email":"nope","guests":-3}
not JSON       400 bad request: no route pattern matches this request
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

`./send.sh http://localhost:8080` (Quillo, with messages and rules):

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"error":"Signup: `email` is missing"}
guests: two    400 {"error":"Signup: `guests` must be int, got str \"two\""}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 {"error":"Signup: `name` is missing"}
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

Two problems in one body, `{"name":"Ed","guests":"two"}`:

- zod: `{"formErrors":[],"fieldErrors":{"email":["Invalid input: expected string, received undefined"],"guests":["Invalid input: expected number, received string"]}}`
- Quillo: `{"error":"Signup: `email` is missing"}`
