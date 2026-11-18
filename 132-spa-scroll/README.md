# React Router SPA: The Page That Opens Halfway Down, and the Blank Page Without JS (vs Quillo)

Soup Kitchen: thirty soups, a long page for each, and plain links between five kinds of page, in Quillo (main.qwe, on 8080): each page comes whole from the server, so a clicked page opens at the top, Back returns to the same place, and it all works with JavaScript off. compare/react is the same site in React 19.3.1 with React Router 8.5.1, from Vite's starter (variants/: naive.jsx, createBrowserRouter and Links; restore.jsx, the same with <ScrollRestoration />). compare/scroll.mjs checks where a clicked page opens and where Back goes, and each page with JavaScript off; compare/clicks.mjs counts the bytes of a six-page visit; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's Soup Kitchen, on 8080
(cd compare/react && npm install && npm run dev)   # React's (App.jsx is naive.jsx)
# Windows (PowerShell), with Quillo from quillolang.org: quillo run main.qwe
#   and cd compare\react; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
