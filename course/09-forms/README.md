# Suggest a Movie: Forms and Errors | Learn to Code with Quillo #9

Movie Night, lesson 9 of Learn to Code with Quillo: a suggestion box on /suggest, a text box tied to state, a server fn that checks the title (trim, blank, a repeat, too long) and gives back an error value, and the page showing the problem kindly.

This lesson starts where [08-live](../08-live) ended.

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

- [`steps/v0`](steps/v0): where lesson 8 ended
- [`steps/v1a`](steps/v1a): a suggestions table, and server fns all_suggestions and suggest (-> int ! str)
- [`steps/v1`](steps/v1): the suggestion box on /suggest, ignoring suggest's errors (quillo check warns)
- [`steps/v2`](steps/v2): the error is caught with is_err, and shown under the box
- this folder: titles over 60 letters refused (the lesson's "your turn")
