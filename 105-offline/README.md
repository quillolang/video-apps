# Pull the Plug: What Your App Does When the Network Drops

Luigi's notes: a box, a Save button, and a word on how it went. In plain JavaScript (public/index.html, served by node/server.mjs on 8081), Save says Saving…, then awaits a fetch that, with the network gone, rejects; nobody catches it, so the page says Saving… for good, also once the network is back, and the note is lost. In Quillo (main.qwe), the save is a server fn: a call that can't be made gives an error value, so the page says Not saved and why, and the save is wrapped in idempotent, so the page sends a call that got no answer again, with the same key, and a short drop saves by itself, once.

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                  # Quillo, on 8080
node node/server.mjs      # the plain JavaScript page, on 8081
# then, in the browser's developer tools, Network: Offline, and Save
```
