# React useEffect Fetch Race: The Search That Showed the Wrong Results (vs Quillo)

Pantry Search: up to 8 foods that contain what you type, from the server, in Quillo (main.qwe, on 8080): `state results = live(search, query)` runs the server fn again when the query changes and drops an answer still on its way for the old one. compare/react is the same search in React 19.3.1 from Vite's starter, three ways (variants/: effect.jsx, useEffect and fetch with no cleanup; ignore.jsx, the ignore flag from React's docs; query.jsx, TanStack Query 5.108.0), with compare/api/server.mjs as its API. Both servers take 900 ms for one letter and 150 ms for more, so an older, shorter search answers last. compare/play.mjs types "a" then "p" in each in Chromium; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's pantry, on 8080
node compare/api/server.mjs                  # the React app's API, on 8081
(cd compare/react && npm install && npm run dev)   # React's (App.jsx is effect.jsx)
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
