# One Page, Three Addresses? Typed Routes in Quillo | Advanced Quillo #11

Help Desk, lesson 11 of Advanced Quillo, the first of part 2: addresses. Each team gets a help center, articles at /help/:id. Read untyped and made an int with int(id), /help/5, /help/05 and /help/+5 (and /help/%205) are the same article, three addresses for one; with /help/:id(int), only /help/5 answers and the others are the server's own 404. quillo docs lists every address the app answers, and the id's type. The exercise: /tickets/on/:day(date), where 2026-02-30 is a 404.

This lesson starts where [10-see](../10-see) ended.

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

- [`steps/v1`](steps/v1): the help center, with /help/:id read with int(id): one article at several addresses (the lesson's mistake)
- [`steps/v2`](steps/v2): /help/:id(int): one article, one address
- this folder: the tickets opened on a day, /tickets/on/:day(date) (the lesson's "your turn")
