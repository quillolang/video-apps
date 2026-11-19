# Live Updates in Every Tab: Express Server-Sent Events vs Quillo's live()

Trail Club's conditions board in Quillo (main.qwe, on 8131): a ranger posts a trail's status, and every open page shows it at once, with live(), which runs the server fn again whenever the trails table changes. compare/express is the same board in Express 5.3.0 with better-sqlite3 13.2.0: server-sent events written by hand (app.js keeps the open pages and writes to each; public/index.html opens an EventSource), with two variants, one without the req.on('close') line and one behind compression() (and its fix, res.flush()). compare/live.mjs tries each side the same ways in a browser; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8131   # Quillo's board: http://127.0.0.1:8131
(cd compare/express && npm install && npm start)   # Express's: http://localhost:3000
curl -d id=2 -d status=closed localhost:3000/status   # a ranger's change
(cd compare && node live.mjs express out.json && node live.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8131
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
