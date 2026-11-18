# One App, Many Teams: A Database per Team | Advanced Quillo #1

Help Desk, lesson 1 of Advanced Quillo: one app for many teams, each with a database of its own, picked from the address (acme.localhost). new_tenant starts a team and refuses a name that's taken, and a team's data stays out of global variables.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a database per team: tenant_from("localhost"), db.open("data/{tenant}.db"), and new_tenant to start one
- [`steps/v2`](steps/v2): the latest ticket in a global variable, one copy for every team (the lesson's mistake; quillo check warns)
- [`steps/v3`](steps/v3): the latest ticket from each team's own database
- this folder: a settings page for each team, with its display name (the lesson's "your turn")
