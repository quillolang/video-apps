# Why Won't /help/new Open? Route Order, Slugs and 404 Pages | Advanced Quillo #12

Help Desk, lesson 12 of Advanced Quillo: route order. Articles get readable addresses (010_article_slugs.sql: a unique slug from each title) at /help/:slug, and agents write new ones at /help/new. Routes are tried in the order they're written, and the first match answers: GET /help/new written after /help/:slug never opens (it's the slug route's 404), and quillo check and the --watch reload say "this route is never reached". Moved first, it works. The server answers 404, 405 (with Allow) and 400 by itself; a 404 page of one's own, route GET /*rest last, keeps those, where route ANY /*rest would take them too.

This lesson starts where [11-addresses](../11-addresses) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): slugs, and the new-article page written after /help/:slug: it never opens (the lesson's mistake; quillo check warns)
- [`steps/v2`](steps/v2): GET /help/new before /help/:slug: the form opens, and an article goes up at its slug
- this folder: a 404 page of our own, route GET /*rest, with the articles that share a word with the address (the lesson's "your turn")
