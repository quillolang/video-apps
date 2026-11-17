// Luigi's notes, in plain Node: the page, and POST /save, which keeps a note.
import http from 'node:http';
import fs from 'node:fs';

const notes = [];
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      notes.push(body);
      console.log(`kept note ${notes.length}: ${body}`);
      res.end('ok');
    });
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('public/index.html'));
}).listen(8081);
