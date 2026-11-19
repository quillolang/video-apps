// Serves a built folder as it is, for measure-js.mjs: node serve-dist.mjs <folder> <port>
// index.html for /, and each file with its type; no compression (measure-js gzips each body itself).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [dir, port] = process.argv.slice(2);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' };
http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const file = fs.existsSync(p) && fs.statSync(p).isFile() ? p : path.join(dir, 'index.html');
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(Number(port));
