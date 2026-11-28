# Quality metrics

The numbers each quality step started from and ended at. `npm run quality:count` recounts the code counts
(`-- --lint` adds the app's lint results). Each step appends rows. Leave old rows as they are, so the table
shows how the numbers changed over time.

Counts are of product code: test files are left out. "Comments" excludes lint and TypeScript directives
(`eslint-disable`, `@ts-expect-error`).

| date | step | area | measure | before | after | note |
|---|---|---|---|---|---|---|
| 2026-11-28 | 1 lint for the app | app | files lint checks | 0 | 380 | `mobile/` was excluded from lint and had no config |
| 2026-11-28 | 1 lint for the app | app | lint errors | 177 | 0 | the first run with Expo's defaults |
| 2026-11-28 | 1 lint for the app | app | lint warnings | 181 | 169 | the 169 left are React Compiler rules, step 7 makes them errors |
| 2026-11-28 | 1 lint for the app | app | hooks called after an early return | 2 | 0 | crash when a matrix cell goes from empty to filled |
| 2026-11-28 | 1 lint for the app | app | unused imports and variables | 34 | 0 | |
| 2026-11-28 | 1 lint for the app | app | wrong hook dependency lists | 8 | 0 | 3 fixed, 5 marked intentional with a directive |
| 2026-11-28 | 1 lint for the app | app | lint-off directives | 37 | 32 | 5 no longer needed, removed by `--fix` |
| 2026-11-28 | baseline | app | comment lines | 2702 | | AGENTS.md has said "leave clear code uncommented" since before this count; step 4 bans them by lint |
| 2026-11-28 | baseline | shared | comment lines | 2270 | | |
| 2026-11-28 | baseline | website | comment lines | 2579 | | |
| 2026-11-28 | baseline | scripts | comment lines | 536 | | |
| 2026-11-28 | baseline | app | useEffect calls | 160 | | step 7 |
| 2026-11-28 | baseline | website | useEffect calls | 220 | | |
| 2026-11-28 | baseline | app | setTimeout / setInterval / requestAnimationFrame | 72 | | step 7 |
| 2026-11-28 | baseline | website | setTimeout / setInterval / requestAnimationFrame | 61 | | |
| 2026-11-28 | baseline | app | empty catch blocks | 12 | | step 2 |
| 2026-11-28 | baseline | shared | empty catch blocks | 10 | | step 2 |
| 2026-11-28 | baseline | website | empty catch blocks | 30 | | step 2 |
