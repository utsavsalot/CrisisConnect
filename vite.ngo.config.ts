import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { crisisConnectSyncPlugin } from './vite-sync-plugin';

export default defineConfig({
  plugins: [react(), crisisConnectSyncPlugin()],
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'ngo-portal.html'),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
