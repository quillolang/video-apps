# Your Dev Server Is on the Café Wi-Fi: next dev, vite --host and Quillo

Trail notes, for the video about dev servers on a network: app/ in Quillo (its page reads a notes.json that isn't there, so it fails, and --watch shows the error). compare/next (Next.js 16.4.6) and compare/vite (Vite 8.3.8) are the same page; compare/vite-old (Vite 6.2.2) is there only for npm audit (its package.json and lockfile are renamed .6.2.2, so the repository's scanners don't flag them; run-compare.sh puts them back). compare/run-compare.sh starts each dev server, asks lsof what it listens on, and asks curl from this machine's Wi-Fi address. No attack is included. For updates, see the official sites: https://nextjs.org, https://vite.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                      # this machine only: http://127.0.0.1:8080
./run.sh --watch --host 0.0.0.0       # the network too, with a warning

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
