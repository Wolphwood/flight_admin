import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias pour le dossier src
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: 'build',
    rollupOptions: {
      external: ['browser.js']
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
})
