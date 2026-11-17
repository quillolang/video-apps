# Blocked by CORS Policy? Why It Happens, and an App That Never Sees It

Luigi's menu, as a front end on one port and an API on another, and in Quillo. The plain JavaScript front end (frontend/index.html, served by node/frontend.mjs on 5173) fetches the menu from the Node API (node/api.mjs, on 3000): the browser blocks it, by CORS policy. In Quillo (main.qwe) the page and its server fns are one program on one origin, so there's nothing to allow. And when another site's page should read the menu, an OPTIONS route and the access-control headers on the answer say which site may (the front end with ?api=http://localhost:8080).

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/api.mjs         # the API, on 3000
node node/frontend.mjs    # the front end, on 5173: try /?api=http://localhost:8080 too
```
