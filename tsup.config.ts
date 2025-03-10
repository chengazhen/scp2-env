import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['main.ts'],
  format: ['cjs'],
  clean: true,
  dts: true,
  outDir: 'dist',
  external: ['vite', 'vite-node', 'vite-node/server', 'vite-node/client', 'vite-node/source-map'],
  inject: ['types/env.d.ts'],
  minify: false,
  sourcemap: true,
  noExternal: ['consola'],
  banner: {
    js: "#!/usr/bin/env node",
  },
  platform: 'node',
  target: 'node16',
}); 