// Sprout Club's sign-up, in plain Node (node:http, nothing installed).
import http from 'node:http';

const EMAIL = /^([a-zA-Z0-9]+[._-]?)+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;

const page = `<h1>🌱 Sprout Club</h1>
<form method="post" action="/join">
  <input name="email" placeholder="you@example.com">
  <button>Join</button>
</form>`;

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    return res.end(page);
  }
  let body = '';
  req.on('data', (chunk) => body += chunk);
  req.on('end', () => {
    const email = new URLSearchParams(body).get('email') ?? '';
    res.end(EMAIL.test(email)
      ? `Welcome to the Sprout Club, ${email}!`
      : 'That does not look like an email.');
  });
}).listen(process.env.PORT ?? 8081, () =>
  console.log('Sprout Club on http://localhost:8081'));
