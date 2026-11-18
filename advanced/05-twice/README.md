# Clicked Twice: Idempotent Requests and Idempotency Keys | Advanced Quillo #5

Help Desk, lesson 5 of Advanced Quillo: requests that run once, however many times they're sent. A double click on Reply made two replies; add_reply wrapped in idempotent makes two clicks one call, and a client that sends the call again with its Idempotency-Key gets the first answer, marked idempotent-replayed. The new-ticket form carries a key of its own (<form idempotent>).

This lesson starts where [04-feed](../04-feed) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v0`](steps/v0): where lesson 4 ended: a double click on Reply makes two replies (the lesson's mistake)
- [`steps/v1`](steps/v1): add_reply wrapped in idempotent: one call, one reply, and a retry gets the first answer
- this folder: the new-ticket form idempotent too, its key in the form (the lesson's "your turn")
