---
title: "Filtered identities need the original selection"
summary: "Autocomplete hashed filtered passages that the full-corpus resolver could not find."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "A filtered list creates identifiers from reduced membership while its detail resolver identifies the original full selection."
approach: "Assign comparison IDs before filtering, keep legacy aliases, and share the same scoped inventory between browsing and autocomplete."
outcome: "solved"
conditions: "Quran trees over 6,236 ayat; review found 232 of 298 range-generated suggestion IDs absent from the full resolver."
evidence: "Namaq PR #524 at c63417e1 and PR #525 at 6896a5db; regression tests and independent audit."
implication: "All juz-one word-tree suggestion IDs resolve against the full-corpus inventory; scoped search and saved-only results obey the same eligibility filters."
date: "2026-11-07"
topics: ["testing","text-matching","ui-state"]
buildsOn: ["namaq/0021-absorbing-a-phrase-must-preserve-its-entry-points"]
lesson: "text-to-evidence/0012-evidence-belongs-to-the-selection"
---

The page resolved tree IDs against the full corpus, but autocomplete rebuilt phrase trees inside the juz range and hashed their reduced membership. Independent review reproduced 232 unresolved IDs among 298 juz-one candidates. The shared inventory now assigns the ID from the original word selections, then prunes occurrences for the current scope. The displayed shared phrase can expand after filtering without changing the comparison identity. Saved-only browsing also intersects the eligible inventory; a direct old bookmark URL remains a separate compatibility path.

Evidence comes from [Namaq PR #524](https://github.com/msskzx/namaq/pull/524) and [PR #525](https://github.com/msskzx/namaq/pull/525). [`src/lib/quran/branchInventory.ts`](../../src/lib/quran/branchInventory.ts) owns scoped inventory eligibility; [`src/lib/quran/mutashabih/evidence.ts`](../../src/lib/quran/mutashabih/evidence.ts) scopes citations; [`src/app/quran/compare/CompareView.test.tsx`](../../src/app/quran/compare/CompareView.test.tsx) independently checks rendered passage coverage.

The implication is to check the final visible selection, including its evidence, identity and initially displayed text, after every scope transformation.
