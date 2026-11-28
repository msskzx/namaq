# Quality work log

What each quality PR did, what its reviewers caught and what is still open. The dashboard reads these tables,
beside the counts in docs/quality/metrics.md. Each PR adds its row; leave old rows as they are.

## Pull requests

"Review notes" counts the problems a reviewer who did not write the code raised and the author then fixed,
over all review cycles of the PR. Optional notes are not counted.

| pr | date | step | title | status | review_notes | reviews |
|---|---|---|---|---|---|---|
| 1247 | 2026-11-28 | 5 feature map | Every app screen by name and the tap that opens it | merged | 6 | 2 |
| 1248 | 2026-11-28 | 1 lint for the app | Lint for the phone app, and the quality numbers | merged | 3 | 1 |
| 1249 | 2026-11-28 | 3 every-word tests | Every word of the Quran, the Forty, the sira stories and the books, tested | waiting for the owner | 10 | 2 |
| 1250 | 2026-11-28 | 2 errors show their cause | Every caught error keeps its reason; the crash screen shows the root cause | merged | 8 | 1 |
| 1251 | 2026-11-28 | 4 no comments | Comments removed from the app and shared code, new ones banned | merged | 2 | 1 |
| 1252 | 2026-11-28 | 5 feature map | Every link and sheet found in the code, and the owner's navigation rules | merged | 11 | 2 |
| 1253 | 2026-11-28 | 7 no raw effects or timers | No raw useEffect or timers in screens; shared hooks | merged | 5 | 3 |
| 1254 | 2026-11-28 | 5 feature map | Every break of the navigation rules fixed | merged | 1 | 2 |
| 1256 | 2026-11-28 | 8 scripts lint, 9 import rules | Lint scripts/, add import boundaries, and log the quality work | merged | 4 | 2 |
| 1257 | 2026-11-28 | tests | Two e2e breakages fixed: journeys load, party tests ask their own questions | merged | 1 | 1 |

## Bugs found

Bugs a person using the app would meet, found by the quality work. "Found by" names the check that caught it.

| bug | effect | found_by | pr | status |
|---|---|---|---|---|
| Matrix cell hooks after an early return | the comparison matrix crashed when an empty cell filled | lint | 1248 | fixed |
| Adhan scheduling failed silently | the adhan could never ring, with no trace of why | empty-catch rule | 1250 | fixed |
| Saves of bookmarks, notes and storage failed silently | a lost save left no trace | empty-catch rule | 1250 | fixed |
| Video recorder dropped its error reason | a failed recording said nothing about why | reading the catches | 1250 | fixed |
| Crash screen lost the stack when the message was empty | a crash report could show nothing useful | review | 1250 | fixed |
| Four of five swipe timers never stopped | closing a pager right after a swipe still ran its page change | timer count | 1253 | fixed |
| Listen bar «جارٍ التحميل…» at once | the loading note flashed on every ayah (a new hook's mistake, never shipped) | review | 1253 | fixed |
| Mushaf ayah menu without «صفحة الآية» | the mushaf alone could not open an ayah's page | navigation rules | 1254 | fixed |
| Person page with no way back to its hadith | a hadith linked to the person, not the other way | navigation rules | 1254 | fixed |
| 79 links into another tab without its first page | Back from a person or story opened from home left the tab empty | navigation rules | 1254 | fixed |
| Same-hadith link replaced the page | Back skipped the hadith you came from (a fix's mistake, never shipped) | review | 1254 | fixed |
| 12:39 and 12:41 spelled differently in the two Quran copies | an encoding difference; the printed Madina page decides | every-word tests | 1249 | open |
| Muslim 1733 route ٧٠ runs into the next route | two routes show under one number | every-word tests | 1249 | open |

## Still open

| item | why | owner |
|---|---|---|
| Every-word tests (#1249) | waiting for the owner's look before merging | owner |
| Bombadil property tests | on hold (owner, 2026-11-28) | owner |
| 138 useEffect, 40 timers, 166 React Compiler findings | frozen; being removed screen by screen | thread «Remove leftover effects and timers» |
| 11 feed and quiz views kept in screen files | frozen by the import rules; each view moves to components/ | not started |
| Website: 4,443 comment lines, 44 empty catches, 220 useEffect, 61 timers | the website is frozen | after the website returns |
| Two text differences found by the every-word tests | need a named source | data week |
