# Live, but Not Too Live: Topics, Watch and Publish | Advanced Quillo #3

Help Desk, lesson 3 of Advanced Quillo: pages that follow the data, but only the data they show. The ticket list is live; each ticket's replies are live on its page, first woken by the whole replies table (every reply runs every open ticket page's loader again), then by a topic of the ticket's own, with watch, unwatched and publish.

This lesson starts where [02-presence](../02-presence) ended.

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

- [`steps/v0`](steps/v0): where lesson 2 ended
- [`steps/v1`](steps/v1): the home page's ticket list, live: a ticket added anywhere shows up on every open list
- [`steps/v2`](steps/v2): replies, live on a ticket's page; every reply wakes every open ticket page (the lesson's mistake)
- [`steps/v3`](steps/v3): a topic for each ticket: a reply wakes only that ticket's pages
- this folder: each ticket's reply count, live on the home page (the lesson's "your turn")
