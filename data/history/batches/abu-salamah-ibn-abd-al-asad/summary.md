# Batch: Abu Salamah ibn Abd al-Asad, Siyar entry 8

This batch preserves al-Dhahabi's complete entry on Abu Salamah ibn Abd
al-Asad and supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-salamah-ibn-abd-al-asad/](accounts/abu-salamah-ibn-abd-al-asad/)

## Source account

Entry 8 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from
printed page 150 to page 153.

Page 150 opens mid-page with the tail of the Uhud martyrs' roster that closes
Musab ibn Umayr's entry, entry 7. Abu Salamah's own entry starts at `150-p2`
with its heading, and its `(*)` source list sits in the same page's notes,
right after the heading, so the page's notes belong to this entry outright.
Page 153 closes the entry at `153-p8`, "وقيل: مات أبو سلمة سنة ثلاث", and its
next paragraph opens entry 9, على عثمان بن مظعون. That page's notes carry six
footnotes for Abu Salamah's own entry followed by a `(*)` source list that
matches Uthman ibn Maz'un's entry instead, so the account keeps the six and
drops the `(*)` block.

Abu Salamah already had a catalog entry of his own,
[data/catalog/people/abu-salamah.ts](../../../catalog/people/abu-salamah.ts),
authored earlier from `prophet-muhammad-sira`. This batch adds to it.

## What the entry supports

Three claims and four citations.

**Father, now a cited relation.** The entry's heading itself names his
father, "أبو سلمة بن عبد الأسد بن هلال" (`150-p2`), and backs the `SON` edge
to Abd al-Asad ibn Hilal that the seed asserted without a citation.

**One title.** The entry calls him "وأحد السابقين الأولين" (`150-p5`), which
matches the catalog's `al-sabiqoon` title. `companion` stays on its legacy
marker: this entry never states his companionship in those words.

**A competing death year.** Two lines in this entry put his death in year 3
AH rather than year 4: the opening summary says "مات كهلا، في سنة ثلاث من
الهجرة" (`151-p1`), and the closing line says outright "وقيل: مات أبو سلمة
سنة ثلاث" (`153-p8`). The catalog's `deathYearHijri` already holds year 4,
established in `prophet-muhammad-sira` from al-Dhahabi's own dated account of
the wound reopening in Jumada al-Akhirah. This entry's own dated account
(`153-p6`, `153-p7`) gives the same report, month and year, almost word for
word: the passage the sira batch already cited from page 444 and the passage
here from page 153 both read "دخل أبو سلمة المدينة انتقض جرحه، فمات لثلاث
بقين من جمادى الآخرة" (page 153 continues ", يعني: سنة أربع"). Since
al-Dhahabi states year 4 with a named source and month, then flags year 3
only as "وقيل" without one, the field keeps year 4 and the year 3 reports are
recorded as a `DISPUTED` claim rather than overwriting it.

## Corroboration against the sira batch

`prophet-muhammad-sira` already cites Abu Salamah for his hijra to Abyssinia,
his hijra to Medina, his full name, his mother, his death year and his
marriage to Umm Salamah, plus the Qatan expedition. None of this entry
contradicts those claims.

**Hijra to Abyssinia.** This entry's own report, citing Ibn Ishaq, reads "هو
أول من هاجر إلى الحبشة" (`151-p2`), matching the sira batch's
`abu-salamah/hijra-habasha-first` claim.

**The Qatan expedition.** This entry's account of the standard, the raiding
party of a hundred and fifty, and the fortnight away (`153-p2` through
`153-p5`) is close to word for word the sira batch's
`abu-salamah/sariyyah-qatan` claim, down to the same figure, "خمسون
ومائة". Both trace to al-Waqidi, so this is one report cited twice rather
than two independent accounts, and no new claim is added for it.

**Umm Salamah's remarriage.** The entry gives an extended account of Umm
Salamah's mourning, her turning down Abu Bakr and Umar, and her marriage to
the Prophet (`150-p6`, `150-p7`, `152-p2` through `152-p4`). The catalog
already holds the `HUSBAND`/`WIFE` relation between Abu Salamah and Umm
Salamah from the sira batch; this account adds detail the model has no field
for, so it stays in the source text.

## What the model has no shape for yet

**Umm Salamah's own hadith reports** about the words to say at a death, and
her account of grieving Abu Salamah before her remarriage (`150-p7` through
`152-p1`), are her narration rather than a value the catalog records about
either of them.

**His children by Umm Salamah**, "سلمة، وعمر، ودرة، وزينب" (`151-p4`), are
named but none of them has a catalog entry yet, so the relation stays in the
source text rather than becoming a person node with no other data.

## Leaving the seed

There is no seed to retire: Abu Salamah already has no `prisma/personSeedData*.ts`
entry of his own; the mother he carries on a citation and the milk-brotherhood
relation both came from the earlier `prophet-muhammad-sira` batch, not from a
seed row.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
