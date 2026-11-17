# The Link Preview That Reached Inside Your Server (SSRF, Found and Fixed)

Luigi's chat's link previews: GET /preview?url=... fetches the page and gives its title and first paragraph. admin/server.mjs is a stand-in for something only this machine should reach (an admin page, a database's console, a cloud's metadata service), on 127.0.0.1:9000, with made-up secrets. In plain Node (node/server.mjs), the preview fetches any address: http://127.0.0.1:9000/admin, or http://127.0.0.1.nip.io:9000/admin (a public name that points back to 127.0.0.1), hands out the secrets. In Quillo (main.qwe), http.get with { public_only: true } refuses this machine, private networks and 169.254.169.254, checked on the address as it connects; quillo check warns about the call without it (steps/mistake).

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
node admin/server.mjs     # the admin page, on 127.0.0.1:9000
./run.sh                  # Quillo, on 8080
node node/server.mjs      # Node, on 8081
curl -s 'localhost:8080/preview?url=http://127.0.0.1:9000/admin'
```

## The versions in the video

The video also shows the careless version, which quillo check warns about (`cd steps/mistake && quillo check`):

- [`steps/mistake`](steps/mistake): http.get(url) with no options: quillo check warns that the host comes from a value
- this folder: the finished app
