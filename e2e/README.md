# UI tests

Playwright clicks through the main flows of the phone app (its web export at 390×844) and the website. Run it before merging a change to the app or to the pages below:

```bash
npm run test:ui                # both halves, about 2.5 minutes in a cloud container
E2E_ONLY=app npm run test:ui   # the app only
E2E_ONLY=web npm run test:ui   # the website only
```

The command builds a fresh web export of the app into `mobile/dist-e2e` and starts `next dev` on port 3100. `E2E_REUSE=1` reuses servers already on ports 8082 and 3100 instead of exporting and starting again, which helps while writing a test; make sure they serve the current branch. A failing test leaves a screenshot in `e2e/test-results/`.

On a new machine, Playwright needs its browser once: `npx playwright install chromium`. Cloud containers already have it.

## The database

The website's home, branches, reader and compare pages read surahs from PostgreSQL. With `.env` (the Mac) they use the preview database. A cloud container has no `.env`, so those tests skip unless you start a local database first:

```bash
./e2e/cloud-db.sh   # as root in a throwaway container: starts Postgres (password postgres), loads the surahs and ayat, prints two exports
export DATABASE_URL=... DATABASE_URL_UNPOOLED=...
```

## What each file covers

- `app/tour.spec.ts`: the first-launch tour step by step, and skip.
- `app/home.spec.ts`: the story circles, the reading card and date, the search, settings, and for a returning user the forgotten card, a saved ayah's menu and the notes list.
- `app/mushaf.spec.ts`: the index, the long-press menu (save, forgotten, note), the trees and compare preview sheets, a word's places, and the write quiz.
- `app/quran.spec.ts`: the Quran hub, branches (tree and matrix, save, search), compare, a prophet story dot, and the words page.
- `app/quizzes.spec.ts`: the quizzes tab, a solo quiz (right, wrong and shown answers, reload, result) with seeded random questions, and recite mode.
- `app/party.spec.ts`: a host and a guest play a whole party quiz against `app/partyServer.ts`, which runs the worker's rules from `shared/party/rules.ts` in the test.
- `app/utilities.spec.ts`: prayer times for a picked city, the qibla and the Hijri month.
- `web/pages.spec.ts`: the same areas on the website, a smoke test per page.

Every test fails on an uncaught page error or a console error (`errors` in each `fixtures.ts`).

## Writing a test

- Find elements by role and accessible name (`accessibilityLabel` in the app), not by Quran text typed by hand. The mushaf data writes words with marks in an order that rarely matches typed text; copy a word from `shared/data/quran/mushaf/<page>.json` if you need one.
- Check what the app stored (`stored()`, `readerPage()` in `app/fixtures.ts`) when the screen has no clear label for the result.
- Wait for something the new state shows, not a fixed time (a long press holds for a set time, which is fine). The tour, for one, turns a step only when its slide ends, so a second tap during the slide is lost.
