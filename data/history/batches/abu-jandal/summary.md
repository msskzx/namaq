# Batch: Abu Jandal ibn Suhail, Siyar entry 23

This batch gives أبو جندل بن سهيل his own catalog file and cites al-Dhahabi's
dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-jandal/](accounts/abu-jandal/)

## Source account

Entry 23 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. It opens on page
192 (Shamela 1618), right after entry 22 (Abu al-Haytham) closes at
`191-p4`. Its own bibliography footnote lands on that same opening page and
needs no trimming from the previous entry's side, matching the clean
boundary the Abu al-Haytham batch already found from its own end.

The entry's own text runs out one line into page 193 (Shamela 1619), at
`193-p1`. Page 193 then turns straight into entry 24 (Abdullah ibn Suhail,
Abu Jandal's brother): `193-p2` reads "وأخوه:" and `193-p3` is entry 24's
own numbered heading. Those two lines are kept in this account, not
trimmed out, because they are the only place in this entry's own extracted
range that names the sibling; the account's own footnote block is trimmed
out entirely for page 193, since all of it belongs to entry 24's
bibliography rather than Abu Jandal's.

## What this entry supports

Eight claims, across the two pages.

His name, from the heading: "أَبُو جَنْدَلٍ العَاصُ بنُ سُهَيْلِ بنِ عَمْرٍو
العَامِرِيُّ" (`192-p1`), continuing "ابْنِ عَبْدِ شَمْسٍ بنِ عَبْدِ وُدٍّ
بنِ نَصْرِ بنِ حِسْلِ بنِ عَامِرِ بنِ لُؤَيِّ بنِ غَالِبِ بنِ فِهْرٍ
العَامِرِيُّ، القُرَشِيّ" (`192-p2`) and confirmed by "وَاسْمُهُ: العَاصُ"
(`192-p3`, his given name is al-Aas, distinct from the kunya the heading
leads with). This matches the retired seed's fullName exactly and backs a
`SON` relation to `suhail-ibn-amr`, the existing seed-only node for his
father, who is also named directly in the heading.

His kunya, the heading's own title: "أَبُو جَنْدَلٍ" (`192-p1`).

His standing among the Companions: "كَانَ مِنْ خِيَارِ الصَّحَابَةِ"
(`192-p4`, he was among the best of the Companions), carried as `virtues`.

His presence at Hudaybiyyah: "فَلَمَّا كَانَ يَوْمُ صُلْحِ الحُدَيْبِيَةِ
هَرَبَ يَحْجِلُ فِي قُيُوْدِهِ، وَأَبُوْهُ حَاضِرٌ بَيْنَ يَدَيْ النَّبِيِّ
-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- لِكتَابِ الصُّلْحِ" (`192-p4`, on the
day of the Hudaybiyyah reconciliation he fled hobbling in his shackles,
while his father stood before the Prophet for the writing of the treaty).
The `PARTICIPATED_IN` claim adds him to `data/catalog/battles/hudaybiyyah.ts`'s
participant list.

His death: "ثُمَّ انْتَقَلَ إِلَى جِهَادِ الشَّامِ، فَتُوُفِّيَ شَهِيْداً
فِي طَاعُوْنِ عَمَوَاسَ بِالأُرْدُنِّ سَنَةَ ثَمَانِيَ عَشْرَةَ" (`193-p1`),
giving `deathYearHijri: '18'` and `placeOfDeathArabic: 'طاعون عمواس
بالأردن'`.

## The sibling tie to Abdullah ibn Suhail

"وَأَخُوْهُ" (`193-p2`) opens the entry's transition into `٢٤ - عَبْدُ
اللهِ بنُ سُهَيْلِ بنِ عَمْرٍو العَامِرِيُّ` (`193-p3`), naming Abdullah
ibn Suhail as Abu Jandal's brother. Entry 25, on their father, confirms
both are his sons ("سُهَيْلُ بنُ عَمْرٍو: أَبُوْهُمَا", page 194, outside
this account's own range since it belongs to Suhail's own entry). Neither
entry states whether Abu Jandal and Abdullah share a mother, only that
they share a father, so the relation is recorded as `HALF_BROTHER` rather
than `BROTHER`, marked `DISPUTED` to flag that a full-sibling reading
cannot be ruled out either. `abdullah-ibn-suhail` stays a seed-only node;
this batch does not extract his own entry.

## Corroboration with the sira batch

`data/history/batches/prophet-muhammad-sira`'s own Hudaybiyyah pages
(`528.md`, `530.md`) give the same episode in near-identical wording: Abu
Jandal arriving in his shackles, Suhail demanding his return as the first
term of the treaty, and the Prophet's refusal followed by his surrender
under the treaty's letter. Later pages (`551.md`, `552.md`) carry the story
forward past where this entry stops: joining Abu Basir's band of escaped
converts outside Meccan and Medinan jurisdiction, leading their prayers,
and burying Abu Basir. None of this contradicts entry 23's own account,
which only says he fled, was freed, migrated, and fought (`192-p4`,
`192-p8` through `192-p10`); the sira batch's fuller narrative is
consistent with it rather than adding a competing claim, so no new claim
is authored from it.

## What the model has no shape for yet

His imprisonment before Hudaybiyyah, "أَسْلَمَ وَحَبَسَهُ أَبُوْهُ
وَقَيَّدَهُ" (`192-p4`, he converted and his father imprisoned and
shackled him), and his escape itself, name no field or relationship this
model holds. They stay in the source text.

His flight to join Abu Basir's band and his role leading their prayers,
covered in the sira batch's pages rather than this entry, likewise names
no field this model holds.

## Kunya and titles

The heading gives his kunya outright, "أَبُو جَنْدَلٍ", carried as the
`kunya` field. No title beyond the seed's carried "companion" is
supported here.

## Leaving the seed

`prisma/personSeedData5.ts` no longer carries `abu-jandal` as an active
entry. `data/catalog/people/abu-jandal.ts` is now his sole author, per the
standing rule that a subject's catalog file retires its seed row in the
same commit.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries its approval only for publication, not for review.
