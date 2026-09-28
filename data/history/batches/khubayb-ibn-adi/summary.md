# Batch: Khubayb ibn Adi, Siyar entry 40

This batch gives خبيب بن عدي بن عامر بن مجدعة الأنصاري his first sourced claims, from
al-Dhahabi's dedicated Siyar entry on him. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/khubayb-ibn-adi/](accounts/khubayb-ibn-adi/)

## Index position and the section

The islamweb companion index runs أبو دجانة (entry 39), then خبيب بن عدي (entry 40),
then معاذ بن عمرو بن الجموح (entry 41). All three sit under the شهداء بئر معونة
group heading, though Khubayb's own account is the story of his capture at al-Raji'
and his killing in Mecca, not of Bi'r Ma'una itself. The Shamela text confirms the
order: entry 39 closes on printed 245, heading ٤٠ opens at the top of printed 246,
and the entry's text runs onto printed 249 where heading ٤١ opens mid-page.

## Source account

Entry 40 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 4 (سير أعلام النبلاء ج١), edited by Hussein Asad under Shuayb al-Arnaut.
It opens at `246-p1` (Shamela 1672) with its numbered heading "٤٠ - خُبَيْبُ بنُ
عَدِيِّ بنِ عَامِرِ بنِ مَجْدَعَةَ الأَنْصَارِيُّ" and runs five paragraphs to the
end of page 246, four paragraphs into page 247 (Shamela 1673), thirteen paragraphs
into page 248 (Shamela 1674), and three paragraphs into page 249 (Shamela 1675),
closing at `249-p3`, "وَمَا أَعْلَمُ فِي الأَرْضِ حَبَّةَ عِنَبٍ". Entry 41 (Mu'adh
ibn Amr ibn al-Jamuh) opens right after at `249-p4`, so the last page was cut with
`--end-anchor p3`.

Both end pages carry a shared footnote block. Page 246's block opens with Abu
Dujana's continuation note (the fire hadith, ending "وليس في الصحابة من يسمى بموسى
أصلا"), so `--notes-start-marker (*)` cuts from Khubayb's own bibliography marker,
keeping the (*) refs and the (١) hadith note in `001.notes.md`. Page 249's block
opens with Khubayb's (١) and (٢) notes and continues into Mu'adh's (*) bibliography,
so `--notes-end-marker (*)` keeps only the two Khubayb notes in `004.notes.md`.

## What this entry supports

Six claims, across the four pages.

His name, from the heading plus its continuation: "خُبَيْبُ بنُ عَدِيِّ بنِ عَامِرِ
بنِ مَجْدَعَةَ الأَنْصَارِيُّ" (`246-p1`) continuing "ابْنِ جَحْجَبَا الأَنْصَارِيُّ،
الشَّهِيْدُ" (`246-p2`). `fullName` carries the whole chain as stated, replacing the
stub's truncated form (which dropped "الأنصاري" after مجدعة and read "بن جحجبى"
for "ابن جحجبى"). The same heading backs a `SON` relation to `adi-ibn-amir`, which
already exists in the catalog.

His companion title: the entry places him among the الطبقة الأولى, states he
witnessed Uhud ("شَهِدَ أُحُداً"), and that he was among those the Prophet sent with
Banu Lihyan ("وَكَانَ فِيْمَنْ بَعَثَهُ النَّبِيُّ... مَعَ بَنِي لِحْيَانَ") (`246-p3`).
No work contests his صحبة.

His virtues, carried as `virtues`: he was the first to institute prayer at the time
of killing ("فَكَانَ أَوَّلَ مَنْ سَنَّ الصَّلاَةَ عِنْدَ القَتْلِ", `248-p6`); his
supplication against his killers ("اللَّهُمَّ أَحْصِهِم عَدَداً، وَاقْتُلْهُم بَدَداً،
وَلاَ تُغَادِرْ مِنْهُم أَحَداً", `248-p7`); Mu'awiyah's testimony that Abu Sufyan
threw him to the ground for fear of Khubayb's supplication (`248-p8`); and the
grape miracle — Mawiyyah found him eating a cluster of grapes like a man's head
while imprisoned in Mecca, where no grapes grow (`249-p3`).

His Uhud attendance: "شَهِدَ أُحُداً" (`246-p3`) gives him a `PARTICIPATED_IN`
relation to `data/catalog/battles/uhud.ts` with no `status`; he survived it, unlike
many named there.

His death place: "فَبَاعُوْهُمَا بِمَكَّةَ، فَقَتَلُوْهُمَا... وَصَلَبُوْهُمَا
بِالتَّنْعِيْمِ" (`246-p3`) — sold in Mecca, killed in Mecca, crucified at al-Tan'im.
The catalog holds no Battle or Event entry for al-Raji', so his capture there
cannot become a `PARTICIPATED_IN` relation the way Uhud did; the same sentence
instead backs a `placeOfDeathArabic` field ("مكة").

## What the entry does not state

Kunya, appearance, wives, and siblings: trigger-word grep (يكنى/أبو, appearance
phrases, تزوج/امرأة/زوج, أخو/أخت/شقيق) across all four pages and all four note
files returns nothing relevant — the "أبو" hits are other people's names (أبو
مسيرة، أبو سروعة), not Khubayb's kunya, and the "رجل" hits are generic references
in the notes. The full read confirms it. All four are marked `notInSource`.

No death year: the entry gives no year for his killing, only the sequence (captured
at al-Raji', sold and killed in Mecca), so no `deathYearHijri` is set.

## Legacy values

The stub held four legacy values; three are visited here. `fullName`, the companion
title, and the `SON` edge to `adi-ibn-amir` are each promoted to a cited claim
above. `sex` stays on the legacy marker: the entry never states "رجل" outright, and
the masculine name and verb forms are consistent with MALE but are not a citable
statement — the same call the amir-ibn-al-bukayr batch made for its subject.

The ledger's remaining items on `adi-ibn-amir` (his own sex and his own father
edge) belong to him, not to this batch. The reciprocal `FATHER` side of the new
`SON` tie is left to `catalog:project-graph`, which writes it from the declared
inverse.

## Review

Nothing is reviewed and nothing is approved. Every claim is NOT_REVIEWED, and the
batch carries no approval block.
