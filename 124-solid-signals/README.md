# SolidJS 2.0 vs Quillo: The Closest Cousin, and the One Rule Solid Asks You to Remember

Tip Splitter: a bill, a tip and the number of people, and what each one pays, in Quillo (main.qwe, on 8080): the total is a let in the component's body, and <Share> reads its parameters as they are. compare/solid is the same app in Solid 2.0.0, from Solid's own CLI (npm create solid -- --solid -t bare --js), with variants/ for two traps (body.jsx: the total read in the component's body; destructure.jsx: Share's props destructured) and fixed.jsx. compare/play.mjs uses each in Chromium and counts the page's changes; compare/lint.sh runs the starter's lint rules (eslint-plugin-solid's v2 config, in oxlint); compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's splitter, on 8080
(cd compare/solid && npm install && npm run dev)   # Solid's, on 3000 (App.jsx is fixed.jsx)
(cd compare && ./lint.sh)                    # each trap through Solid's lint rules
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
