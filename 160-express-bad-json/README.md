# A Bad JSON Body in Express vs Quillo: express.json(), an Error Page, and express-validator

The bake sale's sign-ups API in Quillo (main.qwe, on 8080, the same as videos 131, 150 and 152): a record type, `Signup(request.json)`, and the rules in `problems`. compare/express is the same API in Express 5.3.0: variants/naive.js with express.json() alone, and app.js with express-validator 7.3.2 (the rules, and matchedData for only the checked fields) and an error handler that answers broken JSON as JSON. compare/send.sh sends seven bodies; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh   # Quillo's API, on 8080
(cd compare/express && npm install && node app.js)   # Express's, on 3001
(cd compare && ./send.sh http://localhost:8080 && ./send.sh http://localhost:3001)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
