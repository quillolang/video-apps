// Sits between the shop and billing and prints each call as it crosses:  node compare/peek.mjs 8252 8251
// (the shop is started with --service-url billing=http://127.0.0.1:8252, billing on 8251).
// Each call is also saved as compare/logs/call-N.json, to send again by hand.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const [listen, to] = process.argv.slice(2).map(Number);
const logs = path.join(path.dirname(fileURLToPath(import.meta.url)), 'logs');
let n = 0;
http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (c) => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks), k = ++n;
    console.log(`>>> ${req.method} ${req.url}`);
    for (const [h, v] of Object.entries(req.headers)) if (h.startsWith('x-')) console.log(`${h}: ${v}`);
    console.log(body.toString());
    fs.writeFileSync(path.join(logs, `call-${k}.json`), JSON.stringify({ method: req.method, url: req.url, headers: req.headers, body: body.toString() }, null, 1));
    const up = http.request({ host: '127.0.0.1', port: to, method: req.method, path: req.url, headers: req.headers }, (r) => {
      const back = [];
      r.on('data', (c) => back.push(c));
      r.on('end', () => {
        const b = Buffer.concat(back);
        console.log(`<<< ${r.statusCode}`);
        for (const [h, v] of Object.entries(r.headers)) if (h.startsWith('x-')) console.log(`${h}: ${v}`);
        console.log(b.toString() + '\n');
        res.writeHead(r.statusCode, r.headers); res.end(b);
      });
    });
    up.on('error', (e) => { console.log('<<< error', e.message); res.writeHead(502); res.end(); });
    up.end(body);
  });
}).listen(listen, '127.0.0.1');
