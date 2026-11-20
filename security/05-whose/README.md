# One Number in the Address, and Someone Else's Listing Was Mine: Whose Is It? | Quillo Security #5

Swap Board, lesson 5 of Quillo Security: whose is it? The attack (steps/v1, lesson 4's app): the listing page hides its Edit link from everyone but the owner, but /listings/:id/edit and its save check only that someone is signed in: Max types /listings/1/edit and retitles Ana's bike "Taken, sorry!", and a curl loop gets 200 from every listing's edit page. The fix (steps/v2): my_listing(id, owner_id) and an update with "and owner_id = ?": anyone else gets a 404, not a 403. steps/v3 adds messages (ask a listing's owner), written the same way: Max reads Ben's message to Ana at /messages/1. The exercise: a message only for its sender and recipient.

This lesson starts where [04-sessions](../04-sessions) ended.

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

- [`steps/v1`](steps/v1): lesson 4's app: the edit routes check only that someone is signed in (the lesson's attack)
- [`steps/v2`](steps/v2): the owner in the query: someone else's listing is a 404
- [`steps/v3`](steps/v3): messages, written the same way: anyone signed in reads /messages/1
- this folder: a message only for its sender and its recipient (the lesson's "your turn")
