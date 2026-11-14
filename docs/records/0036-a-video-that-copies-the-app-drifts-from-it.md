---
title: "A video that redraws the app from its own constants drifts from the app"
summary: "The tree video drew boxes, lines and labels from numbers copied out of BranchTree, so every later change to the app left the video behind; it now takes each label's and line of words' place from the app's own layout."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The phone app records the growing tree on a canvas in a web view (mobile/src/lib/scene.ts), since Expo Go cannot record a native view. The recorder had its own copy of the tree's look: leaf-shaped box corners from before the owner chose round ones, sharp connector corners where BranchTree curves them, a sans-serif 12px label where the app sets Amiri at 12 x 1.12, guessed line and label spacing, fixed places for the chips and card. Each was right once and none followed the app's later changes; the owner saw two different components."
approach: "BranchTree now registers every label (References, the ruled header) and every Words text with a ref (usePart), and measureScene measures them against the tree root and hands them to the video as each box's parts. The recorder draws each part in its measured rect, so line breaks, spacing and alignment come from the app. What a canvas still has to draw itself takes the app's numbers by name: CARD's radius 14 on every corner, the 14-point stub plus half the 2-point line, the 10-point curve at a fan's ends, Text's 1.12 scale for interface sizes, the matrix card's 12/8 padding and 21/44 ayah lines. Lit lines are drawn after plain ones so grey never covers the path. The frame stacks tree, chips and card as TreeCard does, measured once the fonts load."
outcome: "solved"
conditions: "Expo app, canvas recorder in a WebView, 2026-11-14. Recording the real native view would need a dev build with a native encoder."
evidence: "mobile/src/components/BranchTree.tsx usePart and measureScene; mobile/src/lib/scene.ts drawText, strokeEdge, layout; e2e/app/quran.spec.ts 'the tree video draws each box from where the app laid out its labels and words'"
implication: "When a video or image redraws an app screen, feed it the app's measured layout rather than copied numbers, and when you change the look of a tree, card or chip, check the video frame beside the app screen."
date: "2026-11-14"
topics: ["video", "ui-consistency"]
buildsOn: []
---

The owner put the app's studio beside a video frame and named four gaps: the
path, the spacing, the node shapes and the font. All four came from the same
cause: the recorder had its own idea of the tree.

## Tried

- matching each constant by hand (#753) → right on the day, wrong once the app changed
