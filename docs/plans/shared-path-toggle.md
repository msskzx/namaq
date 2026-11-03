# Shared path toggles

Nodes representing one ayah path share a toggle keyed by that ayah. Clicking its opening, leaf, or surrounding-ayah box toggles the same selection. Nodes representing several ayah paths keep their own node toggle. Their independent selection may continue to light a path after its individual toggle is cleared, as today. Search highlighting stays independent.

## Acceptance criteria

- Clicking a single-path root then its leaf clears that path, in either order.
- Path buttons and node clicks use the same state and pressed status.
- Shared nodes retain independent toggles, including shared nodes with identical ayah sets.
- Selecting and clearing one path preserves other selected paths and search highlighting.
- Put pure identity and state-transition helpers in `src/lib/quran/pathHighlight.ts`.
- Cover single paths, shared nodes, mixed clicks, and quiz answer trees.
- Run lint, TypeScript, all tests, and the production build.
- Run the app and show phone and desktop screenshots in light and dark before opening a PR. Leave the PR unmerged.

## Scope and validation

Update `src/app/quran/branches/Paths.tsx` to use the shared helpers. Retain existing branch and quiz regression tests and add behavioral tests. Homepage replay must clear and restore each logical selection once when several buttons represent it. No tree data, matching rules, layout, or quiz grading changes are needed.

Distillate search found no matching toggle-state record. The Node 20 runtime record applies: use existing platform APIs available in CI.

The fresh checkout has no `.env`. Its worktree links to the expected main-checkout location, but the target is absent. The clone and dependency installation succeeded after the initial network delay. Local verification uses a temporary PostgreSQL-compatible PGlite server with the Prisma schema and surah metadata from checked-in files. The branch page uses checked-in Quran text; no preview or production database is modified. Neo4j is not exercised by this change.

## Review

The first independent review found that homepage replay clicked each pressed node button, so two buttons for one selection toggled it twice. Replay now deduplicates by logical toggle identity. Tests using real path controls check clearing and restoration after skip and completion. The second review found no defects.

## Verification

Lint, TypeScript, the production build, and all 3,479 tests across 300 files pass. An earlier suite run overlapped the build and timed out in the existing Quran text-integrity test; the full suite passes with four workers.

The real `/quran/branches?o=ما سعي` page was checked at 390 × 844 and 1440 × 900 in both themes. Browser assertions check opening-to-leaf clearing, path-button clearing in the opposite order, and preservation of the shared middle's independent selection. Screenshots show the selected path, with separate captures after clearing. Quiz feedback tests check the same shared toggle while preserving grading; the full quiz suites pass.
