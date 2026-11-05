# Quran branch learning

Keep the passage being compared when switching between tree and matrix views. Make progress through a filtered set visible and retain reference labels on saved phrases.

## Acceptance criteria

- A matrix card includes the complete ayah run shown by its tree, with numbered verse markers and continuous text. The existing tree presentation decides where the run ends.
- Surrounding ayat appear before and after that whole run. Existing swipe navigation, matching, retry and keyboard behavior continue to work.
- Selected navigation tabs use neutral ink and paper colors in both themes.
- Saved phrases that remain reachable after absorption into larger trees retain their surah and ayah references, including existing bookmarks with juz or occurrence filters.
- Both views show a thin neutral progress bar and localized current/total count for the current filtered navigation set. Progress means position, not recorded mastery.

## Paths and validation

Changes cover branch page presentation, AyahCards, TreeSteps, navigation CSS and the homepage bookmark index. Colocated tests cover continuation, filters, recovery, saved references, bilingual progress and reaching the final tree.

Run npm run lint, npx tsc --noEmit, npm test and npm run build. Obtain an independent review before opening the PR.

Distillate record namaq/0021-absorbing-a-phrase-must-preserve-its-entry-points applies to bookmark lookup: the raw phrase inventory remains a valid entry point after a phrase disappears from the retained tree list.

Filtering and sorting of search results is a subsequent task and is outside this change.
