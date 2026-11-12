# Namaq phone app

The phone app is an Expo (React Native) app in this folder. The website stays in `src/`. Both use the pure logic and data in `../shared/`.

## Layout

- `src/app/` holds the screens (Expo Router). `(tabs)/` has the website's four phone tabs plus the prophets timeline (`prophets.tsx`): branches (`index.tsx`), compare (`compare.tsx`), mushaf (`read.tsx`), prophets and quizzes (`quizzes.tsx`).
- `src/app/quiz/` holds the quizzes: `solo.tsx` (setup), `play.tsx` (a solo quiz, built on the device from the bundled trees and kept in storage until it ends) and `party/` (start or join, then the room). The quizzes tab opens them.
- `src/components/` holds the app's own views. `BranchTree.tsx` draws a tree with plain views, side or top down, and takes `around` for the surrounding ayat. `TreeCard.tsx` handles pinch zoom and one-finger moves and picks the direction. `MatrixCard.tsx` draws the matrix view. `TreePager.tsx` holds the row of cards, the saved place, the bookmark row and the growth studio. `FilterSheet.tsx` and `BranchSearch.tsx` are the branches tab's filter sheet and search.
- `Studio.tsx` has the growth studio's controls. `VideoSheet.tsx` records a growing tree in a web view (`VideoFrame.tsx`) and shares the video. The recorder page and its drawing code are in `src/lib/scene.ts`.
- `src/components/ComparePager.tsx` holds the surah pairs side by side (a paged list), `CompareCard.tsx` one card with its read-along studio, `CompareSheet.tsx` the pair list as a bottom sheet. The cards come from `shared/data/quran/compareCards.js`, built by the website's `npm run quran:compare-cards`.
- `src/components/Reader.tsx` is the mushaf tab: `ReaderPager.tsx` swipes the 604 pages, `MushafPageView.tsx` draws one page and fits its lines (measured once per page at a base size), `ReaderSheets.tsx` has the index/search sheet and the touch settings. The pages come from `shared/data/quran/mushaf/` through `require.context` in `src/lib/mushaf.ts`; recite steps for one page are in `src/lib/recitePage.ts`.
- `src/components/ProphetStory.tsx` is the website's prophets story page (`/quran/prophets/[slug]`): the story map (`StoryMap.tsx`: events by group, surahs by row), a sheet for a tapped dot, and the event's places one under another (`EventPlaces.tsx`). The intro is in the help sheet. The ayat come from the bundled Quran (`src/lib/prophets.ts`), the stories from `shared/quran/prophets`. It is the prophets tab (`(tabs)/prophets.tsx`, Musa) and `/prophets/[slug]` for links.
- `TabBar.tsx` is the bottom tab bar. Pages that scroll up and down pass `useShrinkOnScroll()` (`src/lib/chrome.ts`) as their `onScroll`, and the bar gets a little smaller while they scroll down (rules in `src/lib/scrollShrink.ts`). `TopBar.tsx` shows the settings gear only when given `settings` (the homepage), and with `hideOnScroll` slides away at the same moment.
- `src/lib/` holds app logic. `branchList.ts` builds the list of trees from the filters, search and saved trees. `growth.ts` and `growPlayer.ts` plan and play the growth. `settings.ts` keeps the tab's switches. The tests next to them run in the website's `npm test`, or only the app's and shared tests with `npm test` here (about 30 s), so files in `src/lib/` import each other with relative paths (`@/` points to the website there).
- `metro.config.js` lets the bundler read `../shared`. Code there imports no packages.
- The folder is `mobile/` and not `app/`, because Next.js would take a root `app/` folder as the website's routes.

## Tree sizes

A tree opens sideways or top down, whichever fits the screen bigger. The app reads each tree's size both ways from `src/lib/treeSizes.json`, so it never has to draw a tree twice before showing it. A tree a filter cuts down is shown sideways at once, measured both ways out of sight, and its size kept on the phone. After changing how trees are drawn or which trees exist, run `npm run tree-sizes` (needs Playwright); a test fails when a tree has no size.

## Run

```bash
cd mobile
npm ci
npx expo start        # open in Expo Go on a phone on the same network
npm run typecheck
npx expo export --platform web   # a web build of the app, used to check screens in a browser
```

The party quiz talks to the same Cloudflare worker as the website, `https://namaq.msskzx.workers.dev`. Its address is the EAS environment variable `EXPO_PUBLIC_PARTY_URL`, set in the **production** environment on expo.dev, so builds and updates must use `--environment production`. Without it the app looks for a local worker on `http://localhost:8787` (`npm run dev` in `party/`).

The phone keeps its state (bookmarks, the open tree and its zoom) in `expo-sqlite/kv-store`. The web build keeps it in localStorage.

## Publish to Expo Go

Needs `EXPO_TOKEN` in the environment. The first time, `npx eas-cli@latest init` links the project and writes its id into `app.json`. Then:

```bash
npx eas-cli@latest update --branch trial --environment production --message "..."
```

The command prints a link and QR code that Expo Go opens.
