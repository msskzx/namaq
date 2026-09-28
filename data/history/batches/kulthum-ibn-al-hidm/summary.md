# Batch: Kulthum ibn al-Hidm, Siyar entry 38

This batch gives كلثوم بن الهدم بن امرئ القيس بن الحارث الأنصاري his first
sourced claims, from al-Dhahabi's dedicated Siyar entry on him. It follows
the [data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/kulthum-ibn-al-hidm/](accounts/kulthum-ibn-al-hidm/)

## Index position and the two collective entries

The islamweb companion index runs عبد الله بن رواحة (entry 37), then two
collective headings — شهداء يوم الرجيع (id 43) and شهداء بئر معونة (id 44) —
then كلثوم بن الهدم (id 45). The two middle headings are group martyrdom
lists, not single-person entries, so they are skipped the same way earlier
batches skipped the السابقون الأولون and شهداء بدر group entries. Kulthum is
the next personal entry after Abdullah ibn Rawaha, and the Shamela text
confirms the order: entry 37 closes at printed 241, the Rajiʿ and Biʾr
Maʿuna sections run through printed 242, and heading ٣٨ opens mid-page.

## Scope

Companion, in scope. The entry sits at number 38 in the Siyar's first
Sahaba run: an Ansari of Aws who converted before the Prophet's arrival,
hosted him at Quba, and died before Badr. No work contests his صحبة, so
there is nothing to record beyond the call itself.

## Source account

Entry 38 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb
al-Arnaut. It opens at `242-p3` (Shamela 1668), mid-page: the Biʾr Maʿuna
section occupies `242-p1`–`242-p2`, so the first page was cut with
`--start-anchor p3` at the numbered heading "٣٨ - كُلْثُوْمُ بنُ الهِدْمِ".
The entry runs six paragraphs to the end of page 242 and three paragraphs
into page 243 (Shamela 1669), closing at `243-p3`, "ثُمَّ لَمْ يَلْبَثْ أَنْ
تُوُفِّيَ... وَذَلِكَ قَبْلَ بَدْرٍ". Entry 39 (Abu Dujana) opens right after
at `243-p4`, so the last page was cut with `--end-anchor p3`.

Both pages carry a shared footnote block. Page 242's block opens with Biʾr
Maʿuna's footnote (١) ("سقطت من الأصل"), so `--notes-start-marker (*)` cuts
from the entry's own bibliography marker, keeping the (*) refs and the
منزل العزاب note (٢) in `001.notes.md`. Page 243's block opens with
Kulthum's Ibn Saʿd footnote (١) and continues into Abu Dujana's (*) bibliography,
so `--notes-end-marker (*)` keeps only the Ibn Saʿd line in `002.notes.md`.

## What this entry supports

Seven claims, across the two pages.

His name, from the heading plus its continuation: "كُلْثُوْمُ بنُ الهِدْمِ
بنِ امْرِئِ القَيْسِ بنِ الحَارِثِ" (`242-p3`) continuing "ابْنِ زَيْدِ بنِ
عُبَيْدِ... بنِ الأَوْسِ الأَنْصَارِيُّ، العَوْفِيُّ" (`242-p4`). `fullName`
carries the whole chain as stated, replacing the stub's truncated
"الأنصاري الأوسي" form. The same heading backs a `SON` relation to
`al-hidm-ibn-imri-al-qays`, which already exists in the catalog.

His sex: "كَانَ كُلْثُوْمُ بنُ الهِدْمِ رَجُلاً شَرِيْفاً" (`242-p7`).

His standing, carried as `virtues`: شيخ الأنصار (`242-p4`), a noble old man
who converted before the Prophet reached Medina (`242-p7`), a righteous man
who died before Badr (`243-p3`).

His companion title: an Ansari Muslim of the first hour, dead before Badr —
the entry's own placement among the Sahaba with no contest recorded.

## The two lodging reports

`242-p4` and `242-p7` say the Prophet stayed with Kulthum when he first
reached Medina at Quba ("وَمَنْ نَزَلَ عَلَيْهِ النَّبِيُّ... أَوَّلَ مَا
قَدِمَ المَدِيْنَةَ بِقُبَاءَ"، "فَلَمَّا هَاجَرَ، نَزَلَ عَلَيْهِ"). Then
`243-p2` reports al-Waqidi's "قيل": the Prophet stayed with Saʿd ibn
Khaythama, while a group of Muhajirun stayed with Kulthum.

The first reading takes the field
(`kulthum-ibn-al-hidm-siyar38/prophet-lodging`, ESTABLISHED): the heading's
own wording plus an Ibn Abbas-isnad report against one "it was said". The
Waqidi report stays its own claim
(`kulthum-ibn-al-hidm-siyar38/prophet-lodging-alt`), marked `DISPUTED` and
not projected onto the field — the suhail-ibn-amr death-place pattern.

## What the entry does not state

Kunya, appearance, wives, and siblings: trigger-word grep (يكنى/أبو،
appearance phrases, تزوج/امرأة/زوج, أخو/أخت/شقيق) across both pages and
both note files returns nothing, and the full nine-paragraph read confirms
it — "مسنّاً" and "قد شاخ" are age, not a physical description. All four
are marked `notInSource`.

No battle participation: he died before Badr (`243-p3`), and the entry
places him at no modeled battle, so no `PARTICIPATED_IN` is authored and no
battle file is touched. His death carries no year, only "قبل بدر", so no
death field is set.

## Legacy values

The stub held four legacy values; all are visited here. Sex, fullName, the
companion title, and the SON edge to his father are each promoted to a
cited claim above. Nothing is left legacy, and nothing contradicts.

The ledger's two remaining items belong to `al-hidm-ibn-imri-al-qays`
himself (his own sex and his own father edge) — his subject, not this
batch's. The reciprocal FATHER side of the new SON tie is left to
`catalog:project-graph`, which writes it from the declared inverse.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED,
and the batch carries no approval block.
