// Bookshelf, in plain Node: GET /books, GET /books/:id, and POST /books with a title and pages.
// Nothing installed: only node:http.  node node/server.mjs   (PORT=8081 by default)
import http from 'node:http';

const books = [];

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(data)); } catch { reject(new Error('the body is not JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/books') return send(res, 200, books);
  const one = url.pathname.match(/^\/books\/(\d+)$/);
  if (req.method === 'GET' && one) {
    const book = books.find((b) => b.id === Number(one[1]));
    return book ? send(res, 200, book) : send(res, 404, { error: 'no such book' });
  }
  if (req.method === 'POST' && url.pathname === '/books') {
    let body;
    try { body = await readJson(req); } catch (e) { return send(res, 400, { error: e.message }); }
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      return send(res, 400, { error: 'a title is needed' });
    }
    if (!Number.isInteger(body.pages)) return send(res, 400, { error: 'pages must be a whole number' });
    if (body.pages < 1) return send(res, 400, { error: 'pages must be 1 or more' });
    const book = { id: books.length + 1, title: body.title.trim(), pages: body.pages };
    books.push(book);
    return send(res, 201, book);
  }
  send(res, 404, { error: 'not found' });
});

server.listen(Number(process.env.PORT) || 8081);
