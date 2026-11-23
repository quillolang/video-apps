# React vs Vue vs Svelte vs Solid vs Dioxus: What Really Runs When State Changes

The Groceries app from the video comparing how React 19.3, Vue 3.5, Svelte 5, Solid 2.0, Dioxus 0.7 and Quillo 0.8.10 notice a change: the same app in all six, from each one's own starter. main.qwe is Quillo's; compare/ has the other five (react, vue, svelte, solid, dioxus), React with its compiler (react-compiler), the Dioxus variant (variants/dioxus-signal-row.rs), and the scripts that check and measure them (check.mjs, measure.mjs, build.sh, measure.sh); compare/runs/ has every result, and compare/MEASURE.md says how. For updates, see the official sites: https://react.dev, https://vuejs.org, https://svelte.dev, https://www.solidjs.com, https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8096                  # Quillo's side: http://127.0.0.1:8096

# The other five (needs Node 24 and, for Dioxus, Rust with dx 0.7: https://dioxuslabs.com/learn/0.7/getting_started):
cd compare
for d in react react-compiler vue svelte solid; do (cd $d && npm install); done
sh build.sh                              # production builds into .build/
node serve.mjs .build/react 5181         # and vue 5182, svelte 5183, solid 5184, dioxus 5185
sh measure.sh                            # runs/check.txt, runs/measure.txt

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8096
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
