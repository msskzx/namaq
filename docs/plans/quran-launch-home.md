# Quran launch homepage

Focus the public entry points on learning through Quran branches, reading and quizzes. Keep all existing routes available directly and list them at an unlisted `/experiments` directory. Comparison stays available within branches rather than becoming a promoted standalone tool.

## Acceptance criteria

- The bilingual homepage introduces visual Quran learning, shows a real branch example, and links to branches, the reader, solo branch quizzes and existing party quizzes. It promotes no biographies, hadith, graph, standalone comparison or experiments links.
- Desktop and phone navigation expose only branches, reader, solo quizzes and party quizzes. The desktop footer uses the same destinations and retains necessary privacy information. Phones show no footer.
- The existing scholarly-review disclaimer appears as a dismissible homepage toast, once per session, for about five seconds. Storage failure must not break the page. It waits for the selected language to load.
- `/experiments` lists existing destinations grouped and ordered like the previous navbar. It includes a bilingual experimental notice, has noindex metadata, and is absent from public navigation and sitemap.
- Existing routes and quiz implementations remain intact. Next-ayah questions and deeper branches/quiz interaction work belong to later PRs.

## Affected paths and validation

Homepage components, homepage data loader and route; navbar/navigation data; footer; disclaimer; experiments route; colocated tests. Retain useful preview tests for experimental components. Replace obsolete seven-feature homepage and all-features navigation assertions with launch-route, bilingual, interaction and session behavior coverage.

Run lint, TypeScript, the full test suite and production build. Inspect actual rendered desktop and phone layouts. Run an independent review before opening the PR, with one additional cycle only if defects require changes.

## Prior records

Searched local Distillate Namaq records for homepage, navigation, toast and session issues. No applicable records found.

## Verification and review

Lint, TypeScript, all 283 test files with 3,287 tests, and the production build pass. The homepage no longer loads biography quiz or hadith data; random examples fetch Quran surah names through the existing database.

Checked the production UI at desktop and 390px phone widths, including Arabic, English, light and dark themes, phone navigation, no phone footer and the loaded verse-context dialog.

The owner approved removing the hero, showing the complete six-ayah tree with all controls, four matching learning cards, smaller navigation controls, and a Quran-only site description. The homepage viewport has a fixed responsive height, fit and manual zoom, a surrounding-ayat switch, and a random-tree action with animation and retry handling. Previous ayat appear only on request. Experiments use grouped columns and reader juz headings use the shared accent.

Rebased onto main's overlapping-tree and ayah-boundary fixes. The only conflict joined independently added tests, both retained. A fresh independent review of the approved refinements and integration found no defects.

The independent reviewer found that the bottom cookie banner could obscure the first-visit disclaimer. Moved the disclaimer below the navbar. The second and final review found no further defects. Obsolete seven-feature homepage and shelf tests were replaced with launch destinations and path interaction tests; disclaimer tests cover both languages, Strict Mode, dismissal, revisits, language readiness and unavailable storage. Existing experimental preview component tests remain.

Follow-up browser testing reproduced an unkeyed server-created sidebar warning on the branches page and a footer hydration mismatch with a saved English preference. The sidebar now has the same stable slot key used by the comparison page. The footer renders Arabic until language readiness, matching its server output. Added regressions for both contracts, confirmed that they fail before the fixes, and confirmed a fresh development page load produces neither console error.
