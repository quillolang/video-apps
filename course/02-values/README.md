# Values and Names | Learn to Code with Quillo #2

Movie Night, lesson 2 of Learn to Code with Quillo: values with names (let), shown on the page with { }, numbers added up, and a template.

This lesson starts where [01-first-page](../01-first-page) ended.

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

- [`steps/v0`](steps/v0): where lesson 1 ended: a heading and two paragraphs
- [`steps/v1`](steps/v1): let tonight, shown on the page with {tonight}
- [`steps/v2`](steps/v2): numbers: minutes + trailers
- [`steps/v3`](steps/v3): a template: `Come and watch ${tonight} with us!`
- this folder: Hosted by Sam (the lesson's "your turn")
