# Conditional Rendering in 10 Frameworks: React, Vue, Svelte, Solid, Reflex, Leptos, Quillo...

One page with five conditions, in Quillo (main.qwe) and in nine other frameworks (compare/: React 19.3, Vue 3.5, Svelte 5.59, Solid 2.0 on Vite; Reflex 0.11, NiceGUI 4.1, Streamlit 1.67 in Python; Leptos 0.8 and Dioxus 0.7 in Rust). compare/run.mjs plays any of them in Chromium; compare/mistakes.json holds each mistake as an edit, and compare/make.mjs makes each one, lints, builds, checks and plays it; compare/runs/ has what each showed. For updates, see the official sites: https://react.dev, https://vuejs.org, https://svelte.dev, https://www.solidjs.com, https://reflex.dev, https://nicegui.io, https://streamlit.io, https://leptos.dev, https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.11 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                               # Quillo's page: http://127.0.0.1:8080

# The others: install each from compare/<name> (npm install; uv venv + uv pip install reflex nicegui streamlit; Rust with trunk and dx 0.7), then
node compare/make.mjs                  # or: node compare/make.mjs zero --only=react,quillo

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.11/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
