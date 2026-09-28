# Batch: Aqil ibn Abi Talib, Siyar entry 35

This batch cites al-Dhahabi's dedicated Siyar entry on عقيل بن أبي طالب
الهاشمي, eldest brother of Ja'far (entry 34) and Ali. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/aqil-ibn-abi-talib/](accounts/aqil-ibn-abi-talib/)

## Scope

Companion, in scope. The entry sits in the Siyar's الصحابة run (between
Ja'far ibn Abi Talib and Zayd ibn Harithah), places him at Badr on the
Quraysh side, then has him emigrate in early year 8 and fight at Mu'tah as
a Muslim. No work contests his صحبة here; there is nothing to record under
the contested-Companion rule.

## Source account

Entry 35 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1 of the Siyar proper (`volumeNumber: 4` in this source's 28-volume
list). Printed pages 218–219 (Shamela 1644–1645), a clean two-page entry:
page 218 opens with the numbered heading at `218-p1` (entry 34 ends on
Shamela 1643) and page 219 closes with "تُوُفِّيَ زَمَنَ مُعَاوِيَةَ" at
`219-p10` (entry 36 opens on Shamela 1646). No shared pages, so no anchor
or notes trimming was needed. Verified on islamweb's companion index, where
عقيل بن أبي طالب الهاشمي follows جعفر بن أبي طالب directly.

Reproduce with:

```bash
npm run history:extract -- --book 10906 --from 1644 --to 1645 \
  --out data/history/batches/aqil-ibn-abi-talib \
  --subject-slug aqil-ibn-abi-talib \
  --source-slug siyar-alam-al-nubala-risalah \
  --volume 4
```

## What this entry supports

Six claims, across the two pages.

His father, from the heading: "عَقِيْلُ بنُ أَبِي طَالِبٍ الهَاشِمِيُّ"
(`218-p1`), backing the `SON` relation to `abu-talib`, an existing slug.

His kunya, from two passages: "وَبِهِ كَانَ يُكْنَى" of his son Yazid
(`218-p3`), confirmed by the Prophet addressing him "يَا أَبَا يَزِيْدَ"
(`219-p7`). Kunya is أبو يزيد.

His virtues: the Prophet's "أُحِبُّكَ حُبَّيْنِ: لِقَرَابَتِكَ، وَلِحُبِّ
عَمِّي لَكَ" (`219-p7`). The same passage backs `COMPANION_OF` to
`prophet-muhammad`, which carries the `companion` title, on the standing
pattern (saeed-ibn-zaid) that the title rests on the relation claim.

Two battle placements, each a `PARTICIPATED_IN` claim against an existing
battle:

- **Badr** (`218-p4`): "شَهِدَ بَدْراً مُشْرِكاً، وَأُخْرِجَ إِلَيْهَا
  مُكْرَهاً، فَأُسِرَ"، ransomed by his uncle al-Abbas, so `isMuslim: false`
  and `status: ['WAS_CAPTURED']` on `badr.ts`, on the suhail-ibn-amr
  pattern for a captive on the Quraysh side.
- **Mu'tah** (`218-p8`, Ibn Sa'd: "خَرَجَ عَقِيْلٌ مُهَاجِراً فِي أَوَّلِ
  سَنَةِ ثَمَانٍ، وَشَهِدَ مُؤْتَةَ"), corroborated inside the entry by his
  grandson's report that he took a ring with images at Mu'tah (`219-p1`),
  so `isMuslim: true` on `mutah.ts`.

## What the page does not support

- **Khaybar** is a yearly grant ("أَطْعَمَهُ ... بِخَيْبَرَ مَائَةً
  وَأَرْبَعِيْنَ وَسقاً كُلَّ سَنَةٍ", `218-p9`), not a presence, so no
  participation is registered there.
- **Fath Makkah, Hunayn, al-Taif**: "فَلَمْ يُسْمَعْ لَهُ بِذِكْرٍ فِي
  فَتْحِ مَكَّةَ، وَلاَ حُنَيْنٍ، وَلاَ الطَّائِفِ" (`218-p8`) reports an
  absence of reports after his illness, not a remarked absence, so no
  `ABSENT_FROM` is recorded ([ADR 0013](../../../../docs/adr/0013-separate-attendance-from-outcome.md)).
- **Death**: "تُوُفِّيَ زَمَنَ مُعَاوِيَةَ" (`219-p10`) names a reign, not a
  year or place, and the editor's footnote cites الإصابة for a competing
  report (dead at the start of Yazid's caliphate, before al-Harrah).
  Neither yields a year, so `deathYearHijri` stays unset; both readings
  stay in the stored pages.
- **Children**: eight sons named (`218-p3` — مسلم، يزيد، سعيد، جعفر، أبو
  سعيد الأحول، محمد، عبد الرحمن، عبد الله), none with a catalog slug, so
  no relation is claimed; a relation is declared only to an existing slug.
  The grandson عبد الله بن محمد بن عقيل المحدث (`218-p2`, `219-p1`) is a
  transmitter in the chains, not an edge.
- **The captive dialogue** (who of their nobles did you kill — Abu Jahl —
  "الآن صَفَا لَكَ الرَّادِي", `218-p5`–`218-p7`) and **the needle story**
  (the مخيط and the crier against غلول, `219-p2`–`219-p5`) back no value
  the model holds and stay in the source text.
- **Appearance** never appears (the old man carrying the غرب at `219-p9`
  is an act, not a description), so it is marked `notInSource`. **Wives**
  is marked `notInSource`: a wife is mentioned but never named (`219-p3`),
  and the model holds no edge to an unnamed spouse.

## Legacy ledger

`npm run catalog:ledger -- --batch` for this subject lists `sex`,
`fullName`, the `companion` title, `SON→abu-talib`, and
`BROTHER→jaafar-ibn-abi-talib`. Visited each:

- `companion` and `SON→abu-talib` are promoted to cited claims above.
- `sex` stays legacy: the entry never states it as a value.
- `fullName` stays legacy: the entry states only the short form "عقيل بن
  أبي طالب الهاشمي", never the seed's longer ancestor chain, so the chain
  is neither cited nor overwritten.
- `BROTHER→jaafar-ibn-abi-talib` stays legacy: the entry says only "هُوَ
  أَكْبَرُ إِخْوَتِهِ" (`218-p2`), naming no brother and no mother. The
  mother is stated in Ja'far's own entry (entry 34, a separate batch's
  scope), not here, so this batch claims no sibling edge of its own.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
