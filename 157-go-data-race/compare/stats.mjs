// The stats service each visit is reported to: answers every POST /visit with {"ok":true}, on 8099.
//   node stats.mjs
import http from 'node:http';
let seen = 0;
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/visit') { seen++; req.resume(); req.on('end', () => { res.setHeader('content-type', 'application/json'); res.end('{"ok":true}'); }); }
  else if (req.url === '/seen') res.end(`${seen}\n`);
  else { res.statusCode = 404; res.end(); }
}).listen(8099);
