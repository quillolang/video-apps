# Call the Server: Server Functions | Learn to Code with Quillo #7

Movie Night, lesson 7 of Learn to Code with Quillo: a votes column (migrations/003_votes.sql), a server fn that saves each vote in the database, a VoteButton that calls it with props, and an Undo that never goes below 0.

This lesson starts where [06-database](../06-database) ended.

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

- [`steps/v0`](steps/v0): where lesson 6 ended: votes only in the browser
- [`steps/v1`](steps/v1): a votes column, and server fn vote
- [`steps/v2`](steps/v2): the button calls vote(id): votes saved, through a reload and a restart
- this folder: Undo, with server fn unvote (the lesson's "your turn")
