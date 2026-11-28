import path from 'node:path';
const POINTER = String.raw`(docs\/[\w./-]+\.md|R\d{4}|ADR[ -]?\d{3,4})`;
const DIRECTIVE = new RegExp(String.raw`^\*?\s*(eslint-(disable|enable)(-next-line|-line)?\b|eslint\s|@ts-(expect-error|ignore|nocheck|check)\b|prettier-ignore\s*$|@vitest-environment\s+\w+\s*$)`);
const SEE = new RegExp(String.raw`^\s*see ${POINTER}(, ${POINTER})*\s*$`);
const REFERENCE = /^\/\s*<reference\s+(path|types|lib)=/;
const LOCKED = /\b(quality\/(no-raw-effects|no-comments)|no-restricted-globals|no-restricted-properties|react-hooks\/(set-state-in-effect|refs|immutability|preserve-manual-memoization|purity|use-memo))\b/;
const unlocks = comment => {
  const directive = comment.value.trim().replace(/^\*\s*/, '').split(/\s-{2,}\s/)[0];
  const disable = directive.match(/^eslint-(disable|enable)(-next-line|-line)?(\s+([\s\S]*))?$/);
  if (disable) return disable[1] === 'disable' && (!disable[4]?.trim() || LOCKED.test(disable[4]));
  return /^eslint\s/.test(directive) && LOCKED.test(directive);
};
const allowed = comment => DIRECTIVE.test(comment.value) || SEE.test(comment.value) || REFERENCE.test(comment.value) || (comment.type === 'Block' && /^\s*global\s/.test(comment.value));

const quality = {
  rules: {
    'no-comments': {
      meta: {
        type: 'suggestion',
        messages: {
          unlock: 'This rule has no inline exceptions: add a hook in mobile/src/lib/hooks with a test instead. See docs/quality/effects.md.',
          comment: 'No comments (owner, 2026-11-28): say it in code, a test or a lint rule. If a reader needs the reason, write only "see docs/<file>.md" or "see R00xx".',
        },
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (unlocks(comment)) context.report({ loc: comment.loc, messageId: 'unlock' });
              else if (!allowed(comment)) context.report({ loc: comment.loc, messageId: 'comment' });
            }
          },
        };
      },
    },
    'import-boundaries': {
      meta: {
        type: 'problem',
        schema: [{ type: 'object', properties: { root: { type: 'string' }, zones: { type: 'array' } }, required: ['root', 'zones'], additionalProperties: false }],
        messages: { crossed: '{{message}} ({{target}}). See docs/quality/imports.md.' },
      },
      create(context) {
        const { root, zones } = context.options[0];
        const file = path.relative(root, context.filename).split(path.sep).join('/');
        const mine = zones.filter(zone => file.startsWith(zone.from) && !(zone.skip ?? []).some(pattern => new RegExp(pattern).test(file)));
        if (!mine.length) return {};
        const resolve = spec => {
          if (spec.startsWith('.')) return path.relative(root, path.resolve(path.dirname(context.filename), spec)).split(path.sep).join('/');
          if (spec.startsWith('@shared/')) return `shared/${spec.slice(8)}`;
          if (spec.startsWith('@/') && file.startsWith('mobile/')) return `mobile/src/${spec.slice(2)}`;
          if (spec.startsWith('@/')) return `src/${spec.slice(2)}`;
          return null;
        };
        const check = (node, spec) => {
          if (typeof spec !== 'string') return;
          const target = resolve(spec);
          const inside = dir => `${target}/`.startsWith(dir);
          for (const zone of mine) {
            const crossed = target === null
              ? zone.packages === false && !(zone.allowPackages ?? []).includes(spec)
              : (zone.allow ? !zone.allow.some(inside) : false)
                || ((zone.forbid ?? []).some(inside) && !(zone.unless ?? []).some(inside));
            if (crossed) context.report({ node, messageId: 'crossed', data: { message: zone.message, target: spec } });
          }
        };
        return {
          ImportDeclaration: node => check(node.source, node.source.value),
          ExportNamedDeclaration: node => node.source && check(node.source, node.source.value),
          ExportAllDeclaration: node => check(node.source, node.source.value),
          ImportExpression: node => node.source.type === 'Literal' && check(node.source, node.source.value),
          CallExpression: node => node.callee.type === 'Identifier' && node.callee.name === 'require' && node.arguments[0]?.type === 'Literal' && check(node.arguments[0], node.arguments[0].value),
        };
      },
    },
    'no-raw-effects': {
      meta: {
        type: 'problem',
        messages: {
          effect: 'No raw {{name}} in app code (owner, 2026-11-28): derive the value with useMemo, run it in the event handler, read a store with useSyncExternalStore, or use a hook from @/lib/hooks. If none fits, add a hook there with a test. See docs/quality/effects.md.',
        },
      },
      create(context) {
        const EFFECTS = new Set(['useEffect', 'useLayoutEffect', 'useInsertionEffect']);
        const nameOf = callee => (callee.type === 'Identifier' ? callee.name : callee.type === 'MemberExpression' && !callee.computed ? callee.property.name : null);
        return {
          ImportSpecifier(node) {
            const name = node.imported.name;
            if (EFFECTS.has(name) && node.local.name !== name) context.report({ node, messageId: 'effect', data: { name } });
          },
          CallExpression(node) {
            const name = nameOf(node.callee);
            if (name && EFFECTS.has(name)) context.report({ node: node.callee, messageId: 'effect', data: { name } });
          },
        };
      },
    },
  },
};

export default quality;
