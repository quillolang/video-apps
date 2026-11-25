# Why Your Single-Page App Forgets Everything: State That Stays | Quillo SPA #4

Fernhill Trails, lesson 4 of Quillo Single-Page Apps: state that stays. steps/v1 is lesson 3's app. steps/v2 adds "Add to my plan" to a trail page, with the plan in TrailPage's own state, so another trail's page, or Back, finds the plan empty. steps/v3 lifts the plan into App and hands it down (plan, on_add), with "My plan · 2" in the header and a /plan page; a reload starts it afresh. steps/v4 keeps it in localStorage through js(): state plan = saved(js("localStorage.getItem", "plan")), and keep() saves it, so a reload and a new tab still have it. The exercise adds Remove and the plan's total distance.

This lesson starts where [03-page-data](../03-page-data) ended.

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

- [`steps/v1`](steps/v1): lesson 3's app
- [`steps/v2`](steps/v2): the plan in the trail page's own state: every other page finds it empty (the lesson's mistake)
- [`steps/v3`](steps/v3): the plan in App, handed down, with a count and a plan page; a reload empties it
- [`steps/v4`](steps/v4): the plan kept in localStorage: a reload and a new tab keep it
- this folder: Remove, and the plan's total distance (the lesson's "your turn")
