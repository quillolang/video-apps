// The menu page's own little server, as a dev server would be: port 8081.
import http from 'node:http';
import fs from 'node:fs';

http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync('js/menu.html'));
}).listen(8081);
