# Guard proposals from the ship checklist

Rules from [ship-checklist.md](../ship-checklist.md) that a test could check.
Owner rule: a guard needs a second agent's vote, then the owner's sign-off,
before anyone builds it. Reviewer A wrote each proposal; reviewer B, a separate
agent that read the code, voted on it. The owner signed them off on
2026-11-19. Each one names its single entry point and asserts a rule over
every item, never a hard-coded count.

Votes: 9 yes, 2 no, 17 change (B's change is folded into the proposal below).
Rules a test already enforces are listed at the end.

## Status

| No. | Where |
| --- | --- |
| 1 | Quran pipeline thread (`oneQuranText.test.ts`) |
| 2 | `shared/quiz/quranWords.test.ts` |
| 5 | `shared/quiz/integrity.test.ts`, plus counts replaced in nine other tests |
| 6, 8, 10 | `shared/quiz/giveaway.test.ts` (#1000) |
| 7 | `shared/party/reveal.test.ts`. Known break kept on its list: tree questions send their tree, ayat and answers before the reveal, and compare questions their blanks' words |
| 9 | kunya thread (`kunyaNotFirst`) |
| 11 | `shared/quiz/branchAnswers.test.ts` (#1000) |
| 12 | `e2e/app/party.spec.ts` |
| 13 | `shared/quran/oneRecite.test.ts` (#1002) |
| 3 | `shared/oneText.test.ts` |
| 15 | `shared/tapSize.test.ts`: the website floor and the app floor read one value; the "is 44" line is gone |
| 16 | `shared/topBarSearch.test.ts` |
| 17 | `shared/colourLiterals.test.ts`, with a shrink-only list of the colours still outside the themes |
| 21 | `shared/firstFrame.test.ts`. Follows value imports only: `import type` lines are erased at build, and the type graph reaches the data through harmless card shapes. It found six tab pages that ignored a tap on their open button (battle, battles, story, stories, life, term); fixed |
| 14 | `shared/bookmarkKind.test.ts` over `cardMenuSaveId`, which the app's «…» menu now uses. The website has no «…» menu on its feed cards yet (a parity gap, not built here) |
| 18 | `e2e/app` `reciteBarsHidden`, run after recite starts from the top bar, the long-press menu and the home review |
| 19 | Not a test: the blank tree was seen on a phone only, so it is on the real-phone checklist |
| 20 | `e2e/app/fixtures.ts` `noNestedButtons`: the page each app UI test ends on has no button inside a button |
| 4 | `shared/quran/closingSign.test.ts`: both tree drawers (and the website's neighbour boxes) take the sign from `closingSign`; every built tree is walked through it |
| 23 | `shared/quran/oneWordMatch.test.ts`: no file outside `shared/quran` strips marks or letters itself, except a listed few (names, hadith and book text, plus four Quran ones marked "should move": the website's mutashabih engine, quiz checks, hints, tajwid). Not built: "every matrix link is a phrase of two or more words with a rare-root word". Today a matrix link is one word lined up across the rows (`sharedByAll`), so this would change what the matrix lights; it waits for the owner |
| 24 | `shared/sourceFiles.test.ts`: sources name their files (`files` in `shared/sources.ts`); 25 older files wait on a shrink-only list; no non-commercial licence |
| 25 | `shared/quran/droppedCards.test.ts`: only `compareCards.ts` reads the stored compare cards. Known: the review page (on purpose) and the app's tree-to-compare links, which keep their own copy of the rule. Trees and compare cards are judged by different verdicts, so the two filters stay two |
| 26 | `shared/quran/storyCards.test.ts`: an ayah on a part of a story sits on no other card of its page. 50 places break it today, kept on a shrink-only list |
| 22 | `shared/pages.ts` + `shared/pages.test.ts`: every app route and website page in one list; a page on one side only says why (review tool, browser-impossible) or waits on a shrink-only list (today: recite start, events, titles, sources have no app page). The website menu has the app bar's five sections in order |

## Bugs the review found in today's code

- `wrongSurahs` in `shared/quiz/whichSurah.ts` picks wrong choices from all 114
  surahs and ignores the quiz scope and filters, so a juz 30 quiz can offer a
  juz 29 surah (owner 11-19). Proposal 8 would fail on it today.
- The owner said on 11-19 that mutashabihat quizzes draw only from the
  «في كتب المتشابهات» cards. `QUIZ_CATEGORIES` in `shared/quiz/scopeParams.ts`
  asks both kinds, `scopeParams.test.ts` asserts that, and
  `shared/quiz/treeScope.ts` widens the categories back to both. Proposal 10.
- `shared/quran/oneQuranText.test.ts` stays green while the quiz verse
  component lost the mushaf line size: `QuizChoice.tsx` is on its baseline.
  Proposal 1.
- The branch quiz types into its own field (`src/app/quizzes/BranchAnswers.tsx`,
  `mobile/src/components/QuizTree.tsx`), not the recite write boxes.
  Proposal 13.
- One extra letter in the first typed word marks every word wrong:
  `rightWords`/`matchedWords` in `shared/quiz/branchAnswers.ts` count from the
  start. Proposal 11.

## Proposals

### Quran text

1. **Every ayah view goes through the Quran module.** Vote: change. The module
   today has only `QuranWords`, a font wrapper; the four levels (page, slice,
   ayah as set, ayah copied) must exist as module components first, and that
   pipeline is the owner's call. Then: `QURAN_FONT` and `QuranWords` are
   allowed only inside the module, QuranWords only for single words or chips,
   and any other file that sets the Quran font fails. Baseline: the existing
   `font` list in `oneQuranText.baseline.json`, with the quiz verse files
   taken off first.
2. **Tashkeel is never dropped in display.** Vote: change. Mark-stripping is
   inline in about 17 files, so an import ban misses it. Check the output:
   every Quran word a quiz or card hands to a renderer equals a page word from
   `ayahWordsOf`. Extend `shared/quiz/integrity.test.ts` from tree questions to
   every field of every kind in `CHOICE_KINDS` that carries Quran words.
3. **App text only through `mobile/src/ui/Text.tsx`.** Vote: change. Only that
   file imports `Text`/`TextInput` from `react-native`, except
   `mobile/src/lib/useWriteBoxes.tsx`, which is named as the one exception
   with its reason or moved behind the shared piece. Past bug: about 65
   right-aligned styles showed on the left on phones (#674).
4. **A tree box that ends an ayah shows its number sign.** Vote: change. The
   sign is added in each drawer (`endSign` in both `BranchTree.tsx` files), so
   first move it to one shared function both drawers call; the test walks
   every built tree through it, dashed boxes included.

### Quizzes

5. **Question plus answer rebuilds the Quran text.** Already guarded by
   `integrity.test.ts`. Vote: yes to replacing its `> 1000` with "at least one
   question".
6. **Every choice kind is fair.** Vote: change. Runs on what the quiz really
   returns (`assembleQuiz` in `src/lib/quiz/assemble.ts`, which also mixes the
   website's database bank, and `mobile/src/lib/quiz.ts`). For every question:
   the answer appears once among distinct choices, its label is not in the
   prompt, and no wrong choice equals or contains it. Past bug: «أين كانت سرية
   أبي سلمة إلى قطن؟» answered «قطن». Shrink-only baseline of failing ids.
7. **Party phones get nothing that reveals the answer before the reveal.**
   Vote: change. Run real built questions of every kind through `viewFor`
   (`shared/party/rules.ts`) and compare against the answer's label and key.
   Prefer a list of allowed fields to today's list of banned ones.
8. **Choices and questions stay inside the chosen scope.** Vote: change. The
   scope comes from the same `filteredAyat(ayat, filters, range)` the question
   picker uses, so filters count, not just the juz. For every question, its
   ayah, every choice naming a surah or ayah, and both ayat of a compare
   question are in scope. The database bank path needs the same check. Fails
   today (`wrongSurahs`). When the scope holds fewer surahs than the
   choices need, the question is not valid and is not asked (owner 11-19).
9. **Kunya questions never come first.** Vote: change. They live only in the
   website's database bank (family KUNYA). For a range of seeds, the first
   tarajim question `assembleQuiz` returns is never KUNYA. The app has no kunya
   questions: a parity gap.
10. **Mutashabihat quizzes draw only from the books' cards.** Vote: change.
    Check the category of the cards behind the built questions, not the
    constant, since `treeScope.ts` widens it too. The rule covers trees and
    «قارن الموضعين» (owner 11-19, thread "Stop quizzes giving away their
    answers").
11. **One wrong letter marks only that word.** Vote: change. Through
    `rightWords`/`matchedWords` (`shared/quiz/branchAnswers.ts`, also used by
    `compareCorrections`), on every leaf and blank of the built questions:
    one added letter in word i marks only word i wrong. Fails today.
12. **Look-up keeps the party timer visible, and a player can submit with no
    choice.** Vote: yes. Extends `e2e/app/party.spec.ts`.
13. **Every typed Quran answer uses the recite write boxes.** Vote: change
    (new; reviewer A had wrongly called it guarded). Any file outside the
    recite piece that renders an input for Quran words and grades it with the
    branch or compare answer functions fails. Baseline today:
    `BranchAnswers.tsx`, `QuizTree.tsx`, `QuizCompare.tsx`. Also widen
    `oneTree.test.ts`'s "no tree in a quiz" check from its fixed file list to
    every file that imports from `shared/quiz`.

### Feed

14. **«احفظ» on every feed card except questions.** Vote: change. Test the
    function that gives each feed item its menu id: every kind in
    `FEED_CARD_KINDS` except quizzes gets one, in the app and on the website.

### UI

15. **Drop `MIN_TAP toBe(44)` from `tapSize.test.ts`.** Vote: yes. The checks
    that every press goes through `Tap`/`Button` are the guard.
16. **Top-bar search only through `TopBar`'s `search` prop or `NavSearch`.**
    Vote: yes, also catching a field passed through `middle` or children.
17. **Colour values only in the theme files.** Vote: yes. No hex, `rgb(` or
    `hsl(` literal outside `src/app/theme.css` and the app's palette module.
    Shrink-only baseline (28 files today).

### Gestures and phone

18. **Recite hides both bars from every way in.** Vote: change. The bars hide
    in one place (`Reader.tsx`). A UI test enters recite from the top bar, the
    ayah's long-press menu and the home "forgotten" review, and checks both
    bars are hidden.
19. **Trees render on first open.** Vote: change. Keep it only if the old
    blank-tree bug shows in the web export; it was seen on a phone. Otherwise
    it goes to the real-phone checklist.
20. **No button inside a pressable card.** Vote: change. In the UI test
    fixture: on every page the tests visit, no `[role=button]` sits inside
    another. (R0055)
21. **The first frame stays light.** Vote: yes. Walk the imports from
    `mobile/src/app/_layout.tsx`, theme and settings: no data module or JSON
    is reachable, type imports included. Plus a line that every tab route
    under `mobile/src/app/(tabs)/` registers `useTabBarSpace` and
    `useTabRetap`. (R0038)

### Website parity

22. **One page list for app and website.** Vote: yes. This is a new pipeline,
    so it needs the owner's go first. One registry gives each page an app
    route and a website page; a test fails when either is missing, unless the
    entry is marked browser-impossible (qibla) or a review tool. The website
    nav lists the same groups as the app bar. Shrink-only baseline. (R0018)

### Shared pieces

23. **One word-match rule for tree, matrix and compare.** Vote: change. Matrix
    tones come from `ayahContexts`/`sharedByAll` (`shared/quran/ayahContext.ts`)
    through `mobile/src/lib/marks.ts`; no file outside `shared/quran` compares
    words with its own letter or normalize code. Plus: every matrix link is a
    phrase of two or more words with a rare-root word.

### Content and data

24. **Every data file and font is in the sources list.** Vote: yes. Every file
    under `shared/data/` and every bundled font is named by a source in
    `shared/sources.ts`, and no licence is non-commercial. Baseline for files
    older than the list.
25. **Dropped cards are hidden everywhere.** Vote: change. There are two
    filters today, `droppedBranch` (branches) and `shownCards` (compare).
    Make one call the other, then fail on browse, search, quizzes, saved items
    or the feed reading cards any other way.
26. **One ayah, one story card per surah pair.** Vote: yes. For each surah
    pair in the built compare story cards, no ayah appears on two cards.

### Voted no

- **«سورة سورة».** The bug came from database names, which
  `oneSurahName.test.ts` already bans; the proposed rule would flag correct
  uses of `سورة ${surahName(n)}`.
- **Unique story slugs.** Once a file is overwritten the old one is gone, so a
  test over the data cannot fail. It is a checklist line instead: a writing
  script refuses an existing slug.

## Already guarded

Quran text through the module's font rule (`shared/quran/oneQuranText.test.ts`),
surah names (`oneSurahName.test.ts`), one tree builder and no tree tabs
(`oneTree.test.ts`, `treeTabs.test.ts`), tree labels and subtree links
(`treeLabels.test.ts`, `phraseTrees.test.ts`, `branchTreeLinks.test.ts`),
no repeated ayah in one quiz (`choiceKinds.test.ts`), matrix-only quizzes and
solo/party only (`e2e/app/quizzes.spec.ts`), look-up scoring
(`e2e/app/party.spec.ts`), one interest per card and quiz kind
(`interests.test.ts`), no caps in the feed (`e2e/app/home.spec.ts`), no Latin
letters in icons (`noLatinIcons.test.ts`), the 44 pt floor (`tapSize.test.ts`),
shared controls and boxes (`sharedFirst.test.ts`), no shrink-to-fit text
(`treeTabs.test.ts`), back and hub navigation (`e2e/app/back.spec.ts`), the
floating bar and zoom (`e2e/app/mushaf.spec.ts`), reader place and bookmarks
(`readingMarks.test.ts`, `e2e/app/books.spec.ts`), tree path taps
(`e2e/app/quran.spec.ts`), links out (`ExternalLink.test.tsx`), one recite
piece (`oneRecite.test.ts`) and the records index
(`scripts/records/format.test.ts`).

## Doc conflicts found

- Joined ف is purple, as palette.md and the app have it (owner 11-19).
- [palette.md](../palette.md) describes "asymmetrically rounded" tree node
  borders; the owner set one 14 px round radius on 11-13 and the code follows
  it. The doc line is stale.
