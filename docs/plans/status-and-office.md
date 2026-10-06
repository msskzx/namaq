# Status and office beside title

Status: blocked on the open issue marked as a blocker below. Everything else is ready.

Vocabulary is in [CONTEXT.md](../../CONTEXT.md) under "A person's standing". The
decision and its reasons are in
[ADR 0025](../adr/0025-title-status-and-office-are-separate-predicates.md).

## Agreed behavior and scope

- `companion` and `tabii` are values of one predicate, `status`, and not titles.
  `is-sahabi` in `src/lib/model/types.ts` is renamed to `status`, with no adapter.
- Every person in a volume of the Companions gets `status: companion`. The basis
  is any author text that shows it: the volume title, the first paragraph of the
  entry, a virtue or an epithet. No rule file, no derivation, no approval flow.
- A death during the Prophet's lifetime, as with many who fell at Badr and Uhud,
  does not change the status. Such a person met him and died a Muslim, which is
  the whole definition, so `status` never depends on a death date or on
  surviving him.
- Where the text places a person elsewhere, the model records what the text says.
  Marwan ibn al-Hakam sits under «كِبَارُ التَّابِعِيْنَ» (Shamela page 3084), so
  he is `tabii`. The author's «وَقِيْلَ: لَهُ رُؤْيَةٌ، وَذَلِكَ مُحْتَمَلٌ» stays a
  separate statement and does not assert `companion`.
- `title` stays for epithets the text states. Amir al-Mu'minin is an office
  designation and is not a title.
- `office` has a classified kind (`caliph`, `amir`), a scope (a linked place,
  army or event, or the span that names it), and dates only where the text states
  them. Relative dating waits for the time layer
  ([relative-event-dating.md](relative-event-dating.md)).
- `tabii` is in the closed set for contested subjects only. No tabi'i is
  extracted otherwise.
- The catalog's `companion` title leaves the titles.

Excluded: derivation of a status from premises, per-work run files, an epithet
list, and any bulk conversion of the catalog before the owner has tested.

## Acceptance criteria

1. `status` replaces `is-sahabi` in the closed predicate list, and nothing in
   `src` or `data` refers to `is-sahabi` afterwards.
2. The al-Zubayr unit holds a `status: companion` assertion resting on a span of
   the entry, and `model:diff` reports no `companion` title difference for him.
3. `diffAgainstCatalog` compares a catalog `status` against the model's `status`
   assertion, and a catalog `companion` title shows as catalog-only until the
   catalog drops it.
4. A unit for a person the text places elsewhere (Marwan) produces
   `status: tabii` and holds the sight remark as a statement with no `status`.
5. A person whose death falls in the Prophet's lifetime still gets
   `status: companion`, covered by a test that gives the model a death year
   before his own.
6. An `office` assertion validates with a kind, a scope and optional stated
   dates, and `npm run model:check` rejects one with an unknown kind.
7. `npm run lint`, `npx tsc --noEmit` and `npm test` pass.

## Affected components

Verified paths:

- `src/lib/model/types.ts`: the predicate list (`is-sahabi` becomes `status`;
  add `office`).
- `src/lib/model/diff.ts`: the title and status comparison, now reading
  `take('title')` (line 84) and a new `take('status')`.
- `src/lib/model/diff.test.ts`: the al-Zubayr diff lines.
- `data/works/siyar-alam-al-nubala/units/siyar-v4-3-az-zubayr.json`: add the
  `status` assertion and its span.
- `docs/plans/data-model/plan.md` (lines 183 and 403): replace `is-sahabi`.
- `README.md`: a line under "What is implemented".

Proposed, not yet created: a unit for Marwan ibn al-Hakam (page 3084, entry 102)
as the `tabii` case, and the `office` validation in `scripts/model/check.ts`
(unverified: confirm where predicates are validated before editing).

Order: types, then diff and its tests, then the al-Zubayr unit, then Marwan, then
`office`.

## Validation

- `diff.test.ts`: a `status` assertion matches a catalog `status`; a catalog
  `companion` title is catalog-only (criteria 2 and 3).
- A test over the Marwan unit: `tabii`, and no `companion` assertion (4).
- A test with a death year inside the Prophet's lifetime still yielding `companion` (5).
- A `check.ts` test with a valid and an invalid `office` (6).
- `npm run model:check`, `npm run lint`, `npx tsc --noEmit`, `npm test` (7).

## Data and operational consequences

- Removing `companion` from titles touches the catalog, PostgreSQL and Neo4j,
  because `companion` is also a graph node used by graph search and the title
  filter (`src/lib/titleName.ts`, `src/lib/graphFilter.ts`). Going through
  `npm run people:sync` keeps both stores in step, and `npm run graph:layout`
  must be dry-run and then applied afterwards, since a title node leaving the
  graph shifts ranks and layout.
- Quiz questions that name the `companion` title
  (`data/quiz/questions.json`) follow
  [docs/quiz-question-review.md](../quiz-question-review.md).
- This plan converts nothing in the catalog. The conversion waits until the
  owner has tested the model.

## Open issues

- **Blocker for the catalog step, not for the model:** where the catalog and the
  seeds declare the `companion` title is not located yet (it is not under
  `data/catalog`), and removing it changes the live graph. Resolve by locating
  the declaration, then asking the owner to confirm the removal and the
  `graph:layout` re-run.
- **Nonblocking assumption:** the volume number that holds Marwan's entry is not
  confirmed. Shamela `الجزء ٣` and the edition's volume numbering differ (see
  AGENTS.md), so check it when the Marwan unit is written.
- **Deferred:** relative dates for `office`, until the time layer is planned.
