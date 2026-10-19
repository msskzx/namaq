# Quiz theme, number controls and complete branch answers

Use the paper theme already used by the homepage and Quran reader for quizzes and shared openings. A compact number stepper supports direct typing, bounded increments and keyboard input, replacing numeric selects and inputs across the app. Preserve labelled selectors whose options identify named entities rather than numbers.

The branch quiz uses the explorer's connected tree layout. Every node after the supplied opening, including terminal leaves, has an answer field. Checking requires every node and feedback shows the complete tree. Accept ordinary Arabic keyboard spelling variants, including ي in place of ئ in شيء, without accepting unrelated words or missing nodes.

Keep Arabic and English labels, light and dark themes, form submission and URL state. Do not modify the authored quiz bank or historical data.

Affected paths: common number control and callers, quizzes, Quran branches, branch question generation and matching, README. Cover number bounds, form behavior, full multi-level tree answers and typing variants with colocated Vitest tests. Run lint, tsc, all tests and production build, then visually verify both pages and tree quiz in light and dark. Independent review before opening one application PR.

Distillate search found the record about quiz tests pinning palette class names. Tests here should verify answer state and accessible text instead of palette utilities. Search also found the record about agents reporting green with lint and tsc failures, so run all required checks in the parent.
