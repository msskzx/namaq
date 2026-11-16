---
title: "Letting go of a shared studio to swap its target closes the studio"
summary: "The app's branches pager re-claimed the growth studio through an effect cleanup, so any change of what the studio plays went through 'no owner' and closed it; a switch inside the studio needs the target swapped in place."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "The phone app's growth studio is one module-level player that screens claim with claimTarget(owner, target). TreePager claimed it in an effect and released it in that effect's cleanup. A change of owner closes the studio, and a release followed by a claim counts as two owner changes, so every re-run of the effect (a new tree, a connection tag toggled, and now the matrix's read-along/connections switch) closed the studio."
approach: "TreePager now swaps its target in place: the effect calls claimTarget('branches', next) with no cleanup, a separate unmount effect releases it, and an effect on the open piece closes the studio so a new tree still starts with the studio shut. setTarget stops a running play but keeps the studio open. The website's Grow.tsx registers targets the same release-then-claim way; there setMatrixPlay sets a short-lived `switching` flag that the register and release calls read to keep `studio` open."
outcome: "solved"
conditions: "Expo app (mobile/src/lib/growPlayer.ts claimTarget) and Next.js site (src/app/quran/branches/Grow.tsx), 2026-11-14, adding the matrix read-along studio with a switch on book matrices."
evidence: "mobile/src/components/TreePager.tsx, src/app/quran/branches/Grow.tsx setMatrixPlay; e2e/app/quran.spec.ts 'every matrix has one studio'"
implication: "When a control inside the studio changes what the studio plays, check that the studio is still open after it: a target swap must not go through a release. A UI test presses the control and then looks for a studio-only button."
date: "2026-11-14"
topics: ["ui-state"]
buildsOn: []
---

The first build of the switch flipped the matrix from its connections to the
read-along and the studio vanished at once. Nothing in the switch closed it: the
pager's effect cleanup released the studio, `claimTarget` saw its owner change
from the branches tab to nobody and closed it, then the new claim saw nobody
become the branches tab and closed it again.

Releasing in the cleanup had been harmless only because every earlier re-run
also meant "a different tree", where closing is wanted. Splitting the two
meanings (swap the target in place; close on a new piece) keeps both behaviours.

## Tried

- toggle the switch with the cleanup release in place → studio closed on every switch
