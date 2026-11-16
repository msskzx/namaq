---
title: "One tree means one builder and one set of rules, not only one drawing component"
summary: "Moving the compare tree onto the branches BranchTree made it look like a branches tree, but it was still built by its own rules: words written differently stayed as split boxes, a side with no words became an empty dot box, and a ⋯ mark the mushaf does not write stood for skipped ayat. The owner had asked for one tree, with one set of rules, more than once."
disclosure: "open"
sourceProject: "namaq"
kind: "detour"
problem: "#776 and #811 drew compare cards with the shared BranchTree, so drawing was unified, but `compareTree` (shared/quran/braid.ts) built the nodes with its own word grouping (normalizeWord, not the branches `letters`), never applied ADR 0036 (a word written differently moves into the neighbouring boxes), left empty split sides as dot boxes, and inserted ⋯ where a side skipped ayat. On al-Baqara 24 and Al Imran 131 the owner saw a dot box beside «وقودها الناس والحجارة»."
approach: "Build compare nodes with the branches rules: the braid groups words by phraseTrees `letters`, a shared word written differently takes phraseTrees `sharedDisplay` and each side's own writing in `forms` (drawn as a braid, amber), and `foldStrands` applies ADR 0036 to the braid (first word of a common stretch into the parted boxes before, last word into those after; an emptied stretch lets its neighbours run on). On 2:24/3:131 «التي» (ٱلَّتِى / ٱلَّتِىٓ) moves down and fills Al Imran's side. A side still empty is drawn by both BranchTrees as a line running straight on, never a box. ⋯ is gone; the box's names and the ayah signs show the gap. shared/quran/oneTree.test.ts fails when a page builds Branch nodes outside shared/quran, draws tree lines outside the BranchTree files, or takes tree nodes without drawing them through BranchTree, and checks braid.ts uses the branches grouping and folding."
outcome: "solved"
conditions: "Compare cards (app + website) and branches trees, 2026-11-16."
evidence: "shared/quran/braid.ts (foldStrands, compareTree); shared/quran/braid.test.ts; shared/quran/oneTree.test.ts; mobile/src/components/BranchTree.tsx and src/app/quran/branches/BranchTree.tsx (through line); docs/adr/0036-a-word-written-differently-moves-to-its-neighbour.md."
implication: "When the owner says 'one component', read it as one builder, one set of rules and one drawer: before a tree feature ships, check that every tree (branches, compare, quiz, previews) gets its nodes from the shared builders and their rules (grouping, ADR 0035/0036 written forms, end signs, no empty boxes), not only that it renders through BranchTree. A compare tree differs from a branches tree only in size."
date: "2026-11-16"
topics: ["graph-ui","agent-review"]
buildsOn: ["namaq/R0042-a-rule-kept-in-one-branch-of-a-component-misses-its-other-paths"]
---

The owner's words (2026-11-16): «we have only one kind of trees. We have one component that builds a tree, and we have all the same rules for trees», and «The only difference between the tree in a compare page and in the mutashabihat page is that this one is smaller.»

The branches builder itself (phraseTrees `createPhrasePresenter`) is a trie from one shared phrase and cannot meet again after parting, which a compare pair of whole passages needs; so the compare braid keeps its rejoins but takes every rule from the branches code (grouping, shared spelling, folding, signs) and is drawn by the same component.
