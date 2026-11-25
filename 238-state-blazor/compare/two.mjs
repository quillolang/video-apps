// Two Blazor servers behind one port, as the test's "two server processes". Blazor Server keeps each tab's circuit on
// one server, so this is a sticky load balancer, as Blazor Server needs: a new browser gets the next server in turn,
// and a cookie (node=1 or node=2) keeps it there, WebSocket included.
//   node compare/two.mjs <port>   (with the environment of one server: STATE_DB, KEYS_DIR, DOTNET_ROOT, ...)
// Server 1 listens on <port>+1, server 2 on <port>+2; both share STATE_DB and KEYS_DIR. SIGTERM stops both.
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';

const port = Number(process.argv[2]), out = new URL('./blazor/out', import.meta.url).pathname;
const dotnet = path.join(process.env.DOTNET_ROOT, 'dotnet');
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const servers = [];
const start = (k) => servers.push(spawn(dotnet, [path.join(out, 'StateBlazor.dll'), '--urls', `http://127.0.0.1:${port + k}`], { cwd: out, env: process.env, stdio: 'ignore', detached: true }));
async function up(p) { for (let i = 0; i < 300; i++) { try { if ((await fetch(`http://127.0.0.1:${p}/`)).ok) return; } catch {} await sleep(100); } }

let next = 0;
const sticky = (req) => Number((/(?:^|;\s*)node=([12])/.exec(req.headers.cookie || '') || [])[1]) || 0;
const proxy = http.createServer((req, res) => {
  let k = sticky(req); const fresh = !k; if (fresh) k = (next++ % 2) + 1;
  const up = http.request({ host: '127.0.0.1', port: port + k, path: req.url, method: req.method, headers: req.headers }, (r) => {
    const headers = { ...r.headers };
    if (fresh) headers['set-cookie'] = [...(r.headers['set-cookie'] || []), `node=${k}; Path=/; HttpOnly; SameSite=Lax`];
    res.writeHead(r.statusCode, headers); r.pipe(res);
  });
  up.on('error', () => { res.writeHead(502); res.end(); });
  req.pipe(up);
});
proxy.on('upgrade', (req, socket, head) => {   // the circuit's WebSocket, to the browser's own server
  const k = sticky(req) || (next++ % 2) + 1;
  const u = net.connect(port + k, '127.0.0.1', () => {
    const lines = [`${req.method} ${req.url} HTTP/1.1`];
    for (let i = 0; i < req.rawHeaders.length; i += 2) lines.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
    u.write(lines.join('\r\n') + '\r\n\r\n'); if (head && head.length) u.write(head);
    socket.pipe(u).pipe(socket);
  });
  u.on('error', () => socket.destroy()); socket.on('error', () => u.destroy());
});
const stop = () => { for (const s of servers) try { process.kill(-s.pid, 'SIGTERM'); } catch {} proxy.close(); setTimeout(() => process.exit(0), 1500); };
process.on('SIGTERM', stop); process.on('SIGINT', stop);

start(1); await up(port + 1); start(2); await up(port + 2);
proxy.listen(port, '127.0.0.1');
