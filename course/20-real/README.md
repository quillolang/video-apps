# Ready for Real: Secrets, a JSON API, and Going Online | Learn to Code with Quillo #20

Movie Night, lesson 20 of Learn to Code with Quillo, the finished app: run for real without --watch, with QUILLO_SECRET in .env so names and the host's log-in survive a restart, and a JSON API at /api/movies and /api/movies/:id. Make your own .env: see .env.example.

This lesson starts where [19-search](../19-search) ended.

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

- [`steps/v0`](steps/v0): where lesson 19 ended
- [`steps/v1`](steps/v1): the movies as JSON, at /api/movies
- this folder: one movie as JSON, or a 404, at /api/movies/:id (the lesson's "your turn")
