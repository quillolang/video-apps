// Two loaves added at the same moment, with the same cookie, 20 times over: does the basket get both? Quillo's guide
// says two requests that set the session at once lose one's change. The server is started by this script (and only
// it is stopped), from a JSON spec as restart.mjs takes:
//   node race.mjs '{"name":"Quillo","cmd":".quillo/bin/quillo","args":["run","main.qwe","--port","8080"],"cwd":"../app","port":8080,"env":{}}'
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(process.argv[2]);
const base = `http://localhost:${spec.port}`;
const kid = spawn(spec.cmd, spec.args, { cwd: path.resolve(here, spec.cwd), env: { ...process.env, ...spec.env }, stdio: 'ignore', detached: true });
const stop = () => new Promise((r) => { kid.on('exit', r); process.kill(-kid.pid); });
for (let i = 0; i < 200; i++) { try { await (await fetch(base + '/')).text(); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
// The cookie a browser would keep: each Set-Cookie as its answer arrives, the last one winning.
const trial = async () => {
  let cookie = '';
  const keep = (res) => { for (const c of res.headers.getSetCookie()) { const [kv] = c.split(';'); const k = kv.split('=')[0]; cookie = [...cookie.split('; ').filter((x) => x && !x.startsWith(k + '=')), kv].join('; '); } };
  const add = async (sent) => { const r = await fetch(base + '/add', { method: 'POST', redirect: 'manual', headers: { cookie: sent, 'content-type': 'application/x-www-form-urlencoded', origin: base }, body: 'loaf=Sourdough' }); keep(r); };
  await add(cookie);                       // one loaf, and a session
  const now = cookie;
  await Promise.all([add(now), add(now)]); // two more at once
  const r = await fetch(base + '/', { headers: { cookie } });
  return (await r.text()).match(/<h1>([^<]*)<\/h1>/)?.[1];
};
const seen = {};
for (let i = 0; i < 20; i++) { const b = await trial(); seen[b] = (seen[b] ?? 0) + 1; }
await stop();
console.log(JSON.stringify({ name: spec.name, seen }));
console.error(`${spec.name.padEnd(30)} 1 loaf, then 2 at once, 20 times: ${Object.entries(seen).map(([b, n]) => `${n}× ${b}`).join(', ')}`);
