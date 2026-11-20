# Solid 2.0 Quirks #1: +2 Gives 1, onclick Does Nothing, and 3 More New Rules

Solid 2.0 Quirks #1: five Solid 2.0 quirks, each as a page in Solid's own starter (compare/solid/src: Score, Likes, Tickets, Groceries, Note, and each one's fix, at localhost:3000/#score, #score-fixed, ...), and the same five pages in Quillo (main.qwe, at /score, /likes, /tickets, /groceries, /note). For updates, see the official sites: https://www.solidjs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                                 # the Quillo pages: http://127.0.0.1:8080/score
cd compare/solid && npm install && npm run dev   # the Solid pages: http://localhost:3000/#score

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
cd compare\solid; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
