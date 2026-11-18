# A bad JSON body, Express and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs each command as the
video's terminals show it, in zsh, in a copy under the temp folder (shown as `~/bakesale`; node_modules copied, so
Express's error page shows that folder), and keeps what it printed in `../assets/runs.json`. Measured on one machine.

- **When:** Thu Nov 19 2026 00:37:48 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Node:** v24.11.0; **Express:** 5.3.0; **express-validator:** 7.3.2 (68 packages in node_modules,
  `npm ls --all --parseable`)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The APIs

The bake sale's sign-ups, as in videos 131, 150 and 152: `POST /api/signups` takes a name, an email and a number of
guests, and `GET /api/signups` lists what was saved.

- **Express, the first try** (`express/variants/naive.js`, 13 non-blank lines): `express.json()`, then the name,
  email and guests taken from `req.body`, saved, and answered with 201. On 3000.
- **Express, fixed** (`express/app.js`, 26 lines): express-validator's `body()` rules (a string name, not empty
  once trimmed; `isEmail`; `isInt({ min: 0, max: 8 })`), `validationResult` answered with a 400 and the list,
  `matchedData` for only the checked fields, and an error handler that answers `entity.parse.failed` (broken JSON) with
  JSON. On 3001.
- **Quillo** (`../app/main.qwe`, 17 lines, video 131's): `type Signup = { name: str, email: str, guests: int }`,
  `Signup(request.json)` (a 400 with its error), and `problems` for the rules. `quillo check`: `main.qwe: ok (2 routes, 1 function, 0 components)`. On 8080.

`send.sh <address>` sends the same seven bodies and prints each answer's status and body (cut to 96 characters), then
what was saved (cut to 100).

## Express, the first try

```
~/bakesale/express $ node variants/naive.js &> express.log &
~/bakesale $ ./send.sh http://localhost:3000
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       201 {"name":"Ben","guests":1}
no guests      201 {"name":"Fay","email":"fay@example.com"}
guests: two    201 {"name":"Cy","email":"cy@example.com","guests":"two"}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     201 {"name":"","email":"nope","guests":-3}
not JSON       400 <!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Error</title></head><body><pre
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Ben","guests":1},{"name":"Fay","email"
~/bakesale/express $ curl -s -H 'Content-Type: application/json' -d '{"name":"Ed",' localhost:3000/api/signups | sed 's/<br>/\n/g; s/&nbsp;/ /g' | grep -E 'Error|node_modules'
<title>Error</title>
<pre>SyntaxError: Expected double-quoted property name in JSON at position 13 (line 1 column 14)
    at parse (~/bakesale/express/node_modules/body-parser/lib/types/json.js:93:21)
    at ~/bakesale/express/node_modules/body-parser/lib/read.js:194:18
    at invokeCallback (~/bakesale/express/node_modules/raw-body/index.js:238:16)
    at done (~/bakesale/express/node_modules/raw-body/index.js:227:7)
    at IncomingMessage.onEnd (~/bakesale/express/node_modules/raw-body/index.js:287:7)
```

With `NODE_ENV=production`:

```
~/bakesale/express $ NODE_ENV=production node variants/naive.js &> express.log &
~/bakesale/express $ curl -s -H 'Content-Type: application/json' -d '{"name":"Ed",' localhost:3000/api/signups | grep pre
<pre>Bad Request</pre>
```

## Quillo

```
~/bakesale/quillo $ quillo run main.qwe &> quillo.log &
~/bakesale $ ./send.sh http://localhost:8080
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"error":"Signup: `email` is missing"}
no guests      400 {"error":"Signup: `guests` is missing"}
guests: two    400 {"error":"Signup: `guests` must be int, got str \"two\""}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 {"error":"Signup: `name` is missing"}
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

## Express, fixed

```
~/bakesale/express $ node app.js &> express.log &
~/bakesale $ ./send.sh http://localhost:3001
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"errors":["email: not an email address"]}
no guests      400 {"errors":["guests: from 0 to 8"]}
guests: two    400 {"errors":["guests: from 0 to 8"]}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 {"error":"the body is not JSON"}
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```
