# Tidy Files: One Long File Becomes Six | Learn to Code with Quillo #12

Movie Night, lesson 12 of Learn to Code with Quillo (part 2): the same app in six files: main.qwe with the routes, lib/ for names, movies and words, ui/ for the page and the components, connected with use and import (written by quillo fix).

This lesson starts where [11-css](../11-css) ended.

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

- [`steps/v0`](steps/v0): where lesson 11 ended: one file
- [`steps/v1`](steps/v1): lib/names.qwe and lib/movies.qwe, taken in with use
- [`steps/v2`](steps/v2): ui/page.qwe and ui/movies.qwe too, before their imports (check warns)
- [`steps/v3`](steps/v3): after quillo fix: ui/movies.qwe imports what it calls
- this folder: lib/words.qwe: the words about a movie in a file of their own (the lesson's "your turn")
