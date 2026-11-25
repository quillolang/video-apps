// The built server as two processes, as PM2's `-i 2` runs it: Node's cluster module shares the port between them.
//   ORIGIN=http://127.0.0.1:3000 PORT=3000 node cluster.js
import cluster from 'node:cluster';

if (cluster.isPrimary) {
	for (let i = 0; i < 2; i++) cluster.fork();
} else {
	await import('./build/index.js');
}
