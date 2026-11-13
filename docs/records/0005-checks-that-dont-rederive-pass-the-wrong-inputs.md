---
title: "Checks that don't re-derive pass exactly the inputs that should fail them"
summary: "Checks that only test shape pass exactly the values that are shaped right and mean the wrong thing."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "Validators that check only shape or consistency pass values that are well-formed and wrong."
approach: "Found two cases: an anchor check that counted paragraphs, and a dangling Prisma relation silently patched back by prisma format. Deriving the expected value independently and comparing found both."
outcome: "solved"
conditions: "Page-store migration (namaq PRs #220-222); 1,701 mocked tests, lint and tsc all passed; the second bug was caught only by a live query on the real database."
evidence: "docs/lessons/lessons/0002-who-owns-a-page.html decision, realized in PRs #220-222; history:validate anchor check"
implication: "When writing a validator, require it to re-derive and compare the checked value, and where that is not possible say the static checks do not cover it and a runtime smoke test is owed."
date: "2026-09-30"
topics: ["testing","evidence-model"]
lesson: "text-to-evidence/0003-a-check-that-exists-but-doesnt-run"
---

Found two instances of the same failure mode while building the page store
migration (source: `docs/lessons/lessons/0002-who-owns-a-page.html`'s
decision, realized in PRs #220-222): `history:validate`'s anchor check
counted paragraphs instead of comparing an anchor's own number against the
page's real order, and a dangling Prisma relation (`SourceAccount.citations`
left after removing `Citation.accountId`) got silently patched back into
existence by `prisma format` as `sourceAccountId` — passing lint, `tsc`, and
1,701 mocked tests, caught only by a live query against the real database.

**Evidence:** both bugs shipped past every static check that existed for
them; both were found by deriving the expected value independently
(paragraph position from the store text; a real query against the real
schema) and comparing, not by strengthening the existing check's shape
constraints.

**Implications:** when writing or reviewing a validator, ask whether passing
it requires the checked value to be independently re-derived and compared,
or only to have internally consistent shape. A count match, a type match, a
"the referenced key exists" match are all shape checks and will pass a
value that is shaped right and means the wrong thing. Prefer re-derivation
wherever the derivation is cheap enough to run in CI; where it isn't (a live
schema query), say explicitly that the static checks don't cover this and a
runtime smoke test is still owed before calling a schema migration done.
