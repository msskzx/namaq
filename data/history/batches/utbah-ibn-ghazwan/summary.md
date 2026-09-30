# عتبة بن غزوان

## Entry

- **Source**: سير أعلام النبلاء، شمس الدين الذهبي، تحقيق حسين الأسد
- **Volume**: 4 (سير أعلام النبلاء ج١)
- **Printed pages**: 304–306
- **Shamela pages**: 1730–1732
- **Entry**: 59

## Source account

Three printed pages, all in one volume, so the account declares
`volumeNumber: 4` and the anchors are plain `<printed>-<paragraph>`.

The reading page for 304 (`1730`) is shared with entry 58, أسعد بن زرارة, whose
last two paragraphs are `p1` and `p2`; the slice starts at `p3`, the entry's own
heading, and keeps `p3`–`p7`. Its single footnote block carries entry 58's `(١)`
first and then this entry's `(*)`, so the notes are trimmed at the `(*)` marker
— `001.notes.md` holds the bibliography line and nothing of his neighbour's.
Pages `1731` and `1732` belong to this entry alone, so nothing is cut at
either end. Entry 60 (عكاشة بن محصن) opens `1733` at its own `p1`, so the last
paragraph here — the khutbah and the editor's note that Muslim has it at 2967 —
is the entry's real end.

The pages themselves were already extracted when a previous run stopped. They
were checked against the source rather than trusted: the printed page numbers,
the paragraph boundaries and both notes files all match what the reading pages
serve today, and the anchor count matches the paragraph count on each page
(5, 7, 10). `001.md` keeps the `*` that typesets the `(*)` note in the middle of
the heading line, which is the source's own text and is left as printed.

## What the entry supports

Thirteen claims, thirteen values, one of them a battle participation.

- `full-name` — the chain the heading opens with,
  `عُتْبَةُ بنُ غَزْوَانَ بنِ جَابِرِ بنِ وُهَيْبٍ` (`304-p3`).
- `father` — SON → `ghazwan-ibn-jabir`, on the same patronymic (`304-p3`).
- `kunya` — `أَبُو غَزْوَانَ` (`304-p3`).
- `tribal-affiliation` — `المَازنِيُّ، حَلِيْفُ بَنِي عَبْدِ شَمْسٍ` (`304-p4`).
- `titles` — صحابي, on his being the seventh to convert and witnessing Badr
  (`304-p5`) and on `وَلِي صُحْبَةٌ قَدِيْمَةٌ` (`305-p7`), the Prophet's own words
  for a companionship that predates the question.
- `virtues` — the three epithets `السَّيِّدُ، الأَمِيْرُ، المُجَاهِدُ` (`304-p4`)
  and the paragraph that follows them: the seventh of the first seven, the
  migration to Abyssinia, Badr and the raids after it, one of the archers
  al-Dhahabi names, one of the commanders of expeditions, and the founder of
  Basra (`304-p5`).
- `virtues-basra` — Umar's appointment over Basra, the town he settled and
  surveyed, the mosque he built of reeds and the house he did not build
  (`305-p2`), with the second report that Basra was called the land of India
  and that he was the first to settle it, in 800 (`305-p3`).
- `virtues-khutbah` — the address (`306-p9`–`306-p10`) and the note that his
  hadith is in Muslim (`306-p7`).
- `badr` — PARTICIPATED_IN badr, summarised in the source's own words: he
  witnessed Badr and the raids, and was one of the archers named (`304-p5`).
- `death-year` — 17 (`306-p5`).
- `death-place` — `بطريق البصرة` (`306-p5`).
- `kunya-alt` and `death-year-alt` — the two competing reports, see below.

## Two claims the model can hold but the catalog carries once

The entry disputes two values the model does hold, so each rival report is a
claim of its own, `DISPUTED` and flagged `disputed`, and neither is carried
into `data/catalog/people/utbah-ibn-ghazwan.ts`. This is the pattern
`abdullah-ibn-al-harith-ibn-nawfal`'s `death-year-alt` and
`abu-al-haytham-ibn-at-tayyahan`'s `full-name-alt` already set.

- **Kunya.** `وَقِيْلَ: كُنْيَتُهُ: أَبُو عَبْدِ اللهِ` (`304-p7`) against the
  heading's own `أبو غزوان`, which the entry states twice. The catalog carries
  أبو غزوان.
- **Death year.** `وَقِيْلَ: مَاتَ سَنَةَ خَمْسَ عَشْرَةَ، وَعَاشَ سَبْعاً
  وَخَمْسِيْنَ سَنَةً` (`306-p6`) against `توفي بطريق البصرة وافداً إلى المدينة
  سنة سبع عشرة` (`306-p5`). The catalog carries 17. Both readings are in the
  source: the 15 also appears with a lifespan, and a second, independent
  statement of 17 sits at `306-p4` (`وَقَدِمَ سُوَيْدٌ غُلاَمُهُ بِتَرِكَتِهِ عَلَى
  عُمَرَ، وَذَلِكَ سَنَةَ سَبْعَ عَشْرَةَ`), which is left uncited because it
  repeats the year `death-year` already carries.

## Checklist results

| Item | Status |
|---|---|
| Nasab (fullName) | Found — the heading's chain, printed 304 |
| Nasab (father edge) | Found — غزوان بن جابر, a catalog person |
| Kunya | Found — أبو غزوان, plus a rival reading |
| Manaqeb | Found — the three epithets, the raids, Basra, the address |
| Appearance | Confirmed absent — a diacritic-stripped grep for طويل/أسمر/القصير/الأدمة/أفطس/أبيض/أشقر/امتلأ/هيم across all three pages hits nothing |
| Wives | Confirmed absent — the same grep for تزوج/زوج/امرأة/نكح/خطب/إيلاء hits nothing; the one `خطب` is the editor's note quoting Muslim's own wording for the address, not a marriage |
| Siblings | Confirmed absent — the same grep for أخو/أخت/شقيق hits nothing |

## The sister already in the graph, and why nothing is added

`data/catalog/people/munyah-bint-ghazwan.ts` declares
`SISTER → utbah-ibn-ghazwan` on the legacy marker, so the graph already carries
a sister for him. This entry says nothing about a sister, or about any wife or
son, so there is nothing here to promote and no edge to correct. The relation
is left exactly as it is and the sibling item is marked `notInSource` on the
strength of the source, not on the strength of the graph. His father's module
(`ghazwan-ibn-jabir.ts`) holds the same `SON → jabir-ibn-wuhayb` edge this
entry's chain agrees with, and is left untouched for the same reason.

## Citations: one selection per record

Each of the seventeen citations holds one selection, and the excerpt is the
selection as the page prints it. `npx tsx scripts/history/verifyExcerpts.ts`
confirms sixteen of the seventeen are literal substrings of the paragraph their
anchor names.

The seventeenth is the address. Its selection runs from the attribution
`خَطَبَنَا عُتْبَةُ بنُ غَزْوَانَ، فَقَالَ:` into the words themselves, and the
printed page puts those in two paragraphs: `306-p9` and `306-p10`. Rather than
cut the sentence at the break and record two half-citations, the citation
anchors the paragraph the selection starts in and carries both, so
`verifyExcerpts` reports it as not a substring of `306-p9` alone. It is the
price of one record for one selection, and the two halves are contiguous, so
there is no ellipsis to mark.

Two excerpts drop the editor's inline footnote markers (`(٢)`) where the marker
falls between the words the value needs; `305-p2`'s excerpt ends before its own
`(١)`. Elsewhere the markers are left in place, as at `305-p7` and `304-p3`,
where the `*` is part of the printed line.

## Legacy values visited

`data/catalog/people/utbah-ibn-ghazwan.ts` carried four legacy values.

- **`sex` MALE** — left `legacy-unreviewed`. The entry never states his sex
  outright; what it gives is masculine agreement (`أَسْلَمَ`, `هَاجَرَ`, `شَهِدَ`),
  which is not a statement about it. Same call as
  `muadh-ibn-amr-ibn-al-jumuh` and `saad-ibn-khaythamah`, the two batches
  either side of this one in the run.
- **`fullName`** — promoted, and split. The legacy value carried the chain and
  then the labels, `… بنِ وُهَيْبٍ المَازنِيُّ حَليفُ بَنِي عَبْدِ شَمْسٍ`. The
  heading's chain is the new `fullName` and the labels moved to
  `tribalAffiliation` (`المازني، حليف بني عبد شمس`), which is where
  `saad-ibn-khaythamah` and `al-baraa-ibn-marur` put them. Nothing was dropped.
- **`companion` title** — promoted.
- **`SON` → `ghazwan-ibn-jabir`** — promoted. The reciprocal `FATHER` edge
  reaches the graph from projection, as the catalog declares a relation from one
  side.

## Battle registration

`data/catalog/battles/badr.ts` did not list him. The roster was extended with
one row at the end, after `bishr-ibn-al-baraa` (entry 54) and in Siyar order
after it, since he is entry 59. The row carries no status: attendance and
outcome are separate (ADR 0013), and this entry dates his death fifteen years
after Badr, on the road to Basra.

## Not modelled

- **The address's fuller text**, which the edition's own note quotes from
  Muslim (2967) at `003.notes.md`: the stone hurled from Hellfire's lip, the
  forty years between the gates of Paradise, the patched cloak shared with
  سعد بن مالك. It is a longer text than the one al-Dhahabi prints, cited by
  him rather than written by him, and the model has no shape for it. It stays
  in the note.
- **His teachers and students** (`حَدَّثَ عَنْهُ: خَالدُ بنُ عُمَيْرٍ
  العَدَوِيُّ …` `304-p6`), the Umar exchange that ends with his death on the
  road (`305-p4`–`306-p3`), and the account of Basra's black stones and its
  seven channels of lime (`305-p3`). No field holds any of it, and a
  transmission chain does not become a node.
- **The `من شهداء اليمامة` heading** in the book's index, which the index
  places over entries 57–61. This entry says nothing about Yarmama and dates
  his death to 15 or 17 AH, years after it, so no martyrdom is recorded. The
  heading is the book's grouping, not a statement in the account, and it is
  not among the values the model holds.

## Ledger

`npm run catalog:ledger -- --batch data/history/batches/utbah-ibn-ghazwan`
lists five values still awaiting evidence.

- `people/utbah-ibn-ghazwan` `fields.sex` — left `legacy-unreviewed`, as above.
- `people/ghazwan-ibn-jabir` `fields.sex` and `relations[0]` — his module is
  left untouched. Nothing contradicts it: this entry's chain, عتبة بن غزوان بن
  جابر بن وهيب, agrees with its `SON` edge to جابر بن وهيب. Both values are
  owed a claim from a batch that reads his own entry.
- `battles/badr` `fields.location` and `participants[0]` — the battle's own
  legacy values, reached because this batch's participation claim names the
  battle. This entry says nothing about where Badr was and names none of the
  roster's other participants, so neither is visited here.

## Review

Nothing is reviewed. Every claim is `NOT_REVIEWED`, and the batch carries no
approval block: approving for publication and marking claims reviewed are the
user's separate decisions.
