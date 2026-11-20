# Your Form's Checks Protect Nothing: Think Like an Attacker | Quillo Security #1

Swap Board, lesson 1 of Quillo Security: think like an attacker. Neighbours give away what they don't need; Rosa runs the board, Ana and Ben post on it (sample members, passwords in migrations/003_sample.sql). steps/v1 is the starting code, written quickly, as first versions are: the course attacks it lesson by lesson, on your own computer only. The attack (steps/v1): the new-listing form keeps a title to 80 characters and the condition to three, in the browser; curl sends a 10,000-character title and the condition "brand new!!!", and both are saved. The fix (steps/v2): type Condition = "new" | "good" | "worn" in the route's pattern, and the title's length checked on the server: 400s. The exercise: editing and joining checked on the server too.

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

- [`steps/v1`](steps/v1): the starting code: the server takes whatever the form sends (the lesson's attack)
- [`steps/v2`](steps/v2): a Condition type and a title check: the same requests get a 400
- this folder: editing and joining checked on the server too (the lesson's "your turn")
