# PHP 8.6 Quirks #2: what was run

Every page in the video was opened in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page showed, and what
curl got, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 21:35:40 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **PHP:** `PHP 8.6.0 (cli) (built: Nov 20 2026 20:11:53) (NTS)`, built from php.net's php-8.6.0 release (SHA-256 checked against php.net's), run with `-n` (no php.ini).
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`
- **curl:** curl 8.7.1 (x86_64-apple-darwin25.0) libcurl/8.7.1 (SecureTransport) LibreSSL/3.3.6 zlib/1.2.12 nghttp2/1.68.1

## The apps

- **PHP** (`php/`): plain PHP files, each quirk with its fix beside it (`catalog.php`, `catalog-fixed.php`, ...), `scoreboard.html` (a page
  whose script fetches `scores.php`, or `?api=scores-fixed.php`, and maps over it), and `quirks.css`. Served with `php -n -S localhost:8000`.
- **Quillo** (`../app/main.qwe`): the same five, at `/catalog`, `/api/zips`, `/api/scores`, `/guests` and `/invited`, on 8080.

## What each page showed

| Page | PHP, as written | PHP, fixed | Quillo |
|---|---|---|---|
| Catalog | Catalog / #0 Desk lamp / #1 Floor lamp / #2 Stool / #3 Armchair | Catalog / #101 Desk lamp / #102 Floor lamp / #205 Stool / #206 Armchair | Catalog / #101 Desk lamp / #102 Floor lamp / #205 Stool / #206 Armchair |
| Guests | Guests / Ana / Ben / Ben | Guests / Ana / Ben / Cy | Guests / Ana / Ben / Cy |
| Invited? (?name=Ana) | Invited? / Ana is not on the list | Invited? / Ana is invited | Invited? / Ana is invited |
| Invited? (?name=Ben) | Invited? / Ben is invited | Invited? / Ben is invited | Invited? / Ben is invited |
| Scoreboard | Scoreboard (console: `[pageerror] played.map is not a function`) | Scoreboard / Game 1: 3 points / Game 2: 5 points / Game 3: 8 points | – |

## curl

```
$ curl localhost:8000/zips.php
["08001",10001,75001]
$ curl localhost:8000/zips-fixed.php
["08001","10001","75001"]
$ curl localhost:8080/api/zips
["08001","10001","75001"]
$ curl localhost:8000/scores.php
{"0":3,"2":5,"4":8}
$ curl localhost:8000/scores-fixed.php
[3,5,8]
$ curl localhost:8080/api/scores
[3,5,8]
```

## The checkers

`quillo check main.qwe`: `main.qwe: ok (6 routes, 1 function, 0 components)`. `php -l` on every PHP file: no syntax errors.
