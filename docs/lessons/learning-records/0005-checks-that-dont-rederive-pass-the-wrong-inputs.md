# Checks that don't re-derive pass exactly the inputs that should fail them

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
Captured as [[0003-a-check-that-exists-but-doesnt-run]].
