# Routes and 404s in Fresh vs Quillo: [id].tsx, Number(), and the Site's Own 404 Page

The Trail Guide of videos 128, 143, 145, 146 and 147, in Quillo (main.qwe, on 8080): a page for each trail at `/trails/:id(int)`, a 404 for a missing trail, and `route GET /*rest` for the rest. compare/fresh is the same site in Fresh 2.3.3 on Deno 2.9.8, from its own starter: routes/index.tsx, routes/trails/[id].tsx with a routeOverride pattern, and routes/_error.tsx, the site's own error page; variants/naive/[id].tsx is the first try (Number(ctx.params.id), no pattern). compare/status.sh asks six addresses; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh   # Quillo's Trail Guide, on 8080
(cd compare/fresh && deno install && deno task build && deno task start)   # Fresh's, on 8000
(cd compare && ./status.sh http://localhost:8080 && ./status.sh http://localhost:8000)
# Windows (PowerShell), with Quillo from quillolang.org and Deno from deno.com: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
