# SvelteKit Layouts and Error Pages vs Quillo: Where Does /trails/abc Go?

Trail Guide: a nav on every page, a page per trail and 404 pages of its own, in Quillo (main.qwe, on 8080): a `Layout` view around every page, `route GET /trails/:id(int)`, a `route GET /trails/*rest` for the trails section's 404s and a last `route GET /*rest` for the site's. compare/svelte is the same site in SvelteKit 3.3.1 (Svelte 5.57.3), from the official starter: a +layout.svelte, a param matcher (src/params.js), a load function that throws a 404, and two +error.svelte pages; variants/rest/+page.js is the route SvelteKit's docs give for a section's own 404s (trails/[...rest]/). compare/visit.mjs opens eight addresses on each in Chromium, compare/status.sh asks each with curl, compare/clicks.mjs counts the bytes of a five-page visit; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                         # Quillo's Trail Guide, on 8080
(cd compare/svelte && npm install && npm run dev)  # SvelteKit's (without the [...rest] route)
(cd compare && ./status.sh http://localhost:8080)  # each address's status
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
