# The Page Was Guarded. Its Data Wasn't: Route Groups and Middleware | Advanced Quillo #15

Help Desk, lesson 15 of Advanced Quillo: groups and middleware. The agents' pages move under /desk in `routes /desk | agent`; agents sign in with their name (011_agents.sql: Ana an admin, the others agents), and `routes /settings | role("admin")` nests inside. Signed out, /desk sends you to sign in; Ben gets a 403 on the settings. But a group guards its routes, not the server fns their pages call: signed out, POST /_quillo/rpc/load_tickets gave every ticket, and quillo check warned. The fix: each server fn checks the session itself (load_tickets, load_replies, and add_reply, which check didn't warn of). The exercise: `routes /help | agent` for writing articles, before /help/:slug.

This lesson starts where [14-requests](../14-requests) ended.

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

- [`steps/v1`](steps/v1): the agents, a sign-in, /desk in a guarded group, and role("admin") for the settings; the server fns its pages call are open to anyone (the lesson's mistake)
- [`steps/v2`](steps/v2): each server fn checks the session itself
- this folder: writing help articles for agents only, `routes /help | agent` (the lesson's "your turn")
