// The built server as two processes, as PM2's `-i 2` runs it: Node's cluster module shares the port between them.
//   PORT=3000 node cluster.mjs
import cluster from 'node:cluster'

if (cluster.isPrimary) {
  for (let i = 0; i < 2; i++) cluster.fork()
} else {
  await import('./.output/server/index.mjs')
}
