// Pip's Club, in plain Node: sign up, save settings, and an admin page.
import http from 'node:http';

const users = [];

// Copies settings in, nested ones too.
function merge(target, src) {
  for (const k in src) {
    if (typeof src[k] === 'object') merge(target[k] ??= {}, src[k]);
    else target[k] = src[k];
  }
  return target;
}

const json = (req) => new Promise((done) => {
  let text = '';
  req.on('data', (chunk) => text += chunk);
  req.on('end', () => done(JSON.parse(text)));
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/signup') {
    const body = await json(req);
    const user = Object.assign({ role: 'member', prefs: {} }, body);
    user.id = users.push(user);
    return res.end(JSON.stringify(user));
  }
  if (url.pathname.startsWith('/prefs/')) {
    const user = users[Number(url.pathname.slice(7)) - 1];
    return res.end(JSON.stringify(merge(user.prefs, await json(req))));
  }
  if (url.pathname === '/admin') {
    const user = users[Number(url.searchParams.get('user')) - 1] ?? {};
    const admin = user.role === 'admin';
    return res.end(admin ? 'Welcome, admin!' : 'Admins only');
  }
  res.writeHead(404).end();
}).listen(process.env.PORT ?? 8081, () =>
  console.log("Pip's Club on http://localhost:8081"));
