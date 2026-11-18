# Jobs and Imports: A Recipe of the Day, and All-or-Nothing Imports | Intermediate Quillo #10

Recipe Box, lesson 10 of Intermediate Quillo, the finished app: a recipe of the day picked by a scheduled job (schedule at the program's top level, with db and time), import.qwe bringing recipes in from a JSON file in one transaction, all or nothing, and export.qwe writing them out in the same shape.

This lesson starts where [09-tests](../09-tests) ended.

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

- [`steps/v0`](steps/v0): where lesson 9 ended
- [`steps/v1`](steps/v1): a recipe of the day: 008_featured.sql, a job every 10 seconds while we try it, and the home page showing it
- [`steps/v2`](steps/v2): the job once a day: schedule("@daily", ...)
- [`steps/v3`](steps/v3): import.qwe: recipes from a JSON file, in one transaction (new-recipes.json goes in; bad-recipes.json puts nothing in)
- this folder: export.qwe: every recipe, with its ingredients, to a file the import reads (the lesson's "your turn")
