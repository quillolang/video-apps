// Luigi's gift cards, in plain Node: the cards in the shop's SQLite,
// and every payment in the ledger, on PostgreSQL.
import http from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const shop = new DatabaseSync('shop.db');
shop.exec(`
  create table if not exists cards (who text primary key, balance int);
  insert or ignore into cards values ('Ada', 100)`);
const ledger = new pg.Pool({ connectionString: process.env.LEDGER_URL });
await ledger.query(
  'create table if not exists entries (who text, amount int)');

// POST /pay/Ada: $50 off Ada's card, and into the ledger.
http.createServer(async (req, res) => {
  const name = req.url.split('/')[2];
  try {
    shop.prepare('update cards set balance = balance - 50 where who = ?')
      .run(name);
    await ledger.query('insert into entries values ($1, 50)', [name]);
    res.end('paid $50\n');
  } catch (e) {
    res.writeHead(500).end(`not paid: ${e.message}\n`);
  }
}).listen(8081);
