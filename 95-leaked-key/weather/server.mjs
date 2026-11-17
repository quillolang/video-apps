// A stand-in for a paid weather API, on this machine: it answers only a request with the right key.
import http from 'node:http';
import fs from 'node:fs';

const KEY = /WEATHER_KEY=(.*)/.exec(fs.readFileSync('.env', 'utf8'))[1].trim();
const TEMPS = { Lisbon: 19, Oslo: 4, Tokyo: 14 };

http.createServer((req, res) => {
  const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'x-api-key' };
  if (req.method === 'OPTIONS') return res.writeHead(204, headers).end();
  if (req.headers['x-api-key'] !== KEY) return res.writeHead(401, headers).end('{"error":"bad key"}');
  const city = new URL(req.url, 'http://x').searchParams.get('city');
  console.log(`a forecast for ${city}, paid for with the key`);
  res.writeHead(200, headers).end(JSON.stringify({ city, temp_c: TEMPS[city] ?? 20 }));
}).listen(9090);
