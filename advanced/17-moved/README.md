# This Redirect Never Ends (and Your Browser Remembers It): 301, 302, 307, 308 | Advanced Quillo #17

Help Desk, lesson 17 of Advanced Quillo: pages that moved. A ticket's old address, /tickets/2, from the emails sent before lesson 15 moved the desk, is a 308 to /desk/tickets/2. The old help center's /kb/article.php?id=12, from a table of moves (012_old_help.sql), is a 301 to its article; an unknown number a 404. The mistake (steps/v2): `route GET /help/ = redirect("/help", 301)`, brought from a framework where /help/ is another address. In Quillo they are one path, so it takes /help itself: --watch and quillo check say the help center is never reached, and /help redirects forever (ERR_TOO_MANY_REDIRECTS). Taken out, the browser that saw it still loops: it kept the 301. The exercise: lesson 11's /help/:id(int) as a 301 to each article's slug.

This lesson starts where [16-back](../16-back) ended.

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

- [`steps/v1`](steps/v1): old ticket links (308) and the old help center's addresses (301, from a table)
- [`steps/v2`](steps/v2): plus `route GET /help/ = redirect("/help", 301)`: a redirect loop (the lesson's mistake)
- this folder: /help/:id(int) as a 301 to each article's readable address (the lesson's "your turn")
