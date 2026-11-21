# UI tests

## Using the app

Before merging a change to the phone app, use the feature you changed the way a person would. `npm run phone` runs the app's own React Native code, built for the web, in a dark browser the size of the owner's iPhone 17 Pro Max, with the tour and the interests question already done.

```bash
npm run phone -- start             # builds the app (about a minute) and opens the home screen
npm run phone -- tap الاختبارات      # one step; prints the screenshot's path and everything on screen that can be tapped
npm run phone -- press ٱلۡحَمۡدُ          # a long press, as on a word in the reader
npm run phone -- open /read        # go to a route
npm run phone -- save reader-menu  # keep the steps since start as e2e/journeys/reader-menu.json
npm run phone -- stop
```

The other steps are `type`, `swipe up|down|left|right`, `back`, `wait <name>` and `look`; `npm run phone` alone lists them. After each step, open the screenshot (`e2e/look/NN-step.png`) and decide the next tap from what you see, as a person would. A step that cannot be done prints `STUCK`, and an error the page raised prints under `ERRORS`. `start --reuse` skips the build when `mobile/dist-phone` already holds this branch's code.

Save a walk when it covers a flow worth keeping. `npm run phone -- run <name>...` walks saved journeys again from the start, and `npm run test:ui` walks every one of them (`app/journeys.spec.ts`), failing when a step can no longer be done or the page errs. A journey checks that the walk still works; to check a result (a stored value, a number shown), write a spec below.

The web build does not show native gestures, haptics, the native fonts' exact shaping, audio, notifications or the share sheet. The owner checks those in Expo Go, so name them in the PR when your change touches them.

## The test suite

Playwright clicks through the main flows of the phone app (its web export at iPhone 17 Pro Max size, 440×956) and the website. Run it before merging a change to the app or to the pages below:

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
- `app/hadith.spec.ts`: the Forty list, a hadith with its chain drawn and its whole text, the Jibril pages from no. 2, the library and the tab bar.
- `app/quizzes.spec.ts`: the quizzes tab, a solo quiz (right, wrong and shown answers, reload, result) with seeded random questions, and recite mode.
- `app/party.spec.ts`: a host and a guest play a whole party quiz against `app/partyServer.ts`, which runs the worker's rules from `shared/party/rules.ts` in the test.
- `app/utilities.spec.ts`: prayer times for a picked city, the qibla and the Hijri month.
- `app/journeys.spec.ts`: every walk saved in `journeys/` with `npm run phone -- save`.
- `web/pages.spec.ts`: the same areas on the website, a smoke test per page.

Every test fails on an uncaught page error or a console error (`errors` in each `fixtures.ts`).

## Writing a test

- Find elements by role and accessible name (`accessibilityLabel` in the app), not by Quran text typed by hand. The mushaf data writes words with marks in an order that rarely matches typed text; copy a word from `shared/data/quran/mushaf/<page>.json` if you need one.
- Check what the app stored (`stored()`, `readerPage()` in `app/fixtures.ts`) when the screen has no clear label for the result.
- Wait for something the new state shows, not a fixed time (a long press holds for a set time, which is fine). The tour, for one, turns a step only when its slide ends, so a second tap during the slide is lost.
