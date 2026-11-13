---
title: "Absorbing a phrase must preserve its entry points"
summary: "Combining overlapping Quran trees fixed duplicate diagrams but needed separate checks for autocomplete, zoom targets, and answer offsets."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Combining overlapping text groups removes entry points that search and navigation still need."
approach: "Retain larger overlapping occurrence groups first, keep absorbed wording as search aliases, and use the underlying phrase inventory for focused links and zoom discovery. Keep conjunctions attached to whole words and move answer offsets with the trunk boundary."
outcome: "solved"
conditions: "Arabic Quran branch trees generated from 6,236 ayat, with shared phrases identified by word offsets and morphology."
evidence: "namaq PR #473; page, phraseTrees, branch-phrases route, and branchQuestions regression tests; 3,289 tests passed."
implication: "When combining groups, test each way a user reaches the absorbed group and each consumer of its word offsets."
date: "2026-10-29"
topics: ["testing","text-matching","ui-state"]
buildsOn: ["namaq/0019-fixing-the-example-broke-the-ayah-next-door"]
---

The branch page showed the wording shared by 43:83 and 70:42 separately from
an overlapping tree that included 52:45. It also put an attached ف in its own
node. A three-ayah fixture caught the duplicate and the detached letter. The
actual juz 25–30 page then exposed another overlap: الذي يوعدون and يومهم الذي
share a word without either anchor containing the other. Retaining larger
groups first and absorbing a smaller group only where every occurrence overlaps
a retained anchor produced one tree for the reported passages.

That changed more than the list. Independent review found that submitted search
and the suggestion API had aliases, but local autocomplete did not. It also found
that absorbed phrases could still open by URL while their zoom buttons had
vanished. Page tests reproduced both failures before the fixes. Moving a whole
first-word variant before the trunk also changed the answer offset used by the
quiz, so a separate regression checks where its answers begin.

Evidence comes from [Namaq PR #473](https://github.com/msskzx/namaq/pull/473),
[`src/app/quran/branches/page.test.tsx`](../../src/app/quran/branches/page.test.tsx),
[`src/lib/quran/phraseTrees.test.ts`](../../src/lib/quran/phraseTrees.test.ts), and
[`src/lib/quiz/branchQuestions.test.ts`](../../src/lib/quiz/branchQuestions.test.ts).
The regenerated inventory matched its builder, the underlying ayah data stayed
unchanged, and all 3,289 tests passed.

Combining groups needs checks for typing a query, submitting it, opening an old
link, discovering a focused view, and consuming the resulting offsets. A correct
diagram alone does not establish that those entry points still work.
