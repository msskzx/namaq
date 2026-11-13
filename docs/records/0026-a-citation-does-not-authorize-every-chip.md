# A citation does not authorize every chip

A valid source comparison still carried an incorrect singular/plural label and spread chips to uncited members.

Kind: obstacle · Outcome: solved · Date: 2026-11-07 · Topics: evidence-model, testing, text-matching

**Problem:** A container has a source citation, so its generated labels are treated as supported for every member and every filtered view.

**Fix:** Retain exact source selections, scope citations first, and derive published chips, examples and connectors only from surviving evidence.

**When it applies:** Thirty recorded book cases across seventeen cited comparison groups in a 1,141-group inventory; both خطاياكم and خطيئاتكم are plural.

**Rule it changes:** Uncited gender chips are hidden; the incorrect number tag for two plural forms is removed; filtering out the source comparison removes its chips and book-only eligibility.

**Evidence:** Namaq PR #524 at c63417e1 and PR #525 at 6896a5db; regression tests and independent audit.

**Builds on:** [0023](0023-a-pairwise-match-can-change-after-cropping.md)

## What happened

The خطاياكم / خطيئاتكم comparison had book evidence but was labelled جمع وإفراد. Source support for comparing the words did not support that label: both forms are plural. The tag was removed. Another group carried a citation for 2:129 and 2:151 plus uncited members 3:164 and 62:2. Filtering to those latter members previously hid the citation while leaving its chip and example. Evidence now carries the exact selections and is scoped before chips, connectors or the book-only filter are computed.

Evidence comes from [Namaq PR #524](https://github.com/msskzx/namaq/pull/524) and [PR #525](https://github.com/msskzx/namaq/pull/525). `src/lib/quran/branchInventory.ts` (since moved) owns scoped inventory eligibility; `src/lib/quran/mutashabih/evidence.ts` (since moved) scopes citations; [`src/app/quran/compare/CompareView.test.tsx`](../../src/app/quran/compare/CompareView.test.tsx) independently checks rendered passage coverage.

The implication is to check the final visible selection, including its evidence, identity and initially displayed text, after every scope transformation.
