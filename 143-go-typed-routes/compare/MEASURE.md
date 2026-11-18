# Typed routes, Go and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs them and keeps the results
in `../assets/runs.json`. Measured on one machine.

- **When:** Wed Nov 18 2026 22:02:21 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Go:** `go version go1.27.4 darwin/arm64`, the release from go.dev (its archive checked against the SHA-256 that
  go.dev publishes), run with `GOTOOLCHAIN=local`
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh)

## The sites

The Trail Guide of video 128: six trails, a page for each at `/trails/<its number>`, and a 404 page of the site's own.

- **Go** (`go/`): `go mod init trailguide`, then `main.go` (61 non-blank lines) and four templates in `templates/`
  (layout, home, trail and missing: 19 lines), built into the program with `embed` and parsed once with
  `html/template`. Only the standard library: `go list -m all` prints just `trailguide`, and `go vet .` prints nothing.
  The routes are Go 1.22 patterns on a `ServeMux`: `GET /{$}` (the home page only), `GET /trails/{id}` (the id read with
  `strconv.Atoi(r.PathValue("id"))`; not a number: the 404 page "No such page"; no such trail: "No such trail"),
  `GET /trails.css`, and `GET /` for every other address (the 404 page). On 8090.
- **Quillo** (`../app/main.qwe`, 25 lines, the same as video 128's): `route GET /trails/:id(int)`, a 404 for a missing
  trail, and `route GET /*rest` for the rest. `quillo check` prints `main.qwe: ok (3 routes, 2 functions, 0
  components)`. On 8080.

`build-variants.sh build` builds the Go site three ways in `build/` (with the `go` on PATH, or `$GO`):

- **app**: `go/` as it is (8090).
- **catch-all**: the last pattern `"/"` instead of `"GET /"` (8091). `diff go/main.go build/catch-all/main.go`:

```
58c58
< 	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
---
> 	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
61c61
< 	log.Fatal(http.ListenAndServe(":8090", mux))
---
> 	log.Fatal(http.ListenAndServe(":8091", mux))
```

- **strict**: the id must read back as the same text (8092). `diff go/main.go build/strict/main.go`:

```
43c43
< 		if err != nil {
---
> 		if err != nil || strconv.Itoa(id) != r.PathValue("id") {
61c61
< 	log.Fatal(http.ListenAndServe(":8090", mux))
---
> 	log.Fatal(http.ListenAndServe(":8092", mux))
```

## Six addresses (status.sh)

`./status.sh <site>` asks six addresses with curl and prints each one's status and heading. Go (8090):

```
200  /trails/2    Eagle Ridge
200  /trails/02   Eagle Ridge
200  /trails/+2   Eagle Ridge
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

Quillo (8080), and Go's strict build (8092), the same six lines:

```
200  /trails/2    Eagle Ridge
404  /trails/02   404: No such page
404  /trails/+2   404: No such page
404  /trails/abc  404: No such page
404  /trails/999  404: No such trail
404  /nope        404: No such page
```

Tried by hand while making the video, not in the scripts: Quillo also answers `/trails/2.0`,
`/trails/99999999999999999999` and `/trails/%202` with "No such page", and `/trails/-1` with "No such trail" (-1 is a
whole number, and no trail has it).

## A POST to a trail

`curl -s -X POST -D - -o /dev/null localhost:<port>/trails/2 | grep -i -e '^HTTP' -e '^allow'`:

```
8090 (Go):          HTTP/1.1 405 Method Not Allowed
                    Allow: GET, HEAD
8080 (Quillo):      HTTP/1.1 405 Method Not Allowed
                    allow: GET, HEAD, OPTIONS
8091 (catch-all):   HTTP/1.1 404 Not Found
```

## Go's docs

- "Routing Enhancements for Go 1.22" (https://go.dev/blog/routing-enhancements): "A wildcard can match an entire
  segment, like {id} in the example above"; and a request whose method no pattern takes gets "a 405 Method Not Allowed
  error that lists the available methods in an Allow header".
- net/http, ServeMux (https://pkg.go.dev/net/http#ServeMux): "the pattern "/{$}" matches only the path "/", whereas the
  pattern "/" matches every path"; "A pattern with the method GET matches both GET and HEAD requests."
- strconv (https://pkg.go.dev/strconv): "Atoi is equivalent to ParseInt(s, 10, 0), converted to type int."; and for
  ParseInt, "The string may begin with a leading sign: "+" or "-"."
