# Two Photos Named photo.jpg, and a Photo That Was a Page: Files In, Files Out | Quillo Security #10

Swap Board, lesson 10 of Quillo Security: files in, files out. steps/v2 adds listing photos (010_photos.sql, an "Add a photo" form for the owner, POST /listings/:id/photo) kept as uploads/${f.filename}, served with files("uploads", path) as quillo check asks. The attack: Ana's and Ben's photos are both photo.jpg, so Ben's replaces Ana's; and Max's "photo", page.html (a sign-in form in Swap Board's style, posting elsewhere), is served as text/html at /uploads/page.html, a page on Swap Board's own address. The fix (steps/v3): uuid() names; an upload with no extension is served as application/octet-stream, and photos still show in an <img>. The exercise: 2 MB at most (413), and a JPEG or PNG by image.info (else delete_file and 415). Any two photos named photo.jpg show the first attack.

This lesson starts where [09-other-sites](../09-other-sites) ended.

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

- [`steps/v2`](steps/v2): photos kept under the names they came with: one replaces another, and page.html is a page (the lesson's attack)
- [`steps/v3`](steps/v3): uuid() names: two photos, two files, and page.html is just bytes
- this folder: JPEG or PNG only, 2 MB at most, by image.info (the lesson's "your turn")
