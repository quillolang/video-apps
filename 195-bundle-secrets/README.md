# The One-Word Fix That Ships Your Secret Key: VITE_, NEXT_PUBLIC_ and Quillo's PUBLIC_

A bake sale's Pay page three ways, for the video about public prefixes: app/ in Quillo (a server fn holds Payly's secret key; the page gets only the publishable key), steps/v1 (the component reads the secret: quillo check stops it) and steps/v2 (the secret renamed PUBLIC_..., which ships it). compare/vite (React with Vite) and compare/next (Next.js, App Router) are the same page; their versions/ folders hold each step (vite/ is left at its first version, where the secret stays out; next/ at its third, the Server Action), and compare/run-compare.sh builds and searches them. Payly is a made-up payment provider and its keys are made up. For updates, see the official sites: https://vite.dev, https://nextjs.org and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                      # the Quillo bake sale: http://127.0.0.1:8080

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): the component reads env("PAYLY_SECRET"): quillo check stops it
- [`steps/v2`](steps/v2): the secret renamed PUBLIC_PAYLY_SECRET: it works, and the secret is in the page's script
- this folder: the finished app

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
