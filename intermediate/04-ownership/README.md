# Mine, Not Yours: Edit and Delete, Only Your Own (IDOR, Found and Fixed) | Intermediate Quillo #4

Recipe Box, lesson 4 of Intermediate Quillo: members edit and delete their own recipes, and every query asks for the recipe's id and its owner's user_id, so someone else's recipe is not found (a 404), for the page and for a form posted by hand.

This lesson starts where [03-members](../03-members) ended.

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
- [`steps/v1`](steps/v1): Edit, with the recipe found and saved by its id alone: any member can edit anyone's recipe by changing the number in the address (the lesson's mistake)
- [`steps/v2`](steps/v2): every query asks for the id and the owner: where id = ? and user_id = ?, and a 404 when no row matches
- this folder: Delete, the owner's only, asked first on a page of its own (the lesson's "your turn")
