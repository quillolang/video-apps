// Serves a built folder on a port, gzipping text as vite preview does (Solid's Vite plugin makes vite preview serve
// the project's own dist/client whatever --outDir says, so the copied builds are served with this instead).
//   node serve.mjs <folder> <port>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const [dir, port] = process.argv.slice(2);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let f = path.join(dir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(path.resolve(dir))) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) f = path.join(dir, 'index.html');
  const type = types[path.extname(f)] || 'application/octet-stream', body = fs.readFileSync(f);
  const gzip = /text|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, { 'content-type': type, ...(gzip ? { 'content-encoding': 'gzip' } : {}) });
  res.end(gzip ? zlib.gzipSync(body) : body);
}).listen(Number(port), '127.0.0.1', () => console.log(`${dir} on http://localhost:${port}/`));
