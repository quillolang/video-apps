# Fast Pages: Measure Your Queries, Read the Plan, Add an Index | Advanced Quillo #8

Help Desk, lesson 8 of Advanced Quillo: fast pages. After a busy month (seed.qwe: 100 more tickets, 20,000 replies), the ticket list takes about 27 ms. The query stats (/_quillo/health/queries, on under --watch; stats.qwe prints them) show that the 102 queries per row are cheap in SQLite, and the list's reply count is the slow one: its plan is SCAN replies. An index on replies (ticket_id) makes it a search, and the page about 1 ms. Then the last reply's author goes into the list's own query.

This lesson starts where [07-agents](../07-agents) ended.

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

- [`steps/v1`](steps/v1): the list shows who wrote each ticket's last reply, with one more query for each ticket; the reply count reads every reply (the lesson's mistake)
- [`steps/v2`](steps/v2): an index on replies (ticket_id): the count is a search, and the page about twenty times faster
- this folder: each ticket's last author in the list's own query: one query for the list (the lesson's "your turn")
