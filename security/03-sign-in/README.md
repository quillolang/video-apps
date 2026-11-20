# My Log-In Page Told a Script Who Has an Account: A Sign-In That Tells Nothing | Quillo Security #3

Swap Board, lesson 3 of Quillo Security: a sign-in that tells nothing. The attack (steps/v1, lesson 2's app): the sign-in says "No account with that email." or "Wrong password.", and attacks/find-members.qwe, a Quillo script, lists the members from that. The common half-fix (steps/v2): one message, "Wrong email or password."; the script times each answer instead (now(), fastest of three): members take an Argon2id check (over 10 ms), others none (0 ms), because sign_in returned before verify_password when no member had the email. The fix (steps/v3): crypto.verify_password runs every time, before the member is looked at (with no member its hash is null, and verify_password takes as long and says false), so every sign-in does the same work. attacks/guess-password.qwe still gets in by guessing. The exercise: failed_sign_ins counts wrong tries per email, account or not; five in 15 minutes and the email waits.

This lesson starts where [02-passwords](../02-passwords) ended.

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

- [`steps/v1`](steps/v1): lesson 2's app, and the attacker's script: two messages give the members away
- [`steps/v2`](steps/v2): one message; the attacker's script times the answers instead, and still finds them
- [`steps/v3`](steps/v3): verify_password every time: every sign-in takes as long; guess-password.qwe still gets in
- this folder: wrong sign-ins counted: five in 15 minutes, and the email waits (the lesson's "your turn")
