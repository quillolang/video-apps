# A Blog from Markdown Files in Quillo: The Pancake Diaries

The Pancake Diaries: a blog whose posts are Markdown files. Each post is read on every request and made HTML with markdown() inside the blog's own page; the about page is a whole page from markdown_page(); only posts on the list are served.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.
