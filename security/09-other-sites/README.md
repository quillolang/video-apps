# A Kittens Page Deleted My Listing: Requests From Other Sites | Quillo Security #9

Swap Board, lesson 9 of Quillo Security: requests from other sites. steps/v2 adds Delete as a link, a GET route (owner-checked); quillo check warns that a GET that writes and reads who the visitor is runs with their session from a link elsewhere. other-site/main.qwe is somebody else's site (.quillo/bin/quillo run other-site/main.qwe --port 8081, at 127.0.0.1:8081, another site to the browser): its meta refresh sends the browser to http://localhost:8080/listings/1/delete, and Ana's bike is gone (the session cookie goes along on a followed link or refresh). The fix (steps/v3): Delete is a POST button; the other site's form posting to /listings/3/delete gets Quillo's 403, "this site does not take form posts from other sites". The exercise: /embed/listings may be framed by any site (site_headers("/embed", ...) with x-frame-options null and frame-ancestors *); every other page keeps x-frame-options: SAMEORIGIN.

This lesson starts where [08-sql](../08-sql) ended.

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

- [`steps/v2`](steps/v2): Delete as a GET link, and the kittens site that follows it (the lesson's attack)
- [`steps/v3`](steps/v3): Delete as a POST button: the kittens site's post is refused with a 403
- this folder: /embed/listings, framed by any site; the rest refuse frames (the lesson's "your turn")
