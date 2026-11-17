# Only the Host: Why Hiding a Button Isn't Security | Learn to Code with Quillo #17

Movie Night, lesson 17 of Learn to Code with Quillo (part 2): the host's panel on /host: clear every vote for a new week (one transaction over two tables) and remove suggestions, each server fn checking am_host() itself. Make your own .env: see .env.example.

This lesson starts where [16-password](../16-password) ended.

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

- [`steps/v0`](steps/v0): where lesson 16 ended
- [`steps/v1`](steps/v1): the host's panel and new_week, in a transaction, with no check of its own
- [`steps/v2`](steps/v2): new_week checks am_host(): a stranger's call is refused
- this folder: suggestions on the panel, each with Remove (the lesson's "your turn")
