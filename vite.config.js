import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist'],
          epubjs: ['epubjs'],
        },
      },
    },
  },
  worker: { format: 'es' },
  optimizeDeps: { include: ['epubjs'] },
});
