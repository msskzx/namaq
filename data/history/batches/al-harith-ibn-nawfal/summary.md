# Batch: al-Harith ibn Nawfal, Siyar entry 28

This batch cites al-Dhahabi's dedicated Siyar entry on الحارث بن نوفل بن
الحارث الهاشمي, son of Nawfal ibn al-Harith (entry 27) and father of
Abdullah ibn al-Harith (entry 29). It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/al-harith-ibn-nawfal/](accounts/al-harith-ibn-nawfal/)

## Source account

Entry 28 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The whole entry
sits at the foot of page 199 (Shamela 1625): entry 27 (Nawfal) closes at
`199-p10` with "وَابْنُهُ:" ("and his son:"), this entry runs `199-p11`
through `199-p15`, and entry 29 opens cleanly at the top of the next page
(Shamela 1626), so no end trimming was needed.

Page 199's footnote block holds entry 27's `(*)` bibliography, a `(1)`
printing correction ("سقطت لفظة أبي من المطبوع"), then this entry's `(**)`
bibliography. The `(**)` marker starts entry 28's own notes, so the shared
block was cut there and only his bibliography remains in `001.notes.md`.

Shamela's plain reading page for id 1625 currently serves a JavaScript shell
with an empty `.nass` element (the al-baraa batch's summary records the
same transient behavior for ids 1624 and 1625, then worked around with a
trailing slash; the trailing slash no longer helps). The page text was read
through Shamela's own `ajax/pageContent/10906/1625` endpoint instead, which
returns the identical markup — body paragraphs, `<hr>`, and the `hamesh`
footnote block — and the standard extractor functions ran over it
unchanged. The ajax markup carries empty copy-link anchor spans with
server-side ids, so those spans were dropped before slicing and the
passages use the same positional `199-p11`–`199-p15` numbering as the
neighbouring batches. `extractionUrl` still names the canonical reading
page. If the plain page renders again, re-running
`npm run history:extract -- --book 10906 --from 1625 --to 1625 --out data/history/batches/al-harith-ibn-nawfal --subject-slug al-harith-ibn-nawfal --source-slug siyar-alam-al-nubala-risalah --start-anchor p11 --notes-start-marker "(* *) طبقات ابن سعد"`
should reproduce these files exactly.

## Scope call: Companion

Entry 28 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry itself settles the question independently of the
section heading: "أَسْلَمَ مَعَ أَبِيْهِ" ("he accepted Islam with his
father", `199-p12`) and "اسْتَعْمَلَهُ النَّبِيُّ ... عَلَى بَعْضِ العَمَلِ"
("the Prophet employed him in some office", `199-p13`). He is taken in as a
Companion, no contest recorded.

## What this entry supports

Three claims, on the one page.

His name, from the heading: "الحَارِثُ بنُ نَوْفَلِ بنِ الحَارِثِ
الهَاشِمِيُّ" (`199-p11`). The heading stops at his grandfather, so
`fullName` stops there too rather than importing the seed's longer chain
(بن عبد المطلب بن هاشم القرشي) without a citation from this entry for it —
the same call the suhail-ibn-amr batch made for entry 25. The longer
ancestry stays reachable through the father edge: the same paragraph backs
a `SON` relation to `nawfal-ibn-al-harith`, whose own entry gives نوفل بن
الحارث بن عبد المطلب الهاشمي. That target lives in the in-flight Nawfal
batch's files, which this batch does not touch; the reciprocal `FATHER`
side is written by `catalog:project-graph` at projection time.

His standing, carried as `virtues`: he accepted Islam with his father, the
Prophet employed him in some office, and he governed Mecca under Umar and
Uthman (`199-p12`, `199-p13`). A prophetic appointment is virtues material
on the musab-ibn-umayr batch's footing, and the Mecca governorship goes
with it as the entry's other stated trust.

## What the entry does not state

Kunya, appearance, wives, and siblings are all clean misses: trigger-word
greps for تزوج/امرأة/زوج, أخو/أخت/شقيق, physical-description phrases, and
أبو/يكنى across the extracted page return nothing, and the five paragraphs
were read in full. All four are marked `notInSource`.

No battle is named anywhere in the entry, so no `PARTICIPATED_IN` claim is
authored. No muakhah is stated, so no `PACT_BROTHER`. The Basra house
(`199-p14`) and the death "in Uthman's caliphate at about seventy"
(`199-p15`) have no fields in the model — the death is not a hijri year,
so no `deathYearHijri` is inferred — and stay in the source text only.

## Legacy values visited

`data/catalog/people/al-harith-ibn-nawfal.ts` carried four legacy values:
`sex` MALE, the long `fullName` chain, the `companion` title, and the
`SON` edge to Nawfal. The nasab chain and the father edge are promoted to
the new claims above (with `fullName` shortened to what the entry states,
per the suhail-ibn-amr precedent). `sex` and the `companion` title stay
`legacy-unreviewed`: the entry implies both and states neither outright,
and the neighbouring batches leave the title uncited on the same footing.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
