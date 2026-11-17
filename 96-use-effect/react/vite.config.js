import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The page on 5173; /api goes to the oven's server on 8081.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8081' } },
});
