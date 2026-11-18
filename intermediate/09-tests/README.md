# Test Your Own Code: A Test Script That Catches a Bug | Intermediate Quillo #9

Recipe Box, lesson 9 of Intermediate Quillo: tests for your own code. scaled() and amount_text() in lib/amounts.qwe, plain functions the page uses, and tests.qwe, a script that checks them and the form's rules, prints ok or FAIL for each, and ends with status 1 on a failure: quillo run tests.qwe.

This lesson starts where [08-components](../08-components) ended.

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

- [`steps/v0`](steps/v0): where lesson 8 ended
- [`steps/v1`](steps/v1): scaled() in lib/amounts.qwe, used by the ingredient list, and tests.qwe: 4 passed
- [`steps/v2`](steps/v2): scaled() rounds each serving's amount first: 1.86 cups instead of 1.88, and the tests fail (the lesson's mistake)
- this folder: scaled() put back, and tests for the form's rules too: 7 passed (the lesson's "your turn")
