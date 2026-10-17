---
status: proposed
---

# A grouping of ayat is a work's own statement

Namaq does not author topics or tags for ayat (R2 in
[owner-goals.md](../plans/data-model/owner-goals.md)). A grouping of ayat enters
the model only as what a published work says, attributed to that work and shown
under its name. Two link records on the rethink model
([plan.md](../plans/data-model/plan.md)) carry it, shaped like `SharhLink`
rather than as Assertions, since an Assertion's subject is a Mention.
`LISTS_AYAH {unit, surah, ayah, basis}` says that an entry of a work lists an
ayah, with the quoted span as its basis. A mutashabih entry that sets 57:1
beside the openings of 59, 61, 62 and 64 lists five ayat.
`EXPLAINS_SURAH {unit, surah, basis}` says that a passage describes a whole
surah by its number, as Ibn Ashur's أغراض do; it is not split into a link per
ayah, because the author said nothing about each ayah. The units are of two new
kinds, `entry` and `surah-intro`. Works such as al-Kirmani's أسرار التكرار take
a new genre, `ULUM_QURAN`, since they are not running commentaries.

There is no link from one ayah to another. That two ayat are parallels is
derived from their being listed in the same unit of one work, and is shown as
that work's statement. Nothing equates a grouping in one work with a grouping in
another.

A quoted fragment becomes a link only after two checks: a strict match finds it
on the book's page, and the Qur'an normalizer finds it in exactly one ayah. The
search runs in the surah the author names, else the surah heading the work
prints, else the whole Qur'an. Any other result is flagged and left unlinked. A
link follows each reading the quotation matches (plan.md section 2.15); while
the `Ayah` table holds Hafs only, a fragment that may follow another reading is
flagged on its own. The steps, files and targets are in
[quran-attributed-groupings.md](../plans/quran-attributed-groupings.md).

## Considered options

- A closed topic vocabulary built by agents from a sample of surahs. It would
  compare well across surahs, but the vocabulary and every assignment to it are
  groupings Namaq wrote.
- A published topical index. Quranpedia's names no compiler and has no topics
  for 64:1-9 or 57:1-11. تفصيل آيات القرآن الحكيم survives only as scans; the
  owner left it out of scope.
- An ayah-to-ayah pair link for mutashabih works. The authors contrast groups
  (سبح in 57, 59 and 61 against يسبح in 62 and 64), not pairs, so pair links
  would add structure they did not state.

## Consequences

Comparison of ayat by theme reaches only as far as the attributed works do.
Most ayat in 64:1-9 and 57:1-11 have no parallel in the mutashabih works and
stay unlinked. The existing `themeId` topics are groupings Namaq wrote and
conflict with this decision; the owner has not yet ruled on them.
