// A slow API somewhere else, for /weather: every answer takes 1 s.   node compare/upstream.mjs  (port 8242)
import http from 'node:http';
http.createServer((req, res) => setTimeout(() => res.end('sunny'), 1000)).listen(+(process.env.PORT || 8242), '127.0.0.1');
