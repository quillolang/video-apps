# My Password Reset Link Worked Twice: Every Attack, Every Time | Quillo Security #12

Swap Board, lesson 12 of Quillo Security, the last: every attack, every time. attacks/attack.qwe sends an attack from each lesson to the board running on localhost:8080 (.quillo/bin/quillo run attacks/attack.qwe, in a second terminal), prints refused or GOT THROUGH for each, and exits 0 when all are refused, 1 when one gets through. It lives in attacks/ because quillo.policy, beside main.qwe, would refuse its requests to this machine. steps/v2 adds it, with eleven attacks, and a password reset (012_resets.sql): /forgot prints the email's link, /reset?token=..., where a mailer would send it. The attack: the link is in the request log, and works again after it's used. The fix (steps/v3, 013_reset_hash.sql): the token kept as its SHA-256, for 30 minutes, deleted when used. The exercise: attack 12, a reset link used twice.

This lesson starts where [11-links](../11-links) ended.

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

- [`steps/v2`](steps/v2): attacks/attack.qwe with eleven attacks, and a password reset whose link works again and again (the lesson's attack)
- [`steps/v3`](steps/v3): the reset kept as a hash, for 30 minutes, once
- this folder: attack 12 in attacks/attack.qwe, a reset link used twice (the lesson's "your turn")
