# Many Answers: match | Learn to Code with Quillo #14

Movie Night, lesson 14 of Learn to Code with Quillo (part 2): match in lib/words.qwe: votes_text with an arm for each number of votes, and snack_note and era with guards and a catch-all.

This lesson starts where [13-types](../13-types) ended.

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

- [`steps/v0`](steps/v0): where lesson 13 ended
- [`steps/v1`](steps/v1): votes_text: a match on the votes, used by VoteButton
- [`steps/v2`](steps/v2): snack_note: three answers, with guards and _
- this folder: era with three answers (the lesson's "your turn")
