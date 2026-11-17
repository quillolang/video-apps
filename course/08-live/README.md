# Live for Everyone | Learn to Code with Quillo #8

Movie Night, lesson 8 of Learn to Code with Quillo: the home page's list is a MovieList component whose movies are live(all_movies), so a vote in one browser shows in every other at once, most votes first, with tonight's pick.

This lesson starts where [07-server-fns](../07-server-fns) ended.

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

- [`steps/v0`](steps/v0): where lesson 7 ended
- [`steps/v1`](steps/v1): the list in a component: state movies = live(all_movies), a server fn
- [`steps/v2`](steps/v2): a vote button on each row, most votes first, and tonight's pick
- this folder: Votes so far, added up with sum (the lesson's "your turn")
