# Batch: Abu al-As ibn al-Rabia, Siyar entry 69

This batch cites al-Dhahabi's dedicated Siyar entry on أَبُو العَاصِ بنُ
الرَّبِيْعِ بنِ عَبْدِ العُزَّى القُرَشِيُّ. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abu-al-as-ibn-al-rabi/](accounts/abu-al-as-ibn-al-rabi/)

## Source account

Entry 69 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The entry runs
five Shamela pages, 1756–1760 (printed 330–334): the first page opens with
the end of entry 68 (Yazid ibn Abi Sufyan), so the body was trimmed with
start-anchor `p10` where the ٦٩ heading begins; the last page carries the
start of entry 70 (Zaynab bint Muhammad), so it was cut with end-anchor
`p6`. Page 1756's footnote block holds only this entry's `(*)` bibliography,
and page 1760's holds only this entry's notes, so no notes markers were
needed on either shared end.

## Scope call: Companion

Entry 69 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry itself settles the question independently of the
section heading: "أَسْلَمَ قَبْلَ الحُدَيْبِيَةِ بِخَمْسَةِ أَشْهُرٍ"
(`331-p4`), the Prophet's son-in-law (`331-p2`), and the only Companion
named in the Qur'an's context of the Prophet's family. He is taken in as a
Companion, no contest recorded.

## What this entry supports

Four claims, across the five pages.

His name, from the heading and the opening nasab: "٦٩ - أَبُو العَاصِ بنُ
الرَّبِيْعِ بنِ عَبْدِ العُزَّى القُرَشِيُّ" (`330-p10`) "ابْنِ عَبْدِ
شَمْسٍ بنِ عَبْدِ مَنَافٍ بنِ قُصَيِّ بنِ كِلاَبٍ القُرَشِيُّ،
العَبْشَمِيُّ" (`330-p11`). The chain adds "بن كلاب" between قصي and
القرشي, completing the catalog's truncated form.

His father, from the nasab: "أَبُو العَاصِ بنُ الرَّبِيْعِ بنِ عَبْدِ
العُزَّى" (`330-p10`), a `SON` relation to `al-rabi-ibn-abd-al-uzza`,
whose own module already declares the legacy `FATHER` side toward Abu
al-As — projection joins them.

His marriage, from the opening description: "صِهْرُ رَسُوْلِ اللهِ
-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- زَوْجُ بِنْتِهِ زَيْنَبَ"
(`331-p2`), a `HUSBAND` relation to `zaynab-bint-muhammad`, whose own
module already declares the legacy `WIFE` side toward Abu al-As.

His standing, carried as `virtues`: the Prophet's son-in-law and father of
Umamah whom the Prophet carried in prayer (`331-p2`), the Prophet's praise
of his marriage alliance (`331-p5`), "حَدَّثَنِي فَصَدَقَنِي، وَوَعَدَنِي
فَوَفَى لِي" (`331-p6`), and his place among the merchants and trusted
ones of Quraysh (`331-p7`).

## What the entry does not state

Appearance is a clean miss: no physical description appears anywhere in the
five pages. Siblings is a clean miss: the entry names his mother (Halah
bint Khuwaylid, Khadijah's sister) and his maternal aunt (Khadijah), but
never a brother or sister of his own. Both are marked `notInSource`.

The entry does state his conversion ("أَسْلَمَ قَبْلَ الحُدَيْبِيَةِ
بِخَمْسَةِ أَشْهُرٍ", `331-p4`) and his pre-Islamic nickname "جَرْوَ
البَطْحَاءِ" (`331-p3`), but neither has a field in the model and both
stay in the source text. The ransom narrative (`332-p1`–`334-p6`), the
pre-Fudayl trading expedition (`333-p19`–`334-p5`), and the hadith about
the Prophet's praise (`331-p5`–`331-p8`) have no modellable targets beyond
the virtues claim above and stay in the source text.

## Legacy values visited

`data/catalog/people/abu-al-as-ibn-al-rabi.ts` carried five legacy values:
`sex` MALE, the `fullName` chain, the `companion` title, a `SON` edge to
`al-rabi-ibn-abd-al-uzza`, and a `HUSBAND` edge to `zaynab-bint-muhammad`.

The `fullName` chain is promoted to the new full-name claim (the entry's
version adds "بن كلاب"). The `SON` edge is promoted to the new father
claim. The `HUSBAND` edge is promoted to the new Zaynab-wife claim. `sex`
and the `companion` title stay `legacy-unreviewed`: the entry implies both
— early convert, Prophet's son-in-law — and states neither outright, the
same footing the neighbouring batches left them on.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
