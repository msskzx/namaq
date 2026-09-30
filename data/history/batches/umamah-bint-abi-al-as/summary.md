# Batch: Umamah bint Abi al-As, Siyar entry 71

This batch preserves al-Dhahabi's complete entry on Umamah bint Abi al-As
and supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/umamah-bint-abi-al-as/](accounts/umamah-bint-abi-al-as/)

## Source account

Entry 71 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. The account runs
entirely on printed page 335, right after Zaynab bint Muhammad's entry
closes and right before entry 72, Abu Zayd al-Ansari, opens further down
the same page.

Page 335 opens with the tail of Zaynab's entry (paragraphs 1–3), then
Umamah's heading "٧١ - أُمَامَةُ بِنْتُ أَبِي العَاصِ*" at paragraph 4, then
Abu Zayd's heading "٧٢ - أَبُو زَيْدٍ الأَنصَارِيُّ" at paragraph 9. The
extraction keeps only paragraphs 4–8 (Umamah's entry) and trims the notes
at the "(*)" and "(* *)" markers, so nothing here belongs to Zaynab's or
Abu Zayd's entries.

`umamah-bint-abi-al-as` already had a catalog file before this batch,
carried from the retired `neo4j/graphSeedData*.ts` seeds. The seed values
— `fullName`, `sex`, the `companion` title, and the two `DAUGHTER` edges
to `abu-al-as-ibn-al-rabi` and `zaynab-bint-muhammad` — were all on the
legacy marker. This batch promotes `fullName`, `sex`, and both `DAUGHTER`
edges to cited claims.

## What the entry supports

Six claims and six citations.

**Full name.** The heading gives it directly: "أُمَامَةُ بِنْتُ أَبِي العَاصِ"
(`4/335-p4`). The entry states only this short form; the longer chain in
the retired seed ("بن الربيع بن عبد العزى بن عبد شمس القرشي العبشمي") is
not restated here, so the claim supports the short form.

**Sex.** The name itself carries "بِنْتُ" (daughter of), which states her
sex plainly (`4/335-p4`).

**Virtue.** The entry's second line: "الَّتِي كَانَ رَسُوْلُ اللهِ يَحْمِلُهَا
فِي صَلاَتِهِ" (`4/335-p5`) — the Prophet used to carry her in his prayer.

**Father.** The heading "أُمَامَةُ بِنْتُ أَبِي العَاصِ" names Abu al-As as
her father (`4/335-p4`), confirming the existing `DAUGHTER`/`FATHER` edge
to `abu-al-as-ibn-al-rabi`.

**Mother.** The entry states "هِيَ بِنْتُ بِنْتِهِ" (`4/335-p6`) — she is
his granddaughter — confirming the existing `DAUGHTER`/`MOTHER` edge to
`zaynab-bint-muhammad`.

**Husband: Ali ibn Abi Talib.** The entry states "تَزَوَّجَ بِهَا عَلِيُّ
بنُ أَبِي طَالِبٍ فِي خِلاَفَةِ عُمَرَ" (`4/335-p6`). This adds a
`WIFE`/`HUSBAND` edge to `ali-ibn-abi-talib`.

## What the model has no shape for yet

**Second husband: al-Mughirah ibn Nawfal.** The entry names him —
"المُغِيْرَةُ بنُ نَوْفَلِ بنِ الحَارثِ بنِ عَبْدِ المُطَّلِبِ الهَاشِمِيُّ"
(`4/335-p7`) — and states she died at his house after bearing him Yahya
ibn al-Mughirah. Al-Mughirah ibn Nawfal is not a catalog subject, so no
relation claim can be authored; the marriage stays in the source text.

**Death timing.** The entry states "مَاتَتْ فِي دَوْلَةِ مُعَاوِيَةَ بنِ أَبِي
سُفْيَانَ" (`4/335-p8`) — she died in Muawiyah's rule — but gives no
specific year. `deathYearHijri` stays unset.

**Hadith narration.** The same line states "وَلَمْ تَرْوِ شَيْئاً" — she did
not narrate anything. The model has no field for this; it stays in the
source text.

## Corroboration and disputes

No other batch cites Umamah bint Abi al-As, so there is nothing here to
corroborate or dispute against. The `DAUGHTER` edges to Abu al-As and
Zaynab match the seed values without disagreement.

## Legacy values

The catalog file carries the `companion` title on its legacy marker. The
entry sits in the "الصحابة رضوان الله عليهم" section but does not itself
state "she is a companion" — the section heading is not on this page — so
the title stays legacy-unreviewed.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch
carries its approval only for publication, not for review.
