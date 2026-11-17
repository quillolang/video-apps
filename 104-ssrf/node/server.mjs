// Luigi's chat, in plain Node: a link's preview, for any link posted.
import http from 'node:http';

// The text after the first <title> or <p>.
const pick = (html, tag) => html.match(`<${tag}>([^<]*)`)?.[1] ?? '';

// GET /preview?url=...: the page's title and its first paragraph.
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x').searchParams.get('url');
  try {
    const html = await (await fetch(url)).text();
    res.end(`${pick(html, 'title')}\n${pick(html, 'p')}\n`);
  } catch (e) {
    res.writeHead(502).end(`no preview: ${e.message}\n`);
  }
}).listen(8081);
