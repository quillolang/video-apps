# Two Agents, One Ticket: Lost Updates and a Version Column | Advanced Quillo #7

Help Desk, lesson 7 of Advanced Quillo: two agents, one ticket. An edit page that saves everything its form had loses an update: Ana closes a ticket, Ben, whose form was made before, adds a tag, and the ticket is open again. A version column fixes it: a save goes through only for the version its form was made from (where id = ? and version = ?), and changes == 0 means someone saved first, so the agent is shown the ticket as it is now. On a conflict, the tags can be merged instead.

This lesson starts where [06-later](../06-later) ended.

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

- [`steps/v1`](steps/v1): an edit page for a ticket (title, status, tags) that saves everything its form had: the second of two saves wipes out the first (the lesson's mistake)
- [`steps/v2`](steps/v2): a version column: a save made from an older version changes nothing, and the agent is shown the ticket as it is now
- this folder: on a conflict, the form's tags are merged into what the other agent saved (the lesson's "your turn")
