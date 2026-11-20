# One Look at a Bio, and It Posted a Listing as the Reader: What raw() Lets In | Quillo Security #7

Swap Board, lesson 7 of Quillo Security: what raw() lets in. steps/v1 (lesson 6's app) shows a bio with {m.bio}: Max's HTML (an <u>, and an <img> whose onerror posts a listing) is escaped, and shown as text. steps/v2 renders bios with markdown(m.bio, { html: true }), "so members can underline": Ana opens Max's page, and a listing "Free phones! Ask Max" appears from Ana (the onerror ran with Ana's session; a same-site request, so the cross-site check doesn't apply). The fix (steps/v3): markdown(m.bio), which shows HTML as text. The exercise: site_headers({ "content-security-policy": "default-src 'self'" }), with Quillo's own scripts named by hash; with html: true put back for a moment, the browser refuses the onerror.

This lesson starts where [06-extra-field](../06-extra-field) ended.

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

- [`steps/v2`](steps/v2): bios in Markdown with html: true: a bio's script runs as its reader (the lesson's attack)
- [`steps/v3`](steps/v3): markdown(m.bio): HTML in a bio is shown as text
- this folder: a content-security-policy for the whole site (the lesson's "your turn")
