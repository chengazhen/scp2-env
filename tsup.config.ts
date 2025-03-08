import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['main.ts'],
  format: ['esm'],
  clean: true,
  dts: true,
  outDir: 'dist',
  external: ['vite', 'vite-node', 'vite-node/server', 'vite-node/client', 'vite-node/source-map'],
  inject: ['types/env.d.ts'],
  minify: false,
  sourcemap: true,
}); 