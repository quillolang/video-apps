# React vs Vue vs Svelte vs Solid vs Dioxus: The Same 4 Mistakes, Who Catches Them?

The four mistakes from the video, made in the Groceries app of React 19.3, Vue 3.5, Svelte 5, Solid 2.0, Dioxus 0.7 and Quillo 0.8.10 (the apps are in 208-reactivity-models): compare/mistakes.json holds each mistake as an edit, compare/make.mjs makes each one, runs the starter's linter, builds, runs quillo check, and plays it in Chromium; compare/runs/ has every command and its output, and results.json what each page showed and its console. main.qwe is Quillo's app with no mistake in it. For updates, see the official sites: https://react.dev, https://vuejs.org, https://svelte.dev, https://www.solidjs.com, https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                               # Quillo's side, without a mistake: http://127.0.0.1:8080

# The mistakes (needs 208-reactivity-models beside this folder with its apps installed, Node 24, Rust with dx 0.7):
node compare/make.mjs                  # or: node compare/make.mjs race --only=react,quillo

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
