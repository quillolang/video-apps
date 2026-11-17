# View Source: Empty. Is Your Website Invisible Without JavaScript?

Pip's Recipes, four recipes and a search, twice. In plain Node (node/server.mjs) the page is an empty div that its script fills from a JSON API, so with JavaScript off, or before the script runs, there is nothing: no recipes, no search. In Quillo (main.qwe) a view makes the page on the server, so the recipes are in the HTML, and the search is a plain form that the server answers, with or without JavaScript.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -s localhost:8081/ | grep -c 'Lemon tart'
```
