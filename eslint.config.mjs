import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import quality from "./shared/lint/quality.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["shared/**/*.ts"],
    ignores: ["shared/**/*.d.ts"],
    plugins: { quality },
    rules: {
      "quality/no-comments": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-restricted-syntax": ["error",
        { selector: "CatchClause > BlockStatement[body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > :function[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > :function:nth-child(2)[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > ArrowFunctionExpression:nth-child(2)[body.type=/Literal|Identifier/]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > ArrowFunctionExpression:nth-child(2)[body.operator='void']", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression[body.type=/Literal|Identifier/]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > ArrowFunctionExpression[body.operator='void']", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
      ],
    },
  },
  {
    ignores: [
      "src/generated/**/*",
      "node_modules/**/*",
      ".next/**/*",
      "party/node_modules/**/*",
      "party/.wrangler/**/*",
      "mobile/**/*",
    ],
  },
];

export default eslintConfig;
