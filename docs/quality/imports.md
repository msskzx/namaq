# Which code may import which

Owner, 2026-11-28. Lint enforces each rule (`quality/import-boundaries` in `shared/lint/quality.mjs`). The rules
themselves are listed in `shared/lint/importZones.mjs`, which both lint configs read.

| Code in | May not import | Why |
|---|---|---|
| `shared/` (tests excepted) | anything outside `shared/`: no package, no React, no app or website code | the phone app's bundler reads `shared/` as plain files, so one React import there breaks the app build |
| `mobile/` | the website (`src/`) | the website is frozen, and the app must work without it |
| `mobile/src/ui/` | `components/`, `screens/`, `app/`, except the Quran text module (`components/quran/text/`) | a shared button or bar never pulls in a feature or a whole page |
| `mobile/src/` outside `app/` | `screens/` | only a route in `app/` opens a screen. A view two places share goes in `components/`, a helper in `lib/` |

The rule follows relative paths and the `@/` and `@shared/` aliases, in `import`, `export … from`, `import()` and
`require()`.

## What broke the rules on the first day

Imports that broke a rule when it was added are listed in `mobile/eslint-suppressions.json`, which may only
shrink (see docs/quality/effects.md for how). On 2026-11-28 that was:

- `components/HomeFeed.tsx` (5) and `components/QuizLook.tsx` (6): feed and quiz cards draw views that live in
  screen files (`PersonBrief`, `NasabTree`, `OpeningRows`, `Virtues`, `StoryView`, `BattleView` and others).
  Each view moves to `components/` and both places import it from there.
- `ui/TopBar.tsx` (2) and `ui/LoadingScreen.tsx` (1): the logo and the settings sheet are in `components/`.

The four hadith-link helpers (`openBook`, `openKitab`, `openBab`, `openSahih`), `FortyCard` and `Credit` lived
in screen files and were imported by eleven other files. They moved to `lib/ways.ts` and `components/` the same
day.
