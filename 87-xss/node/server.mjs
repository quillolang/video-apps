// Pip's Pottery guestbook, in plain Node (node:http, nothing installed).
import http from 'node:http';
import crypto from 'node:crypto';

const comments = ['Lovely mugs!'];

const page = () => `<body style="font: 20px system-ui; margin: 24px">
<h1>🏺 Pip's Pottery</h1>
<ul>${comments.map((c) => `<li>${c}</li>`).join('')}</ul>
<form method="post" action="/sign">
  <input name="text"> <button>Sign</button>
</form></body>`;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/sign') {
    let body = '';
    req.on('data', (chunk) => body += chunk);
    return req.on('end', () => {
      comments.push(new URLSearchParams(body).get('text') ?? '');
      res.writeHead(303, { location: '/' }).end();
    });
  }
  const headers = { 'content-type': 'text/html; charset=utf-8' };
  if (!/session=/.test(req.headers.cookie ?? ''))
    headers['set-cookie'] = `session=${crypto.randomUUID()}; Path=/`;
  res.writeHead(200, headers).end(page());
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Pip's Pottery on http://localhost:8081"));
