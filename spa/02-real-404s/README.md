# Your "Not Found" Page Says 200 OK: Real Addresses, Real 404s | Quillo SPA #2

Fernhill Trails, lesson 2 of Quillo Single-Page Apps: real addresses, real 404s. steps/v1 is lesson 1's app, where /nope and /trails/abc show a not-found page but answer 200. steps/v2 adds page_of(path) in ui/app.qwe, shared by App and the route, which answers respond(404, page) for an address that is no page; but int() takes "05" and "+5", so /trails/05 is Lantern Ridge again at a second address. steps/v3 keeps one written form (str(id) == piece). The exercise makes /trails/99, a number with no trail, a 404 too.

This lesson starts where [01-addresses](../01-addresses) ended.

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

- [`steps/v1`](steps/v1): lesson 1's app: /nope shows "No such trail" but answers 200
- [`steps/v2`](steps/v2): page_of(path) on both sides and respond(404, page); but /trails/05 is a second address for Lantern Ridge (the lesson's mistake)
- [`steps/v3`](steps/v3): one written form: str(id) == piece, so /trails/05 is a 404
- this folder: a number with no trail, /trails/99, is a 404 too (the lesson's "your turn")
