# Namaq phone app

The phone app is an Expo (React Native) app in this folder. The website stays in `src/`. Both use the pure logic and data in `../shared/`.

## Layout

- `src/app/` holds the screens (Expo Router). `(tabs)/` has the four phone tabs, the same as the website's bottom bar. The branches (`index.tsx`) and compare (`compare.tsx`) tabs work; the others link to the website.
- `src/components/` holds the app's own views. `BranchTree.tsx` draws a tree with plain views, side or top down, and takes `around` for the surrounding ayat. `TreeCard.tsx` handles pinch zoom and one-finger moves and picks the direction. `MatrixCard.tsx` draws the matrix view. `TreePager.tsx` holds the row of cards, the saved place, the bookmark row and the growth studio. `FilterSheet.tsx` and `BranchSearch.tsx` are the branches tab's filter sheet and search.
- `Studio.tsx` has the growth studio's controls. `VideoSheet.tsx` records a growing tree in a web view (`VideoFrame.tsx`) and shares the video. The recorder page and its drawing code are in `src/lib/scene.ts`.
- `src/components/ComparePager.tsx` holds the surah pairs side by side (a paged list), `CompareCard.tsx` one card with its read-along studio, `CompareSheet.tsx` the pair list as a bottom sheet. The cards come from `shared/data/quran/compareCards.js`, built by the website's `npm run quran:compare-cards`.
- `src/lib/` holds app logic. `branchList.ts` builds the list of trees from the filters, search and saved trees. `growth.ts` and `growPlayer.ts` plan and play the growth. `settings.ts` keeps the tab's switches. The tests next to them run in the website's `npm test`, so files in `src/lib/` import each other with relative paths (`@/` points to the website there).
- `metro.config.js` lets the bundler read `../shared`. Code there imports no packages.
- The folder is `mobile/` and not `app/`, because Next.js would take a root `app/` folder as the website's routes.

## Run

```bash
cd mobile
npm ci
npx expo start        # open in Expo Go on a phone on the same network
npm run typecheck
npx expo export --platform web   # a web build of the app, used to check screens in a browser
```

The phone keeps its state (bookmarks, the open tree and its zoom) in `expo-sqlite/kv-store`. The web build keeps it in localStorage.

## Publish to Expo Go

Needs `EXPO_TOKEN` in the environment. The first time, `npx eas-cli@latest init` links the project and writes its id into `app.json`. Then:

```bash
npx eas-cli@latest update --branch trial --message "..."
```

The command prints a link and QR code that Expo Go opens.
