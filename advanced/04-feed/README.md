# An Activity Feed: Server-Sent Events, Ids and Reconnects | Advanced Quillo #4

Help Desk, lesson 4 of Advanced Quillo: an activity feed, sent from the server as Server-Sent Events (events) and followed in the page (listen). The stream's function runs for no team, so the route carries the team in with with_tenant, after checking it's there; each new line goes once, with its id, so a page that reconnects goes on from the last one.

This lesson starts where [03-live](../03-live) ended.

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

- [`steps/v0`](steps/v0): where lesson 3 ended
- [`steps/v1`](steps/v1): an activity table, and a feed that stays empty: the stream's function runs for no team
- [`steps/v2`](steps/v2): the team carried into the stream with with_tenant; the feed works, but every event is the whole history (the lesson's mistake)
- [`steps/v3`](steps/v3): each new line once, with its id: small events, and Last-Event-ID to go on after a reconnect
- this folder: a feed you can pause and resume, with nothing missed (the lesson's "your turn")
