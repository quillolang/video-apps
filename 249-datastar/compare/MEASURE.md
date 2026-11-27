# Quillo 0.8.11 vs Datastar 1.0.5: how it was measured

The same shared shopping list, built twice: add an item, tick it off, hide what's done, and every open tab
follows.

- `datastar/`: Datastar 1.0.5 (`static/datastar.js`, from jsDelivr's `bundles/datastar.js` at the v1.0.5 tag)
  with its Go SDK, `github.com/starfederation/datastar-go` 1.2.2, `net/http`, `html/template` and SQLite through
  `modernc.org/sqlite`, on Go 1.27.4. It follows Datastar's guide: signals in `data-signals`, `data-bind`,
  `data-on:submit="@post('/add')"`, and one long-lived `@get('/updates')` stream per page (the guide's CQRS
  pattern), fed by a small hub of open streams. `go build -o shoplist . && ./shoplist` serves it on
  127.0.0.1:8190.
- `../app/`: Quillo 0.8.11, one `main.qwe` and a migration. `./run.sh --port 8191`.

Both pages have the same markup and the same one-line style.

## Scripts

- `measure.mjs [datastar|quillo]` starts each app with a fresh database and plays it in Chromium (Playwright),
  two tabs, writing `runs/<side>.json`: the scripts the page ran (sizes as sent, and gzipped at level 9), the
  bytes of one add (DevTools protocol: request bodies, response data, WebSocket frames), the delay before the
  other tab shows a new item (20 adds, median), an empty add, ticking an item in the other tab, Hide done, typing
  in one tab while the other adds, a name with markup, and two restarts (server down 3 s and 20 s, then an add
  from a fresh tab).
- `mistakes.mjs` makes the same small mistakes in temporary copies of both apps, checks each (`go vet .`,
  `go build`, `quillo check`), runs what builds, adds an item, and writes `runs/mistakes.json`.
- `../shots.mjs` takes the video's screenshots from both apps the same way.

## Results (2026-11-27, Apple Silicon Mac, one run each; earlier runs agreed)

| | Datastar 1.0.5 + Go | Quillo 0.8.11 |
|---|---|---|
| JavaScript the page runs | 35,673 B (14,130 B gzipped; Go's file server sends it uncompressed) | 175,499 B (50,614 B gzipped; sent gzipped) |
| Other tab shows a new item, median of 20 | 35 ms | 125 ms |
| Bytes for one add, tab 1 up / down, tab 2 down | 45 / 399 / 317 | 10 / 176 / 165 |
| Requests for one add | `POST /add`; both tabs get HTML on their open stream | `rpc/add`, then each tab `rpc/items` after a live notice |
| An empty add | "Type something to add" | "Type something to add" |
| Hide done | no request | no request |
| Typing "Bre" in tab 1 while tab 2 adds | kept, with focus | kept, with focus |
| A name `<b>Bold</b> beans` | shown as typed (html/template escapes) | shown as typed |
| Server down 3 s, then an add | tab 1 and 2 after 3.5 s | 0.3 s and 1.1 s |
| Server down 20 s, then an add | tab 1 and 2 after 3.5 s | 13.2 s and 11.9 s |
| Non-blank lines | 159 in main.go (23 of them the template) | 41 in main.qwe + 5 of SQL |

Restart times depend on where each client's retry timer is when the server comes back: an earlier run gave
Datastar 0.01 s / 7.5 s and Quillo 4.7 s / 11.3 s for the two outages. Both always caught up with no reload.

## Mistakes

| Mistake | Datastar: go vet, go build | Datastar: on the page | Quillo: quillo check |
|---|---|---|---|
| `$problem` spelled `$problme` (`{problme && ...}` in Quillo) | pass | an empty add shows no message; no console error | `main.qwe:37: error: unknown name `problme` (did you mean `problem`?)` |
| `@post('/ad')` (`ad(item)` in Quillo) | pass | Milk stays in the box; the console has a 404 | `main.qwe:31: error: unknown name `ad` (did you mean `add`?)` |
| the struct reads `json:"name"`, the page sends `item` (in Quillo: `add({ name: item })`) | pass | "Type something to add" with Milk typed; no error | `main.qwe:31: error: argument `name` of `add` must be str, got map` |
| the list written with `fmt.Fprintf`, as the SDK's `PatchElementf` does | pass | `<b>Bold</b> beans` shows **Bold** in bold | not a mistake Quillo can make without `raw()` |

Datastar has editor extensions (VS Code, IntelliJ) with diagnostics; they were not part of this.
