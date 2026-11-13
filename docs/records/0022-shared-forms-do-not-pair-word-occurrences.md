---
title: "Shared forms do not pair repeated word occurrences"
summary: "A repeated ما inherited another occurrence's exact match, while similarity-search keys omitted the preposition needed for مِنْ and مِنْهَا."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Text comparison reuses matches between repeated occurrences and treats a search index's omitted tokens as absent evidence."
approach: "Keep the existing LCS occurrence selection, compare corresponding selected occurrences, and reuse complete stem roots and lemmas. Apply the same matcher to tree segments without crossing ayah boundaries."
outcome: "solved"
conditions: "Quran branch comparison over 6,236 ayat and 5,174 multi-ayah tree groups, using corpus morphology and original reader words."
evidence: "Namaq PR #512; regressions for 2:35/7:19, 2:170/31:21, tree offsets and default-view navigation; 3,502 tests, lint, typecheck and build passed."
implication: "Select concrete occurrences before classifying their forms, and check whether an index intentionally drops information before using it as comparison evidence."
date: "2026-11-04"
topics: ["testing","text-matching","ui-state"]
buildsOn: ["namaq/0019-fixing-the-example-broke-the-ayah-next-door","namaq/0021-absorbing-a-phrase-must-preserve-its-entry-points"]
lesson: "text-to-evidence/0010-comparing-word-occurrences"
---

In 2:170 and 31:21, the first ما pair agreed, but the second pair differed in its marks. The matcher collected every form under the shared key and used that collection to classify each occurrence. The first pair's shared form therefore made the second occurrence in 2:170 look exact. Selecting concrete occurrences and comparing their corresponding forms made the second pair purple on both sides.

The other report crossed a different boundary. The similarity-search keys intentionally omitted prepositions and classified حيث differently by part of speech. Full STEM metadata was already available in the tree inventory. Reusing it paired مِنْ with مِنْهَا by lemma and recognized حَيْثُ as exact. The legend now says “Same lemma or root.”

Independent review also found that a subtree link dropped an explicit tree override above a saved matrix default. A page regression followed the generated link before the fix, then verified that the destination stayed a tree. The second review found no further defects.

Evidence is [Namaq PR #512](https://github.com/msskzx/namaq/pull/512),
[`src/lib/quran/ayahContext.test.ts`](../../src/lib/quran/ayahContext.test.ts) and
[`src/app/quran/branches/page.test.tsx`](../../src/app/quran/branches/page.test.tsx).
The full inventory test checks equal exact and lemma/root counts and disjoint, in-range marks. All 3,502 tests passed with two workers; the production build, lint and TypeScript checks passed too.

The implication is to distinguish a search index's selection policy from a comparison's evidence needs. An exact match belongs to a tuple of occurrences, not to a word key's collection of possible forms.
