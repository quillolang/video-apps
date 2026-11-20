import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The chat's server, for the demo: POST /api/join adds "Ana joined" and answers with every message so far;
// DELETE /api/join starts the chat empty again; GET /api/menu answers with the menu. (A real app has an API server
// of its own.)
const messages = []
const api = {
  name: 'api',
  configureServer(server) {
    server.middlewares.use('/api/join', (req, res) => {
      if (req.method === 'POST') messages.push('Ana joined the chat')
      if (req.method === 'DELETE') messages.length = 0
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(messages))
    })
    server.middlewares.use('/api/menu', (req, res) => {
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(['Pizza', 'Pasta', 'Salad']))
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), api],
})
