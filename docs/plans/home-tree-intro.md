# Homepage tree introduction

Animate the homepage example on a visitor's first visit to explain how shared phrases form paths. Keep the tree above the explanatory text on phones, add skip and replay controls, and simplify the branch-page header and context dialog. Remove the previous work-in-progress toast.

## Acceptance criteria

- Draw paths in order, type each leaf while highlighting its path, then point out the ayah-context action without opening it.
- Start automatic playback when the tree is visible, pause when it leaves view, remember completion or skipping, and respect reduced motion for automatic playback.
- Keep skip and replay available in Arabic and English. Restore the tree's controls and existing pinned paths after playback or cancellation.
- Replacing the random example cleans up the old animation and initializes the replacement tree.
- Retain search, navigation, zoom, surrounding-ayat and context-dialog behavior with compact controls and accessible names.

## Validation

Run lint, TypeScript, all Vitest tests and a production build. Review the complete feature diff independently before opening the PR.

Keep the existing homepage navigation, random-example retry, search and context tests. Update assertions for renamed controls and remove the obsolete toast tests. Add animation sequencing, visibility, reduced-motion, replay, cancellation, keyboard isolation and random-replacement coverage.

Searched Distillate's Namaq records for homepage and animation problems. The Node-version record applies to runtime checks: CI uses Node 20, so avoid newer built-ins without support there.
