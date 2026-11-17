// Piggy Bank, in plain Node: log in, and send money by form or by link.
import http from 'node:http';
import crypto from 'node:crypto';

const balances = { ada: 100, eve: 0 };
const sessions = {};
// SAMESITE=None: the cookie for a bank that's shown inside other sites.
const same = process.env.SAMESITE ? `; SameSite=None; Secure` : '';

const form = (req) => new Promise((done) => {
  let text = '';
  req.on('data', (chunk) => text += chunk);
  req.on('end', () => done(new URLSearchParams(text)));
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const id = /session=([\w-]+)/.exec(req.headers.cookie ?? '')?.[1];
  const who = sessions[id];
  if (req.method === 'POST' && url.pathname === '/login') {
    const id = crypto.randomUUID();
    sessions[id] = 'ada';
    res.writeHead(303, { location: '/',
      'set-cookie': `session=${id}; Path=/; HttpOnly${same}` });
    return res.end();
  }
  if (url.pathname === '/send') {   // a form, or a link: ?to=eve&amount=50
    const p = req.method === 'POST' ? await form(req) : url.searchParams;
    if (!who) { res.writeHead(401); return res.end('Log in first'); }
    balances[who] -= Number(p.get('amount'));
    balances[p.get('to')] += Number(p.get('amount'));
    res.writeHead(303, { location: '/' });
    return res.end();
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<body style="font: 22px system-ui; margin: 28px">
<h1>🐷 Piggy Bank</h1>
<p>${who ? 'Logged in as Ada' : 'Not logged in'}</p>
<p>Ada: $${balances.ada} · Eve: $${balances.eve}</p>
<form method="post" action="/login">
  <button>Log in as Ada</button></form>`);
}).listen(process.env.PORT ?? 8081, () =>
  console.log('Piggy Bank on http://localhost:8081'));
