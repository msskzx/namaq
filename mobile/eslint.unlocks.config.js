const parser = require('@typescript-eslint/parser');
const { default: quality } = require('../shared/lint/quality.mjs');

module.exports = [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'off' },
    plugins: { quality },
    rules: { 'quality/no-comments': 'error' },
  },
];
