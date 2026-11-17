# The Host's Key: Passwords Done Right | Learn to Code with Quillo #16

Movie Night, lesson 16 of Learn to Code with Quillo (part 2): a host's log-in on /host, with the password's hash in .env (never the password itself), checked by crypto.verify_password, remembered in the session, and a Log out. Make your own .env: see .env.example.

This lesson starts where [15-dates](../15-dates) ended.

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

- [`steps/v0`](steps/v0): where lesson 15 ended
- [`steps/v1`](steps/v1): lib/host.qwe and ui/host.qwe: the host's log-in, its hash read from .env
- this folder: Log out (the lesson's "your turn")
