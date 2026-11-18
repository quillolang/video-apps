# One Cart Badge, Three React Answers: Props, Context, or Zustand? (vs Quillo)

The Little Bakery: a cart badge in the header, and an Add button on each of 12 pastries, in Quillo (main.qwe, on 8080): the cart is a page state, `state cart = []` at the top of the program, which Badge reads and every AddButton sets, placed apart in the page. compare/react is the same page in React 19.3.1 from Vite's starter, three ways (variants/: drilling.jsx, the cart and add passed down as props; context.jsx, a CartContext; zustand.jsx, a Zustand 5.1.0 store with selectors). compare/measure.mjs clicks Add in each in Chromium and counts the React components that ran (read from React's commits, as React DevTools does) and the page's changes; compare/MEASURE.md has every command and what it printed.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                                     # Quillo's bakery, on 8080
(cd compare/react && npm install && npm run dev)   # React's (App.jsx is drilling.jsx; variants/ has the others)
```

## The comparison

The video compares this app with the same one in another framework. [`compare/`](compare) holds that project, made
from its own starter (install its packages to run it), and [`compare/MEASURE.md`](compare/MEASURE.md) every command
behind the numbers in the video, with what it printed, the date, the machine and the versions.
