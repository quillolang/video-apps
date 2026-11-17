// Luigi's pizza club, in plain Node: Ada's account page, with a button
// that deletes it.
import http from 'node:http';

let ada = { name: 'Ada', points: 120 };
const page = (body) => `<meta charset="utf-8">
<body style="font: 22px system-ui; margin: 28px">
<h1>🍕 Luigi's pizza club</h1>${body}`;

http.createServer((req, res) => {
  const signedIn = (req.headers.cookie ?? '').includes('sid=ada');
  if (req.url === '/login') {
    res.writeHead(302, { 'set-cookie': 'sid=ada; HttpOnly; Path=/',
      location: '/' });
    return res.end();
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  if (req.method === 'POST' && req.url === '/delete' && signedIn) {
    ada = null;
    return res.end(page('<p>Your account is gone.</p>'));
  }
  res.end(page(signedIn && ada
    ? `<p>Signed in as Ada: ${ada.points} points.</p>
<form method="post" action="/delete">
  <button style="font: inherit">Delete my account</button></form>`
    : '<p>No account here.</p>'));
}).listen(8081);
