// Luigi's API, in plain Node, on its own port: the menu, and orders.
import http from 'node:http';

http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  if (req.url === '/api/menu') {
    return res.end(JSON.stringify(['Margherita', 'Funghi']));
  }
  if (req.url === '/api/order' && req.method === 'POST') {
    return res.end(JSON.stringify({ ok: true }));
  }
  res.writeHead(404).end();
}).listen(3000, () => console.log('the API on http://localhost:3000'));
