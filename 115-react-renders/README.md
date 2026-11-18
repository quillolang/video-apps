# One Keystroke, 1,001 React Re-Renders: memo, useCallback, the Compiler, and Quillo

The Corner Shop: 1,000 products, a name for the order, and a cart total, in Quillo (main.qwe, on 8080). compare/ has the same shop in React 19.3.1, from Vite's own starters: react/ (variants/: plain, memo, and memo with useCallback and the updater form) and react-compiler/ (the React Compiler starter, with the plain code and the updater form). compare/measure.mjs types and clicks in each one in Chromium and counts the React components that ran (read from React's commits, as React DevTools does), the changes to the page and the time; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                   # Quillo's shop, on 8080
(cd compare/react && npm install && npm run dev)            # React's, on 5173
(cd compare/react-compiler && npm install && npm run dev)   # with the React Compiler
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
