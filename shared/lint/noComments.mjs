const ALLOWED = /^(\s*(eslint-|@ts-|@vitest-environment|prettier-ignore|global\s)|\s*see (docs\/[\w./-]+\.md|R\d{4}|ADR[ -]?\d{3,4})(, (docs\/[\w./-]+\.md|R\d{4}|ADR[ -]?\d{3,4}))*\s*$|\/\s*<reference)/;

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
              if (!ALLOWED.test(comment.value)) context.report({ loc: comment.loc, messageId: 'comment' });
            }
          },
        };
      },
    },
  },
};

export default quality;
