# Lists and Loops | Learn to Code with Quillo #3

Movie Night, lesson 3 of Learn to Code with Quillo: a list of movies, shown with a for loop, counted with len, and each movie a map of facts.

This lesson starts where [02-values](../02-values) ended.

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
- [`steps/v1`](steps/v1): tidied up: one movie's lines out, the host kept
- [`steps/v2`](steps/v2): a list of titles, shown with a for loop
- [`steps/v3`](steps/v3): len(titles): how many to choose from
- [`steps/v4`](steps/v4): a list of maps: title, year and minutes
- this folder: Midnight Bakery added (the lesson's "your turn")
