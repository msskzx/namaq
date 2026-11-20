---
title: "An animated style runs again only for the shared values in its own closure"
summary: "A floating bar's style read its place through a helper worklet, so it never re-ran while dragged and the bar jumped on release."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "The reader's floating recite bar stayed put under a dragging finger and jumped to the drop point only when the finger lifted, on the phone and on the web export alike."
approach: "Read every shared value the style depends on directly inside useAnimatedStyle (cx.value, cy.value, w.value, h.value) and pass them to the clamp, instead of calling a helper worklet that reads them. The drag also follows the finger's absolute position (absoluteX/Y against where it touched), not translationX/Y."
outcome: "solved"
conditions: "react-native-reanimated 4.7, react-native-worklets 0.13, Expo SDK 58. The helper `box()` was a 'worklet' arrow function in the component holding cx and cy."
evidence: "mobile/src/ui/FloatingBar.tsx; e2e/app/mushaf.spec.ts checks the bar's place before the finger lifts."
implication: "In useAnimatedStyle and useDerivedValue, read each shared value in the callback itself. A shared value reached only through another worklet's closure is not a dependency, so the style is computed once and again only when React renders."
date: "2026-11-20"
topics: ["mobile","ui-state"]
---

#1015 moved the bar with a transform instead of top and left, so it would be drawn on the UI thread every frame. It still jumped. The style called `box()`, a worklet that read `cx.value` and `cy.value`. Reanimated finds a style's inputs in the callback's own closure; it does not look inside another worklet's closure, so the style had no inputs and ran only when React rendered the bar again, which the store write on release caused.

The web export showed the same thing with a touch drag in Playwright, so the bug could be reproduced without a phone. The earlier test only checked where the bar was after the finger lifted, which is why it passed.

## Tried

- transform instead of top and left (#1015) → the bar still jumped on release, because the style never re-ran mid-drag
- reading the shared values in the style itself → the bar follows the finger
