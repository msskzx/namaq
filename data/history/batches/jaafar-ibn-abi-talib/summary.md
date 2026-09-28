# Batch: Ja'far ibn Abi Talib, Siyar entry 34

This batch cites al-Dhahabi's dedicated Siyar entry on جَعْفَرُ بنُ أَبِي
طَالِبٍ الهَاشِمِيُّ, cousin of the Prophet and commander at Mu'tah. It
follows the [data quality and references
workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/jaafar-ibn-abi-talib/](accounts/jaafar-ibn-abi-talib/)
- Islamweb index: [جعفر بن أبي طالب](https://www.islamweb.net/ar/library/content/60/42/جعفر-بن-أبي-طالب) (content id 42)
- Shamela range: book 10906, pages 1632–1643 (printed 206–217, volume 1 of the Risalah edition)

## Source account

Entry 34 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The entry opens
page 206 with its own heading (`٣٤ - جَعْفَرُ...`, `206-p1`), so the first
Shamela page (1632) needed no start trimming, and it runs to the foot of
page 217 while entry 35 (عقيل) opens cleanly at the top of the next page
(Shamela 1644), so no end trimming either. Twelve pages were extracted with
the standard command and no anchor or notes markers. The plain Shamela
reading pages served full markup for all twelve ids, so no ajax fallback
was needed.

## Scope call: Companion

Entry 34 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry settles the question on its own: "هَاجَرَ
الهِجْرَتَيْنِ" (he made both hijrahs, `206-p3`), "أَسْلَمَ جَعْفَرٌ بَعْدَ
أَحَدٍ وَثَلاَثِيْنَ نَفْساً" (`216-p10`), and he died commanding at Mu'tah
(`206-p3`). He is taken in as a Companion, no contest recorded.

## What this entry supports

Eleven claims across the twelve pages.

His name and father, from the heading: جَعْفَرُ بنُ أَبِي طَالِبٍ عَبْدِ
مَنَافٍ الهَاشِمِيُّ, with the chain عبد مناف بن عبد المطلب بن هاشم بن عبد
مناف بن قصي (`206-p1`, `206-p2`). `fullName` stops where the entry stops,
per the suhail-ibn-amr precedent for entry 25 — the seed's القرشي goes
uncited rather than imported. The same heading backs the `SON` relation to
`abu-talib`. The (١) printing note on page 206 ("سقطت لفظة بن في المطبوع")
is the editor's, and the chain is carried as the entry states it.

His kunya, from the same paragraph: أَبُو عَبْدِ اللهِ (`206-p2`).

His brothers, as full brothers: "أَخُو عَلِيِّ بنِ أَبِي طَالِبٍ" (`206-p2`),
with شباب's report that علي وجعفر وعقيل share one mother, فَاطِمَةُ بِنْتُ
أَسَد (`216-p8`) — so `BROTHER`, not `HALF_BROTHER`, to both
`ali-ibn-abi-talib` and `aqil-ibn-abi-talib`.

His wife: "هَاجَرَ جَعْفَرٌ إِلَى الحَبَشَةِ بِزَوْجَتِهِ أَسْمَاءَ بِنْتِ
عُمَيْسٍ" (`216-p9`), corroborated inside the entry by his own "وَخَالَتُهَا
تَحْتِي" for Hamzah's daughter (`213-p10`) together with "أُمُّهَا: سَلْمَى
بِنْتُ عُمَيْسٍ، وَخَالَتُهَا: أَسْمَاءُ" (`214-p1`) — a `WIFE` relation to
`asma-bint-umays`.

His son: "وَابْنُهُ عَبْدُ اللهِ" (`206-p6`), with الواقدي's report that
Asma bore him عبد الله وعونا ومحمدا in Abyssinia (`216-p9`) — a `FATHER`
relation to `abdullah-ibn-jaafar`, whose stub currently carries only the
mother edge. Awn and Muhammad have no slugs, so no claims name them; they
stay in the source text.

His Mu'tah command: "أَمَّرَهُ رَسُوْلُ اللهِ عَلَى جَيْشِ غَزْوَةِ مُؤْتَةَ
بِنَاحِيَةِ الكَرَكِ، فَاسْتُشْهِدَ" (`206-p3`), with "أَخَذَ اللِّوَاءَ
جَعْفَرٌ، فَشَدَّ عَلَى النَّاسِ حَتَّى قُتِلَ" (`209-p5`) — a
`PARTICIPATED_IN` claim on `mutah` with status `MARTYRED`, registered on
`data/catalog/battles/mutah.ts` beside Zayd's existing entry. Sibling
entries 36–37 (Zayd ibn Harithah, Abd Allah ibn Rawahah) may register on
the same battle file; this batch touches only its own participant row.

His virtues, in two claims: the Prophet's praise (أَشْبَهَ خَلْقُكَ خَلْقِي
... فَأَنْتَ مِنِّي وَمِنْ شَجَرَتِي, `214-p3`; مَلَكاً فِي الجَنَّةِ يَطِيْرُ,
`212-p4`; بِقُدُوْمِ جَعْفَرٍ أَسَرُّ مِنِّي بِفَتْحِ خَيْبَرَ, `216-p15`), and
his generosity (أَفْضَلُ مِنْ جَعْفَرٍ ... فِي الجُوْدِ وَالكَرَمِ,
`217-p5`–`217-p6`; أَبَا المَسَاكِيْنِ, `217-p9`).

The muakhah is contested inside the entry: Ibn Ishaq reports the Prophet
paired جعفر with معاذ بن جبل (`213-p5`), and al-Waqidi denies it — the
pact predates Badr while Ja'far was in Abyssinia (`213-p6`). It is carried
as one `PACT_BROTHER` claim to `muadh-ibn-jabal` with confidence `DISPUTED`
and `disputed: true`, on the abu-jandal batch's footing, rather than
dropped for being contested.

## What the entry does not state

Appearance is a clean miss: the trigger-word grep across all twelve pages
returns only "أَبْيَضُ الفُؤَادِ" inside an editor footnote quoting a
paradisal vision (wings dyed with blood), which describes no earthly
physique. It is marked `notInSource`. Every other checklist item is
present, so it stands alone there.

No Khaybar participation is authored: he reached the Muslims "وَهُمْ عَلَى
خَيْبَرَ إِثْرَ أَخْذِهَا" — after its taking (`206-p3`). No Badr
participation either: he was in Abyssinia through Badr, and the entry gives
him only a struck share and reward ("ضَرَبَ لَهُ يَوْم بَدْرٍ بِسَهْمِهِ
وَأَجْرِهِ", `216-p13`). A share without presence is not attendance under
[ADR 0013](docs/adr/0013-separate-attendance-from-outcome.md), and
`data/catalog/battles/badr.ts` is frozen for sibling work in any case — the
report stays in the source text only.

The "بِضْعاً وَثَلاَثِيْنَ سَنَةً" lifespan (`212-p8`) is an age, not a hijri
year, so no `deathYearHijri` is inferred. The competing wound counts at
Mu'tah (بضعة وثلاثون, بضع وتسعون, بضع وأربعون) describe no modeled value
and stay in the pages. Transmission chains name no new graph nodes.

## Legacy values visited

`data/catalog/people/jaafar-ibn-abi-talib.ts` carried four legacy values:
`sex` MALE, the long `fullName` chain, the `companion` title, and the `SON`
edge to Abu Talib. The nasab chain (shortened to the entry's wording) and
the father edge are promoted to the new claims above. `sex` and the
`companion` title stay `legacy-unreviewed`: the entry implies both and
states neither outright, on the same footing as the neighbouring batches.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
