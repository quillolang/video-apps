# Islands, Both Ways: Fresh vs Quillo, and the JavaScript Each Counter Sends

A counter page and a page with nothing to run, in Quillo (main.qwe, on 8080): a `component Counter` with its state, and an about page with no component. compare/fresh is Fresh 2.3.3's own starter on Deno 2.9.8 (its home page and Counter island, unchanged), with routes/about.tsx added: a page with no island. compare/js.mjs measures the JavaScript each page sends as it loads and after a click on +1; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's counter, on 8080
(cd compare/fresh && deno task build && deno task start)   # Fresh's, on 8000
(cd compare && node js.mjs http://localhost:8000/ http://localhost:8080/)
# Windows (PowerShell), with Quillo from quillolang.org and Deno from deno.com: quillo run main.qwe
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
