// The prize page's own little server, on port 5173.
import http from 'node:http';
import fs from 'node:fs';

http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('prize/index.html'));
}).listen(5173);
