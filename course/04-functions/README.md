# Functions and Decisions | Learn to Code with Quillo #4

Movie Night, lesson 4 of Learn to Code with Quillo: functions of our own (length_text, snack_note, era), decisions with ? : and if, and a page for every movie at /movies/:id, linked from the list.

This lesson starts where [03-lists](../03-lists) ended.

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

- [`steps/v0`](steps/v0): where lesson 3 ended
- [`steps/v1`](steps/v1): length_text: minutes as hours and minutes
- [`steps/v2`](steps/v2): ids, and a page for each movie at /movies/:id (a 404 for none)
- [`steps/v3`](steps/v3): the titles are links
- [`steps/v4`](steps/v4): snack_note: a decision, on each movie's page
- this folder: era: A classic! or A newer one. (the lesson's "your turn")
