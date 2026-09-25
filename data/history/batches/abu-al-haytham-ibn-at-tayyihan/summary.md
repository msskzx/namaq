# Batch: Abu al-Haytham ibn at-Tayyihan, Siyar entry 22

This batch gives أبو الهيثم بن التيهان his own catalog file and cites
al-Dhahabi's dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-al-haytham-ibn-at-tayyihan/](accounts/abu-al-haytham-ibn-at-tayyihan/)

## Source account

Entry 22 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on page
189 (Shamela 1615), the page shared with Abu Abs's closing lines, right
after entry 21 ends at `189-p7`. Its own bibliography footnote ("(*)")
lands on that same page and is trimmed to start from it, the split the
Abu Abs batch already described from its own side. The entry runs on
through page 190 (Shamela 1616) and closes on page 191 (Shamela 1617) at
`191-p4`, before entry 23 (Abu Jandal) opens cleanly on its own page, 192
(Shamela 1618), with its own heading and bibliography footnote. No page
is shared between entries 22 and 23, so the end anchor needed no trimming.

## What this entry supports

Eleven claims, across the three pages.

His name and ancestry, from the heading: "مَالِكُ بنُ التَّيِّهَانِ
الأَنْصَارِيُّ" (`189-p8`), continuing "ابْنِ بَلِيِّ بنِ عَمْرِو بنِ
الحَافِ بنِ قُضَاعَةَ الأَنْصَارِيُّ" (`189-p9`). This is the same chain
the retired seed carried, and it backs a `SON` relation to
`at-tayyihan-ibn-bali`, the existing graph-only node for his father.

His tribal affiliation, from the same line: "حَلِيْفُ بَنِي عَبْدِ
الأَشْهَلِ" (`189-p9`), an ally of Banu Abd al-Ashhal rather than a blood
member of the Aws.

His kunya, the heading's own opening title: "أَبُو الهَيْثَمِ" (`189-p8`).

His pre-Islamic monotheism, from al-Waqidi: "كَانَ أَبُو الهَيْثَمِ
يَكْرَهُ الأَصْنَامَ فِي الجَاهِلِيَّةِ، وَيُؤَفِّفُ بِهَا، وَيَقُوْلُ
بِالتَّوْحِيْدِ هُوَ وَأَسَعْدُ بنُ زُرَارَةَ" (`190-p4`), carried as
`virtues`.

His paired brotherhood, unlike Abu Abs's unclaimed pairing: "آخَى رَسُوْلُ
اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَيْنَهُ وَبَيْنَ عُثْمَانَ بنِ
مَظْعُوْنٍ" (`190-p7`) backs a `PACT_BROTHER` relation to
`uthman-ibn-mazun`, who already has his own catalog file.

His presence at Badr: "شَهِدَ بَدْراً" (`190-p8`); the `PARTICIPATED_IN`
claim adds him to `data/catalog/battles/badr.ts`'s participant list, next
to Abu Abs and the al-Bukayr brothers. البدري stays a relation rather than
a title, the same treatment those entries got.

His death: "وَقَالَ غَيْرُهُ: تُوُفِّيَ سَنَةَ عِشْرِيْنَ" (`191-p1`),
giving `deathYearHijri: '20'`. Al-Waqidi's own words right after this line
call it the more reliable report, against a rival account that has him
killed at Siffin decades later.

## The two competing accounts

The entry disputes its own subject twice, and both disputes are recorded
rather than resolved by silent preference.

Abdullah ibn Muhammad ibn Amarah al-Ansari's report reverses the
genealogy and the tribal reading the heading gives: "هُوَ مِنَ الأَوْسِ،
مِنْ أَنْفُسِهِم" (`190-p1`, he is of the Aws, one of their own blood, not
a confederate) and "هُوَ ابْنُ التَّيِّهَانِ بنِ مَالِكِ بنِ عَمْرِو بنِ
زَيْدِ بنِ عَمْرِو بنِ جُشَمَ بنِ الحَارِثِ بنِ الخَزْرَجِ بنِ عَمْرِو بنِ
مَالِكِ بنِ الأَوْسِ" (`190-p2`, naming the father Malik rather than
at-Tayyihan, the reverse of the heading's own "مَالِكُ بنُ التَّيِّهَانِ").
Both stand as `DISPUTED` claims on `fullName` and `tribalAffiliation`; the
catalog file keeps the heading's own reading, which is what the retired
seed already carried and what the existing `at-tayyihan-ibn-bali` graph
node's ancestry matches.

Al-Waqidi's own rejection names the second dispute: "هَذَا أَثْبَتُ
عِنْدَنَا مِمَّنْ رَوَى أَنَّهُ قُتِلَ بِصِفِّيْنَ مَعَ عَلِيٍّ"
(`191-p2`, the year-20 death is more reliable with us than those who
report he was killed at Siffin with Ali). Siffin fell decades after Badr
and the Aqaba pledges, so this account would make him an old man fighting
a battle the entry never otherwise connects him to. It stands as a
`DISPUTED` claim on `placeOfDeathArabic`, since the report names Siffin
without a specific year the entry states outright, and the catalog keeps
al-Waqidi's own preferred year.

## Corroboration with the sira batch

`data/catalog/events/first-pledge-of-aqaba.ts` and
`second-pledge-of-aqaba.ts` already cite `abu-al-haytham/aqaba-first` and
`abu-al-haytham/aqaba-second` from the `prophet-muhammad-sira` batch,
naming this same subject at the first twelve-man pledge and among the
seventy at the second. This entry's own account agrees without adding a
new claim: "وَيُجْعَلُ فِي الثَّمَانِيَةِ الَّذِيْنَ لَقَوْا رَسُوْلَ اللهِ
-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِمَكَّةَ، وَيُجْعَلُ فِي السِّتَّةِ،
وَفِي أَهْلِ العَقَبَةِ الأُوْلَى الاثْنَيْ عَشَرَ، وَفِي السَّبْعِيْنَ"
(`190-p6`) counts him among the same two pledges, so nothing here
contradicts the sira batch's existing claims.

## What the model has no shape for yet

His mother's clan, "وَأُمُّهُ مِنْ بَنِي جُشَم المَذْكُوْرِ" (`190-p3`,
his mother is from the aforementioned Banu Jusham), names no specific
person the graph could hold a relation to.

His posting to Khaybar as a produce assessor, both in the entry's own
words ("وَبَعَثَهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- إِلَى
خَيْبَرَ خَارِصاً بَعْدَ ابْنِ رَوَاحَةَ", `190-p8`) and again through Ibn
Habban's isnad, and his refusal to serve under Abu Bakr in the same role
(`190-p9` to `190-p11`), names no field or relationship this model holds,
the same kind of gap Abu Abs's tax-collecting line left.

His report of the Prophet's saying "المُسْتَشَارُ مُؤْتَمَنٌ" (the one
consulted is trusted, `191-p3` to `191-p4`) carries an isnad the editor's
own footnote grades "ضَعِيْفٌ جِدًّا" (very weak). It stays in the source
text rather than becoming an `UTTERANCE` record: the weak grading is the
editor's footnote, not al-Dhahabi's own printed word, and the saying is
the Prophet's rather than this subject's own.

## Kunya and titles

The heading gives his kunya outright, "أَبُو الهَيْثَمِ", carried as the
`kunya` field. No title beyond the seed's carried "companion" is
supported here: البدري is modeled as the Badr `PARTICIPATED_IN` relation
rather than a title, per the standing rule against duplicating a relation
as a title.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries
`abu-al-haytham-ibn-at-tayyihan` as an active entry.
`data/catalog/people/abu-al-haytham-ibn-at-tayyihan.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its
seed row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
