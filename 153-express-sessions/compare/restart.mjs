// Adds two loaves to the basket, restarts the server, and asks for the basket again with the same cookie: is the
// session still there? Each server is started by this script (and only it is stopped), from a JSON spec:
//   node restart.mjs '{"name":"express-session","cmd":"node","args":["app.js"],"cwd":"express","port":8090,"env":{}}'
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(process.argv[2]);
const base = `http://localhost:${spec.port}`;
const start = () => spawn(spec.cmd, spec.args, { cwd: path.resolve(here, spec.cwd), env: { ...process.env, ...spec.env }, stdio: 'ignore', detached: true });
const stop = (kid) => new Promise((r) => { kid.on('exit', r); process.kill(-kid.pid); });
const until = async () => { for (let i = 0; i < 200; i++) { try { await (await fetch(base + '/')).text(); return; } catch { await new Promise((r) => setTimeout(r, 100)); } } throw new Error('never answered'); };
let cookie = '';
const keep = (res) => { for (const c of res.headers.getSetCookie()) { const [kv] = c.split(';'); const k = kv.split('=')[0]; cookie = [...cookie.split('; ').filter((x) => x && !x.startsWith(k + '=')), kv].join('; '); } };
const basket = async () => { const r = await fetch(base + '/', { headers: { cookie } }); keep(r); return (await r.text()).match(/<h1>([^<]*)<\/h1>/)?.[1]; };
const add = async () => { const r = await fetch(base + '/add', { method: 'POST', redirect: 'manual', headers: { cookie, 'content-type': 'application/x-www-form-urlencoded', origin: base }, body: 'loaf=Sourdough' }); keep(r); return r.status; };
let kid = start();
await until();
const statuses = [await add(), await add()];
const before = await basket();
await stop(kid);
kid = start();
await until();
const after = await basket();
await stop(kid);
console.log(JSON.stringify({ name: spec.name, statuses, before, after, cookie: cookie.split('; ').map((c) => c.split('=')[0] + ` (${c.length - c.indexOf('=') - 1} characters)`) }));
console.error(`${spec.name.padEnd(30)} before the restart: ${before}; after: ${after}`);
