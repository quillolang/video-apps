# SolidJS 2.0 Stores vs Quillo: Nested State, a Silent Write, and 8 Rows Rebuilt for One Star

Chore Chart: three columns of chores; star one, or move it on to the next column, in Quillo (main.qwe, on 8080): the board is one state, a list of columns each with a list of cards, changed only by giving it a new value (star and move_on return a new board, with map and spread), and the loops are keyed by id. compare/solid is the same board in Solid 2.0.0, from Solid's own CLI, with a createStore, three ways (variants/: draft.jsx, written through the setter's draft as Solid 2.0 asks; outside.jsx, a star written to the store itself, which is ignored; spread.jsx, a star written as a new board with map and spread, which makes every row again). compare/play.mjs uses each in Chromium and counts the page's changes and the rows made again; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's board, on 8080
(cd compare/solid && npm install && npm run dev)   # Solid's (App.jsx is draft.jsx)
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
