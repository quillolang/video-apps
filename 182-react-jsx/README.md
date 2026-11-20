# React Quirks #5: One Style Blanked the Page, and 4 More JSX Surprises

React Quirks #5: five React JSX quirks, each as a page in Vite's React starter (compare/react/src: Note, Profile, Likes, Welcome, Inbox, and each one's fix, at localhost:5173/#note, #note-fixed, ...), and the same five pages in Quillo (main.qwe, at /note, /profile, /likes, /welcome, /inbox). For updates, see the official sites: https://react.dev and https://quillolang.org/docs/install/.

Written for Quillo 0.8.8 (get it at https://quillolang.org). Run it with:

```sh
./run.sh --watch                                 # the Quillo pages: http://127.0.0.1:8080/note
cd compare/react && npm install && npm run dev   # the React pages: http://localhost:5173/#note

# On Windows, in PowerShell, in this folder:
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.8/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
cd compare\react; npm install; npm run dev
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
