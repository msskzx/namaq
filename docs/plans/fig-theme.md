# Quran, branches and quiz theme

Base the changes on fetched main. Scope is the Quran hub and reader, branches in tree and matrix views, and quizzes. Experimental Quran tools, experiments and other features keep their presentation.

## Acceptance

- Add the latest-main requirement to AGENTS.md.
- Tree nodes have subtle botanical borders and curved connectors, visible selection, keyboard focus and reduced motion support.
- Tree and matrix use the same exact and root match treatment. Highlighted phrases are continuous if backgrounds are used.
- Reading surfaces and surrounding chrome use one consistent background in each theme.
- Fig red filled actions stay the same in light and dark, with readable warm white labels. Supporting blue, sand, leaf and purple colors retain their content meanings.
- Preserve navigation, Arabic and English, word positions, studio playback, pause, recall and export.
- Fix the BranchTree child key warning with a regression test.

## Paths and checks

Theme values live in src/app/theme.css. Scope route colors through AppChrome for Quran and quizzes. Update their components and docs/palette.md as needed. Existing Distillate lessons favor deterministic graph geometry and behavior tests over incidental class assertions.

Run lint, TypeScript, all tests and the production build. Inspect the rendered tree, matrix, Quran reader and quiz in both themes. Obtain an independent diff review before opening the PR, resolve findings, merge after CI passes and clean up.
