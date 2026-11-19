# Searching "run" Found "brunch": LIKE vs Full-Text Search | Quillo Databases #17

Lesson 17 of Quillo Databases: search. The Corner Shop's like search, from lesson 4. The Clinic's doctors' notes (007_notes.sql) searched with like '%' || :q || '%' (steps/clinic-v1, the lesson's mistake): run finds "brunch" and "Runny", and every appointment is read (SCAN). 008_notes_search.sql: an FTS5 index of the notes with the porter stemmer, filled with rebuild and kept up to date by three triggers; the page asks match, ordered by rank: running and runs, the best first. steps/clinic-v2 passes what was typed straight to match, so ankle-sore is an error (no such column: sore). The exercise: each word in double quotes, so the box takes anything.

Each setting is a folder of its own, with its own database. Written for Quillo 0.8.6: in a setting's folder, `run.sh` downloads that Quillo the first time:

- [`clinic`](clinic): the Clinic: notes (007_notes.sql), their full-text index (008_notes_search.sql), and /notes?q=run, safe for anything typed (the lesson's "your turn")
- [`shop`](shop): the Corner Shop: /search, with like, from lesson 4
- [`library`](library): the Library, as lesson 15 left it
- [`school`](school): the School, as lesson 16 left it
- [`bank`](bank): the Bank, as lesson 16 left it
- [`concert`](concert): the Concert Hall, as lesson 11 left it

```sh
cd clinic
./run.sh --watch
```

Then open http://127.0.0.1:8080. One setting at a time on that port: stop one with Ctrl+C before starting the next, or give it `--port 8081`.

On Windows, in PowerShell, in a setting's folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The versions from the video run on their own (`cd steps/clinic-v1 && ./run.sh --watch`):

- [`steps/clinic-v1`](steps/clinic-v1): the notes searched with like (the lesson's mistake): letters, not words, and every row read
- [`steps/clinic-v2`](steps/clinic-v2): full-text search, but what was typed goes straight to match (where the "your turn" starts)
