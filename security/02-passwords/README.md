# I Opened the Database and Read Every Password: Passwords, Stored Right | Quillo Security #2

Swap Board, lesson 2 of Quillo Security: passwords, stored right. The attack (steps/v1, lesson 1's app): with a copy of swap.db, the REPL reads every member's password as typed. A fast hash isn't enough: crypto.sha256 gives the same fingerprint for the same password, and attackers keep lists of them; crypto.hash_password (Argon2id, salted, m=19456) gives a new one each time, and crypto.verify_password checks it. The fix (steps/v2): migration 004 renames the column password_hash, sign_up stores crypto.hash_password, sign_in asks crypto.verify_password, and hash_old_passwords() hashes the passwords already there as the program starts (SQL can't make an Argon2id hash). The exercise: /account, to change your password, the current one checked first.

This lesson starts where [01-attacker](../01-attacker) ended.

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

- [`steps/v1`](steps/v1): lesson 1's app: passwords kept as typed (the lesson's attack)
- [`steps/v2`](steps/v2): Argon2id hashes: migration 004, crypto.hash_password and verify_password, and the old passwords hashed at start
- this folder: a page to change your password, the current one checked first (the lesson's "your turn")
