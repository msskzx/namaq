# Homepage palette and matrix setting

Include the homepage in the existing fig palette scope, including navigation and overlays in both modes. Keep experimental tools and other routes unchanged. The homepage already uses the shared tokens.

Replace the vague word-connector preference with a matrix-specific label and a brief description in Arabic and English. Associate the description with the switch. Preserve its cookie, default-off state, persistence and refresh behavior.

Changes are limited to AppChrome, BranchConnectorSetting, their existing tests and palette documentation. The Distillate record about palette tests favors behavior and accessible state over utility-class assertions. Add the homepage to the existing route scope cases and check both language descriptions through aria-describedby.

Run lint, TypeScript, all tests and the production build. Inspect the homepage and setting in light and dark, obtain an independent review, then open and merge the PR after CI passes. Stop the temporary preview and archive the worktree afterward.
