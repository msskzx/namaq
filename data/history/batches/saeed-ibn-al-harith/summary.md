# Batch: Saeed ibn al-Harith, Siyar entry 31

This batch cites al-Dhahabi's dedicated Siyar entry on سعيد بن الحارث بن
عبد المطلب, son of al-Harith ibn Abd al-Muttalib and paternal cousin of
the Prophet. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/saeed-ibn-al-harith/](accounts/saeed-ibn-al-harith/)

## Source account

Entry 31 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The whole entry
sits on one printed page, 202 (Shamela 1628): entry 30 (Abdullah ibn
Abdullah ibn al-Harith) closes at `202-p3`, this entry runs `202-p4`
through `202-p8`, and entry 32 (Abu Sufyan ibn al-Harith) opens at
`202-p9` on the same page, so both ends were trimmed
(`--start-anchor p4 --end-anchor p8`).

Page 202's footnote block holds entry 30's `(1)` gloss and `(*)` source
note, then this entry's `(2)` note on the single hadith, then entry 32's
`(**)` bibliography. The `(2)` note starts this entry's own notes
(`--notes-start-marker "أخرجه الحاكم"`) and entry 32's `(**)` sigil ends
them (`--notes-end-marker "(* *) طبقات ابن سعد"`), so only the hadith note
remains in `001.notes.md`.

Unlike the neighbouring al-harith-ibn-nawfal batch, no ajax fallback was
needed: Shamela's plain reading page for id 1628 served the full `.nass`
markup to the browser-shaped request, and the standard extractor ran over
it unchanged. `extractionUrl` names the canonical reading page.

## Scope call: Companion, contested — taken in

Entry 31 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry itself raises the contest rather than settling
it: "ذَكَرَهُ الحَاكِمُ فِي الصَّحَابَةِ مِنْ (صَحِيْحِهِ)، وَمَا رَأَيْتُ
مَنْ ذَكَرَهُ غَيْرَهُ" — al-Hakim alone listed him among the Companions
in his Sahih, on one hadith whose isnad carries Ibn Lahi'ah, and
al-Dhahabi has seen no one else mention him at all ("ولم أر لسعيد هذا
ذكرا في كتب الأنساب", per Ibn Hajar as quoted in the edition's own note).
A contested صحبة is taken in with the contest recorded, never dropped, so
he stays a Companion subject and the doubt is recorded here rather than
resolved — settling it properly wants الإصابة, which is not extracted.

## What this entry supports

Three claims, on the one page.

His name, from the heading: "سَعِيْدُ بنُ الحَارِثِ بنِ عَبْدِ
المُطَّلِبِ" (`202-p4`). The heading stops at his grandfather with no
الهاشمي/القرشي suffix, so `fullName` stops there too rather than
importing the seed's longer chain without a citation from this entry —
the same call the suhail-ibn-amr batch made for entry 25. The same
paragraph backs a `SON` relation to `al-harith-ibn-abd-al-muttalib`, an
existing catalog slug.

His kinship to the Prophet, stated outright: "ابْنُ عَمِّ رَسُوْلِ اللهِ"
(`202-p5`), carried as `PATERNAL_COUSIN` to `prophet-muhammad` on the
az-zubayr batch's footing (`zubayr/cousin-of-prophet`).

## What the entry does not state

Kunya, appearance, wives, and siblings are all clean misses: trigger-word
greps for تزوج/امرأة/زوج, أخو/أخت/شقيق, أبو/أم/يكنى, and كان/طويل/أسمر/أبيض
across the extracted page return nothing, and the five paragraphs were
read in full. All four are marked `notInSource`, plus `manaqeb`: his one
transmitted hadith ("فِيْمَنْ لَقِيَ اللهَ مُؤْمِناً دَخَلَ الجَنَّةَ",
`202-p6`) is a report he carried, not praise of him, and the entry states
no deed, appointment, or prophetic commendation.

No battle is named anywhere in the entry, so no `PARTICIPATED_IN` claim is
authored. No muakhah is stated, so no `PACT_BROTHER`. The hadith's isnad
through Salman al-Agharr and Ibn Lahi'ah (`202-p7`), al-Hakim's solitary
listing (`202-p8`), and Ibn Hajar's remark in the edition's note stay in
the source text only — transmission chains become neither nodes nor
edges, and the contested listing is recorded above rather than claimed.
No death is stated, so no death fields are inferred.

## Legacy values visited

`data/catalog/people/saeed-ibn-al-harith.ts` carried four legacy values:
`sex` MALE, the long `fullName` chain, the `companion` title, and the
`SON` edge to al-Harith. The father edge is promoted to the new claim
above, and `fullName` is promoted shortened to what the entry states (per
the suhail-ibn-amr precedent). `sex` stays `legacy-unreviewed`: the entry
implies it and states nothing outright, the same footing the neighbouring
batches leave it on. The `companion` title stays `legacy-unreviewed` too:
the entry reports only al-Hakim's contested listing alongside the
author's doubt, which is evidence of a contest, not a citable affirmation
— the scope call above is where that contest lives.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
