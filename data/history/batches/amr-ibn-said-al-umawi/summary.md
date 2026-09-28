# Batch: Amr ibn Said al-Umawi, Siyar entry 50

This batch preserves al-Dhahabi's entry on Amr ibn Said ibn al-As al-Umawi and
supports the records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/amr-ibn-said-al-umawi/](accounts/amr-ibn-said-al-umawi/)

## Source account

Entry 50 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
across printed pages 261–262, one of the shortest entries in the book. Both
pages are shared: page 261 opens with the tail of entry 49 (Aban ibn Said) and
page 262 continues into entry 51 (al-Ala ibn al-Hadrami).

The extraction keeps entry 50's own two paragraphs on page 261 (its heading
`٥٠ - عَمْرُو بنُ سَعِيْدِ بنِ العَاصِ الأُمَوِيُّ **` and the line that opens with
`لَهُ هِجْرَتَانِ`) and its six paragraphs on page 262, ending with
`فَأَبَوا، وَخَرَجُوا إِلَى الشَّامِ، فَقُتِلُوا`. The notes are trimmed at the
`(* *)` marker on page 261 and the `(*)` marker on page 262, so neither page
carries a neighbour's references.

The last line of page 261 breaks mid-sentence inside `(مُسْنَدِ الإِمَامِ`; the
sentence closes with `أَحْمَدَ) .` at the top of page 262. That is the edition's
own pagination and the pages keep it as it falls.

`amr-ibn-said-al-umawi` had a catalog file before this batch, carried from the
retired graph seeds with every value on the legacy marker. The batch visits each
one: `fullName` is promoted to a cited claim, the `SON` edge to
`said-ibn-al-as` and the `companion` title are promoted to cited claims, and
`virtues` and the two `HALF_BROTHER` edges are added. `sex` stays on the legacy
marker — the source never states his sex explicitly, though the entry's
masculine forms leave no doubt about it.

The seed's `fullName` read
`عمرو بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي`,
a chain longer than the source's. Entry 50 gives the heading and stops, and it
never says القرشي. The catalog value is shortened to what the source states,
the same call the adjacent batch made for Khalid ibn Said (entry 48), whose
heading carries the longer chain this entry's does not.

## What the entry supports

Seven claims and eleven citations.

**Full name (nasab).** The heading gives "عَمْرُو بنُ سَعِيْدِ بنِ العَاصِ
الأُمَوِيُّ" (`261-p9`), so `fullName` holds "عمرو بن سعيد بن العاص الأموي".

**Father.** The same heading names his father as سعيد بن العاص (`261-p9`), so
the `SON` edge to `said-ibn-al-as` is promoted from the legacy marker to a cited
claim. The `FATHER` side is already declared on `said-ibn-al-as`.

**Virtues.** He had two migrations, to Abyssinia and then to Medina
(`261-p10`). On the death of the Prophet his uncles — "خَالِداً، وَأَبَاناً،
وَعَمْراً" — left their work (`262-p4`), refused to go back to it on Abu Bakr's
word, and went out to the Sham where they were killed (`262-p6`).

**Brothers.** The entry calls the two men he fell with his brothers —
"مَعَ أَخَوَيْهِ" (`262-p2`) — and the report names them: Khalid and Aban
(`262-p4`). Both share his father and no mother is stated anywhere, so both
edges are `HALF_BROTHER` rather than `BROTHER`
(docs/extraction-checklist.md, item 6). The reciprocal edges are declared on
`khalid-ibn-said` and `aban-ibn-said`, which is where a reader of those
profiles looks for the tie.

**Yarmouk.** "اسْتُشْهِدَ يَوْمَ اليَرْمُوْكِ ... مَعَ أَخَوَيْهِ" (`262-p2`) adds
him to `yarmuk` as a participant with `MARTYRED` status.

**Ajnadayn.** The same sentence offers Ajnadayn as an alternative —
"وَيُقَالُ: يَوْم أَجْنَادِيْنَ". Both readings are recorded, each in its own
claim, because the model holds the event: `yarmuk` takes the reading the entry
states, and `ajnadayn` takes the alternative with the claim marked `disputed`.
The attribution stays visible in each participation's `summary`, the wording
al-Dhahabi gives it.

The entry itself pulls both ways, and the second reading has support inside the
same entry. Its closing report says the three brothers went out to the Sham and
were killed, which fits Ajnadayn, while the sentence above it says Yarmouk. The
two brothers' own entries add to the tension rather than settling it: entry 48
has Khalid killed at Ajnadayn and entry 49 has Aban and Khalid martyred there
"على الصحيح" (the more correct view), with no mention of Yarmouk in either.
Recording one reading and dropping the other would pick a winner the source
does not. The disputed flag is the honest state, and it is the same one
`suhail-ibn-amr` carries for his two death accounts.

## What the model has no shape for yet

**The hadith in Musnad Ahmad.** The entry notes "وَلَهُ حَدِيْثٌ فِي (مُسْنَدِ
الإِمَامِ أَحْمَدَ) .", split across the page turn (`261-p10` and `262-p1`). The
model holds no field for it, so it stays in the source pages. It is also the
one selection in this entry that no single paragraph contains, so no citation
could carry it whole.

**The narrator.** `عَمْرُو بنُ سَعِيْدٍ الأَشْدَقُ` (`262-p3`) reports the closing
story. He is a different, later man than the subject, and a narrator rather
than someone the catalog models. Per the standing rule, transmission chains stay
in the source text.

**Abu Bakr's instruction.** "ارْجِعُوا إِلَى أَعْمَالِكُم" (`262-p5`) is what the
three refused. It is about them and not a value the model holds, so the virtues
text carries the refusal and the `virtues` claim stops short of the instruction.

## Confirming absence

**Kunya.** The entry gives no `أبو` form for him. The only `أبو` on the page is
Abu Bakr in the closing report. Marked `notInSource`.

**Appearance.** No physical description. The trigger words (طويلا, أسمر, أبيض,
وسيم, جميل) return no match. Marked `notInSource`.

**Wives.** No wife is named. The trigger words (تزوج, امرأة, زوج) return no
match across both pages. Marked `notInSource`.

## Legacy values this batch walks past

`npm run catalog:ledger -- --batch <dir>` reports every value whose evidence is
owed on the subjects this batch speaks about, including the ones its claims
point at. Each is left on the legacy marker, for these reasons:

- **`fields.sex` on the three brothers** (`amr-ibn-said-al-umawi`,
  `khalid-ibn-said`, `aban-ibn-said`) and on `said-ibn-al-as`. No entry in this
  batch states a subject's sex. The masculine forms leave it certain, but the
  value stays a marker rather than take a citation that does not say so.
- **`aban-ibn-said`'s `fullName`, `companion` title and `SON` edge to
  `said-ibn-al-as`.** Entry 49 is the neighbouring entry and has its own batch.
  Its text shares the printed page this batch starts on, and it does support
  those values, but they are authored there, not here.
- **`said-ibn-al-as`'s `SON` edge to `al-as-ibn-umayya`.** Said ibn al-As has no
  entry in this book within reach of this batch, so nothing here speaks to his
  own side of the tie.
- **`yarmuk` and `ajnadayn`'s `engagement`, `hijriYear` and `location`, and
  their first participants** (Umar, Abu Bakr, Abu Ubaydah). Carried from the
  retired seed. Neither entry in this batch dates or locates either battle or
  mentions those three men here.

## Corroboration and disputes

No other batch cites Amr ibn Said, so nothing here is corroborated. The Yarmouk
and Ajnadayn participations are new: both battles' participant lists come from
the retired seed, apart from Abu Ubaydah and Suhail ibn Amr at Yarmouk and
Khalid ibn Said at Ajnadayn.

The Yarmouk martyrdom conflicts with the two battle participations entry 48
records for Khalid and entry 49 for Aban. Neither is corrected here. Each is
attributed to its own entry, and the disagreement is stated rather than
resolved.

## Leaving the seed

`prisma/personSeedData*.ts` does not carry `amr-ibn-said-al-umawi`. The catalog
file at `data/catalog/people/amr-ibn-said-al-umawi.ts` is updated in place:
`fullName` is shortened to the source's chain and promoted to a cited claim,
`virtues` is added as a cited claim, the `SON` edge to `said-ibn-al-as` and the
`companion` title are promoted to cited claims, and a `HALF_BROTHER` edge to
each brother is added. `sex` stays on the legacy marker.

`data/catalog/battles/yarmuk.ts` and `data/catalog/battles/ajnadayn.ts` each gain
one participant. The `sex` counts in `data/catalog/people/sex.test.ts` are
unchanged, since no sex value moved off the legacy marker.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch carries
no approval.
