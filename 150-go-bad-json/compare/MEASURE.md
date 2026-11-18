# A bad JSON body, Go and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:53:21 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Go:** `go version go1.27.4 darwin/arm64`, the release from go.dev (its archive checked against the SHA-256 that go.dev
  publishes), run with `GOTOOLCHAIN=local`; only the standard library (`go list -m all` prints just `signups`; `go vet .`
  prints nothing)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The APIs

The bake sale's sign-ups, as in video 131: `POST /api/signups` takes a name, an email and a number of guests, and
`GET /api/signups` lists what was saved.

- **Go, the first try** (`go/variants/naive.go.txt`, 39 non-blank lines): `type Signup struct { Name string; Email
  string; Guests int }` with JSON tags, `json.NewDecoder(r.Body).Decode(&s)` (a 400 with the error if it fails), then
  saved behind a mutex and answered with 201. On 8090.
- **Go, fixed** (`go/main.go`, 66 lines): `Guests *int`, so a missing number is nil; `dec.DisallowUnknownFields()`;
  and `problems()`, the same rules as Quillo's (an empty name, an email that doesn't look like one, guests missing or not
  from 0 to 8), answered with a 400 and the list. On 8091 (the build's copy).
- **Quillo** (`../app/main.qwe`, 17 lines, the same as video 131's): `type Signup = { name: str, email: str, guests:
  int }`, `Signup(request.json)` (a 400 with its error if the body isn't a sign-up), and `problems` for the rules.
  `quillo check` prints `main.qwe: ok (2 routes, 1 function, 0 components)`. On 8080.

`build-variants.sh build` builds both Go versions in `build/` with the `go` on PATH (or `$GO`).

## Seven bodies (send.sh)

`./send.sh <api>` sends the same seven bodies (a good one, no email, no guests, guests as text, an extra field `paid`,
bad values, and JSON cut short) and prints each answer's status and body, then what was saved. Go's first try:

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       201 {"name":"Ben","email":"","guests":1}
no guests      201 {"name":"Fay","email":"fay@example.com","guests":0}
guests: two    400 json: cannot unmarshal string into Go struct field Signup.guests of type int
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     201 {"name":"","email":"nope","guests":-3}
not JSON       400 unexpected EOF
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Ben","email":"","guests":1},{"name":"F
```

Quillo:

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"error":"Signup: `email` is missing"}
no guests      400 {"error":"Signup: `guests` is missing"}
guests: two    400 {"error":"Signup: `guests` must be int, got str \"two\""}
paid: true     201 {"name":"Di","email":"di@example.com","guests":0}
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 {"error":"Signup: `name` is missing"}
saved          [{"name":"Ana","email":"ana@example.com","guests":2},{"name":"Di","email":"di@example.com","guests":
```

Go, fixed:

```
good           201 {"name":"Ana","email":"ana@example.com","guests":2}
no email       400 {"errors":["email: not an email address"]}
no guests      400 {"errors":["guests: missing"]}
guests: two    400 json: cannot unmarshal string into Go struct field Signup.guests of type int
paid: true     400 json: unknown field "paid"
bad values     400 {"errors":["name: empty","email: not an email address","guests: from 0 to 8"]}
not JSON       400 unexpected EOF
saved          [{"name":"Ana","email":"ana@example.com","guests":2}]
```
