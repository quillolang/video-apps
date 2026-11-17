// Bookworm's member search, in plain Node: node:http and node:sqlite.
import http from 'node:http';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec(fs.readFileSync('migrations/001_members.sql', 'utf8'));

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname !== '/search') { res.writeHead(404); return res.end(); }
  const q = url.searchParams.get('q') ?? '';
  const rows = db.prepare(
    "SELECT name, email FROM members WHERE name LIKE '%" + q + "%'").all();
  res.end(rows.length === 0 ? 'No members match.'
    : rows.map((m) => `${m.name} <${m.email}>`).join('\n'));
}).listen(process.env.PORT ?? 8081, () =>
  console.log('Bookworm on http://localhost:8081'));
