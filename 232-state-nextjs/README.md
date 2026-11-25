# Quillo vs Next.js: Where State Lives (Cookies, Server Functions, router.refresh)

The page from "Quillo vs Next.js: Where State Lives": six counters, one for each kind of state, in Quillo (main.qwe) and in Next.js 16.4 (compare/nextjs: useState in a client component, the page's searchParams, a cookie through cookies(), a server variable, node:sqlite through server functions, and router.refresh() every second).

Written for Quillo 0.8.10. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
