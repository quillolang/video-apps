# Who's Here? Live Presence with Channels, Join and Leave | Advanced Quillo #2

Help Desk, lesson 2 of Advanced Quillo: who else is looking at a ticket, as it happens. A "viewers" channel: the page joins it and says which ticket it shows, the server keeps who's where in a map keyed by tenant() and broadcasts it, and leave takes a closed page off the list.

This lesson starts where [01-teams](../01-teams) ended.

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

- [`steps/v0`](steps/v0): where lesson 1 ended
- [`steps/v1`](steps/v1): a name for each person, kept in the session, and a page for each ticket
- [`steps/v2`](steps/v2): who's here: the viewers channel, with join but no leave, so a page that closed stays on the list (the lesson's mistake)
- [`steps/v3`](steps/v3): leave takes a page off the list, and tells the others
- this folder: who's online, on the team's home page (the lesson's "your turn")
