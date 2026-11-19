# Every Restart Signed Everyone Out: Ready for Production | Advanced Quillo #23

Help Desk, lesson 23 of Advanced Quillo: ready for production. .env.example names QUILLO_SECRET: without it, a server started without --watch makes a new session key each start, and a restart signs everyone out (--watch keeps one in .quillo/, so it never showed); make one with crypto.token() in the REPL, put it in .env, the same on every server. HTTPS comes from a proxy in front (Caddy, nginx, limer), and --instances N runs more copies (see https://quillolang.org/docs/hosting/). quillo.policy says what the program may do: its effects, the one env variable it reads (SITE), and no plugin builds. The mistake (steps/v1): a policy without net, which the channels need: quillo check says so, and ./run.sh refuses to start. The fix (steps/v2): net added. The exercise: a backup of every team each night, db.tenants() with with_tenant and vacuum into, scheduled for 02:00 UTC.

This lesson starts where [22-tests](../22-tests) ended.

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

- [`steps/v1`](steps/v1): .env.example, and a policy without net (the lesson's mistake): quillo check gives two errors, and it won't start
- [`steps/v2`](steps/v2): the policy with net: check passes, and the start line names it
- this folder: a backup of every team each night, scheduled (the lesson's "your turn")
