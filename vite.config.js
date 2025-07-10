// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; 

export default defineConfig({
  plugins: [
    vue(), 
  ],

  resolve: {
    alias: {
      '@': '/src',
    },
  },

  test: {
    globals: true, 
    environment: 'jsdom',
  },
  server: {
    port: 5173, 
  },
  build: {
    outDir: 'dist', 
  },
});