# Refresh, and Your Filters Are Gone. Put Them in the URL

Luigi's menu with two filters: a kind (all, pizza, pasta, drinks) and under $12. In plain JavaScript (js/menu.html, served by node/server.mjs on 8081) the filters live in two variables, so a refresh, or the address sent to a friend, shows the whole menu again. In Quillo (main.qwe, on 8080) they live in the address, /menu?kind=pizza&under=12: the route reads them with a typed query pattern, the filters are plain links, and the server makes the filtered page, for a refresh or a shared link alike.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080: localhost:8080/menu?kind=pizza&under=12
node node/server.mjs      # the plain JavaScript menu, on 8081: localhost:8081/menu
```
