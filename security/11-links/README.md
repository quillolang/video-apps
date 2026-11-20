# A Link Preview Showed My Server's Backup Password: Links That Reach Inside | Quillo Security #11

Swap Board, lesson 11 of Quillo Security: links that reach inside. steps/v2 adds a link for each listing (011_links.sql), previewed by the server: preview(url) fetches it with http.get(url, {}, { public_only: false, timeout: 3 }) "to try it on this machine", and keeps its title and first paragraph. inside/main.qwe is the board's back office on 127.0.0.1:9090 (.quillo/bin/quillo run inside/main.qwe --port 9090), which only this machine reaches. The attack: Max's link http://127.0.0.1:9090/ previews the back office's backup password on Max's listing. The fix (steps/v3): public_only: true, "refused by public_only: 127.0.0.1 is not on the public internet". The exercise: https links only, and quillo.policy with [http] private = false (read as the program starts; its start line says "no private addresses").

This lesson starts where [10-files](../10-files) ended.

Written for Quillo 0.8.8. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v2`](steps/v2): link previews with public_only: false, and the back office they reach (the lesson's attack)
- [`steps/v3`](steps/v3): public_only: true: a link to the inside is refused
- this folder: https links only, and quillo.policy's [http] private = false (the lesson's "your turn")
