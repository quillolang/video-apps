# Members Only: Route Groups, Guards, and a Trip to Log In and Back | Intermediate Quillo #3

Recipe Box, lesson 3 of Intermediate Quillo: recipes get an owner, and members-only pages under /my, guarded in one place by a route group; a visitor is sent to log in and brought back where they were going, only ever to a page of this site (local_path).

This lesson starts where [02-accounts](../02-accounts) ended.

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

- [`steps/v0`](steps/v0): where lesson 2 ended
- [`steps/v1`](steps/v1): recipes get an owner, and a route group, routes /my | signed_in, with My recipes and a form to add one
- [`steps/v2`](steps/v2): the trip there and back: /login?next=/my, and back with redirect(local_path(next) ?? "/")
- this folder: a settings page in the group, to change your name (the lesson's "your turn")
