# Quillo's Reactive if vs Vue 3.5: v-if, watchEffect and the Cleanup You Forget

Quillo's reactive if, and the same page in Vue 3.5.46 (compare/vue): three branches, a ticker that runs while it's on, a filtered list, and one field kept through a switch. compare/play.mjs plays either app in Chromium and records what it shows (compare/runs/); compare/mistakes/nocleanup-vue is the usual mistake (and compare/mistakes/handler-quillo Quillo's) (no onCleanup). For updates, see https://vuejs.org and https://quillolang.org/docs/install/.

Written for Quillo 0.8.11 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                               # http://127.0.0.1:8080

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.11/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
