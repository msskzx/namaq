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

## The mushaf's ayah menu has no «صفحة الآية» (step 3, feature map)

- **Where:** `mobile/src/components/Reader.tsx`, the menu on a long press in the mushaf.
- **Wrong:** the reader builds its own ayah menu. `AyahMenuHost.tsx`, which every other screen uses, adds
  «صفحة الآية»; the reader's copy never got it.
- **Effect:** the owner could open an ayah's page from every screen except the mushaf, where people read most.
- **Found by:** the owner on his phone. Now the rule "the ayah menu offers «صفحة الآية» wherever it shows"
  (`e2e/featureRules.test.ts`) lists it from the links found in the code.
- **Fix:** listed in `e2e/featureRules.baseline.json`, to be fixed; the list may only shrink.

## A page's search that opened the home search (step 3, feature map)

- **Where:** the tarajim tab, before #1225.
- **Wrong:** its search button called `toTab('/search')`, the home search, instead of searching the page.
- **Effect:** typing a name in التراجم left the tab and showed results from the whole app.
- **Found by:** the owner. Now the rule "a page's search stays on the page" fails on it: putting the call back
  in `screens/tarajim.tsx` fails `e2e/featureRules.test.ts`.
- **Fix:** #1225; the rule keeps it from coming back.

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

## A frame with the old state (step 7, screens)

- **Where:** `screens/quran.tsx` and `screens/search.tsx`, and every screen that read a route param.
- **Wrong:** `useEffect(() => { setOpen(null); }, [query])`. The effect runs after the screen has drawn.
- **Effect:** each new letter typed drew the new results under the old open group for one frame, then drew
  again. The atlas opened from a link (`/atlas?year=5`) drew one frame of its first year before the linked one,
  and `/order?juz=…` and `/people?title=…` did the same when a new link arrived while the screen was open.
- **Found by:** `react-hooks/set-state-in-effect`, frozen in the baseline since step 7.
- **Fix:** `useAdjustOn([query], () => setOpen(null))` sets the state while rendering, so the first frame is
  already right. Only the work React cannot do while rendering (scrolling, clearing the route params) stays
  after the draw, in `useOnChange`.

## Timers that outlived their screen (step 7, screens)

- **Where:** `screens/oaths.tsx` (a retry after a failed scroll and the first scroll), `screens/openings.tsx`,
  `app/(tabs)/(home)/index.tsx` (the refresh spinner), `screens/quiz/solo.tsx`, `screens/tree-sizes.tsx`.
- **Wrong:** `setTimeout` and `requestAnimationFrame` called from a handler or a layout callback, with nothing
  keeping the id.
- **Effect:** leaving the screen in the 50 to 400 ms before the timer fired still ran it: a scroll on a list
  that was gone, a state change on an unmounted screen.
- **Found by:** `no-restricted-globals`, frozen in the baseline since step 7.
- **Fix:** `useLater()`. A screen holds one slot: a new job replaces the waiting one, and the slot is cleared
  when the screen closes.

## A read that failed without a word (step 7, screens)

- **Where:** `screens/ayah.tsx`, al-Kashshaf's text on the ayah page.
- **Wrong:** `void readBook('kashshaf').then(…)` inside an effect, with a hand-written `live` flag.
- **Effect:** a failed read of the downloaded book left the section empty and reported nothing.
- **Found by:** `quality/no-raw-effects`, frozen in the baseline since step 7.
- **Fix:** `useLoaded(kashshafOn ? 'kashshaf' : null, …)`, which keeps the `live` check in one place and sends a
  failure to `reportError`.

## A state change React dropped (step 7, ui)

- **Where:** `ui/Sheet.tsx`, during this step's rewrite.
- **Wrong:** `shown` was set while rendering (`useAdjustOn`), but the same state is also set to `false` when the
  close animation ends, and that update can still be waiting in a slower lane.
- **Effect:** the settings sheet stopped opening. A log showed `shown` true for one draw and false the next: React
  rebased the waiting update and skipped the one made while rendering. Lint, types and 1,600 unit tests passed.
- **Found by:** using the app with `npm run phone`, then narrowing the change down file by file.
- **Fix:** the sheet sets `shown` after the draw again (`useOnChange`), as before the rewrite. `effects.md` now says
  `useAdjustOn` is only for state nothing else sets from a timer, an animation's end, a layout event or a promise.
  `ui/FloatingMenu.tsx` (measured by a layout event) and the tools pages' scroll reach got the same change.

## An effect that only replayed a tap (step 7, components)

- **Where:** `components/CompareCard.tsx`.
- **Wrong:** a double tap bumped a `pop` counter, and an effect watched the counter to start the pop animation.
- **Effect:** one extra draw per tap, and a state that existed only to carry the tap to the effect.
- **Fix:** the tap starts the animation itself; the counter is gone.

## A failed load that never surfaced (step 7, components)

- **Where:** `components/scenes/SeaArt.web.tsx`.
- **Wrong:** Skia for the web was loaded in an effect with no rejection handler.
- **Effect:** if the file failed to load, the sea scene stayed empty with no error anywhere.
- **Fix:** a module-level `lazy()` under `Suspense`, with no effect. A failed load is passed to `reportError` with its
  cause, and the scene draws nothing instead of crashing the screen.

## A hook that the web build could not see (step 7, components)

- **Where:** `lib/adhan.ts`, which has a web twin, `lib/adhan.web.ts`.
- **Wrong:** the new `useAlertsBlocked` hook went into `adhan.ts` only. On web, the bundler picks `adhan.web.ts`, which has
  no such export.
- **Effect:** the tools and adhkar pages crashed on web, and so did their UI tests. Phones were fine, so the review
  missed it, and #1259 merged after a run of only the specs that had failed before.
- **Fix:** the hook moved to `lib/alertsBlocked.ts`, which imports `alertsAllowed` from `./adhan` and so gets the
  right twin on each platform. Run the whole app UI suite after the last change before merging.
