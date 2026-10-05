# Parsing the Companions of the Siyar into the span model

Status: ready to implement. Nothing blocks it; open issues are listed at the end.

Decided by the owner: the target format, how uncovered text and unresolved names are
handled, how names are resolved, and that the time layer comes first. The remaining
choices were settled by the main agent and a critic agent, on the owner's delegation,
and are marked as such. The rule that governs all of it is
[ADR 0024](../adr/0024-read-the-text-and-stop-where-it-is-unclear.md). Terms are in
[CONTEXT.md](../../CONTEXT.md): entry, not modeled, unresolved name.

## Agreed behavior and scope

- A new Siyar entry is parsed into the span-based model, under
  `data/works/siyar-alam-al-nubala/`. The existing history batches and catalog rows are
  not touched, converted or removed until the owner has tested the model.
- An entry is parsed whole. Its pieces must rebuild its text word for word. A sentence
  no field covers is listed as **not modeled** and never fails the check.
- A date sentence is listed as not modeled with the tag `time-layer`, and waits for the
  time layer, which gets its own plan (start from
  [relative-event-dating.md](relative-event-dating.md)). A year the book prints as a
  number, such as a death year, stays recorded as the book prints it, with no
  conversion or derivation.
- A name is tied to a person only through the book itself: the entry's heading, its
  nasab, the editor's footnotes and other entries. A name those cannot settle is an
  **unresolved name**: it stays text and is highlighted, not guessed. A rijal work as a
  second source is a later decision.
- Attendance at an event is recorded; the outcome sentences (ADR 0013) are listed as
  not modeled with the tag `outcome`, since the model has no participation status yet.
- Scope is the Companions only, with the skip list in
  [data-pipelines.md](../data-pipelines.md#companion-scope): the two runs of senior
  Tabi'un are skipped, and a contested صحبة is taken in with the contest recorded.
- Batches follow the book's order: three to five entries for the first batches, then
  ten once the process is smooth. Each batch's `summary.md` lists the readings the agent
  chose, and cites the coverage command with counts instead of pasting its lists.
- While both pipelines exist, the catalog wins on the site. The model's tables
  (`model_spans`, `model_profile_entries`) are separate, and the model projection never
  overwrites catalog rows.

## Acceptance criteria

1. `npm run model:coverage -- <unit>` prints the not-modeled sentences, each with its
   reason tag where one applies, and the unresolved names, with a count of each. It exits
   0 by default and nonzero only with `--strict`.
2. A test over every unit under `data/works/` checks that its pieces rebuild its text
   word for word, and it runs in `npm test`.
3. A `model:check` rule fails a unit whose volume is missing or not among the source
   manifest's declared volumes (`data/history/sources/<slug>/source.json`).
4. `npm run model:diff` for a person with both a catalog entry and a unit labels each
   difference: model-only, or catalog-only with a reason (unsupported by the text, needs
   a predicate, or owner decision).
5. Al-Zubayr is re-parsed (below) and its diff is fully classified.
6. `CONTEXT.md` carries the three new terms, and `AGENTS.md` and the plan carry ADR 0024.

## Affected components

| Component | Change |
| --- | --- |
| `scripts/model/coverage.ts`, `src/lib/model/coverage.ts` (new) | The coverage command and its function, which a review page can call later. |
| `package.json` | New script `model:coverage`. |
| `src/lib/model/check.ts` | The volume rule. |
| `scripts/model/diff.ts`, `src/lib/model/diff.ts` | Classified output. |
| a test beside `src/lib/model/coverage.ts` (new) | The completeness test over `data/works/`. |
| `src/lib/model/types.ts`, `check.ts`, fixtures | `speakerBasis` on `Turn` from ADR 0024 (a separate, smaller change). |
| `data/works/siyar-alam-al-nubala/units/` | New units, one per entry. |

The order is: coverage and the volume rule, then the classified diff, then the al-Zubayr
re-parse, then batch one. Paths marked new do not exist yet.

## Validation

- Unit tests for the coverage function on the al-Zubayr unit and on a small fixture with
  a known uncovered sentence, an unresolved name and a date sentence. They check the
  tags, the counts and both exit codes.
- The completeness test passes on al-Zubayr and on the Jibril fixtures.
- The volume rule has a passing and a failing case.
- `npm run lint`, `npx tsc --noEmit` and `npm test` pass.
- `npm run model:check` and `npm run model:diff -- az-zubayr-ibn-al-awwam` run clean and
  show only classified differences.

## Data and operational consequences

No migration and no change to either database. The model's read tables stay separate
from the catalog's. The owner's hold stands: no conversion of existing batches or
catalog rows, and the `persons.virtues` drop migration is not applied. `data/` is the
authority and the databases are rebuilt from it (ADR 0023). The projection of a new unit
to the preview tables is a separate `model:project` run.

## Open issues

Nonblocking:

- **Companion-of edge for al-Zubayr.** The catalog has `COMPANION_OF`. The entry says he
  stayed with the Prophet ﷺ after becoming Muslim, and the tie follows from that. This is
  the owner's point, so the model does not add it until the owner decides.
- **The ayah link** needs a predicate that does not exist yet, so a new ADR.
- **Hakim ibn Hizam as a cousin** is not in the model, on purpose: the batch summary
  records that the entry has al-Zubayr calling Hakim's son «ابن أخي» and does not state
  the relation. It is a possible catalog error, so it is flagged to the owner.
- **The time layer** has no plan yet. Dates stay in the not-modeled list until it does.
- **A rijal work as a second source for names.** Decide later.
- **A batch with a hadith in its text** would exercise the cross-unit span reference
  (progress item 5). It is not required for batch one.
- **The hold on Siyar conversion.** `progress.md` says the owner holds conversion until
  testing. This plan parses only new entries and converts nothing. The owner chose that
  format, but should confirm it does not conflict with the hold.
