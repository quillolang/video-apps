# Plan First, Then Build: Tables That Point at Each Other | Intermediate Quillo #1

Recipe Box, lesson 1 of Intermediate Quillo: recipes and their ingredients in two tables joined by a foreign key, a page for each recipe, and a search by ingredient with a join whose columns are named, so nothing gets mixed up.

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

- [`steps/v1`](steps/v1): the recipes from the database, made by two migrations
- [`steps/v2`](steps/v2): a page for each recipe, with its ingredients
- [`steps/v3`](steps/v3): "What can I make?": a join with select r.*, i.*, whose id is the ingredient's (the lesson's mistake)
- [`steps/v4`](steps/v4): the join with its columns named: r.id as recipe_id
- this folder: each recipe's method, from a steps table, in order (the lesson's "your turn")
