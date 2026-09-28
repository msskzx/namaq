# Batch: Aban ibn Said, Siyar entry 49

This batch preserves al-Dhahabi's entry on Aban ibn Said al-Umawi and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and the [extraction checklist](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/aban-ibn-said/](accounts/aban-ibn-said/)

## Source account

Entry 49 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The whole entry
fits on printed page 261 (Shamela 1687), which it shares with entry 48 (Khalid
ibn Said) above and entry 50 (Amr ibn Said) below.

The extraction slices the page between anchors `p1` (the heading
"٤٩ - أَبَانُ بنُ سَعِيْدٍ الأُمَوِيُّ") and `p8` (the dangling "وَأَخُوْهُمَا:"
that hands the page to entry 50). Entry 48's notes do **not** run onto this
page: the page's single footnote block opens with entry 49's own `(*)` source
list, so no notes-start marker is needed, and a `--notes-start-marker "(*)"`
would be a no-op. Entry 50's notes begin at `(* *)` inside the same block and
are trimmed there with `--notes-end-marker`.

The entry is eight paragraphs: heading, kunya and the Uthman episode, a verse
Aban said on receiving Uthman, the conversion and migration, the Prophet's
appointment, the death at Ajnadayn, a closing note on his kinship to Abu
Jahl, and the colon that introduces his brothers.

`aban-ibn-said` had a catalog file before this batch, carried from the
retired graph seeds with every value on the legacy marker. The batch visits
each of them.

## What the entry supports

Seven claims and ten citations.

**Full name (nasab).** The heading gives "أَبَانُ بنُ سَعِيْدٍ الأُمَوِيُّ"
(`4/261-p1`), and nothing further: the chain stops at his father. The carried
value read "أبان بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي
القرشي الأموي", and the catalog value is now the shorter chain the source
states. This is not a disagreement between two readings of the book — entry
48, two printed pages earlier, gives exactly that longer chain for his brother
Khalid — but entry 49 does not repeat it, and a value that outruns its source
is evidence debt. The line from Sa'id up to Abd Shams and Quraysh stays
visible in the graph through the `SON` edge.

**Father.** "بنُ سَعِيْدٍ" (`4/261-p1`) names the father, so the `SON` edge to
`said-ibn-al-as` is promoted to a cited claim. The heading gives the name
"Sa'id" only; identifying that Sa'id with the catalog's `said-ibn-al-as`
(Sa'id ibn al-As) rests on entry 48's chain for Khalid, in this same section.

**Kunya.** "أَبُو الوَلِيْدِ الأُمَوِيُّ" (`4/261-p2`).

**Virtues.** The entry accumulates: he accepted Islam late (`4/261-p2`), was a
wealthy merchant who travelled to Syria (`4/261-p2`), gave his cousin Uthman
sanctuary at Hudaybiyya when the Prophet sent him to Mecca (`4/261-p2`),
converted before the conquest and migrated (`4/261-p4`), was appointed by the
Prophet over the two seas in year nine (`4/261-p5`), and was martyred at
Ajnadayn alongside Khalid (`4/261-p6`).

**Companion title.** The entry never uses the word صحابي, but it records that
he migrated and that the Prophet appointed him, which is what the title
asserts, so the title is promoted to the same `virtues` claim. This is the
same handling entry 48's batch gave it.

**Siblings.** The entry names both brothers, Khalid (`4/261-p6`) and Amr
(`4/261-p4`), and states no mother for any of them, so both ties are
`HALF_BROTHER` per the checklist's rule that a shared father is not enough for
`BROTHER`. Paragraph 4 also records where the brothers came from: they had
already migrated from Abyssinia to Medina and sent for him, which agrees with
entry 48's account of Khalid's Abyssinian migration.

**Ajnadayn.** "ثُمَّ إِنَّهُ اسْتُشْهِدَ هُوَ وَأَخُوْهُ خَالِدٌ يَوْمَ
أَجْنَادِيْنَ عَلَى الصَّحِيْحِ" (`4/261-p6`) adds him to the `ajnadayn`
battle as a `PARTICIPATED_IN` participant with `MARTYRED` status and the
source's own sentence as the participation summary (ADR 0013).

## What the model has no shape for yet

**His verse.** Paragraph 3 is a line Aban said when he met Uthman: "أَقْبِلْ
وَأَنْسِلْ وَلاَ تَخَفْ أَحَداً ... بَنُو سَعِيْدٍ أَعِزَّةُ البَلَدِ". It is
preserved in the account page; the editor's footnotes give the line as other
works read it and gloss أنسلت القوم.

**Abu Jahl.** "وَأبَانُ: هُوَ ابْنُ عَمَّةِ أَبِي جَهْلٍ" (`4/261-p7`) makes Abu
Jahl his paternal uncle's son. The catalog has no relation type for a cousin,
so this stays in the source text.

**His brothers, unnamed.** The entry closes on "وَأَخُوْهُمَا:" and never
completes the list.

## Confirming absence

**Wives.** The page is one printed page and is read in full. The trigger
words (تزوج, امرأة, زوج) return no matches. Marked `notInSource`.

**Appearance.** The page is read in full and carries no physical description.
The trigger words (طويل, أسمر, وسيم, اللحية, الأدمة) return no matches.
Marked `notInSource`.

## Corroboration and disputes

**Entry 48, Khalid ibn Said.** Same section, same volume, one batch run, two
printed pages earlier. Two values meet across the two extractions and agree:
the entry's report that his
brothers had already come from the Abyssinian migration matches entry 48's
"وَهَاجَرَ إِلَى أَرْضِ الحَبَشَةِ" for Khalid, and the two entries place both
brothers' deaths at Ajnadayn. Neither entry gives a year, so no year is
recorded.

**Entry 50, Amr ibn Said.** The entry named here as عمرو is the same man whose
own entry opens at `4/261-p9` on the same page, which is what fixes the
identification — the famous Amr ibn al-As is a different person and is not
implied. Entry 50 has no batch yet.

**No value is overwritten from the seed.** The fullName shortening is
described above.

## Evidence still owed

`npm run catalog:ledger -- --batch data/history/batches/aban-ibn-said`
reports what this batch walked past, all of it outside its own page:

- `aban-ibn-said` and `khalid-ibn-said` `fields.sex` — the Siyar states no
  sex; the marker stays.
- `said-ibn-al-as` `fields.sex` and `relations[0]` — his own entry is not in
  scope for this batch.
- `amr-ibn-said-al-umawi` `fields.sex`, `fields.fullName`, `titles[0]` and
  `relations[0]` — this batch adds only the sibling edge on Aban's side;
  entry 50 owes the rest.
- `ajnadayn` `fields.engagement`, `fields.hijriYear`, `fields.location` and
  its first three participants — the battle file's own carried values, owed by
  whichever batch first reads a battle entry.

## Leaving the seed

`prisma/personSeedData*.ts` does not carry `aban-ibn-said` (he was a
graph-seed-only subject). The catalog file at
`data/catalog/people/aban-ibn-said.ts` is updated in place: `fullName` is
promoted to a cited claim and shortened to the chain the source states,
`kunya` and `virtues` are added as cited claims, the `companion` title is
promoted, the `SON` edge to `said-ibn-al-as` is promoted, and two
`HALF_BROTHER` edges are added. `fields.sex` stays on the legacy marker.
`data/catalog/battles/ajnadayn.ts` gains him as a participant.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch carries
no approval.
