# Next.js Leaked an HttpOnly Cookie, Node Fixed 16 CVEs, and a Card Skimmer: Nov 2026 Web News

This Month in Web Stacks, November 2026: the Quillo side of each story (main.qwe: /leak, the same login button as the Next.js page; /greeting, a page for one visitor asked to be cached public; /checkout and /checkout-safe, a card form with a third-party script, without and with a Content-Security-Policy), the Next.js 16.4.4 app that shows the HttpOnly cookie in x-middleware-set-cookie (compare/next; upgrade it to 16.4.5 or later to see the fix), and the stand-in vendor script host (compare/vendor/vendor.mjs, on this machine only). For updates, see the official sites: https://nextjs.org/blog, https://nodejs.org/en/blog/vulnerability and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch --port 8091                    # the Quillo pages: http://127.0.0.1:8091/leak
node compare/vendor/vendor.mjs                   # the stand-in vendor, for /checkout
cd compare/next && npm install && npx next dev -H 127.0.0.1 -p 3011   # http://127.0.0.1:3011/leak

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch --port 8091
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
