# An Unticked Checkbox Broke the Form: Request Patterns | Advanced Quillo #14

Help Desk, lesson 14 of Advanced Quillo: request patterns. The help center's contact form, at /help/contact, makes a ticket from a customer's message, and with "Email me updates" ticked, an email made later. With `updates: bool` the form sent with the box unticked is a 400, since an unchecked checkbox sends nothing: the log says so and gives the fix, `updates: bool = false`. A second route for the same address takes `{ json: ... }`, for a script, and answers with the ticket's number as JSON; a 400 for bad JSON names the first route for the path (the form's). The exercise: a ticket as JSON for Accept: application/json, with a header pattern, before the page's route.

This lesson starts where [13-questions](../13-questions) ended.

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

- [`steps/v1`](steps/v1): the contact form with `updates: bool`: sent unticked, a 400 (the lesson's mistake)
- [`steps/v2`](steps/v2): `updates: bool = false`: ticked or not, a ticket
- [`steps/v3`](steps/v3): the same address for a script: `{ json: ... }`, answered with JSON
- this folder: a ticket as JSON for Accept: application/json (the lesson's "your turn")
