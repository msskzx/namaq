# Batch: Abdullah ibn al-Harith ibn Abd al-Muttalib, Siyar entry 47

This batch gives عبد الله بن الحارث بن عبد المطلب الهاشمي his first cited
catalog entry from al-Dhahabi's Siyar entry on him, a son of al-Harith ibn
Abd al-Muttalib and brother of Rabi'ah and Nawfal. It follows
[docs/data-pipelines.md](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-al-harith-ibn-abd-al-muttalib/](accounts/abdullah-ibn-al-harith-ibn-abd-al-muttalib/)

## Source account

Entry 47 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4, edited by Hussein Asad under Shuayb al-Arnaut. It occupies a
single printed page, 259 (Shamela 1685), in the أعيان البدريين section.
The entry opens at the top of the page with the heading and runs through
`259-p11` at the foot: "وَلاَ نَسْلَ لِهَذَا." Entry 46's notes continue
onto this page above the heading, and entry 48 begins on the same page
below, so the extraction was trimmed to entry 47's own paragraphs.

## Scope call: Companion

Entry 47 falls in the أعيان البدريين section within the الطبقة الأولى —
الصحابة block, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry states he emigrated before the Conquest and went
out with the Prophet in his military expeditions, confirming his صحبة. The
`companion` title stays on the catalog entry.

## What this entry supports

Six claims, all on the single page.

His name, from the heading: "عَبْدُ اللهِ بنُ الحَارِثِ بنِ عَبْدِ
المُطَّلِبِ الهَاشِمِيُّ" (`259-p5`). The heading stops at Abd al-Muttalib,
so `fullName` stops there too rather than importing the seed's longer chain
(بن هاشم القرشي) without a citation from this entry for it — the same
call the abdullah-ibn-al-harith-ibn-nawfal and nawfal-ibn-al-harith
batches made. The longer ancestry stays reachable through the father edge.

The heading also backs a `SON` relation to `al-harith-ibn-abd-al-muttalib`,
which exists on origin/main; the reciprocal `FATHER` side is written by
`catalog:project-graph` at projection time.

His siblings, from "أَخُو رَبِيْعَةَ وَنَوْفَلٍ" (`259-p6`): the entry
names Rabi'ah and Nawfal as his brothers. Both are sons of al-Harith ibn
Abd al-Muttalib, so they share a father with the subject. The entry does
not state the mother, so per the extraction checklist these are
`HALF_BROTHER` relations, not `BROTHER`. Both `rabiah-ibn-al-harith` and
`nawfal-ibn-al-harith` exist as catalog nodes.

His standing, carried as `virtues`: "قيل إنه قال فيه: هو سعيد، أدركته
السعادة" (`259-p9`) — a remark that he was blessed and felicity attained
him. The speaker is not named in the entry; the remark itself is the
virtue.

His death place, from "فَمَاتَ بِالصَّفْرَاءِ" (`259-p8`): he died at
al-Safra'. No death year is stated.

## What the entry does not carry into the model

The name change narrative (`259-p7`) — his name was Abd Shams, it was
changed, and the Prophet named him Abdullah — has no field in the model
and stays in the source text. The emigration "before the Conquest" is
noted but has no dedicated field. The military expeditions ("بَعْضِ
مَغَازِيْهِ") are unnamed, so no `PARTICIPATED_IN` is authored and no
battle file is touched. The shrouding in the Prophet's shirt (`259-p8`)
is a death detail with no field. "وَلاَ نَسْلَ لِهَذَا" (`259-p11`) — he
had no offspring — has no field in the model. The Ibn Sa'd citation
(`259-p10`) is a transmission remark with no modeled value.

## What the entry does not state

Kunya, appearance, and wives are all clean misses, checked by close
reading of the full single-page entry. No أبو kunya is given, no physical
description appears, and no marriage is mentioned. All three are marked
`notInSource`.

## Legacy values visited

`data/catalog/people/abdullah-ibn-al-harith-ibn-abd-al-muttalib.ts` carried
four legacy values: `sex` MALE, the long `fullName` chain, the `companion`
title, and the `SON` edge to al-Harith. The name and the father edge are
promoted to the new claims above (with `fullName` shortened to what the
entry states, per the neighbouring batches' precedent). `sex` and the
`companion` title stay `legacy-unreviewed`: the entry implies both through
masculine grammar and placement in the الصحابة run, and states neither
outright — the same footing the sibling batches left them on.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
