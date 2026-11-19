# One Ampersand Broke Page 2: Query Strings and url_encode | Advanced Quillo #13

Help Desk, lesson 13 of Advanced Quillo: questions in the address. A ticket search at /tickets/search ? { q: str = "", status: str = "", page: int = 1 }, five to a page. Its Next link, glued together as text, breaks a search for "Printer & toner": the & starts a new field, so page 2 searches for "Printer " (17 tickets, not 6); url_encode({ q, status, page }) makes it right. page=x doesn't fit the route, and with lesson 12's GET catch-all it falls through to the 404 page; a second route for the same path, with no pattern, answers it with a 400 of its own. The exercise: sort newest or oldest, a type of two strings, kept on every page.

This lesson starts where [12-first-match](../12-first-match) ended.

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

- [`steps/v1`](steps/v1): the ticket search, its Previous and Next links glued together as text: "Printer & toner" breaks on page 2 (the lesson's mistake)
- [`steps/v2`](steps/v2): the links made with url_encode
- [`steps/v3`](steps/v3): a second route for /tickets/search that answers a question it can't read with a 400, before the catch-all
- this folder: sort, newest or oldest first, a type of two strings, kept on every page (the lesson's "your turn")
