# A Tidy-Up Broke Every Old Email Link: Test Every Address | Advanced Quillo #22

Help Desk, lesson 22 of Advanced Quillo: test every address. Quillo has no test runner, so check.qwe is one: a list of addresses with the status each should answer (and where a redirect should send you), each asked with http.request(method, url, body, {}, { redirects: 0, public_only: false }), a line each, ok or FAIL, and exit(0) or exit(1). Run it with the program running: .quillo/bin/quillo run check.qwe. The mistake (steps/v2): a tidy-up deletes the old addresses' routes (/tickets/:id, /kb/article.php), which nothing in the program links to; check.qwe fails on both (404 where it wants 308 and 301), exit status 1. The fix: put them back. The exercise: the API's answers in the checks, their status and content-type, with checks that change nothing.

This lesson starts where [21-api](../21-api) ended.

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

- [`steps/v1`](steps/v1): check.qwe, every address passing
- [`steps/v2`](steps/v2): a tidy-up removes the old addresses' routes (the lesson's mistake): check.qwe fails on two
- this folder: check.qwe with the API's answers too (the lesson's "your turn")
