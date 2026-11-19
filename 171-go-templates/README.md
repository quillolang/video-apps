# Templates and Escaping: Go's html/template vs Quillo's Views, in Five Places

Trail Club's notes board in Quillo (main.qwe, on 8161): a visitor leaves a note with a name, a text, a link and a color, and the page shows them all in a layout view, with the latest note's name in a script. A view escapes each value for where it goes (text, attributes, links, and a script's values as JavaScript strings), but not for CSS, so the color must be one of four. steps/v1 is the board before that check. compare/go is the same in Go 1.27.4 with html/template (its standard library only). compare/contexts.mjs posts five notes, each trying to break out of one place, and opens the page in a browser; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8161   # Quillo's: http://localhost:8161
(cd compare/go && go run .)   # Go's: http://localhost:8160
(cd compare && node contexts.mjs go out.json && node contexts.mjs quillo-v1 out.json && node contexts.mjs quillo out.json)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe --port 8161
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
