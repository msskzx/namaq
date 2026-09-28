# Batch: Khalid ibn Said, Siyar entry 48

This batch preserves al-Dhahabi's complete entry on Khalid ibn Said ibn
al-As al-Umawi and supports the canonical records selected from it. It
follows the [data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/khalid-ibn-said/](accounts/khalid-ibn-said/)

## Source account

Entry 48 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
across printed pages 259–260, shared with entry 47 (Abdullah ibn al-Harith
ibn Abd al-Muttalib) on page 259 and entry 49 (Aban ibn Said) on page 260.

Page 259 opens with the tail of entry 47's text and its notes. Entry 48
begins mid-page with the heading "٤٨ - خَالِدُ بنُ سَعِيْدِ بنِ العَاصِ بنِ
أُمَيَّةَ الأُمَوِيُّ **" and its own `(* *)` source list in the page's notes.
The extraction keeps only the two body paragraphs of entry 48 on this page
(the heading and the continuation of the nasab) and trims the notes at the
`(* *)` marker, so nothing here belongs to entry 47's notes.

Page 260 continues entry 48's text through paragraph 14, where the entry
ends with "وَلَهُ عِدَّةُ أَوْلاَدٍ مِنْهُم:" (he had several children
including:). The entry closes without naming them. Entry 49 (Aban ibn Said)
begins on the same page further down; the extraction trims entry 49's
notes at the `(*)` marker.

`khalid-ibn-said` had a catalog file before this batch, carried from the
retired graph seeds with all values on the legacy marker. The batch visits
every legacy value: `fullName` is promoted to a cited claim (the source
states the chain without the القرشي الأموي suffix the seed carried), the
`SON` edge to `said-ibn-al-as` is promoted to a cited claim, and the
`companion` title is promoted to a cited claim. The `sex` value stays on
the legacy marker: the source nowhere states his sex explicitly, though the
entry's masculine forms make it unambiguous.

## What the entry supports

Six claims and eight citations.

**Full name (nasab).** The heading and its continuation give the chain:
"خَالِدُ بنُ سَعِيْدِ بنِ العَاصِ بنِ أُمَيَّةَ ابْنِ عَبْدِ شَمْسٍ بنِ
عَبْدِ مَنَافٍ بنِ قُصَيٍّ" (`259-p12`, `259-p13`). The source states the
chain without the القرشي الأموي suffix the retired seed carried; the
catalog value is updated to match the source.

**Kunya.** The opening line of page 260 gives it directly: "السَّيِّدُ
الكَبِيْرُ، أَبُو سَعِيْدٍ القُرَشِيُّ، الأُمَوِيُّ" (`260-p1`), so `kunya`
holds "أَبُو سَعِيْدٍ".

**Appearance.** The same page's paragraph 12 describes him: "كَانَ خَالدُ
بْنُ سَعِيْدٍ وَسِيْماً، جَمِيْلاً" (`260-p12`), so `appearance` holds
"وسيم، جميل".

**Virtues.** The entry accumulates several: he is "أَحَدُ السَّابِقِيْنَ
الأَوَّلِيْنَ" (`260-p1`), "خَامِساً فِي الإِسْلاَمِ" (`260-p3`), migrated
to Abyssinia (`260-p3`), was "أَوَّلُ مَنْ كَتَبَ: بِسْمِ اللهِ الرَّحْمَنِ
الرَّحِيْمِ" (`260-p5`), was appointed over Sana'a by the Prophet and over
part of the army in the Sham campaign by Abu Bakr (`260-p6`), killed a
polytheist (`260-p8`), was martyred (`260-p10`), and a light was seen for
him shining to the sky (`260-p11`). He was killed at Ajnadayn (`260-p12`).

**Father.** The nasab names his father as سعيد بن العاص (`259-p12`), so the
`SON` edge to `said-ibn-al-as` is promoted from the legacy marker to a cited
claim.

**Ajnadayn.** The entry states he was killed at Ajnadayn: "قُتِلَ يَوْمَ
أَجْنَادِيْنَ" (`260-p12`). This adds him to the `ajnadayn` battle as a
participant with `MARTYRED` status.

## What the model has no shape for yet

**His daughter Umm Khalid.** The entry names her as a narrator ("رُوِيَ عَنْ
أُمِّ خَالِدٍ بِنْتِ خَالِدٍ", `260-p2`) and notes she lived to nearly
ninety (`260-p2`, `260-p12`). She is not a catalog subject, so she stays in
the source text.

**His father's death.** The entry notes his father Abu Uhayhah died before
Badr as a polytheist (`260-p13`). This is about his father, not Khalid
himself, and the father's own entry is not in scope for this batch.

**His children.** The entry closes with "وَلَهُ عِدَّةُ أَوْلاَدٍ مِنْهُم:"
(`260-p14`) but does not name them. No children are added to the catalog.

## Confirming absence

**Wives.** The entry is read in full and no wife is named. The trigger words
(تزوج, امرأة, زوج) return no matches across both pages. Marked `notInSource`.

**Siblings.** The entry is read in full and no sibling is named. The trigger
words (أخو, أخت, شقيق, إخوة, إخوان) return no matches across both pages.
Marked `notInSource`.

## Corroboration and disputes

No other batch cites Khalid ibn Said, so there is nothing here to
corroborate or dispute against. The Ajnadayn participation is new: the
battle's catalog file carried three participants from the retired seed
(Abu Ubaydah, Abu Bakr, Umar) and none from any batch.

## Leaving the seed

`prisma/personSeedData*.ts` does not carry `khalid-ibn-said` (he was a
graph-seed-only subject). The catalog file at
`data/catalog/people/khalid-ibn-said.ts` is updated in place: `fullName` is
promoted to a cited claim, `kunya` and `appearance` are added as cited
claims, `virtues` is added as a cited claim, the `SON` edge to
`said-ibn-al-as` is promoted to a cited claim, and the `companion` title is
promoted to a cited claim. The `sex` value stays on the legacy marker.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
