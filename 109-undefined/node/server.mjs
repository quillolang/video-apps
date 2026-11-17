// The club's API, in plain Node: a member's profile, as JSON. Ada's is
// complete; Bob's isn't: no name yet, no address, and zeros.
import http from 'node:http';
import fs from 'node:fs';

const users = {
  ada: { name: 'Ada', address: { city: 'Rome' }, balance: 25, unread: 3 },
  bob: { name: '', balance: 0, unread: 0 },
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/users/')) {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(users[url.pathname.split('/')[3]]));
  }
  // /v1 and /v2: the profile card, in plain JavaScript.
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(fs.readFileSync(`js${url.pathname}.html`));
}).listen(8081);
