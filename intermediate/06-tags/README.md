# Tags: Many to Many, the Table in Between, and Rows That Come Twice | Intermediate Quillo #6

Recipe Box, lesson 6 of Intermediate Quillo: tags, many to many, through a table in between with a two-column primary key; a recipe's tags, a tag's page, counts per tag, a search for any of several tags (with distinct, so a recipe comes once), and members tagging their own recipes with insert or ignore.

This lesson starts where [05-forms](../05-forms) ended.

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

- [`steps/v0`](steps/v0): where lesson 5 ended
- [`steps/v1`](steps/v1): tags and recipe_tags (006_tags.sql), a recipe's tags, a tag's page, and counts on the home page
- [`steps/v2`](steps/v2): Find with checkboxes, any of the ticked tags, one ? with json_each: a recipe with two of them comes twice (the lesson's mistake)
- [`steps/v3`](steps/v3): select distinct: each recipe once
- this folder: members tag their own recipes: insert or ignore, for the tag and for the pair (the lesson's "your turn")
