# Quoted values: vowel marks and exact wording

Status: **in progress**. Terms are in [CONTEXT.md](../../CONTEXT.md) (Seam,
Quoted value, Known name, Virtue, Speaker). The virtue model is decided in
[ADR 0020](../adr/0020-a-virtue-is-one-entry-with-one-speaker.md).

## Why

A reader noticed that profile text and the sources contents list do not match
al-Dhahabi's printed Arabic, and that vowel marks (tashkeel) are missing. Four
causes, found by reading the files:

- **Catalog values are the profile.** A profile's `fullName` and `kunya` come
  from `data/catalog/people/<slug>.ts`, not from a batch's `claim.assertion`.
  Rewriting `assertion` in 25 batches (PRs 258-282) fixed a field no profile
  value reads, and those PRs were closed unmerged.
- **The Sira volumes are bare at the source.** Shamela serves volumes 1 and 2
  without tashkeel or footnotes (checked on `10906/428`). Volumes 4 and 5 are
  vowelled.
- **Nothing enforced exactness.** `scripts/history/verifyExcerpts.ts` only
  proves an excerpt sits inside one stored paragraph.
- **A virtue was one string.** Several claims' wording was joined into one
  paragraph, mixing al-Dhahabi's narration with a companion's words.

## Agreed behavior and scope

- Scope is volumes 4 and 5, decided per value by the volume of the cited
  anchors (`4/41-p3`), not by the citation's `volume` label, which is a book
  label (`1`, `السيرة 1`). A value citing any other volume is out of scope.
- A **quoted value** is one contiguous span of the cited passages, joined
  across a seam where a sentence runs on, with vowel marks. It differs from the
  page only by dropping the entry number, collection marks (`*`, `(ع)`),
  footnote markers, the space a marker leaves before punctuation and the closing
  full stop, and by the seam edit (`ابْنِ` opening a sentence is `بنِ`). No
  respelling, no reordering, and **no stitching of separate clips**: a value that
  cannot be one span is not quoted.
- Field classes:

  | Class | Fields | Rule |
  | --- | --- | --- |
  | Quoted | `fullName`, `kunya`, `tribalAffiliation`, `appearance`, `placeOfBirthArabic`, `placeOfDeathArabic`, battle and event `location`, event `description`, participation `summary`, utterance text, `speakerName`, `grading`, `occasion`, `name` | One contiguous span; where the source quotes a person inside it, the text names them |
  | Virtues | `virtues` | A list; see below |
  | Not checked | `titles[].name` (shared labels), `sex`, years, counts, `engagement`, transliterations | The citation is the evidence |
  | Reference | `ayat` | Text comes from the `Ayah` table, whose own check is a later pass |

- **Virtues.** Each entry is one virtue, backed by its own claim, in one
  speaker's exact words. The speaker is al-Dhahabi when he narrates or reports a
  named person's verdict; a companion's or the Prophet's own words are their own
  entry that names the speaker ("قال X: …"). Two speakers never share an entry
  and nobody's words appear unnamed. An entry is one contiguous span, with no
  `…`. A quiz question asks about one virtue.
- `name` is the known name: a vowelled span of the chapter heading chosen by
  the author and checked only to be a span of it. `fullName` keeps the nisbas
  and drops only the closing full stop (Abu Ubaydah is the reference:
  `عَامِرُ بنُ عَبْدِ اللهِ بنِ الجَرَّاحِ بنِ هِلاَلِ…`).
- The sources contents list shows a chapter's heading as printed.
  `SubjectEvidenceAccess` shows the cited excerpt, not `claim.assertion`.
- A stored page is re-fetched only if it has no vowel marks, which today means
  volumes 1-2 and changes nothing.
- Out of scope: another host for volumes 1-2, extracting entries not yet in the
  store, and editing `claim.assertion`.

## Work packages

| # | Package | State |
| --- | --- | --- |
| 1 | Evidence panel shows the excerpt (#283) | merged |
| 2 | Matcher and `catalog:quoted-report` (#284, #289, #290, #300) | merged, #300 open |
| 3 | First pass rewriting 414 failing values (#285-#288, #291-#298) | merged; to be redone under packages 4 and 6 where it stitched or mixed voices |
| 4 | Matcher v2: contiguous only, no clip limit, no stitching | next |
| 5 | Virtue model: types, loader, validator, report, checklist, projector, `PersonVirtue` table, profile list, single-virtue quiz question | next |
| 6 | Re-author every `virtues` as entries; redo summary, appearance, description, occasion values that the first pass stitched or changed | after 4 and 5 |
| 7 | Chapter headings detected anywhere on a page (#299) | merged |
| 8 | Citation excerpts that are not exact spans of their paragraph (about 130 in volumes 4-5, 8 anchors past the last paragraph) | after 4 |
| 9 | `catalog:validate` fails on a non-quote, approvals, import, sync, merge | last |

## Acceptance criteria

1. `npm run catalog:quoted-report` shows no failing value in volumes 4-5 except
   those listed in the plan's open issues with a reason.
2. No catalog value is stitched from separate clips; the matcher test suite
   proves a stitched value fails.
3. Every `virtues` is a list; every entry cites one claim, has one speaker, and
   no entry mixes voices (checked by a reviewer pass over every entry).
4. `Person.virtues` is replaced by `PersonVirtue` rows, and the profile lists
   them with the speaker named where it is not al-Dhahabi.
5. A quiz question about a virtue quotes exactly one entry.
6. Every volume 4-5 citation excerpt is an exact span of its cited paragraph
   (or seam) and every anchor resolves.
7. The contents list shows a heading as printed for every entry that begins on
   a stored page.
8. `npm run lint`, `npx tsc --noEmit` and `npm test` pass; `catalog:validate`
   passes with approvals current; `sync:all` runs.

## Affected components

- `src/lib/catalog/quotedValue.ts` (+ test): matcher v2.
- `src/lib/catalog/types.ts`, `loadCatalog.ts`, `validateCatalog.ts`,
  `provenance.ts`, `quotedValueReport.ts`; `scripts/data/validateCatalog.ts`,
  `projectCatalog.ts`, `catalogChecklist.ts`: the virtue list.
- `prisma/schema.prisma` and a new migration under `prisma/migrations/`:
  `PersonVirtue` (person, position, text, speaker, claim key); drop
  `Person.virtues`.
- `src/app/people/[slug]/page.tsx`, `src/components/language/translations.ts`:
  list with speaker label, Arabic and English.
- `src/lib/quiz/generate.ts` (+ test): `VIRTUE_HOLDER` quotes one entry.
- `data/catalog/people/*.ts`: re-author virtues. The batches already hold one
  claim per virtue (Hatib has six).
- `data/history/batches/*/batch.json`: only to fix excerpts and anchors.
- `docs/extraction-checklist.md`: describe the virtue entry.

## Validation

- Matcher tests: seam edit, dropped marks and punctuation space, contiguous
  clip passes, stitched or reordered fails.
- Validator and report tests on a virtue list: an entry with two speakers
  fails, an unnamed speaker fails.
- Projector test that entries land as ordered `PersonVirtue` rows.
- Component test for the profile list; quiz test for a single-virtue prompt.
- Real catalog: `catalog:validate` and `catalog:quoted-report`.

## Data and operational consequences

- Changing a batch lapses its publication approval and `catalog:validate`
  treats its claim keys as unknown, so batch edits are re-approved in one
  pass ("publish", not "mark reviewed"). Eight batches were already pending
  approval before this work: abu-ubaydah-pilot, arwa-bint-abd-al-muttalib-siyar175,
  fatimah-bint-muhammad, qutaylah-bint-qais-al-kindiyyah, saad-ibn-abi-waqqas,
  safiyyah-bint-huyayy, talhah-ibn-ubaydullah, umm-shareek.
- Catalog and schema reach PostgreSQL and Neo4j through the migration,
  `history:import --apply` for changed batches, then `npm run sync:all`.
- `name` changes reach Neo4j labels; check the graph once.
- `graph:layout` need not rerun: no edge changes.

## Open issues

### Blockers

None.

### Nonblocking

- Another host for volumes 1-2 (vowelled text and footnotes).
- Entries not yet extracted (for example Sa'id ibn Zayd's page content) have no
  heading in the store.
- A value that cannot be one contiguous span stays unquoted and is listed in
  the report (mid-lineage nisbas, values composed from far-apart passages).
- The `Ayah` table's text is unchecked ([quran-as-a-source.md](quran-as-a-source.md)).
- Pages drifting from Shamela in vowelled volumes are not re-fetched; the
  validator and a later all-volume review are the safeguards.
