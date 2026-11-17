// Luigi's orders, in plain Node: an order's page, and the webhook the
// payment provider calls when an order is paid.
import http from 'node:http';

const orders = { 42: { item: 'Margherita', paid: false } };

http.createServer((req, res) => {
  const id = req.url.split('/')[2], o = orders[id];
  if (req.method === 'GET' && req.url.startsWith('/orders/') && o) {
    return res.end(`order ${id}: ${o.paid ? 'paid' : 'not paid'}\n`);
  }
  if (req.method === 'POST' && req.url === '/hooks/pay') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      orders[JSON.parse(body).order].paid = true;   // the kitchen bakes it
      res.end('received\n');
    });
    return;
  }
  res.writeHead(404).end('not found\n');
}).listen(8081);
