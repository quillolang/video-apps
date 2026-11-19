# Your Sign-In Page Can Send Users to Another Site: Safe Redirects | Advanced Quillo #16

Help Desk, lesson 16 of Advanced Quillo: back where they were. The desk's guard sends a visitor to /sign-in?next=<the page, url_encoded>; the sign-in page's form carries next on, and the sign-in sends them back: the new ticket's email link, opened signed out, lands on the ticket. The mistake (steps/v1): redirect(next), so a link to the desk's own sign-in with next=//evil.example sends the agent to another site (an open redirect); quillo check passes it. The fix (steps/v2): redirect(local_path(next) ?? "/desk"). The exercise: next keeps the question too, with request.query_string.

This lesson starts where [15-groups](../15-groups) ended.

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

- [`steps/v1`](steps/v1): next in the sign-in's address, followed with redirect(next): an open redirect (the lesson's mistake)
- [`steps/v2`](steps/v2): redirect(local_path(next) ?? "/desk"): only this site
- this folder: next keeps the question too, `asked_for(r)` with request.query_string (the lesson's "your turn")
