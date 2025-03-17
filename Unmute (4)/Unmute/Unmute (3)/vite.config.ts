
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      include: [
        'events',
        'util',
        'stream',
        'buffer',
        'process'
      ]
    })
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 443,
      port: 3000
    }
  }
});
