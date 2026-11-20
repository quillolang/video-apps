# One Extra Field in the Form Made Him an Admin: Mass Assignment | Quillo Security #6

Swap Board, lesson 6 of Quillo Security: one extra field. steps/v2 adds profiles (008_bio.sql, /account/profile, a member page at /members/:id) and saves the profile the quick way: every field in request.form to its column, with sql_name (so quillo check is quiet). The attack: Max's curl adds role=admin, and the admin page opens for him, every email on it (any column of members is his to set, his id too). The fix (steps/v3): type Profile = { name: str, bio: str }, the route takes { form: Profile } (a record drops fields it doesn't have), and save_profile names its columns. The exercise: "Show my email on my page", show_email: bool = false in the record and the update.

This lesson starts where [05-whose](../05-whose) ended.

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

- [`steps/v2`](steps/v2): profiles, saved the quick way: every field the form sent (the lesson's attack)
- [`steps/v3`](steps/v3): a Profile record and named columns: an extra field is dropped
- this folder: "Show my email on my page", in the record and the update (the lesson's "your turn")
