# Batch: Abdullah ibn Suhail, Siyar entry 24

This batch gives عبد الله بن سهيل بن عمرو his own catalog file and cites
al-Dhahabi's dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-suhail/](accounts/abdullah-ibn-suhail/)

## Source account

Entry 24 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens partway
into page 193 (Shamela 1619), at the heading "٢٤ - عَبْدُ اللهِ بنُ سُهَيْلِ
بنِ عَمْرٍو العَامِرِيُّ" (`193-p3`). The two lines before it, "وَأَخُوْهُ"
(`193-p2`) and the tail of Abu Jandal's own entry (`193-p1`), belong to Abu
Jandal's own account and are not re-extracted here; each page file belongs to
one account only.

The entry runs to one line into page 194 (Shamela 1620), at `194-p1`, al-Dhahabi's
own aside on the chronology of a reported anecdote. Page 194 then turns into
entry 25, on the father Suhail ibn Amr: `194-p2` reads "وَ:" and `194-p3` is
his numbered heading. Page 194's footnote block belongs entirely to entry 25's
own bibliography and citations, so it is trimmed out in full; page 193's
footnote block is entry 24's own bibliography and its one content footnote,
so it is kept whole.

## What this entry supports

Six claims, across the two pages.

His name, from the heading: "عَبْدُ اللهِ بنُ سُهَيْلِ بنِ عَمْرٍو
العَامِرِيُّ" (`193-p3`). Unlike his brother's entry, this page states no
extended ancestor chain past the grandfather, so `fullName` stops there
rather than carrying the seed's longer chain forward without a citation for
it. The same passage names his father directly and backs a `SON` relation to
`suhail-ibn-amr`, the existing seed-only node.

His military record and standing: "وَلَهُ غَزَوَاتٌ وَمَوَاقِفُ" (`193-p5`)
and "وَقِيْلَ: بَلْ هُوَ مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ، وَإِنَّهُ هَاجَرَ
إِلَى الحَبَشَةِ الهِجْرَةَ الأُوْلَى" (`193-p6`, reported, not asserted
outright, that he was among the earliest converts and emigrated to Abyssinia
in the first hijra), carried as `virtues`.

His presence at Badr: "خَرَجَ مَعَ أَبِيْهِ إِلَى بَدْرٍ يَكْتُمُ إِيْمَانَهُ،
فَلَمَّا الْتَقَى الجَمْعَانِ، تَحَوَّلَ إِلَى المُسْلِمِيْنَ، وَقَاتَلَ،
وَعُدَّ بَدْرِيّاً" (`193-p4`, he went out with his father concealing his
faith, then switched to the Muslims once the armies met, fought, and is
counted a Badri). The `PARTICIPATED_IN` claim adds him to
`data/catalog/battles/badr.ts`'s participant list with that sentence as his
`summary`.

His death: "وَاسْتُشْهِدَ يَوْمَ اليَمَامَةِ" (`193-p5`) gives the place, and
al-Dhahabi's own aside on the next page, "لَمَّا اسْتُشْهِدَ سَنَةَ اثْنَتَيْ
عَشْرَةَ بِاليَمَامَةِ" (`194-p1`), gives the year: `deathYearHijri: '12'`
and `placeOfDeathArabic: 'اليمامة'`.

## What the page does not answer for this claim

His age at death, "وَلَهُ ثَمَانٍ وَثَلاَثُوْنَ سَنَةً" (`193-p5`, thirty-eight
years old), names no field the catalog model holds; birth year is not
recorded and thirty-eight is an age, not a birth year, so no claim is
authored from it.

No battle entry exists yet for al-Yamamah (the Ridda-war engagement where
he was martyred), so his martyrdom there is recorded only as
`deathYearHijri`/`placeOfDeathArabic` on his own profile, not as a
`PARTICIPATED_IN` claim against a `BATTLE` node. Creating that battle entry
is future work, not something this single-subject batch takes on.

## The Waqidi anecdote and its chronology

`193-p7` through `193-p10` and `194-p1` report, through al-Waqidi, that Abu
Bakr met Suhail ibn Amr on a pilgrimage before the Farewell Pilgrimage and
was told "I hope Abdullah begins with me", meaning Suhail hoped his son
would die before him. Al-Dhahabi's own aside then flags the story as not
adding up: if Abdullah was martyred at Yamama in year 12H, the anecdote can
only be read as something Suhail said before that year, not as recorded
verbatim at the time it is placed in the narrative. Neither the report nor
the aside states a fact this catalog models beyond the death year already
carried above, so no separate claim is authored from them; they stay in the
source text.

## The sibling dispute with Abu Jandal

The just-merged `abu-jandal` batch already declares a `HALF_BROTHER`
relation from `abu-jandal` to `abdullah-ibn-suhail`, marked `DISPUTED`
because that entry names only their shared father, not a shared mother.
This entry's own text does not mention Abu Jandal at all and gives no
information about a mother, so it neither confirms nor resolves the
dispute. The relation is not re-declared from this side, since it is
already recorded from Abu Jandal's; `siblings` is marked `notInSource` on
this account because Abdullah's own entry states nothing about siblings,
not because the fact is unknown to the source generally.

## Kunya, appearance, and wives

None of the three appears anywhere in this entry, so all three are marked
`notInSource`.

## Pre-existing legacy debt noticed in passing

`npm run catalog:ledger -- --batch data/history/batches/abdullah-ibn-suhail`
also lists `battles/badr.participants[0]` (Umar ibn al-Khattab's
Badr participation) as `legacy-unreviewed`. That entry predates this batch
and has nothing to do with Abdullah ibn Suhail; it surfaces only because
this batch also touches `badr.ts`. It is left as is.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `abdullah-ibn-suhail` as an
active entry. `data/catalog/people/abdullah-ibn-suhail.ts` is now his sole
author, per the standing rule that a subject's catalog file retires its seed
row in the same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
