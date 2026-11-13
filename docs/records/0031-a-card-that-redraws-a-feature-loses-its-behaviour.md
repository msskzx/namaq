---
title: "A card that redraws a feature loses everything the feature does"
summary: "The home feed's tree, recall and pair cards were drawn again from the data, so none of them zoomed, took typing or opened where it should; rebuilt as wrappers around the real components."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A new page (the feed-style home, #703) showed existing features as cards and drew each one again: the tree with BranchTree inside a ScrollView with pointer events off, the recall ayah as empty frames, the pair as two plain ayat. Each copy looked right in a screenshot and did nothing the real feature does."
approach: "Each card now renders the component its page uses. App: the tree card is TreePager (an `embedded` mode that keeps no branches place, has no studio, and lets an unzoomed tree pass vertical drags to the page via TreeCard `inScroll`); the recall card uses the mushaf's WriteBox and Veil with the write logic moved out of Reader into useWriteBoxes (shared/quran/writeAyah.ts typeInBox, gradeWritten); the pair card is CompareCard with an `onOpen` button. Website: BranchTree with zoom and a `steppable.onStep` callback, the read page's WriteBox and a useWriteBoxes hook moved out of ReaderView, the compare page's Card with a `page` prop. The branches tab's endless loading came from change() setting the same list object again, so the list effect also depends on `start`."
outcome: "solved"
conditions: "Expo app (RN gesture handler pan inside a vertical ScrollView) and Next.js site, 2026-11-13. Owner report: the tree card drew wrong, could not switch, zoom or scroll, and opened an endless spinner; the recall boxes took no input."
evidence: "mobile/src/components/HomeFeed.tsx, mobile/src/lib/useWriteBoxes.tsx, src/components/homepage/HomeFeed.tsx, src/app/quran/read/useWriteBoxes.tsx; e2e/app/home.spec.ts and e2e/web/pages.spec.ts tests per card"
implication: "A card, preview or widget that shows an existing feature renders that feature's component, adding props for the new place (embedded, onOpen, page) instead of drawing it again. Before building one, find the component the feature's own page uses. Each such card gets a UI test that uses it (zoom or swipe, typing, the tap that opens its page), not a screenshot."
date: "2026-11-13"
topics: ["ui-state", "graph-ui"]
buildsOn: ["namaq/0018-a-test-against-the-shared-list-misses-a-menu-that-keeps-its-own"]
---

The home feed was built as a social-style page with its own post cards. Each post
took the feature's data and drew it again: the tree card put `BranchTree` in a
sideways `ScrollView`, wrapped it in a `Pressable` and turned its pointer events
off, so it could not zoom, pan, light a path or switch trees, and the press
fought the page's scroll. The recall card drew a frame per hidden word with no
field behind it. The pair card drew both ayat as text. All three passed review
and screenshots, because a screenshot only shows how a card looks, not what it
does.

The fix was to delete the copies and render the real components. Each component
needed a small prop for its new place. The branches pager must not overwrite the
tab's saved place or claim its studio, and on the home page an unzoomed tree
must leave vertical drags to the page. The reader's write mode kept its typing
rules inline, so they moved into a hook that the reader and the card both call.

Opening a tree also hit a separate bug. `change()` on the branches tab blanks
the list and then sets the list again. When the new list was the same object
(the shared empty list), the effect that rebuilds the trees did not run, and the
tab showed the spinner forever. Anything that opened a tree into the default
list could hit it.

## Tried

- Fix each card's symptom (a pan here, an input there) → stopped by the owner: every symptom came from the cards being copies.
