import path from 'path';
import { defineConfig } from 'vitest/config';

// See docs/plans/backend-issues.md, item 2.
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    name: 'live',
    include: ['**/*.live.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
