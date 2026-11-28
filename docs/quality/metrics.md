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
