# Branch filter controls and passage scope

## Behavior

Filter changes stay pending until Apply. Reset clears the pending range, selections, type, difference, saved-only and sorting controls; Apply commits the reset. Closing the menu discards pending edits. Bookmarks is the first filter and there is no visible filter heading.

The filter menu is a non-modal dropdown below its trigger, shifted inward toward the page center and constrained to the viewport. Escape and outside clicks close it. Keyboard shortcuts in the panel must not step the underlying tree. Apply and Reset stay visible below scrolling content.

One inline dropdown offers juz, chapter and page ranges plus specific chapter or juz selections. Range controls share a 40px height, with the From label inside the dropdown. Specific selections use one picker. Unselected chips keep their borders and background with neutral colors in both themes.

A selected range or list limits displayed group members and continuation, including adjacent tree previews. Comparisons require two remaining occurrences. Group URLs such as the identical الم family use the same continuation rule as plain phrase URLs. Explicit multi-ayah passages retain their real endpoints without duplicating text.

Choosing a suggestion uses its complete displayed phrase and clears the stale card position. Selecting الحامدات opens that family rather than retaining a broad prefix query; old partial-query family links are canonicalized. Submitting typed text without choosing a suggestion remains a search.

## Scope and validation

Affected areas are branch filter UI, shared range controls, group browsing/presentation, suggestion navigation and colocated tests. Comparison range controls also wait for Apply. The shared Button supplies the neutral bordered chip style.

Run lint, TypeScript, the full Vitest suite and the production build. Check mobile and desktop positioning, visible Apply/Reset, equal-height inputs, light/dark colors, Escape and outside-click dismissal in a real browser.

Distillate record namaq/0021-absorbing-a-phrase-must-preserve-its-entry-points applies: retained and focused phrase paths remain separate consumers and both need regression coverage.

Search eligibility for aliases or partial-tree matches and consolidation of overlapping trees are deliberately outside this change. Discuss those after this PR merges.
