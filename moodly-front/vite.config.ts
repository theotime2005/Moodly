import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use bundle entry points to avoid platform-specific resolution issues
      '@nativescript/core': resolve(__dirname, 'node_modules/@nativescript/core/bundle-entry-points.js')
    },
    // include common extensions so imports without extension resolve
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  optimizeDeps: {
    // prevent Vite from pre-bundling the large native modules that use platform-specific files
    exclude: ['@nativescript/core']
  },
  ssr: {
    // same for SSR builds
    noExternal: ['@nativescript/core']
  },
  server: {
    port: 3000,
    host: true
  }
});
