---
title: "A pairwise match can change after cropping"
summary: "Candidate pairs passed the matching policy, but selecting shorter spans required checking those exact spans again."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A group passes a pairwise predicate before its inputs are transformed, then publishes transformed members without repeating the predicate."
approach: "Build groups whose every pair matches, select the word spans, then compare every selected pair again. Retain valid groups and recover qualifying pairs when a larger cropped group fails. Rank closeness using the original complete ayat."
outcome: "solved"
conditions: "Quran comparisons over 6,236 ayat, with local spans, morphology-aware matching, retained book cases and tree/matrix views."
evidence: "Namaq PR #514, source commit 0daf6adeb6908032a3212987293853c73661aa0b; engine.ts final clipped-span validation and wholePlace coverage, engine.test.ts automatic-pair and ranking regressions."
implication: "Recheck an invariant after the transformation that produces the published inputs, and define the denominator of a user-facing similarity score."
date: "2026-11-04"
topics: ["testing","text-matching","evidence-model"]
buildsOn: ["namaq/0021-absorbing-a-phrase-must-preserve-its-entry-points","namaq/0022-shared-forms-do-not-pair-word-occurrences"]
---

The new comparison inventory first compared complete ayat and built groups whose
members all matched one another. It then chose shorter word spans for the card.
Those choices can remove different parts of different ayat, so the earlier
pairwise result does not establish that the displayed spans still meet the same
policy. The builder now checks every cropped pair and falls back to qualifying
pairs when a larger group loses that property.

Review found a related denominator error. A short shared phrase could score one
when measured against itself, putting it ahead of nearly identical complete
ayat in “closest first.” The final score uses whole-ayah coverage across every
pair. The 2:4/4:162 group scores about 0.346, while 2:48/2:123 scores about 0.895.
The selected spans still decide what to compare and highlight.

Evidence comes from [Namaq PR #514](https://github.com/msskzx/namaq/pull/514), [`src/lib/quran/mutashabih/engine.ts`](../../src/lib/quran/mutashabih/engine.ts)
and [`src/lib/quran/mutashabih/engine.test.ts`](../../src/lib/quran/mutashabih/engine.test.ts) at
commit 0daf6adeb6908032a3212987293853c73661aa0b. Tests cover the final published word spans and compare a short
shared phrase against a near-complete parallel.

The invariant belongs to the final representation. Ranking also needs its own
measure when the UI asks how much of a complete item agrees.
