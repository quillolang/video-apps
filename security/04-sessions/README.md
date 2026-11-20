# We Took Away His Admin Role. He Kept the Admin Page: Sessions You Can Trust | Quillo Security #4

Swap Board, lesson 4 of Quillo Security: sessions you can trust. A Quillo session is a cookie, base64url JSON and an HMAC signature: the visitor can read it (cut -d. -f1 | base64 -d), can't change it (a role edited to "admin" is thrown away: 403), and it's kept nowhere else. steps/v1 (lesson 3's app) copies the whole member, role included, into it at sign-in. steps/v2 adds Make admin / Remove admin to Rosa's admin page: Ben, made an admin and then not, keeps the admin page, since his cookie still says admin, for its 30 days. The fix (steps/v3): set_session({ member_id }) only, and me() reads the member from the database each time. The exercise: Sign out everywhere, with a session_version number in members, carried in the session and checked by me().

This lesson starts where [03-sign-in](../03-sign-in) ended.

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

- [`steps/v1`](steps/v1): lesson 3's app: the whole member, role included, copied into the session
- [`steps/v2`](steps/v2): Make admin / Remove admin on the admin page: a role taken back keeps working (the lesson's attack)
- [`steps/v3`](steps/v3): the session keeps member_id only; me() reads the member from the database
- this folder: Sign out everywhere, with a session_version checked on every request (the lesson's "your turn")
