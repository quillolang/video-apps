# My App Got an HTML Page Instead of JSON: An API Beside the Site | Advanced Quillo #21

Help Desk, lesson 21 of Advanced Quillo: an API beside the site. `routes /api/v1`: the help center's articles as JSON, and a ticket from JSON ({ name, email, message }, 201 with its number), every answer with the CORS headers for Acme's own site and an OPTIONS route for the browser's question; quillo docs lists the paths as OpenAPI. The mistake (steps/v1): a mistyped address, /api/v1/article, gets the help center's HTML 404 page, and a JSON.parse fails on it. The fix (steps/v2): the group's own catch-all, `route ANY /*rest`, a 404 in JSON, and a 400 in JSON for a body that isn't the JSON asked for. The exercise: /api/v2, a ticket with a subject and a body, beside v1.

This lesson starts where [20-mounted](../20-mounted) ended.

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

- [`steps/v1`](steps/v1): the API at /api/v1, with CORS; a mistyped address gets the help center's HTML 404 page (the lesson's mistake)
- [`steps/v2`](steps/v2): errors in JSON: the API's own catch-all, and a 400 for a wrong body
- this folder: /api/v2 beside /api/v1 (the lesson's "your turn")
