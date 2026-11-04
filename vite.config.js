
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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
    },
  };
});
