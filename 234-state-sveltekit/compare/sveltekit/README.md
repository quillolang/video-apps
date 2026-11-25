# The six-counter page in SvelteKit 3.4

Remote functions (`query`, `form`, `query.live` in src/routes/data.remote.ts) are still experimental in SvelteKit 3.4;
vite.config.ts opts in. The server is adapter-node.

    npm install
    npm run build
    ORIGIN=http://127.0.0.1:3000 PORT=3000 node build/index.js     # one process
    ORIGIN=http://127.0.0.1:3000 PORT=3000 node cluster.js         # two processes on one port

ORIGIN is the address the page is served from: SvelteKit checks it on every form post. STATE_DB names the SQLite file
(state.db by default).
