# Your Single-Page App Works Until You Reload: One Page, Many Addresses | Quillo SPA #1

Fernhill Trails, lesson 1 of Quillo Single-Page Apps: one page, many addresses. The guide to six walks around a small hill town (the trails in migrations/001_trails.sql). steps/v1 is the starting code, where every link loads a page from the server. steps/v2 makes the whole guide one component, App (ui/app.qwe): url().path and a match pick the page, and links change it without loading one; but it is served only at route GET /, so a reload of /trails/5 is a 404 (quillo check warns). steps/v3 serves every address with route GET /*rest. The exercise adds an About page.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the starting code: a page from the server for each address
- [`steps/v2`](steps/v2): one App component, served at / only: a reload of /trails/5 is a 404 (the lesson's mistake)
- [`steps/v3`](steps/v3): route GET /*rest: every address gets the page, and App picks what to show
- this folder: an About page (the lesson's "your turn")
