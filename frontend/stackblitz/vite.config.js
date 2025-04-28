import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,         // your React dev server port
    proxy: {
      // anything under /teams will go to your Flask backend
      '/teams': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/matches': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/elo_ratings': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/match_stats': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
