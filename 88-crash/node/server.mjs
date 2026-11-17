// Luigi's pizza orders, in plain Node (node:http, nothing installed).
import http from 'node:http';

const orders = [];
const body = (req) => new Promise((done) => {
  let text = '';
  req.on('data', (chunk) => text += chunk);
  req.on('end', () => done(text));
});

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/orders') {
    const order = JSON.parse(await body(req));
    orders.push(order);
    return res.end(
      `Order ${orders.length}: one ${order.pizza}, coming up!\n`);
  }
  res.end(`${orders.length} orders so far\n`);
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Luigi's on http://localhost:8081"));
