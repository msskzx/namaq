# Batch: Abdullah ibn Rawahah, Siyar entry 37

This batch cites al-Dhahabi's dedicated Siyar entry on عَبْدُ اللهِ بنُ
رَوَاحَةَ بنِ ثَعْلَبَةَ بنِ امْرِئِ القَيْسِ الأَنْصَارِيُّ, the Khazraji
poet-commander killed at Mu'tah. It follows the [data quality and
references workflow](../../../../docs/data-pipelines.md) and
[docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/abdullah-ibn-rawahah/](accounts/abdullah-ibn-rawahah/)

## Source account

Entry 37 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1 (global volume 4 of the edition, `سير أعلام النبلاء ج١`). The
entry runs printed pages 230–239 (Shamela 1656–1666, eleven pages):
entry 36 (Zayd ibn Harithah) closes page 230 at `230-p8`, this entry runs
`230-p9` through `240-p13`, and the فصل on the Raji' martyrs opens
mid-page-240 at `240-p14`, so both shared pages were trimmed by anchor and
by notes marker.

Page 230's footnote block holds entry 36's `(1)–(3)` notes, then this
entry's `(*)` bibliography; the cut was made at `(*) مسند أحمد`. Page
240's block holds this entry's `(1)–(3)` notes, then the fasl's `(4)`
note; the cut was made at `(٤) أخرج خبرها البخاري`. Only this entry's own
notes remain in `001.notes.md` and `011.notes.md`.

Shamela's plain reading pages for these ids currently serve a JavaScript
shell with an empty `.nass` element, so the page text was read through
Shamela's own `ajax/pageContent/10906/<page>` endpoint instead, which
returns the identical markup — body paragraphs, `<hr>`, and the `hamesh`
footnote block — and the standard extractor functions in
`src/lib/history/shamelaEntry.ts` ran over it unchanged. The ajax markup
carries copy-link anchor spans with server-side ids, so those spans were
dropped before slicing and the passages use the same positional
`230-p9`–`240-p13` numbering as the neighbouring batches. `extractionUrl`
still names the canonical reading page. If the plain pages render again,
re-running `npm run history:extract -- --book 10906 --from 1656 --to 1666
--out data/history/batches/abdullah-ibn-rawahah --subject-slug
abdullah-ibn-rawahah --source-slug siyar-alam-al-nubala-risalah
--start-anchor p9 --end-anchor p13 --notes-start-marker "(*) مسند أحمد"
--notes-end-marker "(٤) أخرج خبرها البخاري"` should reproduce these files
exactly.

## Scope call: Companion

Entry 37 falls in the الطبقة الأولى — الصحابة (v1) block that opens at
Shamela 1431, which the Companion-scope table in `docs/data-pipelines.md`
marks in scope. The entry itself settles the question independently of the
section heading: "شَهِدَ بَدْراً، وَالعَقَبَةَ" (`231-p2`), a Naqib of the
Ansar (`230-p11`), and the Prophet's deputy over Medina (`231-p6`). He is
taken in as a Companion, no contest recorded.

## What this entry supports

Eight claims, across the eleven pages.

His name, from the heading and its continuation: "عَبْدُ اللهِ بنُ
رَوَاحَةَ بنِ ثَعْلَبَةَ بنِ امْرِئِ القَيْسِ" (`230-p9`) "ابْنِ
ثَعْلَبَةَ" (`230-p10`), with the Khazraji nisba from the same line that
calls him الأنصاري الخزرجي (`230-p11`). The same paragraph backs a `SON`
relation to `rawahah-ibn-thalabah`, which already exists in the catalog.

His kunyas: أبو عمرو from the opening line (`230-p11`), and أبو محمد
وأبو رواحة (`231-p3`).

His standing, carried as `virtues` on two claims: Badri, Naqib, and poet
(`230-p11`); the Aqabah pledge, his place among the Ansar's scribes, and
the Prophet's deputyship over Medina (`231-p2`, `231-p5`, `231-p6`); and
three prophetic sayings about him — "رحم الله ابن رواحة، إنه يحب المجالس
التي تتباهى بها الملائكة" (`231-p14`), "زادك الله حرصا على طواعية الله
ورسوله" (`232-p3`), and "خل يا عمر، فهو أسرع فيهم من نضح النبل"
(`235-p7`).

His maternal half-brotherhood with Abu al-Darda: "ابْنُ رَوَاحَةَ،
وَأَبُو الدَّرْدَاءِ أَخَوَانِ لأُمٍّ" (`231-p9`), a `HALF_BROTHER` edge —
they share the mother, so not a full `BROTHER`.

His presence at Badr: "شَهِدَ بَدْراً" (`231-p2`). The claim is authored
as evidence, but `data/catalog/battles/badr.ts` is owned by a parallel
batch lane and was not touched; registering him there is left as a
follow-up, recorded here rather than silently dropped.

His presence at Mu'tah, with martyrdom: the Prophet named him third in
the succession — "الأَمِيْرُ زَيْدٌ، فَإِنْ أُصِيْبَ فَجَعْفَرٌ، فَإِنْ
أُصِيْبَ فَابْنُ رَوَاحَةَ" (`234-p1`) — he took the banner after his two
companions were killed and "فَقَاتَلَ حَتَّى قُتِلَ" (`234-p5`,
`239-p14`). Registered on `data/catalog/battles/mutah.ts` as
`PARTICIPATED_IN` with status `MARTYRED` and the summary in the source's
own wording. Sibling entries 34 and 36 may register on the same battle
file; this batch adds only its own participant.

## What the entry does not state

Appearance is a clean miss: trigger-word greps for physical-description
phrases across all eleven pages return nothing, and the entry was read in
full. Marked `notInSource`.

Wives are marked `notInSource`: the entry names no wife. An unnamed
"امْرَأَتُهُ" weeps with him (`236-p12`), is caught with the concubine
episode (`238-p3`), and is remarried afterwards by a man hoping to learn
of Ibn Rawahah's household ways (`233-p4`) — none of which yields a
`HUSBAND`/`WIFE` edge to an existing subject, which is what the model
holds.

No muakhah is stated, so no `PACT_BROTHER`. The Khaybar assessment
missions (`231-p7`, `237-p3`) and the sariyyah against Usayr ibn Rizam
(`231-p6`) name no modeled battle, so no further participation is
authored. "وَهُوَ خَالُ النُّعْمَانِ بنِ بَشِيْرٍ" (`231-p4`) names a
maternal nephew with no catalog slug, so it stays in the source text with
no edge. "لَيْسَ لَهُ عَقِبٌ" (`231-p3`) has no field and stays in the
text.

One genuine dispute stays in the pages: the "خَلُّوا بَنِي الكُفَّارِ"
verses at the Umrat al-Qada are reported for Ibn Rawahah (`235-p2`),
al-Tirmidhi notes others hold them sounder for Ka'b (`235-p10`–`p12`),
and al-Dhahabi rebuts that Mu'tah came six months after the Umrah
(`236-p2`). The model holds no value this competes over, so no competing
claims are authored.

## Legacy values visited

`data/catalog/people/abdullah-ibn-rawahah.ts` carried four legacy values:
`sex` MALE, the long `fullName` chain, the `companion` title, and the
`SON` edge to Rawahah. The nasab chain (exactly as the entry states it,
Khazraji nisba included) and the father edge are promoted to the new
claims above. `sex` and the `companion` title stay `legacy-unreviewed`:
the entry implies both and states neither outright, the same call the
neighbouring batches make on the same footing.

The scoped ledger also lists values on subjects this batch's claims point
at, none of them promotable from this entry: `abu-al-darda` keeps his
`sex`, `fullName`, and title (the entry gives only his kunya, in passing,
as someone else's brother); `rawahah-ibn-thalabah` keeps his `sex` and
relation (named here only as a father); `battles/badr` keeps its
`location` and first participant (this entry states attendance, not
where Badr lies, and its roster line is another lane's to write).

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
