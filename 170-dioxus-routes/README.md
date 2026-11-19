# Typed Routes in Dioxus vs Quillo: /trails/02, a 200 for Every Page, and a Typo That Won't Build

The Trail Guide in Quillo (main.qwe, video 147's): six trails, a page for each at /trails/<its number> with :id(int), and a real 404 for anything else. compare/trails is the same in Dioxus 0.7.10 (Rust 1.99.0): a Routable enum with TrailPage { id: u32 } and a catch-all NotFound, built for the web with dx build --release --platform web (compare/dist). compare/routes.mjs tries eight addresses on each in a browser, and the Dioxus build on a plain static host; typo-dioxus/ and typo-quillo/ are each with a typo in a link. compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8152   # Quillo's: http://localhost:8152
(cd compare/trails && dx build --release --platform web)   # Dioxus's; then copy the public folder it prints to compare/dist
(cd compare && node routes.mjs dioxus out.json && node routes.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8152
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
