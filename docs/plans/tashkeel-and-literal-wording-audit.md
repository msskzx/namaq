# Quoted values: vowel marks and exact wording

Status: **ready**. Nothing below is implemented. Terms are in
[CONTEXT.md](../../CONTEXT.md) (Seam, Quoted value, Known name).

## Why

A reader noticed that profile text and the sources contents list do not match
al-Dhahabi's printed Arabic, and that vowel marks (tashkeel) are missing. The
investigation found three separate causes:

- **Catalog values are the profile.** A profile's `fullName` and `kunya` come
  from `data/catalog/people/<slug>.ts`, not from a batch. Zubayr's `fullName`
  there is already vowelled; the unvowelled text the reader saw was `name`, the
  short label. So the exactness rule applies to the catalog, and an earlier
  attempt that rewrote `claim.assertion` in 25 batches (PRs 258-282, closed
  unmerged) fixed a field no profile value reads.
- **The Sira volumes are bare at the source.** Shamela serves volumes 1 and 2
  without tashkeel and without footnotes (checked on `10906/428`). Our stored
  pages for them match it. Volumes 4 and 5 are vowelled. Nothing to re-extract
  until another host is chosen, which is out of scope here.
- **Nothing enforces exactness.** `scripts/history/verifyExcerpts.ts` proves a
  citation excerpt is a literal piece of its stored page and nothing else. No
  check ties a catalog value or a heading to a passage.

## Agreed behavior and scope

- Scope is volumes 4 and 5 only, decided per value by the volume its citations
  point at. A subject with citations in both keeps its volume 1-2 values as
  they are.
- A **quoted value** reads exactly as the cited passages print it, with vowel
  marks. It may differ only by: dropping the entry number, the `*`/`(ع)`
  collection marks, footnote markers and a closing full stop; clipping to the
  span it needs; and the seam edit (`ابْنِ` at the start of a sentence becomes
  `بنِ`). Nothing else is respelled, reordered or normalised.
- Field classes (verified against `src/lib/catalog/types.ts`):

  | Class | Fields | Rule |
  | --- | --- | --- |
  | Quoted | `fullName`, `kunya`, `tribalAffiliation`, `appearance`, `virtues`, `placeOfBirthArabic`, `placeOfDeathArabic`, battle and event `location`, event `description`, participation `summary` (cited like `virtues`), utterance text, `speakerName`, `grading`, `occasion`, `name`, title names | Must pass the quoted-value check |
  | Structured | `sex`, `hijriYear`, `engagement`, force and death counts | No text check; the citation is the evidence |
  | Authored | transliterations, Gregorian years | Left alone |
  | Reference | `ayat` (`surah`, `ayah`) | The text is never copied from the source: it is read from the `Ayah` table. The check is that the reference resolves |

  Year strings (`deathYearHijri` and similar) are typed as text; the report
  lists them for review and does not fail them.
- Citation excerpts, stored pages with their footnotes, and chapter headings
  are held to the same rule.
- `name` is the known name: a clipped, vowelled span of the chapter heading,
  chosen by the author and checked only to be a literal span of that heading.
  A subject with no such span stays `legacy-unreviewed`.
- `fullName` keeps the nisbas and drops only the closing full stop. For Abu
  Ubaydah it is `عَامِرُ بنُ عَبْدِ اللهِ بنِ الجَرَّاحِ بنِ هِلاَلِ…المَكِّيُّ`,
  with `الجَرَّاحِ` once, because al-Jarrah is the grandfather and the heading's
  `أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ` is the known name.
- A stored page is re-fetched from Shamela only when it has no vowel marks, and
  today that means volumes 1 and 2, where it changes nothing. A later review
  pass will re-check every volume.
- `SubjectEvidenceAccess` shows the cited excerpt, as `ClaimEvidence` already
  does, instead of `claim.assertion`.
- Out of scope: another host for volumes 1-2, extracting entries not yet in the
  store, and editing `claim.assertion`.

## Acceptance criteria

1. A read-only report lists every catalog value, heading and citation in
   volumes 4-5 that is not a quoted value, with the passage it should match.
2. `catalog:validate` fails on a text value or `name` whose claims' passages do
   not contain it as a quoted value, once the report is clean. Subjects with
   `legacy-unreviewed` values are skipped, as they are today.
3. Every volume 4-5 citation anchor resolves to a passage that contains its
   excerpt; the 14 bare citations (for example Abdullah ibn Amr ibn Haram,
   `4/324-p10`) are traced and fixed or explained.
4. The `volume` field on citations is one form (`4`, not `1` or `السيرة 1`), so
   per-volume scoping counts correctly.
5. The sources contents list shows the heading as printed, vowelled, for every
   chapter present in the store.
6. `SubjectEvidenceAccess` no longer prints `claim.assertion`.
7. `npm run lint`, `npx tsc --noEmit` and `npm test` pass, and
   `npm run catalog:validate` passes on the real catalog.

## Affected components

Verified paths; changes marked proposed are new.

- `src/lib/catalog/validateCatalog.ts` and `scripts/data/validateCatalog.ts`:
  add the quoted-value check. It needs each value's claim keys, resolved through
  the batches to passages (`src/lib/history/sourceStore.ts`, `pageAnchors`), so
  the check lives beside `approvedClaimKeys` in the script. Proposed new
  helper: a pure function in `src/lib/catalog/` that takes a value and its
  passages and returns the span match or the first mismatch, tested in
  `validateCatalog.test.ts`'s style.
- `scripts/history/verifyExcerpts.ts`: keep; the new check reuses its
  normalisation of footnote markers and extends it to the permitted drops.
- `src/lib/history/sectionHeadings.ts`, `volumeChapters.ts` and
  `src/components/sources/SourceContents.tsx`: headings already come from the
  stored page; find why a chapter falls back to the catalog name
  (`item.entries[0]?.label`) and fix the cause (missing page, or heading not
  detected).
- `src/components/graph/SubjectEvidenceAccess.tsx:62`: show the excerpt.
- `data/catalog/people/*.ts`: fix failures the report finds. The Abu Ubaydah
  pilot is the reference.
- Batches under `data/history/batches/`: only to fix anchors and `volume` form.
- `src/lib/subjectSearch.ts` already strips diacritics, so vowelled names do
  not break search.

Order: normalise `volume` and trace the 14 anchors, then the report, then fix
by bucket, then turn the check on.

## Validation

- Unit tests for the span matcher: the seam edit, a dropped entry number and
  marks, a clipped span, a value that is respelled (fails), a value that
  reorders (fails), and the Abu Ubaydah and Zubayr values (pass).
- A test that a vowelled `name` still matches its search query.
- A component test that `SubjectEvidenceAccess` shows the excerpt.
- `npm run catalog:validate` on the real catalog is the integration check.

## Data and operational consequences

- Changing a batch's citations or `volume` field lapses its recorded
  publication approval, and `catalog:validate` then treats that batch's claim
  keys as unknown. Fix catalog files and batches together and re-approve in one
  pass at the end ("publish", not "mark reviewed").
- Page corrections touch the shared store under `data/history/sources/`: one PR
  per volume. Catalog fixes: one PR per ten or so subjects.
- Catalog edits reach PostgreSQL and Neo4j through `npm run sync:all` after
  `history:import --apply` for the changed batches. `name` changes reach Neo4j,
  so the graph label width may change; check the graph visually once.
- `graph:layout` need not rerun: no edge changes.

## Open issues

### Blockers

None.

### Nonblocking

- The Qur'an text in the `Ayah` table (seeded from `api.alquran.cloud`, edition
  `ar.hafs`) has not been checked for correctness, as
  [quran-as-a-source.md](quran-as-a-source.md) already says. Ayat display
  depends on it, so a later pass checks the table. Not part of this plan.

- Another host for volumes 1-2 (vowelled text and footnotes); the user's call.
- Entries not yet extracted (for example Sa'id ibn Zayd) have no heading in
  the store; extracting them is separate work.
- A subject whose heading holds only the full lineage and no short known name
  may need `name` left `legacy-unreviewed`; decide per case in the report.
- Pages drifting from Shamela in vowelled volumes are not re-fetched; the
  validator against stored pages and the later all-volume review are the
  safeguards.
