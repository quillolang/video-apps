# Find a Movie: Search, and Links That Keep It | Learn to Code with Quillo #19

Movie Night, lesson 19 of Learn to Code with Quillo (part 2): a search page at /search?q=..., made on the server: a plain HTML form that puts the search in the address, so a link keeps it, and SQL's like with % around the words.

This lesson starts where [18-posters](../18-posters) ended.

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

- [`steps/v0`](steps/v0): where lesson 18 ended
- [`steps/v1`](steps/v1): /search with a query pattern, a GET form, and like ? with q alone (exact titles only)
- [`steps/v2`](steps/v2): like with % around q: any title with those letters in it
- this folder: N movies found, or No movie matches, from a match (the lesson's "your turn")
