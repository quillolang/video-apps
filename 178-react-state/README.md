# React Quirks #1: Add 3, Get 1, and 4 More useState Surprises

React Quirks #1: five React state quirks, each as a page in Vite's React starter (compare/react/src: Score, Greeting, Groceries, Clicks, Later, and each one's fix, at localhost:5173/#score, #score-fixed, ...), and the same five pages in Quillo (main.qwe, at /score, /greeting, /groceries, /clicks, /later). For updates, see the official sites: https://react.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                                 # the Quillo pages: http://127.0.0.1:8080/score
cd compare/react && npm install && npm run dev   # the React pages: http://localhost:5173/#score

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
cd compare\react; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
