# Components That Work Together: Props Down, Changes Up, and Page State | Intermediate Quillo #8

Recipe Box, lesson 8 of Intermediate Quillo: components that work together. A servings picker tells its parent each new number through a function prop, the ingredient list follows the servings it's given, and a page state, picked, is shared by a badge in the header and a Pick button beside each recipe.

This lesson starts where [07-lists](../07-lists) ended.

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
- [`steps/v1`](steps/v1): a servings picker that tells its parent (on_change), and an ingredient list that copies its servings prop into a state, so it never follows (the lesson's mistake)
- [`steps/v2`](steps/v2): the list reads the prop: it follows the picker
- [`steps/v3`](steps/v3): a page state, picked, shared by a badge in the header (ui/page.qwe) and a Pick button beside each recipe
- this folder: Pick un-picks too, and says Picked ✓ (the lesson's "your turn")
