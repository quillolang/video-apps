# The six-counter page in Nuxt 4.7


    npm install
    npx nuxt build
    SESSION_SECRET=$(openssl rand -hex 32) node .output/server/index.mjs     # one process, port 3000
    SESSION_SECRET=$(openssl rand -hex 32) node cluster.mjs                  # two processes on one port

SESSION_SECRET (at least 32 characters) seals the visitor's session cookie. STATE_DB names the SQLite file (state.db by default).
