---
title: "A rule kept in one branch of a component misses its other paths; a shrink-to-fit label that only iOS shrinks"
summary: "Top-down trees were never meant to have tabs, yet the home pair card drew them, and on the owner's iPhone every tab label was a speck. The no-tab rule lived only in BranchTree's own node branch; the compare tree, added later, went through its nodeContent branch, which drew a tab with no direction check. The speck came from adjustsFontSizeToFit, which the web export the tests run on ignores."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "#776 (2026-11-14) drew compare cards with the branches tree and put the sides' names on tabs through `nodeContent`. The rule 'a tree drawn top down keeps its reference inside the box' (owner) was coded as `!shared.down` in the default node path only, so the custom path ignored it, on the app and the website. #783 (2026-11-15) then added adjustsFontSizeToFit to the tab label to stop iOS cutting «الأعراف…»; in a tab sized by its own text, iOS shrank every label far below minimumFontScale. Screenshots and e2e run on the web export, where neither the shrink nor the tab's look on a real phone showed."
approach: "Make the direction rule hold for every node path: the custom path also puts the name inside the box, over a rule, when the tree is drawn top down (app BranchTree, website BranchTree's [data-down] styles). Drop adjustsFontSizeToFit; a label too long is clipped (ellipsizeMode clip), never shrunk or cut to «…». Tests: app home e2e (no node-tab in the pair card, tab text at least 10px), website e2e (a [data-down] name has no top border, normal size), and a source check that no app file uses adjustsFontSizeToFit."
outcome: "solved"
conditions: "Expo app on iOS (Expo Go), iPhone 17 Pro Max; website and app web export at 440px."
evidence: "mobile/src/components/BranchTree.tsx (NodeTab, custom node path); src/app/quran/branches/BranchTree.tsx; e2e/app/home.spec.ts; e2e/web/pages.spec.ts; src/app/quran/branches/treeTabs.test.ts."
implication: "When a component has more than one way to draw the same thing (default and custom content, own and render props), put a layout rule where every path passes, and check each path when a rule is added. A text-fitting prop that only native honours needs a real-phone check before merge, or not to be used: the web export cannot show it."
date: "2026-11-15"
topics: ["graph-ui","testing"]
---

The same day a third case of the pattern showed: #785 let the surah chips rise into the studio bar's empty room under a tree (TreeCard), but the matrix view's chips are drawn by TreePager's footer, so on the home card's matrix they kept the whole bar's room and left a gap under the buttons. Fixed by tucking them there too whenever no studio bar is showing.

The owner asked how the pills got there, not only to remove them. Two separate changes met on one card: #776's tabs on compare trees (the rule's other path), and #783's shrink-to-fit (a native-only prop no test could see).

Follow-up (owner, 2026-11-16): one layout for every tree. Tabs are gone; every box, side by side or top down, names its ayah inside over a rule, so there is no second path left to miss. `treeTabs.test.ts` fails if a tab comes back.

Follow-up (owner, 2026-11-16): the compare tree still drew its own boxes through `nodeContent`, so #798's rule (every box names its ayah) and the same-style surrounding boxes never reached it. `nodeContent` is gone from both trees: `compareTree` (shared/quran/braid.ts) now hands the tree plain data (`holds` for the ayat a box names, `tones` for its words' likeness, end signs as words, `ayat`/`through` on each side's last box), and the default node path draws it. `ayahEnds` follows `rejoin` so the website finds each side's ayah after.
