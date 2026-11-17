// Dawn Runners, in plain Node: GET /api/members from SQLite, and the page.
import http from 'node:http';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('node/club.db');

http.createServer((req, res) => {
  if (req.url === '/api/members') {
    const members = db.prepare('select * from members order by id').all();
    res.setHeader('content-type', 'application/json');
    return res.end(JSON.stringify(members));
  }
  res.setHeader('content-type', 'text/html');
  res.end(fs.readFileSync('node/public/index.html'));
}).listen(8181);
