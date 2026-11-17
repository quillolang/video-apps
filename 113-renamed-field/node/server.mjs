// The Book Nook's API, in plain Node: GET /api/books from SQLite, and the page.
import http from 'node:http';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('node/shop.db');

http.createServer((req, res) => {
  if (req.url === '/api/books') {
    const books = db.prepare('select * from books order by id').all();
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(books));
  }
  res.setHeader('content-type', 'text/html');
  res.end(fs.readFileSync('node/public/index.html'));
}).listen(8081);
