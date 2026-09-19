# Batch: Abd al-Rahman ibn Awf, Siyar entry 4

This batch preserves al-Dhahabi's complete entry on Abd al-Rahman ibn Awf and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdur-rahman-ibn-awf/](accounts/abdur-rahman-ibn-awf/)

## Source account

Entry 4 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from printed
page 68 to page 92, twenty-five pages.

Both ends needed slicing, which entry 3 did not. Page 68 opens with the heading,
but its footnote block still finishes entry 3's note about الفدفد, so the notes
are cut before this entry's own `(*)` source list. Page 92 carries seven
paragraphs of this entry and then opens entry 5 on Sa'd ibn Abi Waqqas, so the
body stops at `92-p7` and the notes stop before Sa'd's `(*)` list.

## What the entry supports

Twenty claims and twenty-eight citations. His profile carries nothing on the
legacy marker: the entry speaks to his full name, kunya, appearance, virtues,
year of death and place of burial, and to all four of his titles.

**A fourth title for him, not a new title.** The seed gave him the ten promised
paradise, companion and the six of the Shura, and `al-sabiqoon` already existed
for others. The naming line calls him أَحَدُ السَّابِقِيْنَ البَدْرِيِّيْنَ
(`68-p3`), which splits in two: السابقين earns him that existing title, and
البدريين is his Badr participation, which the model holds as a relation and
which `awf/badr` already records.

**His appearance contradicts the seed, and the entry wins.** The seed had him
أسمر اللون. Three reports here describe him and none of them does: Sahla bint
Asim has him أَبْيَض (`75-p2`), al-Waqidi أَبْيَض مُشْرَباً حُمْرَة (`75-p6`),
and Ibn Ishaq gives what Uhud left him, سَاقِط الثَّنِيَّتَيْنِ أَهْتَم أَعْرَج
(`75-p4`). The value is rewritten from the three. The seed's أسمر is not carried
anywhere, because a seed is a checklist and not a source, and nothing in this
entry stands behind it.

**Two Qur'an links, neither of them the seed's.** al-Dhahabi places him among
أهل بيعة الرضوان, whom al-Fath 18 names (`78-p3`), and Qatadah reads al-Tawbah
79 against the hypocrites who called his half-estate gift showing off
(`80-p11` to `80-p13`). The seed carried al-Tawbah 100 for him with nothing
behind it. The entry calls him one of السابقين but never reaches for that verse,
so it stays on the legacy marker and the ledger counts it.

## Battles

**Badr** is stated twice: al-Dhahabi counts him among أهل بدر الذين قيل لهم
اعملوا ما شئتم (`78-p2`), and the Prophet calls him رجلاً من أهل بدر when Khalid
ibn al-Walid quarrels with him (`83-p4`).

**Uhud carries `INJURED`, and the same report gives his appearance.** Ibn Ishaq
has him أُصِيْبَ يَوْمَ أُحُدٍ فُهُتِمَ، وَجُرِحَ عِشْرِيْنَ جِرَاحَةً، بَعْضُهَا
فِي رِجْلِهِ فَعَرَجَ (`75-p4`). The missing teeth and the limp are what the
battle left, so one claim backs both the status and the appearance.

**Khandaq is carried, not cited.** The seed placed him there. This entry never
mentions the battle, so the participation sits on the legacy marker rather than
being dropped or given a citation it does not have.

## Events

Four, and only one of them is dated.

**Both hijras, from one sentence.** Uthman says of him مَا يَسْتَطِيْعُ أَحَدٌ
أَنْ يَعْتَدَّ عَلَى هَذَا الشَّيْخِ فَضْلاً فِي الهِجْرَتَيْنِ جَمِيْعاً
(`75-p8`), which puts him on the hijra to Abyssinia and the hijra to Medina at
once. The Medina link takes its own citation from the account of his arrival
poor and the pact the Prophet made for him (`91-p5`). Both events already exist
with their years; this batch only adds him.

**The hajj of 13 AH**, a new event. al-Sha'bi has him lead the Muslims in it and
names the year (`87-p4`), so this one carries a `hijriYear`.

**The Shura after Umar**, a new event and an undated one. al-Dhahabi calls his
withdrawal from the caliphate his best act, and Ibn Umar reports him asking the
six هَلْ لَكُم أَنْ أَخْتَارَ لَكُمْ وَأَنْفَصِلَ مِنْهَا (`86-p8`, `87-p1`).
The entry never dates it. Umar's death year would have to come from elsewhere,
so `hijriYear` is left unset. Only Abd al-Rahman is linked to it: the entry
names the other five, but names them as the body he chose from, and this batch
read his entry alone.

## The مؤاخاة, and both reports of it

The entry names his pact brother twice and does not reconcile the two. Anas has
the Prophet pair him with Uthman and al-Dhahabi answers كَذَا هَذَا (`76-p2`),
which reads as his own doubt. Twenty pages later the account of his arrival in
Medina pairs him with سَعْد بن الرَّبِيْع أَحَد النُّقَبَاء and carries no such
mark (`91-p5`).

`PACT_BROTHER` is added for this, its own reciprocal the way `PATERNAL_COUSIN`
is, and grouped with `COMPANION_OF` rather than with the blood ties. `BROTHER`
would have said something the source does not. Both reports are authored, since
the app now records the tie they disagree over: Sa'd's is `ESTABLISHED`,
Uthman's is `DISPUTED` and flagged `disputed`.

## What the model has no shape for yet

**His birth.** al-Mada'ini dates it بَعْدَ عَامِ الفِيْلِ بِعَشْرِ سِنِيْنَ
(`74-p1`), and Yaqub ibn al-Mughirah has him live seventy-five years (`92-p3`).
Neither is a hijri or Gregorian year, and converting one would be this batch's
arithmetic rather than the book's statement, so both fields stay unset.

**His mother**, who is disputed. Most name her الشِّفَاء بِنْت عَوْف, Abu Ahmad
al-Hakim names صَفِيَّة بِنْت عَبْدِ مَنَافٍ (`74-p6` to `74-p9`). Neither woman
has a subject in the app, so there is nothing for the competing claims to
compete over, and the disagreement stays on the page.

**The name he was born with.** He was عَبْد عَمْرٍو, and the Prophet named him
عَبْد الرَّحْمَن when he accepted Islam (`69-p3`, `74-p11`). There is no field
for a former name.

## Leaving the seeds

His seed entry, his three seeded participations and his rows in three graph seed
files are retired with this batch, as the first three subjects' were. The
catalog is his only author now, and `catalog:project` and
`catalog:project-graph` write him. Two relations move across cited: `SON` to
عوف بن عبد عوف from the naming line, and `HUSBAND` to Umm Kulthum bint Uqbah,
whom Umar asks about the Prophet telling her انْكِحِيْ سَيِّدَ المُسْلِمِيْنَ
(`84-p9`, `84-p10`).

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch carries
no approval.
