import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['**/*.test.ts'], environment: 'node' } },
      { extends: true, test: { name: 'components', include: ['**/*.test.tsx'], environment: 'jsdom' } },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
