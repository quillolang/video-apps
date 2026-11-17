// The front end's own little server, as a dev server would be: port 5173.
import http from 'node:http';
import fs from 'node:fs';

http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('frontend/index.html'));
}).listen(5173, () =>
  console.log('the front end on http://localhost:5173'));
