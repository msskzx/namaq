# Batch: Sa'd ibn Abi Waqqas, Siyar entry 5

This batch preserves al-Dhahabi's complete entry on Sa'd ibn Abi Waqqas and
supports the canonical records selected from it. It follows the
[data quality and references workflow](../../../../docs/data-quality-references.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/saad-ibn-abi-waqqas/](accounts/saad-ibn-abi-waqqas/)

## Source account

Entry 5 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume
1, edited by Hussein Asad under Shuayb al-Arnaut. The account runs from printed
page 92 to page 124, thirty-three pages.

It shares a page with a neighbour at each end. Entry 4 holds the first seven
paragraphs of page 92, so the body starts at `92-p8` and the notes are cut
before this entry's `(*)` source list. Entry 6 on Sa'id ibn Zayd opens at
`124-p6`, so the body stops at `124-p5` and the notes stop before Sa'id's `(*)`
list.

## What the entry supports

Nineteen claims and twenty-eight citations. His profile carries nothing on the
legacy marker.

**A fifth title for him.** The seed gave him the ten promised paradise, the six
of the Shura, companion and awwal-rami. The naming line counts him among
السابقين الأولين as well (`93-p2`), so `al-sabiqoon` is added. He claims the
archery title himself: وَإِنِّي لأَوَّلُ المُسْلِمِيْنَ رَمَى المُشْرِكِيْنَ
بِسَهْمٍ (`98-p7`).

**Two verses, neither of them the seed's.** He names himself among the six that
al-An'am 52 was revealed about (`109-p4`, `109-p5`), and says outright
نَزَلَتْ هَذِهِ الآيَةُ فِيَّ of al-Ankabut 8, over his mother's hunger strike
against his Islam (`109-p7` to `109-p12`). The seed carried al-An'am 124 for him
with nothing behind it, and the entry never reaches for that verse, so it stays
on the legacy marker.

**خال النبي, now cited.** The graph seeds held `MATERNAL_UNCLE` to the Prophet
uncited. The entry gives it in the Prophet's own words, هَذَا خَالِي، فَلْيُرِنِي
امْرُؤٌ خَالَهُ, and al-Dhahabi explains the tie: the Prophet's mother Aminah
bint Wahb was a Zuhriyyah and a cousin of Abu Waqqas (`110-p5`, `110-p6`).

## Two disagreements the model can hold

**His build.** His daughter Aisha bint Sa'd describes him قَصِيْراً دَحْدَاحاً
(`97-p4`), and Ibn Mandah reports the same build independently (`96-p11`).
Isma'il ibn Muhammad ibn Sa'd has him جَعْدَ الشَّعْرِ، آدَمَ، أَفْطَسَ،
طَوِيْلاً (`97-p6`). The field takes his daughter's account, because two
reports agree on it, and the other is authored as its own `DISPUTED` claim
rather than dropped.

**His death year.** al-Mada'ini, Abu Ubaydah and a group give 55 (`123-p10`),
which the burial account at `97-p2` agrees with. Nuh ibn Yazid gives 56,
another report 57, and Abu Nu'aym al-Mula'i 58 (`124-p2` to `124-p4`). The
field takes 55; the rest are one `DISPUTED` claim.

## Battles

**Badr carries `CAPTURED`.** Ibn Mas'ud shared the spoils with him and Ammar,
and فَجَاءَ سَعْدٌ بِأَسِيْرَيْنِ وَلَمْ أَجِئْ أَنَا وَعَمَّارٌ بِشَيْءٍ
(`107-p6`, `108-p1`). Ibn Mas'ud also has him fighting قِتَالَ الفَارِسِ فِي
الرِّجَالِ there (`101-p2`).

**Uhud and Khandaq** are both his archery. At Uhud the Prophet handed him arrows
saying ارْمِ فِدَاكَ أَبِي وَأُمِّي (`99-p10` to `99-p12`); at Khandaq he shot a
man sheltering behind a shield and the Prophet laughed until his back teeth
showed (`102-p15` to `103-p3`).

**Qadisiyyah is a new catalog battle,** and the only one here with a cited year.
Khalifah ibn Khayyat dates it to 15 (`117-p13`), and al-Dhahabi makes the
conquest of Iraq his (`115-p2`).

**Jamal is an absence, not a participation.** اعْتَزَلَ سَعْدٌ الفِتْنَةَ،
فَلاَ حَضَرَ الجَمَلَ، وَلاَ صِفِّيْنَ، وَلاَ التَّحْكِيْمَ (`122-p7`). This is
the first `ABSENT_FROM` the evidence path has produced rather than inherited. No
status: the entry states the withdrawal and does not excuse it, and
`ABSENT_EXCUSED` would add a judgement the passage does not make.

**Ctesiphon is carried.** The seed placed him there. The entry has him settle at
al-Mada'in after Qadisiyyah and lead at Jalula, but never narrates the conquest,
so the participation keeps the legacy marker.

## What the model has no shape for yet

**Jalula**, which al-Dhahabi and al-Layth both make his and date to 19 (`115-p3`,
`118-p1`), has no battle subject. **His governorship of Kufa**, the complaint
against him, and Umar's refusal to count the dismissal against him (`113`,
`117-p13`, `118-p7`) have no field. **His mother** حَمْنَة بِنْت سُفْيَان, named
at `96-p10`, has no subject to link to, and the entry names no wife.

## Leaving the seeds

His seed entry, his five seeded participations and his rows in two graph seed
files are retired with this batch. The catalog is his only author now. Both
relations the graph seeds held move across cited: `SON` to مالك بن أهيب from the
naming line, and `MATERNAL_UNCLE` to the Prophet from his own words.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed and the batch carries
no approval.
