# A Guestbook Comment Stole Every Visitor's Cookie (XSS, Found and Fixed)

Pip's Pottery, a guestbook, and one comment (comment.txt) with an image whose onerror sends document.cookie to someone else's server (node/catcher.mjs, on 9999). In plain Node (node/server.mjs) the page puts each comment into its HTML as it is, so the script runs for every visitor and the catcher prints their session cookies. In Quillo, {c.text} is escaped: the comment shows as text (steps/v1). raw() puts it in as HTML (steps/v2): the script runs, but Quillo's session cookie is HttpOnly, so it reads nothing. The app lets visitors write Markdown, made safe by markdown().

Written for Quillo 0.8.6 (get it at https://quillolang.org). Run it with:

```sh
./run.sh                       # Quillo, on 8080
node node/server.mjs           # Node, on 8081
node node/catcher.mjs          # the other server, on 9999
curl -s localhost:8080/sign --data-urlencode text@comment.txt
```

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): each comment as text, escaped by { }
- [`steps/v2`](steps/v2): raw(): the comment as HTML, the mistake the video makes on purpose
- this folder: comments as Markdown, through markdown(), safe for visitors' text
