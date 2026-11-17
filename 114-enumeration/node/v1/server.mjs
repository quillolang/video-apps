// Crumbs bakery's club, in plain Node: a log-in for its members.
import http from 'node:http';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const hash = promisify(scrypt);

// The members, each password hashed with its own salt.
const users = new Map();
for (const [name, email, password] of [
  ['Ada', 'ada@example.com', 'sourdough-42'],
  ['Sam', 'sam@example.com', 'croissant!'],
  ['Kim', 'kim@example.com', 'rye-and-honey'],
]) {
  const salt = randomBytes(16);
  users.set(email, { name, salt, hash: await hash(password, salt, 64) });
}

// POST /login with an email and a password.
http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const { email, password } = Object.fromEntries(new URLSearchParams(body));
  const user = users.get(email);
  if (!user) return res.writeHead(401).end('No such user\n');
  const ok = timingSafeEqual(await hash(password, user.salt, 64), user.hash);
  if (!ok) return res.writeHead(401).end('Wrong password\n');
  res.end(`Welcome back, ${user.name}!\n`);
}).listen(8081);
