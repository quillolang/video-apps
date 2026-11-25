# Your Filters Vanish When You Press Back: Filters in the Address | Quillo SPA #5

Fernhill Trails, lesson 5 of Quillo Single-Page Apps: filters in the address. steps/v1 is lesson 4's app. steps/v2 adds a level filter kept in TrailList's state (buttons): it works until you open a trail and press Back, and the address never shows it. steps/v3 puts the filters in the address (/?level=medium&max=10): TrailList reads url().query, fits() checks each trail, and Filter links made with list_link() (url_encode(set(q, name, value))) set one filter and keep the others, so Back steps through them, a shared link shows the same list, and the server sends it filtered. The exercise adds a sort order, ?sort=climb.

This lesson starts where [04-plan](../04-plan) ended.

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

- [`steps/v1`](steps/v1): lesson 4's app
- [`steps/v2`](steps/v2): a level filter kept in state: Back from a trail brings back every trail, and the address stays / (the lesson's mistake)
- [`steps/v3`](steps/v3): the filters in the address, read with url().query and set by links
- this folder: a sort order in the address, ?sort=climb (the lesson's "your turn")
