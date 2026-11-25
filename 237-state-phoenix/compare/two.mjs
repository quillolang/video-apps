// Two Phoenix nodes behind one port, as the test's "two server processes": each new connection goes to the next node
// in turn. The nodes are connected with Erlang distribution (CLUSTER_PEERS, lib/state_phoenix/application.ex), so
// Phoenix.PubSub reaches both.   node compare/two.mjs <port>   (with the environment of one node: MIX_ENV, ...)
// Node 1 listens on <port>+1, node 2 on <port>+2. SIGTERM stops both.
import net from 'node:net';
import { spawn } from 'node:child_process';

const port = Number(process.argv[2]), app = new URL('./phoenix', import.meta.url).pathname;
const sleep = (n) => new Promise((r) => setTimeout(r, n));
const nodes = [];
function start(k) {
  const env = { ...process.env, PORT: String(port + k), CLUSTER_PEERS: `n${3 - k}@127.0.0.1` };
  nodes.push(spawn('elixir', ['--name', `n${k}@127.0.0.1`, '--cookie', 'state', '-S', 'mix', 'phx.server'], { cwd: app, env, stdio: 'ignore', detached: true }));
}
async function up(p) { for (let i = 0; i < 300; i++) { try { if ((await fetch(`http://127.0.0.1:${p}/`)).ok) return; } catch {} await sleep(100); } }

let next = 0;
const server = net.createServer((c) => {
  const u = net.connect(port + 1 + (next++ % 2), '127.0.0.1');
  c.pipe(u).pipe(c);
  c.on('error', () => u.destroy()); u.on('error', () => c.destroy());
});
const stop = () => { for (const n of nodes) try { process.kill(-n.pid, 'SIGTERM'); } catch {} server.close(); setTimeout(() => process.exit(0), 1500); };
process.on('SIGTERM', stop); process.on('SIGINT', stop);

// Node 2 starts once node 1 serves, so its Node.connect to node 1 finds it (the link then works both ways).
start(1); await up(port + 1); start(2); await up(port + 2);
server.listen(port, '127.0.0.1');
