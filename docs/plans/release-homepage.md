# Release homepage

The default `/` route is the returning-user homepage. The first-visit welcome experience will be designed separately.

## Acceptance criteria

- The existing navigation logo and other home links open the new page at `/`, without a preview parameter.
- Reuse the top bar, bottom navigation and desktop rail. Search sits in the phone top bar and is centered on desktop.
- One Quran widget offers Surah and Juz selection through the shared Segmented control. Search the list, select a section, then open the reader at its first ayah or open branches filtered to that section.
- Bookmarks follow the Quran widget, then solo and party quiz entry points. Wider bookmark cards show surah names and ayah numbers above a rule, followed by the saved text. Omit type labels, action labels and icons inside cards.
- Preserve existing browser bookmarks and their links. Respect saved juz ranges and selected occurrences in reference headers. An unknown bookmark still opens its saved link and shows its text.
- Support Arabic and English controls, Arabic content, both writing directions and both themes. Show no scores, progress, streaks or aggregate statistics.
- Keep first-visit onboarding, the example exploration section, daily content and login outside this change.

## Implementation and validation

The page entry point loads `src/lib/homepageData.ts`. Homepage presentation lives in `src/components/homepage/`, with section destinations and bookmark reference logic in `src/lib/`.

Replace tests of the previous homepage's example tree with coverage of the new homepage order, saved-card references, empty state and reactive bookmark updates. Retain the existing independent tree, intro and shared navigation tests. Run lint, TypeScript, the full Vitest suite and the production build. Use Playwright to verify `/`, home navigation from branches and the reader, scoped destinations, phone and desktop layouts, and both themes. Complete the independent review before opening a PR against main.
