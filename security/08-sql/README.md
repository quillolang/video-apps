# One Search Listed Every Member's Email: SQL Built From Text | Quillo Security #8

Swap Board, lesson 8 of Quillo Security: SQL built from text. steps/v2 adds a search box (GET / ? { q }), and search_listings puts the words into the SQL: like '%${q}%'. quillo check warns ("db.query with SQL built from values ... SQL injection"); it runs anyway, and the search x' union select id, email, password_hash, name from members -- lists every member's email and Argon2id hash. The fix (steps/v3): like ?, with `%${q}%` passed after the SQL; check is quiet, and the same search finds nothing. The exercise: sorting by a column the address names, type Sort = "newest" | "title" | "condition" | "owner", put in with sql_name; anything else is a 400.

This lesson starts where [07-raw](../07-raw) ended.

Written for Quillo 0.8.8. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v2`](steps/v2): a search with its words put into the SQL: check warns, and a search lists every email (the lesson's attack)
- [`steps/v3`](steps/v3): the words as a ? value: the same search finds nothing
- this folder: sorting by a Sort, put in with sql_name (the lesson's "your turn")
