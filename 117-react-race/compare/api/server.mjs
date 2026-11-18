// The pantry's search API for the React app, on 8081 (Vite's dev server and vite preview pass /api to it).
// GET /api/search?q=... answers with up to 8 foods that contain q. One letter takes 900 ms and more take 150 ms,
// so an older, shorter search answers last, every time; on a real network the order can flip at any moment.
// Each request is logged with its query and how long it took.
import http from 'node:http';
import fs from 'node:fs';
const foods = JSON.parse(fs.readFileSync(new URL('./foods.json', import.meta.url), 'utf8'));
const log = [];
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/log') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(log)); return; }
  if (url.pathname !== '/api/search') { res.writeHead(404).end(); return; }
  const q = url.searchParams.get('q') ?? '';
  const delay = q.length === 1 ? 900 : 150;
  setTimeout(() => {
    const found = foods.filter((f) => f.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
    log.push({ q, ms: delay, answered: Date.now() });
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(found));
  }, delay);
}).listen(8081, '127.0.0.1', () => console.log('pantry API on http://127.0.0.1:8081/api/search?q='));
