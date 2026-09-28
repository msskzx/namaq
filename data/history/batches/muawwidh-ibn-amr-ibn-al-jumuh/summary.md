# Batch: Muawwidh ibn Amr ibn al-Jumuh, Siyar entry 42

This batch gives معوذ بن عمرو بن الجموح الأنصاري السلمي his first sourced
claims, from al-Dhahabi's dedicated Siyar entry on him. It follows
the [data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/muawwidh-ibn-amr-ibn-al-jumuh/](accounts/muawwidh-ibn-amr-ibn-al-jumuh/)

## Scope

Companion, in scope. The entry sits at number 42 in the Siyar's first
Sahaba run: an Ansari of the Salim clan who witnessed Badr with his two
brothers Muadh and Khallad. The entry is very short — two paragraphs on a
single printed page — and notes that Ibn Ishaq does not mention him.

## Source account

Entry 42 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb
al-Arnaut. It opens at `252-p4` (Shamela 1678), mid-page: entry 41 (Muadh
ibn Amr ibn al-Jumuh) occupies `252-p1`–`252-p3`, so the page was cut with
`--start-anchor p4` at the numbered heading "٤٢ - مُعَوَّذُ بنُ عَمْرِو بنِ
الجَمُوْحِ". The entry runs one paragraph to `252-p5`, "شَهِدَ مَعَ
أَخَوَيْهِ مُعَاذٍ وَخَلاَّدٍ بَدْراً". Entry 43 (Khallad ibn Amr ibn
al-Jumuh) opens right after at `252-p6`, so the page was cut with
`--end-anchor p5`.

The page carries a shared footnote block. Entry 42's footnote (١) is the
first in the block; entries 43 and 44's footnotes follow. The block was cut
with `--notes-end-marker "(* *)"` to keep only entry 42's bibliography in
`001.notes.md`.

## What this entry supports

Eight claims, all on the single page.

His name, from the heading: "مُعَوَّذُ بنُ عَمْرِو بنِ الجَمُوْحِ
الأَنْصَارِيُّ السَّلَمِيُّ" (`252-p4`). `fullName` carries the chain as
stated. The same heading backs a `SON` relation to `amr-ibn-al-jumuh`,
which already exists in the catalog.

His sex: "شَهِدَ" (`252-p5`) — a masculine verb.

His standing, carried as `virtues`: he witnessed Badr with his brothers
(`252-p5`).

His companion title: a Badri companion — the entry's own placement among
the Sahaba.

His brothers: "أَخَوَيْهِ مُعَاذٍ وَخَلاَّدٍ" (`252-p5`) — his two brothers
Muadh and Khallad. The source calls them "his two brothers" but does not
state the same mother, so they are recorded as `HALF_BROTHER` per the
checklist's strict requirement (sharing a father is not enough for
`BROTHER`/`SISTER`).

His participation at Badr: "شَهِدَ... بَدْراً" (`252-p5`) — a
`PARTICIPATED_IN` relation to Badr.

## What the entry does not state

Kunya, appearance, and wives: the entry is two paragraphs with no trigger
words for any of the three. All three are marked `notInSource`.

## Legacy values

The stub held four legacy values; all are visited here. Sex, fullName, the
companion title, and the SON edge to his father are each promoted to a
cited claim above. Nothing is left legacy, and nothing contradicts.

The legacy fullName carried a longer chain ("بن زيد بن حرام بن كعب بن غنم
بن كعب بن سلمة الأنصاري الخزرجي السلمي") than this entry states. The
source gives only "مُعَوَّذُ بنُ عَمْرِو بنِ الجَمُوْحِ الأَنْصَارِيُّ
السَّلَمِيُّ". The longer chain is expected to be supported by entry 44
(the father's entry, عمرو بن الجموح), which gives the father's full
nasab. This batch records only what its own source states.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED,
and the batch carries no approval block.
