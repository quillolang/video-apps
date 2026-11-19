# Internal Error? Find It by Its Request ID: Logs, Metrics, Health | Advanced Quillo #10

Help Desk, lesson 10 of Advanced Quillo: seeing what it does on a real server. Each ticket shows its last reply ("Ana, 3 hours ago"). Run as a server runs it, ./run.sh --log json --metrics 2> app.log (no --watch), a new ticket with no replies answers "internal error"; the log has a JSON line per request with its rid, and the error with the same rid, so grep finds main.qwe:104 (ago got null). The fix gives a missing last reply a branch of its own. /_quillo/metrics counts the answers by status, /_quillo/health is for the load balancer, and errors.qwe prints the server errors so far.

This lesson starts where [09-services](../09-services) ended.

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

- [`steps/v1`](steps/v1): the last reply on each ticket, read from a reply that may not be there: a new ticket answers internal error (the lesson's mistake)
- this folder: a ticket with no replies says "none yet", and errors.qwe counts the server errors from the metrics (the lesson's "your turn")
