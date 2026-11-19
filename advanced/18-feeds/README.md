# The Browser Kept the Old Page: ETags, 304s, Sitemaps and Feeds | Advanced Quillo #18

Help Desk, lesson 18 of Advanced Quillo: feeds, sitemaps and caching. /sitemap.xml (<urlset xmlns>, sent as application/xml) and /feed.xml (<rss>, application/rss+xml), each public for an hour; the feed's channel <link> is written with raw and escape, since Quillo 0.8.6 reads <link> as HTML's empty element (quillo check: "`<link>` has no end tag"). Agents edit an article; the article page sends an etag. The mistake (steps/v2): an etag from the slug alone, so after an edit a browser's If-None-Match still gets a 304 and keeps the old text. The fix (steps/v3): 013_article_version.sql, a version raised by each save, in the etag. The desk's pages read the session, so Quillo sends them cache-control: private and vary: Cookie. The exercise: the help center's own etag, a SHA-256 fingerprint of what it shows.

This lesson starts where [17-moved](../17-moved) ended.

Written for Quillo 0.8.6. `run.sh` downloads that Quillo the first time:

```sh
./run.sh --watch
```

Then open http://127.0.0.1:8080.

On Windows, in PowerShell, in this folder:

```powershell
curl.exe -fsSLO https://raw.githubusercontent.com/quillolang/starter/v0.8.6/get-quillo.ps1
powershell -ExecutionPolicy Bypass -File get-quillo.ps1
.\run.cmd --watch
```

Quillo gets updates: the official install page, https://quillolang.org/docs/install/, always has the latest.

## The versions in the video

The video builds this app up step by step. Each step is a folder that runs on its own (`cd steps/v1 && ./run.sh --watch`):

- [`steps/v1`](steps/v1): a sitemap and an RSS feed
- [`steps/v2`](steps/v2): agents edit articles, and the article page's etag is its slug (the lesson's mistake): an edited article stays old in a browser that kept it
- [`steps/v3`](steps/v3): a version for each article, in its etag
- this folder: the help center's own etag, a fingerprint of the team's name and its articles' count and versions (the lesson's "your turn")
