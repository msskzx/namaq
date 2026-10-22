# Shared openings journey

Status: approved and implemented; final verification and review are in progress. The later compact hero/filter proposal below awaits the owner's choice.

## Outcome and scope

Make `/quran/branches` one browsing and search journey. It opens with ten expanded entries per page. Selecting a search suggestion replaces the list with its complete phrase tree. Remove the view selector and `v=list` from new links.

The [glossary](../../CONTEXT.md#shared-ayah-openings) distinguishes an opening, a shared phrase, and an opening entry. [The existing plan](quran-shared-openings.md) describes the current tree, piece, and data rules. This handoff supersedes its journey and grouping rules where specified below. Root-based vocabulary exploration is deferred for a possible compare demo. The owner also authorized migrating all existing and new icons on this page to Lucide in this PR. Keep this scoped to the branches page, including the controls it renders.

## Implementation baseline after PR 422

[PR 422](https://github.com/msskzx/namaq/pull/422) merged into main on 2026-10-22 as `3a9b57c7061e8ecd1782c621ee132987b646f696`. Its merged diff is the baseline for this handoff. This planning worktree still points to the earlier PR 419 commit, so bring it onto current main before implementation, preserving the plan and glossary changes. Re-read the merged components and existing tests then; paths added in PR 422 below were verified in that PR's diff.

Preserve these completed behaviors:

- Tree matching ignores Quranic annotation signs, initial shadda, and final sukun where PR 422 specifies. Significant vowels still split nodes. Shared display retains marks common to the original spellings at each aligned letter. Original reader spellings remain intact.
- A leaf's references and its TextSearch icon form one borderless context button. Differing original marks highlight the icon; differing inner nodes and first-word boxes use filled amber controls. Reader navigation is available inside the context cards rather than as separate leaf-reference links.
- The lazy context dialog shows every represented ayah with its same-surah neighbors, original marks, differing-word highlights, numeric order, loading/retry states, focus restoration, and background scroll locking. Context neighbors may lie outside the selected juz range.
- The overlay works in list and focused trees and quiz feedback; unanswered quiz trees suppress context controls. Preserve correct offsets for first-word boxes and next-ayah continuations.
- Use the existing Lucide dependency, shared Button variants, palette tokens, and shared PageSpread presentation. Migrate the branches page's existing and new icons to Lucide; a migration of unrelated pages remains out of scope.

PR 422 leaves opening-search hamza normalization and the new root guard undone. It preserves `ayat.json` and existing opening membership, so the prior root audit remains applicable. Our deliberate root-based membership changes must preserve its display and context behavior within each resulting group. Retain PR 422's Original spelling and Shared display glossary entries when integrating the local glossary additions.

## Agreed behavior

### Browsing and ordering

- Show ten expanded entries per page. Default to longest shared phrase first, with the existing tie breakers.
- Retain grouped-by-opening ordering. Order entries under their openings before pagination, then show ten entries per page under opening headings. An opening can continue onto another page. Every displayed entry stays expanded.
- Use one segmented selector for the two orderings, with a label and icon inside each segment and a filled background behind the selection. Each option must be directly selectable and expose its selected state to keyboard and assistive-technology users.
- Changing ordering or the applied juz range resets pagination to page one. Search suggestions do not filter or replace the browsing list until a phrase is selected.

### Search and focused tree

- Update up to ten phrase suggestions as the user types. Search shared phrases, rather than full ayah text. Keep draft text local and leave the URL unchanged while typing.
- Keep prefix matches ahead of substring matches. Use the existing Arabic spelling normalization plus search-only hamza equivalence, applied to both query and candidates. Fold أ, ؤ, ئ, and ء to a common comparison form compatible with plain alif, including canonically equivalent composed spellings.
- Typing أرأيتم or ارايتم must find a phrase indexed with ارءيتم. أفرأيتم must find افرءيتم. شيء and شىء must remain equivalent. Displayed Quran text, phrase IDs, and link spelling retain their original forms.
- Arrow keys select a suggestion. Enter opens the selected suggestion, or the first when none has been chosen. Provide an explicit no-match message. Clearing the query removes suggestions; Escape dismisses them.
- Selecting a suggestion shows its complete tree in place of the list, including phrases that are not single list entries. Keep search and juz controls available. Preserve broader-phrase links, deeper branches, first-word variants, context controls, and the exact ayah reader links inside context cards.
- Return to list restores the previous list page, ordering, and applied juz range. A direct tree link without prior browsing context returns to page one with the current range. Draft search clears on selection.

### Automatic juz filtering

- Apply after a short typing pause once both values are integers from 1 through 30 and From is no greater than To. An Apply action is no longer required.
- Incomplete, reversed, or out-of-bounds drafts retain the last applied results and URL. Show an inline explanation, including that the displayed results still use the applied range. Do not silently swap values during editing.
- Recompute openings, phrases, suggestions, entries, counts, and trees from ayat inside the applied range.
- If a selected phrase has no shared match in the new range, show an explicit no-match state with actions to return to the list or clear the range. Never substitute another phrase.
- Clearing the range restores the whole mushaf and resets pagination. Pending range updates must not overwrite later navigation or reset fields during typing.

### Wording plus root guard

For every word compared in an opening or longer shared phrase, first require the existing normalized wording match. Then apply this additional condition:

| Roots of corresponding words | Result after wording matches |
| --- | --- |
| Both have roots | Require the same root. |
| Only one has a root | Keep them separate. |
| Neither has a root | Wording alone is sufficient. |

Particle identity, lemma, grammatical role, and meaning add no further conditions. Conditional إِنْ and emphatic إِنَّ may remain together. A common root never joins different normalized written words. Search remains tolerant while result membership obeys the root guard.

The current false opening `من الله` joins 52:27 فَمَنَّ ٱللَّهُ, whose verb has root `mnn`, with 70:3 مِّنَ ٱللَّهِ, whose preposition has no root. They must separate. The initial audit also identifies `قالت اني`: 19:18 إِنِّي has no root, while 19:20 أَنَّىٰ has root `Any` in the corpus. Each of these two current opening groups becomes singletons and disappears from the shared-openings list.

The shared phrase قل أرأيتم إن كان من عند الله in 41:52 and 46:10 stays together. Its corresponding roots are `qwl`, `rAy`, no root, `kwn`, no root, `End`, and `Alh` in both ayat. Retain PR 422's shared display and significant-vowel splits, with original marks preserved in its context cards.

Treat an explicitly rootless corpus word differently from an unmapped reader word. Verify word alignment during generation and report incomplete mappings rather than treating them as rootless. Reuse the corpus already read by the build; its ROOT fields supply this check.

### URL behavior

- `/quran/branches` opens the default list. Keep meaningful `g=opening`, `p`, and juz-range parameters. Omit default values from generated links.
- `o` opens the selected phrase tree; `w` retains its first-word spelling selection. Preserve existing homepage, quiz-feedback, tree-branch, and variant entry points.
- Preserve the originating list ordering and page while focused, so Return can restore them. Return clears the phrase and spelling selection. Ordering and juz changes reset the stored page.
- Legacy `v=list` URLs open the list and drop `v`, the unused `o`, and `w`, preserving meaningful ordering, pagination, and range. Direct `o` links continue to request a tree.
- Unknown or no-longer-shared selected phrases show an explicit unavailable state with a return action. They must not fall back silently to إن المتقين.
- If a text-only link names multiple root-compatible groups, offer their vocalized phrases with ayah counts. Selecting one opens only its complete tree. Generated search, branch, and quiz links carry a stable discriminator when needed, preserving the original normalized `o` value.
- Browser Back and Forward restore committed page state. Keep typing local, and preserve responsive fields when route updates arrive later.

## Acceptance criteria and validation

| Criterion | Automated scenarios |
| --- | --- |
| A1. Default list contains ten expanded entries in the existing longest-first order. | First, second, and last partial pages; empty results; invalid page; no old view selector. |
| A2. Grouped pagination counts entries, not openings. | An opening with more than ten entries, a page spanning multiple opening headings, stable order, no missing or duplicated entries, no collapsed groups. |
| A3. Ordering uses a labeled segmented selector. | Direct selection of either option, keyboard use, selected state, icons and both language labels, page reset. |
| A4. Typing updates local suggestions only. | Prefix ranking, substring ranking, result limit, spaces, diacritics, clear, no match, arrows, Enter and Escape. Assert the list and URL remain unchanged until selection. |
| A5. Search tolerates hamza differences without changing identity. | أرأيتم/ارايتم against ارءيتم; أفرأيتم against افرءيتم; أ/ؤ/ئ/ء and composed forms; شيء/شىء. Assert original-ID links and unrelated consonant mismatches. |
| A6. Focused tree navigation preserves the list journey. | Phrase broader than an entry, return to a nonfirst grouped page, nested branches, first-word variants, reader links, direct tree entry, Back and Forward. |
| A7. Only valid juz drafts apply automatically. | Fake timers, partial and rapid edits, reversed and out-of-bounds input, reset, selection during pending updates, no matching phrase, last applied results retained during invalid edits. |
| A8. URL behavior is consistent across entry points. | Canonical new links without v=list, legacy list links carrying unused o, grouped pages, default omission, unknown phrase, homepage and quiz feedback destinations. An ambiguous legacy phrase link offers vocalized choices with counts; selecting either opens only its intended group. |
| A9. Root checking augments wording rather than replacing it. | Real false groups 52:27/70:3 and 19:18/19:20; positive pair 41:52/46:10; same root with different wording; different roots at a later shared word; rooted versus rootless; both rootless with different particle roles. |
| A10. Generated data and quiz trees use the same grouping rule. | Corpus/reader alignment, missing annotation detection, preserved reader text and first-word variants, regenerated group and piece diff, quiz assembly and answer-tree regression coverage. |
| A11. PR 422's display and context behavior survives the new membership rules. | Shared-mark display, significant-vowel splits, original forms, per-group context membership, combined leaf controls, lazy loading/retry, context outside the juz range, offsets and continuations, quiz input suppression and feedback controls, translated labels, scroll lock and focus restoration. |
| A12. Every existing and new icon rendered by the branches page uses Lucide. | Check search, popular openings, ordering, range/reset controls, return/broader navigation, pagination, and context dialog. Preserve RTL horizontal-arrow direction, accessible names, and consistent icon sizing. |

The full-prefix audit identifies one current phrase requiring distinct selections under the root guard: `قال رب اني` names both `قال ربِّ أَنَّىٰ` at 3:40 and 19:8, and `قال ربِّ إِنِّي` in seven other ayat. Add regression coverage for two separate search results, generated links selecting the intended root partition, and a legacy-link picker showing counts of two and seven. Preserve `o` as the original normalized text; an additional stable discriminator is needed when that text is ambiguous. Its parameter name and encoding are implementation choices.

Use a reactive navigation mock with a stable search-parameter reference per unique search string, as required by `AGENTS.md`. Model delayed URL updates for range/navigation races. See the prior [search reset record](https://distillate-kappa.vercel.app/records/distillate/0004-the-fix-for-a-stale-search-box-wiped-what-was-typed) and [router mock record](https://distillate-kappa.vercel.app/records/distillate/0005-a-mock-router-too-fast-to-show-a-race).

Complete `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`. Check rendered Arabic RTL and English UI, light and dark themes, and narrow and wide screens. Inspect control size, text wrapping, focus visibility, suggestions, horizontal tree scrolling, and page stability during typing. Recheck context dialog cards, dismissal, focus restoration, and background scroll lock from both list and focused trees. Follow the repository's review cycle before opening a PR.

## Affected components and implementation order

1. Establish the post-422 baseline described above, then build the root guard in `src/lib/quran/branches.ts` with tests in `branches.test.ts`. Inspect `openingId`, `sharedOpenings`, `listPhrases`, `opens`, `startingWith`, `phraseTree`, piece generation, and tree growth so grouping, search selection, and links agree. Preserve PR 422's `Branch.forms`, `Variant.forms`, shared-display calculation, and context membership. Keep the search-only hamza comparison separate from grouping and route identity.
2. Extend `scripts/quran/buildBranches.ts` to read per-word roots from `data/quran/quranic-corpus-morphology-0.4.txt`. The build already reads this corpus for conjunction prefixes. Carry the required root metadata into `src/app/quran/branches/ayat.json` and account for continuation words used by the tree. Regenerate with `npm run quran:branches` and inspect changes. `src/lib/quran/similar.ts` parses corpus roots but its content-word filtering is unsuitable for this guard without adaptation.
3. Update URL generation in `src/lib/quran/branches.ts` and parsing in `src/app/quran/branches/page.tsx`. Missing selection becomes the list; invalid selection becomes an explicit unavailable state. The current `pickPhrase` default must not choose the landing state. Proposed new route test: `src/app/quran/branches/page.test.tsx`.
4. Update `PieceList.tsx` and its test for ten entries, expanded grouped headings, and pagination after ordering. Preserve the existing tie breakers and full tree display.
5. Update `OpeningSearch.tsx` and its test for suggestions in both browse and focus states, hamza equivalence, keyboard interaction, and state-preserving selected links.
6. Update `JuzFilter.tsx` and its test for draft validation and automatic application. Inspect `src/components/common/NumberInput.tsx` before choosing local handling or a compatible extension. Preserve its other callers and the shared `src/lib/quran/juz.ts` parsing behavior outside this journey.
7. Add the ordering control at the route's client boundary. Proposed new path if needed: `src/app/quran/branches/BranchOrdering.tsx`, with colocated tests. `src/components/graph/ScopeToggle.tsx` is a visual reference but currently flips from one button; provide directly selectable segments. Follow shared-button rules for action buttons.
8. Check shared consumers: `BranchTree.tsx`, `src/app/quizzes/BranchAnswers.tsx`, `src/lib/quiz/branchQuestions.ts`, and `src/components/homepage/homeLinks.ts`. Preserve source-reader links through context cards, homepage previews, quiz feedback destinations, and quiz generation under the new guard. PR 422 adds `src/app/quran/branches/AyahContext.tsx`, `AyahContext.module.css`, `src/lib/quran/ayahContext.ts`, and `src/app/api/quran/context/route.ts`, each with relevant test coverage. Preserve these and `src/components/quran/PageSpread.tsx`; extend tests when group membership affects represented ayat or word offsets.
9. Update the existing [shared openings plan](quran-shared-openings.md) and the implemented-feature line in `README.md` for the finished behavior. Keep domain terms in `CONTEXT.md`.

## Data and operational consequences

This regenerates the branches ayat artifact and changes derived opening and piece membership. The branch quiz derives its questions from that artifact, so its question inventory may change. This task does not author the reviewed bank under `data/quiz/`.

No database migration, PostgreSQL/Neo4j synchronization, or graph layout recomputation is indicated. Surah names still come from PostgreSQL; context continues to load from the reader source pages. Before project commands, create and verify the worktree's `.env` symlink and dependencies according to `AGENTS.md`, preserving existing files. Both `.env` and `node_modules` were absent during planning. Dependencies must match the post-422 package and lockfile, which add Lucide. Reuse the main checkout's node_modules only when they match; otherwise install the correct dependencies. Use the documented project services for local rendered verification.

## Remaining issues

The owner approved the journey and root guard. An ambiguous legacy link offers vocalized phrase choices with counts; it never merges conflicting partitions or silently chooses one.

The owner subsequently requested a suggestion before changing the crowded hero/filter layout. The proposal is a title and one-sentence introduction, matching rules under an expandable disclosure, full-width search first, one compact row for juz range and ordering, and the eight popular openings in an expandable section. This proposal is pending approval; it has not been applied. The owner's alternatives are to retain visible popular openings or request a mockup first.

Evidence check: all 42,593 words in the current generated ayat have corpus locations and STEM annotations. Of these, 15,576 intentionally have no ROOT. This proves positional annotation coverage, rather than exact character-for-character equivalence between the corpus and reader orthographies. Use reader text for wording and corpus annotations for roots. The initial guard removes two false opening groups. A deeper audit finds the `قال رب اني` collision above, which requires selection disambiguation in runtime phrase indexing and links as well as build-time grouping.

Nonblocking implementation choices are the exact short debounce duration, local helper/control boundaries, and spacing within the existing theme. Preserve the eight popular-opening shortcuts as direct phrase selections. Keep invalid first-word spelling behavior compatible with the existing combined-phrase fallback.

No ADR is needed for the reversible journey changes. Root-based comparison remains deferred.
