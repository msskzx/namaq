# Quality metrics

The numbers each quality step started from and ended at. `npm run quality:count` recounts the code counts
(`-- --lint` adds the app's lint results). Each step appends rows. Leave old rows as they are, so the table
shows how the numbers changed over time.

Counts are of product code: test files are left out. "Empty catch blocks" counts both `catch {}` and `.catch(() => {})`. "Comments" excludes lint and TypeScript directives
(`eslint-disable`, `@ts-expect-error`). Across all four parts that is 13,461 comment lines in 8,656 comments.

| date | step | area | measure | before | after | note |
|---|---|---|---|---|---|---|
| 2026-11-28 | 1 lint for the app | app | files lint checks | 0 | 414 | `mobile/` was excluded from lint and had no config (test files included) |
| 2026-11-28 | 1 lint for the app | app | lint errors | 177 | 0 | the first run with Expo's defaults |
| 2026-11-28 | 1 lint for the app | app | lint warnings | 181 | 169 | 168 are React Compiler rules (step 7 makes them errors), 1 is a redeclared `Send` |
| 2026-11-28 | 1 lint for the app | app | hooks called after an early return | 2 | 0 | crash when a matrix cell goes from empty to filled |
| 2026-11-28 | 1 lint for the app | app | unused imports and variables | 34 | 0 | |
| 2026-11-28 | 1 lint for the app | app | wrong hook dependency lists | 8 | 0 | 3 fixed, 5 marked intentional with a directive |
| 2026-11-28 | 1 lint for the app | app | lint-off directives | 76 | 72 | 9 no longer needed and removed; 5 added where a dependency list is left short on purpose |
| 2026-11-28 | baseline | app | comment lines | 4477 | | AGENTS.md has said "leave clear code uncommented" since before this count; step 4 bans them by lint |
| 2026-11-28 | baseline | shared | comment lines | 3511 | | |
| 2026-11-28 | baseline | website | comment lines | 4443 | | |
| 2026-11-28 | baseline | scripts | comment lines | 1030 | | |
| 2026-11-28 | baseline | app | useEffect calls | 160 | | step 7 |
| 2026-11-28 | baseline | website | useEffect calls | 220 | | |
| 2026-11-28 | baseline | app | setTimeout / setInterval / requestAnimationFrame | 72 | | step 7 |
| 2026-11-28 | baseline | website | setTimeout / setInterval / requestAnimationFrame | 61 | | |
| 2026-11-28 | baseline | app | empty catch blocks | 21 | | step 2 |
| 2026-11-28 | baseline | shared | empty catch blocks | 10 | | step 2 |
| 2026-11-28 | baseline | website | empty catch blocks | 44 | | step 2 |
| 2026-11-28 | 2 errors show their cause | app | empty catch blocks | 21 | 0 | one was inside the video recorder's web page script, which lint does not read; it now sends a warning |
| 2026-11-28 | 2 errors show their cause | shared | empty catch blocks | 10 | 0 | |
| 2026-11-28 | 2 errors show their cause | app + shared | failures that dropped their reason | 14 | 0 | a refused storage save, adhan scheduling and permission, book download and open, party questions, location, audio download (each ayah and the pack), video font, share and recording, home card warm-up, screen preload |
| 2026-11-28 | 2 errors show their cause | app + shared | catches that recover without the error (judged expected) | 26 | 23 | parsing a saved value or a URL, reading storage; a failure here is an expected answer, not an error |
| 2026-11-28 | 2 errors show their cause | website | empty catch blocks | 44 | 44 | the website is paused; its turn comes when it returns |
| 2026-11-28 | 3 feature map | app | screens with a name on the map | 0 | 52 | every route file in `mobile/src/app`; a new one fails the test until it is named (#1247) |
| 2026-11-28 | 3 feature map | app | screens reachable from the tab bar | | 51 | all but `tree-sizes`, a developer tool |
| 2026-11-28 | 3 feature map | app | ways into a screen on the map | 59 | 339 | first written by hand; now every place in the code that opens a screen, 563 screen-to-screen pairs |
| 2026-11-28 | 3 feature map | app | sheets and menus found | 0 | 62 | 27 kinds |
| 2026-11-28 | 3 feature map | app | screens whose ayah menu has no «صفحة الآية» | 1 | | the mushaf; rule agreed by the owner |
| 2026-11-28 | 3 feature map | app | page searches that leave their page | 0 | | the tarajim search did before #1225; now a test fails if one does |
| 2026-11-28 | 3 feature map | app | single-thing pages linked one way only | 1 | | hadith → person (a long press on an ayah counts as a way to its page) |
| 2026-11-28 | 3 feature map | app | links into another tab without its first page under it | 79 | | `router.push` or `router.navigate` instead of `toTab`, mostly home feed and quiz cards into the tarajim tab |
| 2026-11-28 | 4 no comments | app | comment lines | 4477 | 20 | the 20 left are "see docs/… / see R00xx" pointers and `@vitest-environment` lines |
| 2026-11-28 | 4 no comments | shared | comment lines | 3511 | 62 | pointers, plus the header of each generated `.d.ts` data file |
| 2026-11-28 | 4 no comments | app + shared | comments turned into a doc or record pointer | 0 | 87 | a removed comment that named docs/… or R00xx kept only that name |
| 2026-11-28 | 4 no comments | website | comment lines | 4443 | 4443 | the website is paused; the rule reaches it when it returns |
| 2026-11-28 | 3 feature map, fixed | app | screens whose ayah menu has no «صفحة الآية» | 1 | 0 | the mushaf's long-press menu now offers it |
| 2026-11-28 | 3 feature map, fixed | app | single-thing pages linked one way only | 1 | 0 | a person's Sahih saying now opens its hadith page |
| 2026-11-28 | 3 feature map, fixed | app | links into another tab without its first page under it | 79 | 0 | `router.push` changed to `toTab` in the helpers and cards that open a page in another tab |
| 2026-11-28 | 7 no raw effects or timers | app (outside lib/) | useEffect calls | 145 | 138 | the 7 removed were a search waiting for typing to stop (3), a clock, a delayed warm-up, a loading flag and a timer cleanup; the 138 left are frozen in eslint-suppressions.json |
| 2026-11-28 | 7 no raw effects or timers | app (outside lib/) | setTimeout / setInterval / requestAnimationFrame | 51 | 40 | 5 copies of the same web scroll timer, 3 search delays, a clock, a delayed warm-up, a loading flag; the app clock in lib/prayer.ts moved to a hook too but lib/ is not counted here |
| 2026-11-28 | 7 no raw effects or timers | app | copies of the web scroll timer without cleanup on unmount | 4 | 0 | the compare pager, the hadith pager, the stories pages and the tools pages; the 40 frozen timers were not checked for this |
| 2026-11-28 | 7 no raw effects or timers | app | shared hooks replacing copies | 0 | 5 | useDebounced, useNow, useAfter, useDelayedFlag, useWebScrollEnd, with tests |
| 2026-11-28 | 7 no raw effects or timers | app | React Compiler findings | 168 | 166 | now errors; the 166 left are frozen in eslint-suppressions.json (set-state-in-effect 54, immutability 53, refs 50, preserve-manual-memoization 7, purity 1, use-memo 1) |
| 2026-11-28 | 7 no raw effects or timers | app | lint warnings | 169 | 0 | the compiler rules became errors and a type that shared its name with an icon (`Send`) was renamed |
| 2026-11-28 | 7 no raw effects or timers | app | files on the shrink-only list | 0 | 89 | |
| 2026-11-28 | 7, screens | app screens and routes | useEffect calls | 28 | 0 | `screens/` and `app/`; route params now go through `useAdjustOn` (state) and `useOnChange` (scroll, clearing the params) |
| 2026-11-28 | 7, screens | app screens and routes | setTimeout / requestAnimationFrame | 13 | 0 | moved to `useLater` |
| 2026-11-28 | 7, screens | app screens and routes | timers never cleared when the screen closed | 6 | 0 | the oaths retry and first scroll, the openings scroll, the home refresh spinner, the solo quiz build, the tree-size batches |
| 2026-11-28 | 7, screens | app | effects on the shrink-only list | 138 | 110 | |
| 2026-11-28 | 7, screens | app | timers on the shrink-only list | 40 | 27 | |
| 2026-11-28 | 7, screens | app | React Compiler findings | 166 | 151 | 15 set-state-in-effect went with the effects |
| 2026-11-28 | 7, screens | app | shared hooks | 5 | 9 | useAdjustOn, useOnChange, useLoaded, useLater, with tests |
| 2026-11-28 | 8 scripts lint | scripts | comment lines | 1030 | 54 | 740 comments removed; the 54 lines left are "see docs/… / R00xx" pointers. `npm run lint` now checks `scripts/` |
| 2026-11-28 | 8 scripts lint | scripts | empty catch blocks | 1 | 0 | a download-size retry that dropped every error; it now keeps the last one as the cause |
| 2026-11-28 | 8 scripts lint | scripts | lint errors | 8 | 0 | 5 unused (cleared by allowing `_` names and unused caught errors, as the app does), 1 empty catch (counted twice), 1 expression used as a statement |
| 2026-11-28 | 9 import rules | app | imports of a screen from outside app/ | 22 | 11 | 11 hadith-link and view imports fixed by moving 4 helpers to lib/ways.ts and 2 views to components/; the 11 left are feed and quiz views |
| 2026-11-28 | 9 import rules | app | ui/ imports of features or pages | 3 | 3 | the logo and the settings sheet; frozen |
| 2026-11-28 | 9 import rules | shared | imports from outside shared/ | 0 | 0 | the rule now guards it; it was a written rule only |
| 2026-11-28 | 9 import rules | app | imports of the website's code | 0 | 0 | the rule now guards it |
| 2026-11-28 | 7, ui and small components | app ui/ | useEffect / useLayoutEffect calls | 19 | 0 | animations, scrolls and the card's lifted row and source line |
| 2026-11-28 | 7, ui and small components | app components (12 files) | useEffect calls / timers | 11 / 2 | 0 / 0 | the reminder checks, two book reads, the Skia load on web, the video frame's listener, two handler timers |
| 2026-11-28 | 7, ui and small components | app | effects on the shrink-only list | 110 | 80 | |
| 2026-11-28 | 7, ui and small components | app | timers on the shrink-only list | 27 | 25 | |
| 2026-11-28 | 7, ui and small components | app | React Compiler findings | 151 | 143 | 8 set-state-in-effect went with the effects |
| 2026-11-28 | 7, ui and small components | app | shared hooks | 9 | 12 | useOnLeave, useWindowEvent, useLiftInto |
| 2026-11-28 | 7, ui and small components | app | effects replaced by the event handler itself | 0 | 1 | the compare card's double-tap pop animates in the tap, with no state in between |
| 2026-11-28 | 7, components batch 3a | app components (20 files) | useEffect / useLayoutEffect calls / timers | 32 / 11 | 0 / 0 | compare, reader, notes, quiz tree, scenes, tour, share pages, recite |
| 2026-11-28 | 7, components batch 3a | app | effects on the shrink-only list | 80 | 48 | |
| 2026-11-28 | 7, components batch 3a | app | timers on the shrink-only list | 25 | 14 | |
| 2026-11-28 | 7, components batch 3a | app | React Compiler findings | 143 | 132 | 10 set-state-in-effect and 1 refs went with the effects |
| 2026-11-28 | 7, components batch 3a | app | shared hooks | 12 | 13 | useBeforePaint, for the reader's page offset and zoom |
| 2026-11-28 | 7, components batch 3b | app components (8 files) | useEffect / useLayoutEffect calls / timers | 48 / 14 | 0 / 0 | the home feed, tree pager, reader, app shell, matrix card, share sheet, tools page, read-along |
| 2026-11-28 | 7, components batch 3b | app | effects on the shrink-only list | 48 | 0 | |
| 2026-11-28 | 7, components batch 3b | app | timers on the shrink-only list | 14 | 0 | the feed's idle warm-up moved to `lib/idle.ts`, the prayer card's clock to `useNow` and `useForeground` |
| 2026-11-28 | 7, components batch 3b | app | React Compiler findings | 132 | 117 | 15 set-state-in-effect went with the effects; the 6 left are in lib/ |
| 2026-11-28 | 7, components batch 3b | app | shared hooks | 13 | 15 | useWhileOpen (start on open, stop on close, restart on change), useLatestRun (drop a late answer) |
| 2026-11-28 | 7, lib leftovers | app lib/ (6 files) | React Compiler set-state-in-effect findings | 6 | 0 | the keyboard height and compass heading reset in the effect's cleanup; the party's offline status and a closed keyboard are derived; the reader books and Sahih texts load through `useLoaded`; the write boxes reset through `useAdjustOn` |
| 2026-11-28 | 7, final | app | effects / timers / set-state-in-effect on the shrink-only list | 138 / 40 / 31 | 0 / 0 / 0 | step 7 is finished; the list holds only the compiler's refs, immutability, memoization and purity findings and the import rules |
| 2026-11-28 | 7, final | app | React Compiler findings | 166 | 111 | |
