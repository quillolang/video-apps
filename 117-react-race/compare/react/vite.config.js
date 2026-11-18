import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// /api goes to the pantry's search API (../api/server.mjs, on 8081), in dev and in vite preview.
const proxy = { '/api': 'http://127.0.0.1:8081' }

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
