// Someone else's server: it prints whatever arrives in ?c=.
import http from 'node:http';

http.createServer((req, res) => {
  const c = new URL(req.url, 'http://x').searchParams.get('c');
  if (c !== null) console.log(`got: ${c || '(nothing)'}`);
  res.end();
}).listen(process.env.PORT ?? 9999);
