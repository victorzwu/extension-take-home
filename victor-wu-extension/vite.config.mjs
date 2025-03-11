import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'public/popup.html'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});