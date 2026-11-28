import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["shared/**/*.ts"],
    rules: {
      "no-empty": ["error", { allowEmptyCatch: false }],
      "no-restricted-syntax": ["error",
        { selector: "CatchClause > BlockStatement[body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='catch'] > :function[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name='then'] > :function:nth-child(2)[body.type='BlockStatement'][body.body.length=0]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name=/^(catch|then)$/] > ArrowFunctionExpression[body.type=/Literal|Identifier/]", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
        { selector: "CallExpression[callee.property.name=/^(catch|then)$/] > ArrowFunctionExpression[body.operator='void']", message: "Report the error with reportError(where, error) from shared/errors.ts, so its cause is not lost." },
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
