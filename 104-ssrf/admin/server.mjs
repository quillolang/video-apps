// Luigi's admin page, for this machine only: it listens on 127.0.0.1,
// so nothing outside can reach it. A stand-in for an admin panel, a
// database's console or a cloud's metadata service. The secrets are made up.
import http from 'node:http';

http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<title>Luigi's admin</title>
<p>DB_PASSWORD=pizza-oven-42 PAYMENTS_KEY=made-up-7Hq2xV</p>`);
}).listen(9000, '127.0.0.1');
