# Do It Later: Emails That Survive a Restart, with .later | Advanced Quillo #6

Help Desk, lesson 6 of Advanced Quillo: work done later that still gets done. A mail service (mailer.qwe, a stand-in for a mail provider, in the same process) sends an email for each new ticket. Kept in a list in memory and sent once a minute, emails are lost when the program stops; made later instead, mailer.later.email in the ticket's transaction, each call is kept in the team's own database and made in the background until it gets through, even after a restart. later.status tells what became of a call.

This lesson starts where [05-twice](../05-twice) ended.

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

- [`steps/v1`](steps/v1): a mail service, and each new ticket's email kept in a list in memory, sent once a minute: a restart before the minute loses them (the lesson's mistake)
- [`steps/v2`](steps/v2): the email made later, mailer.later.email, in the ticket's transaction: kept in the team's database, sent even after a restart
- this folder: each ticket keeps its email's call id, and its page shows later.status: waiting, with its tries, or done (the lesson's "your turn")
