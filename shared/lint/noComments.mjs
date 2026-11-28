const POINTER = String.raw`(docs\/[\w./-]+\.md|R\d{4}|ADR[ -]?\d{3,4})`;
const DIRECTIVE = new RegExp(String.raw`^\*?\s*(eslint-(disable|enable)(-next-line|-line)?\b|eslint\s|@ts-(expect-error|ignore|nocheck|check)\b|prettier-ignore\s*$|@vitest-environment\s+\w+\s*$)`);
const SEE = new RegExp(String.raw`^\s*see ${POINTER}(, ${POINTER})*\s*$`);
const REFERENCE = /^\/\s*<reference\s+(path|types|lib)=/;
const allowed = comment => DIRECTIVE.test(comment.value) || SEE.test(comment.value) || REFERENCE.test(comment.value) || (comment.type === 'Block' && /^\s*global\s/.test(comment.value));

const quality = {
  rules: {
    'no-comments': {
      meta: {
        type: 'suggestion',
        messages: {
          comment: 'No comments (owner, 2026-11-28): say it in code, a test or a lint rule. If a reader needs the reason, write only "see docs/<file>.md" or "see R00xx".',
        },
      },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (!allowed(comment)) context.report({ loc: comment.loc, messageId: 'comment' });
            }
          },
        };
      },
    },
  },
};

export default quality;
