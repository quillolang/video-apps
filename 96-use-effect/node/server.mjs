// The oven's server, in plain Node: GET /api/oven says how hot it is, and
// counts each time it's asked. GET /api/hits says how many times that was.
import http from 'node:http';

let hits = 0;
http.createServer((req, res) => {
  if (req.url === '/api/oven') { hits++; return res.end('220°'); }
  if (req.url === '/api/hits') return res.end(`${hits}\n`);
  res.writeHead(404).end();
}).listen(8081);
