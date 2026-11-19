# My Link Became /status/status: Mounting One Program in Another | Advanced Quillo #20

Help Desk, lesson 20 of Advanced Quillo: programs inside programs. Incidents (014_incidents.sql), posted and resolved from the desk; a status page for customers, status/main.qwe, a program of its own, mounted with `mount /status = "status/main.qwe"`. It finds the team itself (tenant_from: a mounted program doesn't get it from the one that mounts it) and opens Help Desk's database for the team, ../data/{tenant}.db (its paths count from its own folder); a team with no database is a 404. The mistake (steps/v1): a link written with the prefix, /status/incidents/1, which the mount moves again: /status/status/incidents/1, a 404. The fix (steps/v2): /incidents/1, as the program sees itself. The exercise: a changelog, mounted at /changelog, with a database of its own.

This lesson starts where [19-pages](../19-pages) ended.

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

- [`steps/v1`](steps/v1): incidents on the desk, and the status page mounted at /status, its link written with the prefix (the lesson's mistake): doubled, a 404
- [`steps/v2`](steps/v2): the link written as the status program sees itself
- this folder: a changelog, mounted at /changelog, with a database of its own (the lesson's "your turn")
