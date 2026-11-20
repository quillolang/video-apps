# PHP 8.6 Quirks #1: what was run

Every form in the video was filled in and sent in Chromium (Playwright's, headless) by `../shots.mjs`, which keeps what each page
showed, and what curl got, in `../assets/runs.json`; `../make-video.py` checks the narration against it. Run on one machine.

- **When:** Fri Nov 20 2026 20:40:56 GMT+0800 (Singapore Standard Time)
- **Machine:** Apple M5, 16 GB; macOS 26.7.1 (25G241)
- **Node:** v24.11.0
- **PHP:** `PHP 8.6.0 (cli) (built: Nov 20 2026 20:11:53) (NTS)`, built from php.net's php-8.6.0 release (`php-8.6.0.tar.xz`, its SHA-256 checked against php.net's), configured
  `--disable-all --enable-cli --enable-session --enable-filter --enable-ctype --enable-tokenizer --enable-mbstring --disable-mbregex
  --enable-fileinfo`; run with `-n` (no php.ini: PHP's own defaults). Homebrew's `php` bottle is 8.6.0 as well.
- **Quillo:** `quillo 0.8.8 (f35bf2d, 2026-11-19)`
- **curl:** curl 8.7.1 (x86_64-apple-darwin25.0) libcurl/8.7.1 (SecureTransport) LibreSSL/3.3.6 zlib/1.2.12 nghttp2/1.68.1

## The apps

- **PHP** (`php/`): plain PHP files, no framework, each quirk with its fix beside it (`pizza.php`, `pizza-fixed.php`, ...), and
  `quirks.css` (`../app/quirks.css`). `names.php` prints the names PHP made of a form's fields; `visits.php` starts a session. Served
  with `php -n -S localhost:8000` from `php/`.
- **Quillo** (`../app/main.qwe`): the same five, at `/pizza` and so on, run with `./run.sh --watch` on 8080.

## What each form showed after it was sent

| Form | PHP, as written | PHP, fixed | Quillo |
|---|---|---|---|
| Pizza (Ham, Olives, Basil ticked) | Your pizza: basil | Your pizza: ham, olives, basil | Your pizza: ham, olives, basil |
| Newsletter (ana@example.com) | Please enter your email | Thanks, ana@example.com | Thanks, ana@example.com |
| Booking (0 kids) | How many kids? | Booked, with 0 kids | Booked, with 0 kids |
| Hello (a name with HTML in it) | Hi, ! | Hi, <img src=x onerror="document.body.style.background='crimson'">! | Hi, <img src=x onerror="document.body.style.background='crimson'">! |

The PHP Hello page's background after it was sent: `rgb(220, 20, 60)` (the name's onerror ran); the fixed page and Quillo's: `rgb(244, 242, 251)`.
The PHP booking page as written, with 2 kids: "Booked, with 2 kids".

## curl

```
$ curl -d 'user.email=ana@example.com&first name=Ana' localhost:8000/names.php
["user_email","first_name"]
$ curl -d name=Ana localhost:8000/api.php
{"greeting":"Hi, Ana!"}
$ curl -H 'content-type: application/json' -d '{"name":"Ana"}' localhost:8000/api.php
{"greeting":"Hi, nobody!"}
$ curl -H 'content-type: application/json' -d '{"name":"Ana"}' localhost:8000/api-fixed.php
{"greeting":"Hi, Ana!"}
$ curl -H 'content-type: application/json' -d '{"name":"Ana"}' localhost:8080/api/hello
{"greeting":"Hi, Ana!"}
$ curl -si localhost:8000/visits.php | grep -i set-cookie
Set-Cookie: PHPSESSID=0626c4de1195d6bbb4139abe2f33c01f; path=/; HttpOnly; SameSite=Lax
```

(`visits.php`'s cookie: PHP 8.6 made `session.cookie_httponly` 1 and `session.cookie_samesite` "Lax" the defaults, and
`session.use_strict_mode` 1; php-8.6.0's UPGRADING, "Session".)

## The checkers

`quillo check main.qwe`: `main.qwe: ok (9 routes, 5 functions, 0 components)`. `php -l` on every PHP file: no syntax errors.
