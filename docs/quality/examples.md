# Quality examples

Real cases found while improving the code: what was wrong, what it caused, which check found it, and the fix.
New checks add their cases here, so later work can learn from them.

## A hook after an early return (step 1, lint)

- **Where:** `mobile/src/components/MatrixCard.tsx`, `Cell`.
- **Wrong:** `if (!cell) return …` came before `useContext` and `useState`.
- **Effect:** React needs the same hooks in the same order on every draw. A cell that goes from empty to
  filled draws with two more hooks than before, and the app crashes with "Rendered more hooks than during the
  previous render".
- **Found by:** `react-hooks/rules-of-hooks`.
- **Fix:** the two hooks moved above the early return.

## A comment that justified skipping a check (step 1, lint)

- **Where:** `mobile/src/components/SearchResults.tsx`, the search effect.
- **Wrong:** the effect leaves `keep` out of its dependency list, and a comment explained why ("a fixed rule
  of the page that calls this").
- **Effect:** nothing stops a later page from passing a `keep` that changes. Search would then keep filtering
  by the old rule. The comment can't be enforced, which is exactly what a comment shouldn't be doing.
- **Found by:** `react-hooks/exhaustive-deps`.
- **Fix for now:** the comment is gone and a lint directive marks the exception. Step 7 replaces the effect with
  a shared debounce helper.

## A lint autofix that broke the types (step 1, tooling)

- **Where:** `mobile/src/components/BranchTree.tsx`.
- **Wrong:** `import/no-duplicates --fix` merged `import type { … }` with a value import into one
  `import type`, so five values became types only.
- **Effect:** `tsc` failed. Lint and the type check have to run together, and an autofix is not trusted
  until `tsc` passes.
- **Fix:** one import with inline `type` markers.

The same autofix went the other way in three files (`QuizPage.tsx`, `searchAll.ts`, `Reference.tsx`): it merged a
type into a value import without the `type` mark. Nothing failed, because the bundler drops imports used only as
types, but the import no longer says what it is. Each got its `type` mark back. Found by the reviewer, not by a check.

## A counter that miscounted (step 1, tooling)

- **Where:** `scripts/quality/count.mjs`, its first version.
- **Wrong:** it read comments with a bare token scanner, which loses its place inside template strings
  (`` `https://shamela.ws/book/${id}` `` reads as a `//` comment) and JSX text.
- **Effect:** it reported 7,700 comment lines where there are 13,461, about 40% too few.
- **Found by:** the reviewer recounting from the parsed syntax tree.
- **Fix:** the counter walks the parsed file and collects the comments around every node.

## A save that failed in silence (step 2, lint)

- **Where:** `shared/storage.ts` `keyStore.write`, `shared/bookmarks.ts` `write`, and 20 more `catch {}` blocks.
- **Wrong:** a failed save to the device was caught and dropped.
- **Effect:** a reader's bookmark or note could be lost with nothing anywhere saying why.
- **Found by:** `no-empty` with `allowEmptyCatch: false`, now an error in the app and in `shared/`.
- **Fix:** each one calls `reportError(where, error)` from `shared/errors.ts`. The crash screen now shows the
  error, every `cause` under it down to the root, and the last errors the app recovered from.

## The recorder's reason was thrown away (step 2, reading the catches)

- **Where:** `mobile/src/lib/scene.ts` `readRecorderMessage`.
- **Wrong:** the video recorder's web page sent `{ type: 'error', message }`, and the app kept only "error".
- **Effect:** "the video failed" with no way to learn why.
- **Found by:** reading every catch while fixing the empty ones. No rule catches this one, because the catch
  was not empty.
- **Fix:** the message carries a `reason`, which is reported. The same reading found more failures that kept
  no reason, among them scheduling the adhan alerts. A failure there meant the adhan silently never rang.

## Comments that justified a shortcut (step 2, noticed for step 4)

- `mobile/src/lib/lazyScreen.ts` and `HomeFeed.tsx` each have a `catch { /* … */ }` whose comment explains why
  the error can be dropped. That is the pattern from the talk: the comment makes the shortcut look reviewed.
  The stricter rule from the review (a catch block holding only a comment counts as empty) flagged both, and
  they now report what failed.

## A comment that was really a setting (step 4, tests)

- **Where:** four test files in `shared/` that start with `// @vitest-environment jsdom`.
- **Wrong:** the first pass removed every comment, and this one is not a note but a switch: it tells Vitest to
  run the file with a browser `localStorage`.
- **Effect:** 22 tests failed with "localStorage is not defined".
- **Found by:** the tests, right after the strip.
- **Fix:** `@vitest-environment` joined the lint directives the rule keeps. Comments that switch a tool on or
  off are code, and they stay.

## Five copies of one timer (step 7)

- **Where:** `ui/Pager.tsx`, `ComparePager.tsx`, `screens/hadithSahih.tsx`, `screens/stories.tsx` and
  `screens/utilities.tsx`.
- **Wrong:** each pager had its own copy of the same 7 lines that wait 150 ms after the last web scroll event
  to find the page that was swiped to. Only the one in `Pager.tsx` cleared the timer when the screen closed.
- **Effect:** on the web, closing one of the other four right after a swipe left a timer that still called the
  page change for a screen that was already gone.
- **Found by:** the timer count for step 7. Copies drift: a fix made in one copy did not reach the other four.
  This is the pattern from the talk: when every screen writes its own effect, every screen gets its own bug.
- **Fix:** one hook, `useWebScrollEnd`, with a test that it does not fire after unmount. Lint now rejects a raw
  `setTimeout` in a screen, so a sixth copy cannot be written.
