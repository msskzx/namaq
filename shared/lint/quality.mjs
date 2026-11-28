const POINTER = String.raw`(docs\/[\w./-]+\.md|R\d{4}|ADR[ -]?\d{3,4})`;
const DIRECTIVE = new RegExp(String.raw`^\*?\s*(eslint-(disable|enable)(-next-line|-line)?\b|eslint\s|@ts-(expect-error|ignore|nocheck|check)\b|prettier-ignore\s*$|@vitest-environment\s+\w+\s*$)`);
const SEE = new RegExp(String.raw`^\s*see ${POINTER}(, ${POINTER})*\s*$`);
const REFERENCE = /^\/\s*<reference\s+(path|types|lib)=/;
const LOCKED = /\b(quality\/no-raw-effects|no-restricted-globals|no-restricted-properties|react-hooks\/(set-state-in-effect|refs|immutability|preserve-manual-memoization|purity|use-memo))\b/;
const unlocks = comment => /^\s*eslint-(disable|enable)/.test(comment.value) && LOCKED.test(comment.value);
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
