# Works on My Laptop, Blank on My Phone: Each Page Loads Its Data | Quillo SPA #3

Fernhill Trails, lesson 3 of Quillo Single-Page Apps: each page loads its data. steps/v1 is lesson 2's app, where App holds every trail, whole, from the first page. steps/v2 gives TrailList and TrailPage their own data, with server fns in state (state trail = load_trail(id)) and key={at.id}; but TrailPage doesn't handle null: with a mouse the prefetched page shows whole, while a tap on a touch screen leaves the page blank (Level gets null), and quillo check passes. steps/v3 shows Waiting while trail is null and NotFound for an error value (load_trail returns err("no such trail")). The exercise makes the list say "Loading trails…" instead of "0 trails".

This lesson starts where [02-real-404s](../02-real-404s) ended.

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://localhost:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): lesson 2's app: App holds every trail, whole
- [`steps/v2`](steps/v2): each page loads its data, but the trail page doesn't handle null: blank after a tap (the lesson's mistake)
- [`steps/v3`](steps/v3): Waiting while null, NotFound for an error value
- this folder: the list says "Loading trails…" while it loads (the lesson's "your turn")
