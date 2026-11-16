---
title: "A type import through settings pulled all tree data into the first frame"
summary: "The theme read settings, settings read branchList for one empty value, and branchList loaded trees.json and mutashabih.json, so even a loading screen waited for 12 MB of data."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "A loading screen cannot show before data loads if anything it imports reaches the data, and the import chain that does it is not visible in the file."
approach: "Traced the first frame's import graph with an esbuild metafile (entry app/_layout.tsx, packages external, @/screens and AppShell external): theme -> settings -> branchList -> branchInventory -> trees.json. Moved ListState and EMPTY_LIST to lib/listState.ts; the first frame fell from 12 MB to 0.07 MB. Route files other than home wrap their screen (src/screens/) with lib/lazyScreen.ts, because expo-router reads every route file when the navigators mount; launch fell from 23.3 MB to 15.3 MB of source."
outcome: "solved"
conditions: "Expo 58, expo-router with sync route imports on native, Metro without inline requires (Expo's default). Sizes are source bytes, not device timings."
evidence: "mobile/src/app/_layout.tsx, mobile/src/lib/lazyScreen.ts, mobile/src/lib/listState.ts"
implication: "Keep app/_layout.tsx, lib/theme.ts, lib/settings.ts and components/LoadingScreen.tsx free of data imports, even for one constant. A new screen goes in src/screens/ with a lazyScreen route file, not straight in app/."
date: "2026-11-14"
topics: ["build-tooling"]
---

Metro evaluates a module when it is first required, and an ES import is a require at the top of the module, so one
import of a small constant evaluates everything that constant's file imports. settings.ts needed only the empty
branches-list value, but branchList.ts also builds the tree inventory, so the theme (read by every screen, the loading
screen included) waited for trees.json, mutashabih.json and branchVerdicts.json.

expo-router builds every screen of a navigator when the navigator mounts, which requires every route file, so each
route file's imports load at launch whether or not the screen is opened. The route files now only require their screen
inside a component; AppShell starts `warmScreens` after home is drawn so the first visit to a tab is still quick.

Home's own data (trees, mutashabih, branch verdicts, compare cards, mushaf words) still loads at launch; splitting it
needs the home feed to change how it picks its first cards.

## Tried

- Metro `inlineRequires` → Expo turns it off on purpose because it ignores side effects (the storage setup import and the splash call depend on order); not used.
