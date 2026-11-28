const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

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
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-restricted-syntax': ['error',
        { selector: "CallExpression[callee.property.name='catch'] > :function[body.type='BlockStatement'][body.body.length=0]", message: 'Report the error with reportError(where, error) from @shared/errors, so its cause is not lost.' },
        { selector: "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression[body.type=/Literal|Identifier/]", message: 'Report the error with reportError(where, error) from @shared/errors, so its cause is not lost.' },
      ],
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/use-memo': 'warn',
    },
  },
]);
