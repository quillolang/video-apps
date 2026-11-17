# Make It Pretty: CSS | Learn to Code with Quillo #11

Movie Night, lesson 11 of Learn to Code with Quillo (part 2): a Page view on every route, a stylesheet in public/ served by a static route, and MovieList's own scoped style.

This lesson starts where [10-names](../10-names) ended.

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

- [`steps/v0`](steps/v0): where lesson 10 ended: no style
- [`steps/v1`](steps/v1): a Page view, with a title for each page
- [`steps/v2`](steps/v2): public/style.css, and route GET /static/*path
- [`steps/v3`](steps/v3): MovieList's own style: the pick in a box, the list without bullets
- this folder: problems in red, from the shared stylesheet (the lesson's "your turn")
