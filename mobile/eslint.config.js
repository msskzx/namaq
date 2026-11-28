const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const path = require('node:path');
const { default: quality } = require('../shared/lint/quality.mjs');
const { default: importZones } = require('../shared/lint/importZones.mjs');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'web-build/*', '.expo/*', 'sketches/*', 'node_modules/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'import/no-unresolved': 'off',
      'import/namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/preserve-manual-memoization': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/use-memo': 'error',
    },
  },
  {
    plugins: { quality },
    rules: {
      'quality/no-comments': 'error',
      'quality/import-boundaries': ['error', { root: path.resolve(__dirname, '..'), zones: importZones }],
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-restricted-syntax': ['error',
        { selector: "CatchClause > BlockStatement[body.length=0]", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > :function[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > :function:nth-child(2)[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > ArrowFunctionExpression:nth-child(2)[body.type=/Literal|Identifier/]", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > ArrowFunctionExpression:nth-child(2)[body.operator='void']", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression[body.type=/Literal|Identifier/]", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression[body.operator='void']", message: "Report the error with reportError(where, error) from @shared/errors, so its cause is not lost." },
      ],
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    ignores: ['src/lib/**', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: {
      'quality/no-raw-effects': 'error',
      'no-restricted-globals': ['error',
        ...['setTimeout', 'setInterval', 'requestAnimationFrame', 'requestIdleCallback'].map(name => ({ name, message: `No raw ${name} in app code (owner, 2026-11-28): use useDebounced, useNow, useAfter or useWebScrollEnd from @/lib/hooks, which clear themselves on unmount. If none fits, add a hook there with a test, or move the scheduling into a lib/ module that owns it. See docs/quality/effects.md.` })),
      ],
      'no-restricted-properties': ['error',
        ...['window', 'globalThis', 'global', 'self'].flatMap(object => ['setTimeout', 'setInterval', 'requestAnimationFrame', 'requestIdleCallback'].map(property => ({ object, property, message: 'No raw timers in app code: use a hook from @/lib/hooks. See docs/quality/effects.md.' }))),
      ],
    },
  },
]);
