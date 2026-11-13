---
title: "Rendered context needs coverage checks"
summary: "Every selected ayah existed in computed rows, but most were initially hidden in one curated comparison."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A comparison reports complete selected coverage while its renderer collapses the unmatched parts by default."
approach: "Reuse the existing passage renderer, open unmatched context for curated selections, and derive expected verse coverage independently from the Quran text."
outcome: "solved"
conditions: "The Salih comparison selects 7:73-79 and 26:141-159; previously only one of nineteen ayat on the second side was visible initially."
evidence: "Namaq PR #524 at c63417e1 and PR #525 at 6896a5db; regression tests and independent audit."
implication: "Tests verify all seven curated selections are initially visible with original verse numbers and without duplicates; explicit custom comparisons retain their previous collapsed context."
date: "2026-11-07"
topics: ["testing","text-matching","ui-state"]
buildsOn: ["namaq/0005-checks-that-dont-rederive-pass-the-wrong-inputs"]
lesson: "text-to-evidence/0012-evidence-belongs-to-the-selection"
---

The existing matcher already retained every selected ayah in either a matched block or an unmatched context row. That did not make the complete passage visible. Its context rows started collapsed, so the Salih selection initially exposed only one of nineteen ayat on the second side. Curated mode now opens the context and reuses the same renderer. Tests derive each expected ayah and reference from the corpus rather than trusting the aligner row counts. The interface calls the algorithmic links lexical matches because shared words can connect different narrative moments.

Evidence comes from [Namaq PR #524](https://github.com/msskzx/namaq/pull/524) and [PR #525](https://github.com/msskzx/namaq/pull/525). [`src/lib/quran/branchInventory.ts`](../../src/lib/quran/branchInventory.ts) owns scoped inventory eligibility; [`src/lib/quran/mutashabih/evidence.ts`](../../src/lib/quran/mutashabih/evidence.ts) scopes citations; [`src/app/quran/compare/CompareView.test.tsx`](../../src/app/quran/compare/CompareView.test.tsx) independently checks rendered passage coverage.

The implication is to check the final visible selection, including its evidence, identity and initially displayed text, after every scope transformation.
