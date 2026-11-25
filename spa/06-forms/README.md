# One Tap, Two Saves: Forms That Go Somewhere | Quillo SPA #6

Fernhill Trails, lesson 6 of Quillo Single-Page Apps: forms that go somewhere. steps/v1 is lesson 5's app. steps/v2 adds hikes (migrations/002_hikes.sql, lib/hikes.qwe, ui/hikes.qwe): a "Log a hike" form at /trails/5/log whose onsubmit calls server fn log_hike(...) -> int ! str, keeps a broken rule's words in the form, and navigates to /hikes/7; a hike page and a list at /hikes; App reads the new addresses with numbered(), and the route answers 404 for a trail or hike that isn't there. But on a slow network a second press of Save logs the hike twice. steps/v3 adds a saving state: the button is disabled and says "Saving…" while the call waits. The exercise adds "Delete this hike", guarded the same way.

This lesson starts where [05-filters](../05-filters) ended.

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

- [`steps/v1`](steps/v1): lesson 5's app
- [`steps/v2`](steps/v2): the hike form, hike page and list; Save pressed twice on a slow network logs the hike twice (the lesson's mistake)
- [`steps/v3`](steps/v3): a saving state: Save is disabled and says "Saving…" while the call waits
- this folder: "Delete this hike", guarded the same way (the lesson's "your turn")
