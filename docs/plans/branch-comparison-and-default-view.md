# Branch comparison and default view

Fix the reported word colors in the 2:35/7:19 and 2:170/31:21 comparisons, apply the same comparison to tree text, and let readers save their preferred tree or matrix view in Settings.

## Acceptance criteria

- Match مِنْ and مِنْهَا by lemma in purple, and حَيْثُ exactly in red.
- Compare corresponding repeated ما occurrences so the second pair is purple on both sides.
- Preserve the existing LCS selection of repeated words, including 6:148/16:35.
- Tree prefixes, shared nodes, leaves and surrounding ayat use the same exact and lemma/root rules as the matrix. Keep original word offsets and compound tokens; compare continuation ayat separately.
- Show an Arabic and English default-view setting using shared buttons and the existing palette. Persist the choice in this browser and refresh the route cache after saving.
- Honor explicit matrix links and explicit tree links above the saved preference, including navigation into subtrees. With no saved preference, use the tree.

The discussion about merging identical preceding ayat and shared prefix endings such as كذلك remains separate.

## Affected paths

Comparison and reader metadata live in `src/lib/quran/ayahContext.ts`, `readerAyat.ts`, `phraseTrees.ts` and `branches.ts`. Branch rendering and navigation live in `src/app/quran/branches/`. The setting lives in `src/components/quran/BranchViewSetting.tsx`, mounted in `src/components/common/TabBar.tsx`, with its cookie name and allowed values in `src/lib/quran/branchView.ts`.

## Validation

Run lint, TypeScript, the complete Vitest suite and the production build. Use two test workers to avoid CPU-contention timeouts in the existing full-corpus quiz tests. Cover both reported comparisons, tree offsets and continuation boundaries, corpus-wide match counts, saved choices and explicit URL precedence. Verify the running app serves matrix view from the preference and honors an explicit tree override.

Distillate record `namaq/0019-fixing-the-example-broke-the-ayah-next-door` calls for checking shared rules across the inventory. The new invariant test covers all 5,174 multi-ayah tree groups. No matching record was found for the default-view setting.
