# Forms That Help: One Set of Rules, in the Browser and on the Server | Intermediate Quillo #5

Recipe Box, lesson 5 of Intermediate Quillo: one set of rules for a new recipe, in lib/rules.qwe, run in the browser for hints as you type and again in the server fn, which has the last word; problems per field, and a warning that advises without stopping anything.

This lesson starts where [04-ownership](../04-ownership) ended.

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

- [`steps/v0`](steps/v0): where lesson 4 ended
- [`steps/v1`](steps/v1): the rules in lib/rules.qwe, a form component with hints after the first try, a list that follows the table, and a server fn that checks who asks but not the rules: a blank recipe sent without the page is saved (the lesson's mistake)
- [`steps/v2`](steps/v2): the server fn runs the same rules, and answers with the problems
- this folder: a warning, not an error, for more than 12 servings (the lesson's "your turn")
