import path from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    exclude: [...configDefaults.exclude, '.claude/**', '.codex/**'],
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
