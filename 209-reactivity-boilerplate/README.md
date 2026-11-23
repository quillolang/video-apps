# React vs Vue vs Svelte vs Solid vs Dioxus: The Same App, Every Cost Measured

The measurements from the video comparing what the same Groceries app costs in React 19.3, Vue 3.5, Svelte 5, Solid 2.0, Dioxus 0.7 and Quillo 0.8.10: compare/size.mjs counts the starters' files, the code, the packages and node_modules, times the production builds, and takes the payload from 208's measurement. The apps themselves are in 208-reactivity-models; main.qwe here is Quillo's, the same file. compare/size.txt and size.json have every result. For updates, see the official sites: https://react.dev, https://vuejs.org, https://svelte.dev, https://www.solidjs.com, https://dioxuslabs.com and https://quillolang.org/docs/install/.

Written for Quillo 0.8.10 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --port 8096                  # Quillo's side: http://127.0.0.1:8096

# The measurements (needs the apps of 208-reactivity-models beside this folder, Node 24, and Rust with dx 0.7):
node compare/size.mjs /tmp/v209

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.10/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --port 8096
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
