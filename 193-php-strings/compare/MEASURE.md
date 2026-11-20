# PHP 8.6 Quirks #3: what was run

Every page in the video was opened (and its form filled in and sent) in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps
what each page showed, and what curl got, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 22:08:45 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **PHP:** `PHP 8.6.0 (cli) (built: Nov 20 2026 20:11:53) (NTS)`, built from php.net's php-8.6.0 release (SHA-256 checked against php.net's) with `--enable-mbstring`; run with `-n` (no php.ini). mbstring: loaded.
  (php.net's Windows builds ship mbstring as `php_mbstring.dll`; php-8.6.0's php.ini-development and php.ini-production have `;extension=mbstring`.)
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`
- **curl:** curl 8.7.1 (x86_64-apple-darwin25.0) libcurl/8.7.1 (SecureTransport) LibreSSL/3.3.6 zlib/1.2.12 nghttp2/1.68.1

## What each page showed

| Page | PHP, as written | PHP, fixed | Quillo |
|---|---|---|---|
| Badge (Zoë Smith, first 3) | Hi, Zo�! (substr's bytes: 5a6fc3) | Hi, Zoë! | Hi, Zoë! |
| Dessert (Crème brûlée, in capitals) | CRèME BRûLéE | CRÈME BRÛLÉE | CRÈME BRÛLÉE |
| Username (José María, at most 10) | Too long: 12 of 10 (strlen, mb_strlen: 12 10) | Saved: José María | Saved: José María |
| Door (code 1e3, the code is 1000) | Door open (with 1000: Door open) | Wrong code | Wrong code |

## curl

```
$ curl localhost:8000/total.php
{"total":0.30000000000000004}
$ curl localhost:8000/total-fixed.php
{"total_cents":30}
$ curl localhost:8080/api/total
{"total":"0.30"}
$ curl localhost:8080/api/total-float
{"total":0.30000000000000004}
```

## New in PHP 8.6

```
$ php -r '$slug = str_replace(" ", "-", ?); echo $slug("crème brûlée"), "\n";'
crème-brûlée
```

## The checkers

`quillo check main.qwe`: `main.qwe: ok (9 routes, 3 functions, 0 components)`. `php -l` on every PHP file: no syntax errors.
