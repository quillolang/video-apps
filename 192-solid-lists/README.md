# Solid 2.0 Quirks #3: Typed "na", Got "Anan", and 4 More List and Loading Surprises

Solid 2.0 Quirks #3: five Solid 2.0 quirks about lists and loading, each as a page in Solid's own starter (compare/solid/src: Guests, Team, Pantry, Menu, News, and each one's fix, at localhost:3000/#guests, #guests-fixed, ...), and the same pages in Quillo (main.qwe, at /guests, /team, /pantry, /menu, /news; /menu-waits and /news-raw are the versions without defer and is_err). For updates, see the official sites: https://www.solidjs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                                 # the Quillo pages: http://127.0.0.1:8080/guests
cd compare/solid && npm install && npm run dev   # the Solid pages: http://localhost:3000/#guests

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
