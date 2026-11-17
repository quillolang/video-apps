# The Invisible Button: Clickjacking, Shown Live (and Blocked by Default)

Luigi's pizza club: Ada's account page, with a button that deletes it, in plain Node (node/server.mjs, on 8081) and in Quillo (main.qwe, on 8080); /login signs Ada in. prize/index.html (served by prize/server.mjs on 5173, another port, so the same site) frames the account page, invisible, with its Delete button right under "Claim your prize!"; ?peek shows the frame. Node's page can be framed, so the click deletes the account. Quillo's pages send x-frame-options: SAMEORIGIN, so the frame stays empty and the click does nothing.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
node node/server.mjs      # Node's account page, on 8081
./run.sh                  # Quillo's, on 8080
node prize/server.mjs     # the prize page, on 5173
# sign in at localhost:8081/login, then open localhost:5173 (?peek shows the frame,
# ?frame=http://localhost:8080/ frames Quillo's page)
```
