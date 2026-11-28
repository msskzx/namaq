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
<<<<<<< HEAD
| 2026-11-28 | 3 feature map, fixed | app | screens whose ayah menu has no «صفحة الآية» | 1 | 0 | the mushaf's long-press menu now offers it |
| 2026-11-28 | 3 feature map, fixed | app | single-thing pages linked one way only | 1 | 0 | a person's Sahih saying now opens its hadith page |
| 2026-11-28 | 3 feature map, fixed | app | links into another tab without its first page under it | 79 | 0 | `router.push` changed to `toTab` in the helpers and cards that open a page in another tab |
=======
| 2026-11-28 | 7 no raw effects or timers | app (outside lib/) | useEffect calls | 145 | 138 | the 7 removed were a search waiting for typing to stop (3), a clock, a delayed warm-up, a loading flag and a timer cleanup; the 138 left are frozen in eslint-suppressions.json |
| 2026-11-28 | 7 no raw effects or timers | app (outside lib/) | setTimeout / setInterval / requestAnimationFrame | 51 | 40 | 5 copies of the same web scroll timer, 3 search delays, a clock, a delayed warm-up, a loading flag; the app clock in lib/prayer.ts moved to a hook too but lib/ is not counted here |
| 2026-11-28 | 7 no raw effects or timers | app | copies of the web scroll timer without cleanup on unmount | 4 | 0 | the compare pager, the hadith pager, the stories pages and the tools pages; the 40 frozen timers were not checked for this |
| 2026-11-28 | 7 no raw effects or timers | app | shared hooks replacing copies | 0 | 5 | useDebounced, useNow, useAfter, useDelayedFlag, useWebScrollEnd, with tests |
| 2026-11-28 | 7 no raw effects or timers | app | React Compiler findings | 168 | 166 | now errors; the 166 left are frozen in eslint-suppressions.json (set-state-in-effect 54, immutability 53, refs 50, preserve-manual-memoization 7, purity 1, use-memo 1) |
| 2026-11-28 | 7 no raw effects or timers | app | lint warnings | 169 | 0 | the compiler rules became errors and a type that shared its name with an icon (`Send`) was renamed |
| 2026-11-28 | 7 no raw effects or timers | app | files on the shrink-only list | 0 | 89 | |
>>>>>>> origin/main
