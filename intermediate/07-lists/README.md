# Lists as Data: A Meal Plan and the Shopping List It Needs | Intermediate Quillo #7

Recipe Box, lesson 7 of Intermediate Quillo: a meal plan (which recipe, which day, for how many), and a shopping list worked out from it in one pipeline: rows, map, group_by, values, map, sort_by; amounts made exact decimals with dec before they're added, and scaled to the servings planned.

This lesson starts where [06-tags](../06-tags) ended.

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

- [`steps/v0`](steps/v0): where lesson 6 ended
- [`steps/v1`](steps/v1): the meal plan (007_plans.sql, Plan it on each recipe, This week), and a shopping list that adds up the amounts as they are, text: sum refuses (the lesson's mistake)
- [`steps/v2`](steps/v2): dec(...) before sum: exact decimals
- [`steps/v3`](steps/v3): each amount scaled to the servings planned, rounded, and written as a person writes it
- this folder: tick things off the shopping list, a component with a state of its own for each item (the lesson's "your turn")
