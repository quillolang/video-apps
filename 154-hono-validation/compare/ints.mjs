// Starts ints/main.qwe (with the app's own Quillo, on 8081; only it is stopped), sends it each text as a form's n, and
// shows what a route pattern's int makes of it, and, when the route doesn't match, what the int function does.
//   node ints.mjs <quillo>
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const kid = spawn(process.argv[2], ['run', 'main.qwe', '--port', '8081'], { cwd: path.join(here, 'ints'), stdio: 'ignore', detached: true });
const base = 'http://localhost:8081';
for (let i = 0; i < 200; i++) { try { await fetch(base + '/'); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
for (const n of ['2', '02', '+2', ' 2 ', '2.5', 'two']) {
  const r = await fetch(base + '/n', { method: 'POST', body: new URLSearchParams({ n }), headers: { origin: base } });
  console.log(`${`"${n}"`.padEnd(8)}${await r.text()}`);
}
await new Promise((r) => { kid.on('exit', r); process.kill(-kid.pid); });
