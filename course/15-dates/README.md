# When's Movie Night? Dates, Time Zones and a Countdown | Learn to Code with Quillo #15

Movie Night, lesson 15 of Learn to Code with Quillo (part 2): lib/when.qwe finds the next Friday and counts the days to it, with today's date in the friends' own time zone, and a countdown in words.

This lesson starts where [14-match](../14-match) ended.

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

- [`steps/v0`](steps/v0): where lesson 14 ended
- [`steps/v1`](steps/v1): next_friday, and the date on the home page
- [`steps/v2`](steps/v2): days to go, from date.today(): the date in UTC
- [`steps/v3`](steps/v3): date.today(zone): the date in the friends' own time zone
- this folder: countdown_text: tonight, tomorrow, or N days to go (the lesson's "your turn")
