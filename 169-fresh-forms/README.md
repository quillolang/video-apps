# Forms in Fresh vs Quillo: 1e1 Guests, a File for a Name, and a Post From Another Site

Trail Club's sign-up for Saturday's hike in Quillo (main.qwe, on 8140): a name and how many are coming. A form that's wrong comes back with a message by each field and what was typed still in it; one that's right is added, and back to the list. Form posts from other sites' pages are refused (403). compare/fresh is the same in Fresh 2.3.3 on Deno 2.9.8 (routes/index.tsx, from the official starter), with two fixes in variants/: strict-index.tsx (text only, guests only as digits) and main-csrf.ts (app.use(csrf())). compare/forms.mjs posts eight sign-ups to a side and one from a page on another site (compare/other-site) in a browser; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8140   # Quillo's: http://localhost:8140
(cd compare/fresh && deno task build && deno task start)   # Fresh's: http://localhost:8000
(cd compare && node forms.mjs fresh out.json && node forms.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8140
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
