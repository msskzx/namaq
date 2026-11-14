---
title: "A box hidden by opacity still holds its place, and lines drawn from layout reach it"
summary: "The app's growth studio drew each branch's spine from the full layout, so lines ran down to boxes not grown yet; the fan now draws the spine only as far as the children shown."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "In the tree studio, a fan's children are laid out from the start and hidden with opacity. Each child's elbow carried its own stretch of the spine, so the first child shown drew a line toward siblings that were still invisible, and on the owner's phone the half-grown tree had lines running into empty space."
approach: "While any child of a fan is hidden, the elbows leave out their spine stretch and the fan draws one spine from the parent's line to the children shown, with the litSpine() helper the tap highlight already used. The lit (blue) spine and stub only count children already shown."
outcome: "solved"
conditions: "Expo app, BranchTree.tsx Fan/Elbow/Stub, growth driven by growPlayer hidden ids, 2026-11-14."
evidence: "mobile/src/components/BranchTree.tsx; e2e/app/quran.spec.ts 'the studio grows a tree to its end'"
implication: "When an animation hides parts of a laid-out view with opacity, anything drawn from that layout (spines, overlays, measured lines) must also be gated by what is shown, or it points at the hidden parts."
date: "2026-11-14"
topics: ["mobile","graph-ui","animation"]
buildsOn: []
---

The growth studio keeps the whole tree laid out so the camera never jumps, and fades boxes and connectors in by id. The connectors were split per child: every child's elbow drew half the spine toward each neighbour. Hiding a child's connector hid only its own elbow, so a shown child's half still reached into the hidden sibling's place.

The lit path had the same shape of bug once the growing ayah lit its path: the blue spine went to children on the path that were not grown yet. Both now read the hidden set.

## Tried

- First fix lit the spine from `lit` alone → review caught blue lines toward hidden children; gated by shown.
