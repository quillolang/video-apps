# Services: Run a Part of Your App on Its Own, and Change It Safely | Advanced Quillo #9

Help Desk, lesson 9 of Advanced Quillo: services. The mail service from lesson 6 runs as a process of its own (./run.sh --watch --split), its calls signed requests to /_quillo/service/...; quillo docs shows each function's contract. Then the mistake: the mailer's email takes a new argument, body, while the app still calls it with two. quillo check finds the call (main.qwe:66, missing argument `body`), the app keeps its previous version, and the next ticket's email is refused with a 409 and waits. The fix: body: str = "", so every call stays right, and the waiting email goes through. The mailer changes its table with migrations of its own (mailer-migrations/).

This lesson starts where [08-fast](../08-fast) ended.

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

- [`steps/v1`](steps/v1): the mailer's email takes a body, and the app still calls it with two arguments: quillo check refuses it (the lesson's mistake, so this folder does not start)
- [`steps/v2`](steps/v2): body has a default, body: str = "": every call fits again, and an email waiting since v1 goes through
- [`steps/v3`](steps/v3): the app sends a body, with the ticket's link, and the Emails page shows it
- this folder: a second service, reports.qwe: each team's tickets day by day, told with .later in the ticket's transaction, and a Reports page (the lesson's "your turn")
