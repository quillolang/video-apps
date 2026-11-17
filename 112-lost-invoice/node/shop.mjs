// Luna's Cakes, in plain Node: an order, and its invoice sent in the background.
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('node/shop.db');
db.exec('create table if not exists orders (id integer primary key, cake text not null)');
db.exec('create table if not exists invoices (id integer primary key, order_id int not null)');

// The mail provider is slow: two seconds for each invoice.
async function sendInvoice(orderId) {
  await new Promise((done) => setTimeout(done, 2000));
  db.prepare('insert into invoices (order_id) values (?)').run(orderId);
}

// POST /order with a cake: the order saved, and its invoice sent in the background.
http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const { cake } = Object.fromEntries(new URLSearchParams(body));
  const { id } = db.prepare('insert into orders (cake) values (?) returning id').get(cake);
  sendInvoice(id);   // no await: the customer doesn't wait for the mail
  res.end(`order ${id}: ${cake}\n`);
}).listen(8181);
