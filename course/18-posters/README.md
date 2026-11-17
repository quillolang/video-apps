# Posters: Uploading Pictures, and Checking What's Inside | Learn to Code with Quillo #18

Movie Night, lesson 18 of Learn to Code with Quillo (part 2): the host uploads a poster for each movie; the upload is checked with image.info (a name ending in .jpg proves nothing), shrunk with image.convert, saved under a name we choose, and shown on the movie's page and in the list. Make your own .env: see .env.example.

This lesson starts where [17-host](../17-host) ended.

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

- [`steps/v0`](steps/v0): where lesson 17 ended
- [`steps/v1`](steps/v1): a poster column, the upload form and route, saving whatever comes
- [`steps/v2`](steps/v2): image.info checks it's a picture; image.convert shrinks it to 300 pixels
- this folder: small posters in the home page's list (the lesson's "your turn")
