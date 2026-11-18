# Everyone Gets an Account: Sign Up, Log In, Log Out | Intermediate Quillo #2

Recipe Box, lesson 2 of Intermediate Quillo: accounts for everyone, in a users table with one account per email; sign up and log in with each password kept as a hash, the database's errors turned into messages people understand, and who is signed in at the top of every page.

This lesson starts where [01-plan](../01-plan) ended.

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

- [`steps/v0`](steps/v0): where lesson 1 ended
- [`steps/v1`](steps/v1): a users table and a sign-up form; a second sign-up with the same email shows the database's error (the lesson's mistake)
- [`steps/v2`](steps/v2): that error turned into a message on the form, with db.error_kind
- [`steps/v3`](steps/v3): logging in, with one message for a wrong email or a wrong password, and a greeting
- this folder: who is signed in, in every page's header, with a Log out button (the lesson's "your turn")
