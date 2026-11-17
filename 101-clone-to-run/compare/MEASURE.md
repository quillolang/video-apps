# The race: the Epic Stack and the Quillo starter, cold, from nothing to a first page

Every number in the video (its `versus` scene, and the narration) comes from `measure.py` in this folder,
which wrote `runs.json`. One machine, one network; your numbers will differ.

- **When:** 2026-11-18 03:07 (the Epic Stack), 2026-11-18 03:15 and 2026-11-18 03:16 (Quillo)
- **Machine:** Apple M5, macOS 26.7.1; busy rendering videos (load average 29 as the Epic Stack began, 34 after; 25 as Quillo's first run began)
- **Node:** v24.11.0; **npm:** 11.6.1; **git:** 2.54.0 (Apple Git-157)
- **Cold:** the Epic Stack with an empty npm cache (`npm_config_cache`) and an empty Playwright browser folder
  (`PLAYWRIGHT_BROWSERS_PATH`), both in a scratch folder; Quillo from a fresh clone, which downloads its quillo.
  Everything was deleted after.

## The Epic Stack (github.com/epicweb-dev/epic-stack)

Its docs/getting-started.md: `npx epicli new <project-name>`, then `npm run dev`. `SKIP_DEPLOYMENT=true` (named
there) skips only the deploy to Fly, which neither side does. epicli runs `create-remix` with the epic-stack
template, which installs the packages and runs the template's setup: `npm run build`, `prisma migrate deploy`,
`prisma generate --sql`, `playwright install`, then `npm run format`.

```
$ SKIP_DEPLOYMENT=true npx epicli new epic-app      # 444.6 s, exit 0, 12,799 lines; the browsers it downloaded:
  Chrome for Testing 145.0.7632.6
  Chrome Headless Shell 145.0.7632.6
  Firefox 146.0.1
  WebKit 26.0
  ...
> format
> prettier --write . --log-level warn
Setup is complete. You're now ready to rock and roll 🐨
What's next?
- Start development with `npm run dev`
- Run tests with `npm run test` and `npm run test:e2e`
      ✔  Template's remix.init script complete
  done   That's it!
$ cd epic-app && npm run dev                        # 32.3 s until http://localhost:3000/ answered 200, "Epic Notes"
> dev
> cross-env NODE_ENV=development MOCKS=true node index.ts
🔶 Mock server installed
Starting development server
```

- **To the first page:** 476.9 s (7:57)
- **Packages installed:** 1,167 (`npm ls --all --parseable | wc -l`)
- **On disk:** the project 915MB, of it node_modules 896MB; npm's cache 467MB; the test browsers 1.1GB (`du -sh`)

## The Quillo starter (github.com/quillolang/starter)

Its README, "Start":

```
$ git clone --depth 1 --branch v0.8.6 https://github.com/quillolang/starter.git my-app      # 1.2 s
Cloning into 'my-app'...
warning: refs/tags/v0.8.6 5a03e619a5a5ad02b5fceaa77c3bdca93f2e9e12 is not a commit!
$ cd my-app
$ rm -rf .git && git init      # 0.0 s
Initialized empty Git repository in /Users/you/my-app/.git/
$ sh get-quillo.sh spa      # 2.6 s
get-quillo: this folder's program is the spa sample now (lib/ main.qwe migrations/ ui/ ); samples/ is removed
get-quillo: quillo 0.8.6 (238dac2, 2026-11-16), in .quillo/bin
get-quillo: wrote run.sh; start the program with ./run.sh --watch
$ ./run.sh --watch      # 0.8 s until http://127.0.0.1:8080/ answered 200, "spa"
quillo: sessions are signed with .quillo/.quillo-secret (development only; set QUILLO_SECRET in production)
quillo: applied migration 001_spa.sql
quillo: 1 route listening on http://127.0.0.1:8080
quillo: database /Users/you/my-app/app.db
quillo: watching for changes
GET / -> 200 (3.7ms)
```

- **Run 1, to the first page:** 4.6 s; the folder 29MB, of it `.quillo/` (the quillo binary) 29MB; 20 files besides

```
$ git clone --depth 1 --branch v0.8.6 https://github.com/quillolang/starter.git my-app      # 1.0 s
Cloning into 'my-app'...
warning: refs/tags/v0.8.6 5a03e619a5a5ad02b5fceaa77c3bdca93f2e9e12 is not a commit!
$ cd my-app
$ rm -rf .git && git init      # 0.0 s
Initialized empty Git repository in /Users/you/my-app/.git/
$ sh get-quillo.sh spa      # 1.0 s
get-quillo: this folder's program is the spa sample now (lib/ main.qwe migrations/ ui/ ); samples/ is removed
get-quillo: quillo 0.8.6 (238dac2, 2026-11-16), in .quillo/bin
get-quillo: wrote run.sh; start the program with ./run.sh --watch
$ ./run.sh --watch      # 0.3 s until http://127.0.0.1:8080/ answered 200, "spa"
quillo: sessions are signed with .quillo/.quillo-secret (development only; set QUILLO_SECRET in production)
quillo: applied migration 001_spa.sql
quillo: 1 route listening on http://127.0.0.1:8080
quillo: database /Users/you/my-app/app.db
quillo: watching for changes
GET / -> 200 (3.5ms)
```

- **Run 2, to the first page:** 2.3 s; the folder 29MB, of it `.quillo/` (the quillo binary) 29MB; 20 files besides

## The scoreboard

| | Epic Stack | Quillo starter |
|---|---|---|
| To the first page | 7:57 | 4.6 s (the slower of 4.6 and 2.3) |
| Commands to type | 3 (`npx epicli new`, `cd`, `npm run dev`) | 5 (`git clone`, `cd`, `git init`, `get-quillo.sh`, `run.sh`) |
| Packages installed | 1,167 | 0 |
| The project on disk | 915MB | 29MB |
| Test browsers | 1.1GB | none |
| Node.js | needed (its engines: ^22.18.0; this ran on Node 24) | not needed |

