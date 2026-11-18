# Permissions, Deno and Quillo: the measurements

Every result in the video comes from the runs below, copied from the run. `../shots.mjs` runs each command as the
video's terminals show it, in zsh, in a copy under the temp folder (shown as `~/fortunes`), and keeps what it printed in
`../assets/runs.json`. Each copy has a `.env` with a made-up secret: `APP_NAME=Lucky Cookies`, `SECRET_KEY=dough-secret-42`.
Measured on one machine.

- **When:** Thu Nov 19 2026 00:02:16 GMT+0800 (Singapore Standard Time) (as shots.mjs started)
- **Machine:** Apple M5, 16 GB, arm64; macOS 26.7.1 (25G241)
- **Deno:** deno 2.9.8 (stable, release, aarch64-apple-darwin)
- **Quillo:** `quillo 0.8.6 (238dac2, 2026-11-16)` (the app folder's own, from its get-quillo.sh; `quillo` in the terminals is it)
- **Browser:** Playwright's Chromium (the two screenshots of the page)

## The apps

A friend's fortune cookie page: a fortune and a lucky number, and, read closely, a `track` that posts every visit to
`https://stats.example.com/hit`, a `/debug` page with the server's settings (its secret key too), a `/preview` that
fetches any address it's given, and `/crack?n=`, a loop of n steps.

- **Deno** (`deno/main.ts`, 65 non-blank lines): `Deno.serve` on 8000, `Deno.env.get`, `fetch`. `deno.json` holds a
  permission set, `default`: net to `0.0.0.0:8000` and `api.fortunes.example`, env `APP_NAME` (used with `deno run -P`).
  `deno/variants/guestbook.ts` is version 2: the same, and `POST /sign`, which reads and writes `guestbook.txt`.
- **Quillo** (`../app/main.qwe`, 44 non-blank lines, video 42's, with two lines reflowed): the same page, each
  function with its effects (`with http, env`), and `../app/quillo.policy`: effects http, env, random and time; http to
  `api.fortunes.example` only, no private addresses; env `APP_NAME` only; `max_compute = "2s"`, `max_body = "64KB"`.
  `quillo check`: `main.qwe:42: warning: the host `http.get` goes to comes from a value: if a visitor can choose it, they can reach this server's own network (localhost, a cloud's metadata service). Pass { public_only: true } as its options (or public_only: false, when it is meant to reach inside)` (the warning is about `/preview`: "the host `http.get` goes to comes from a value").
  `../steps/guestbook` is version 2, with `POST /sign` reading and writing `guestbook.txt`.

## As it comes

Deno with no flags, in a terminal (through `script`, answering `n`; script also writes the `^D` that ends its input,
taken out here):

```
~/fortunes/deno $ deno run --env-file=.env main.ts
┏ ⚠️  Deno requests net access to "0.0.0.0:8000".
┠─ Requested by `Deno.listen()` API.
┠─ To see a stack trace for this prompt, set the DENO_TRACE_PERMISSIONS environmental variable.
┠─ Learn more at: https://docs.deno.com/go/--allow-net
┠─ Run again with --allow-net to bypass this prompt.
┗ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) > n
error: Uncaught (in promise) NotCapable: Requires net access to "0.0.0.0:8000", run again with the --allow-net flag
Deno.serve({ port: 8000 }, async (req) => {
     ^
    at listen (ext:deno_net/01_net.js:591:35)
    at serveInner (ext:deno_http/00_serve.ts:954:18)
    at Object.serve (ext:deno_http/00_serve.ts:869:12)
    at file://~/fortunes/deno/main.ts:35:6
```

Deno with `-A`, then Quillo with no quillo.policy (moved aside for this run):

```
~/fortunes/deno $ deno run -A --env-file=.env main.ts &> deno.log &
~/fortunes/deno $ curl -s localhost:8000/debug
{"app":"Lucky Cookies","secret":"dough-secret-42"}
```

```
~/fortunes/quillo $ quillo run main.qwe &> quillo.log &
~/fortunes/quillo $ curl -s localhost:8080/debug
{"app":"Lucky Cookies","secret":"dough-secret-42"}
~/fortunes $ ./crack.sh 8080
a billion cookies: 200 after 83.2 s (Cracked 1000000000 cookies; the luckiest was 99)
the home page, asked 0.3 s in: 200 after 82.8 s
```

`crack.sh` asks for `/crack?n=1000000000`, and 0.3 s later, as another visitor, for `/`, and prints how long each waited.

## Locked down

Deno with flags:

```
~/fortunes/deno $ deno run --allow-net=0.0.0.0:8000,api.fortunes.example --allow-env=APP_NAME --env-file=.env main.ts &> deno.log &
~/fortunes/deno $ curl -si localhost:8000/debug | head -1
HTTP/1.1 500 Internal Server Error
~/fortunes/deno $ curl -s "localhost:8000/preview?url=http://169.254.169.254/latest/meta-data/"
Could not fetch it: NotCapable: Requires net access to "169.254.169.254:80", run again with the --allow-net flag
~/fortunes/deno $ curl -s -o /dev/null localhost:8000/
~/fortunes/deno $ grep NotCapable deno.log
NotCapable: Requires env access to "SECRET_KEY", run again with the --allow-env flag
track: NotCapable: Requires net access to "stats.example.com:443", run again with the --allow-net flag
~/fortunes $ ./crack.sh 8000
a billion cookies: 200 after 1.1 s (Cracked 1000000000 cookies; the luckiest was 99)
the home page, asked 0.3 s in: 200 after 0.8 s
```

Deno with the permission set in deno.json:

```
~/fortunes/deno $ deno run -P --env-file=.env main.ts &> deno.log &
~/fortunes/deno $ head -1 deno.log
Warning Permissions in the config file is an experimental feature and may change in the future.
~/fortunes/deno $ curl -si localhost:8000/debug | head -1
HTTP/1.1 500 Internal Server Error
```

Quillo with quillo.policy:

```
~/fortunes/quillo $ quillo run main.qwe &> quillo.log &
~/fortunes/quillo $ curl -s localhost:8080/debug
{"app":"Lucky Cookies","secret":null}
~/fortunes/quillo $ curl -s "localhost:8080/preview?url=http://169.254.169.254/latest/meta-data/"
Could not fetch it: http: 169.254.169.254 is not among the hosts quillo.policy allows: api.fortunes.example
~/fortunes/quillo $ curl -s -o /dev/null localhost:8080/
~/fortunes/quillo $ grep track quillo.log
track: http: stats.example.com is not among the hosts quillo.policy allows: api.fortunes.example
~/fortunes $ ./crack.sh 8080
a billion cookies: 500 after 2.1 s (internal error)
the home page, asked 0.3 s in: 200 after 1.8 s
~/fortunes/quillo $ grep -o "this request computed for longer than .*" quillo.log
this request computed for longer than the policy quillo.policy allows (max_compute)
```

## Version 2: a guestbook in a file

```
~/fortunes/deno $ deno check variants/guestbook.ts
Check variants/guestbook.ts
~/fortunes/deno $ deno run --allow-net=0.0.0.0:8000,api.fortunes.example --allow-env=APP_NAME --env-file=.env variants/guestbook.ts &> deno.log &
~/fortunes/deno $ curl -si -d name=Ada localhost:8000/sign | head -1
HTTP/1.1 500 Internal Server Error
~/fortunes/deno $ grep NotCapable deno.log
NotCapable: Requires write access to "guestbook.txt", run again with the --allow-write flag
```

```
~/fortunes/quillo-v2 $ quillo check 2>&1 | grep -v warning:
main.qwe:48: error: `read_file` needs the fs effect, which quillo.policy does not allow
main.qwe:48: error: `write_file` needs the fs effect, which quillo.policy does not allow
quillo: 2 errors, 1 warning
```

The whole of `quillo check` there:

```
main.qwe:42: warning: the host `http.get` goes to comes from a value: if a visitor can choose it, they can reach this server's own network (localhost, a cloud's metadata service). Pass { public_only: true } as its options (or public_only: false, when it is meant to reach inside)
main.qwe:48: error: `read_file` needs the fs effect, which quillo.policy does not allow
main.qwe:48: error: `write_file` needs the fs effect, which quillo.policy does not allow
quillo: 2 errors, 1 warning
```
