
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
const LIVE_API_URL = 'https://merajosh-server-2.onrender.com'; // keep in sync with src/strings/endpoints.js

// Dev proxy to the live API. The Origin header is dropped so the server's CORS
// allow-list (production Netlify URLs only) doesn't reject localhost.
const proxy = { target: LIVE_API_URL, changeOrigin: true, secure: true,
  configure: (p) => p.on('proxyReq', (req) => req.removeHeader('origin')) };

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': '/src',
      },
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            data: ['@tanstack/react-query', 'axios', 'socket.io-client'],
            ui: ['framer-motion', 'lucide-react', 'react-hot-toast'],
            forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          },
        },
      },
    },

    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': proxy,
        '/uploads': proxy,
        '/socket.io': { ...proxy, ws: true },
      },
    },
  };
});
