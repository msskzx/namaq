# Batch: Zaid ibn Harithah, Siyar entry 36

This batch cites al-Dhahabi's dedicated Siyar entry on زَيْدُ بنُ حَارِثَةَ
الكَلْبِيُّ. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md)
and [docs/extraction-checklist.md](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/zaid-ibn-harithah/](accounts/zaid-ibn-harithah/)

## Source account

Entry 36 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 1, edited by Hussein Asad under Shuayb al-Arnaut. The entry runs
eleven Shamela pages, 1646–1656 (printed 220–230): the first page opens
cleanly with the ٣٦ heading, so no start trimming was needed, and entry 37
(Abdullah ibn Rawahah) opens at `230-p9`, so the last page was cut with
end-anchor `p8`. Page 1646's footnote block holds only this entry's `(*)`
bibliography, and page 1656's holds only this entry's notes, so no notes
markers were needed on either shared end.

Shamela's plain reading pages currently serve a JavaScript shell with an
empty `.nass` element (PR #141 records the same for id 1625; the
trailing-slash workaround no longer helps). The text was read through
Shamela's own `ajax/pageContent/10906/<id>` endpoint instead, which returns
the identical markup, and the standard extractor functions ran over it
unchanged. The ajax markup carries server-side anchor ids (`np1646_1`…),
which were remapped to the plain pages' positional per-printed-page `pN`
scheme before slicing; `extractionUrl` still names the canonical reading
page. If the plain pages render again, re-running
`npm run history:extract -- --book 10906 --from 1646 --to 1656 --out data/history/batches/zaid-ibn-harithah --subject-slug zaid-ibn-harithah --source-slug siyar-alam-al-nubala-risalah --end-anchor p8`
should reproduce these files exactly.

## Scope call: Companion

Entry 36 falls in the تابع: الطبقة الأولى - الصحابة (v4) block that opens
at Shamela 3158, which the Companion-scope table in
`docs/data-pipelines.md` marks in scope. The entry itself settles the
question independently of the section heading: "أَوَّلُ مَنْ أَسْلَمَ:
زَيْدُ بنُ حَارِثَةَ" (`224-p2`), "فِيْمَنْ شَهِدَ بَدْراً" (`225-p6`), and
the only Companion named in the Qur'an (`220-p3`–`220-p4`). He is taken in
as a Companion, no contest recorded.

## What this entry supports

Eleven claims, across the eleven pages.

His name, from the heading and the opening nasab: "زَيْدُ بنُ حَارِثَةَ
الكَلْبِيُّ" (`220-p1`) "ابْنِ شرَاحِيْلَ - أَوْ شُرَحْبِيْلَ - بنِ كَعْبِ
بنِ عَبْدِ العُزَّى بنِ يَزِيْدَ بنِ امْرِئِ القَيْسِ بنِ عَامِرِ بنِ
النُّعْمَانِ" (`220-p2`). The author hedges the grandfather's name with
أَوْ, so the شراحيل reading takes `fullName` (it is listed first and
matches the received chain) and the شرحبيل variant is kept as its own
LIKELY claim on the suhail-ibn-amr competing-reports footing.

His kunya, from the opening titles: "أَبُو أُسَامَةَ" (`220-p3`).

His appearance, with a genuine conflict: "وَكَانَ قَصِيْراً، شَدِيْدَ
الأُدْمَةِ، أَفْطَسَ" via Ibn Sa'd/al-Waqidi (`222-p5`) against "مِنْ
وَجْهٍ آخَرَ: أَنَّهُ كَانَ شَدِيْدَ البَيَاضِ" (`222-p7`). The chained
report takes the field; the pale report is a separate DISPUTED claim.

His standing, carried as `virtues`: first of the mawali in Islam and the
Prophet's beloved (`220-p3`), the first Muslim (`224-p2`), commander of
seven sariyas (`226-p2`), "أَنْتَ مَوْلاَيَ، وَمِنِّي، وَإِلَيَّ، وَأَحَبُّ
القَوْمِ إِلَيَّ" (`226-p7`), never sent with an army except in command
and fit for the succession had he outlived the Prophet (`228-p6`,
`228-p8`), prayed for after Mu'tah with the news that he entered Paradise
striving (`229-p5`), and shown a young heavenly companion of his own
(`230-p5`, `230-p7`).

His son: "وَكَانَ ابْنُهُ أُسَامَةُ" (`222-p7`, with the kunya at
`220-p3`), a `FATHER` relation to `usamah-ibn-zaid`, whose own module
already declares the legacy `SON` side toward Zaid — projection joins
them.

Badr: "ذَكَرَهُ: ابْنُ إِسْحَاقَ، وَغَيْرُهُ فِيْمَنْ شَهِدَ بَدْراً"
(`225-p6`), a `PARTICIPATED_IN` claim. It is authored but not registered
on `data/catalog/battles/badr.ts`, which this batch does not touch; the
registration waits on whoever owns that file at merge time.

Mu'tah: the Prophet "عَقَدَ ... لِزَيْدٍ عَلَى النَّاسِ فِي غَزْوَةِ
مُؤْتَةَ، وَقَدَّمَهُ عَلَى الأُمَرَاءِ" (`229-p3`); he took the banner and
"قَاتَلَ ... حَتَّى قُتِلَ طَعْناً بِالرِّمَاحِ" (`229-p4`). Registered on
`data/catalog/battles/mutah.ts` with status MARTYRED and a summary in the
entry's wording, keeping the existing chapter-ten claim beside the new
one. Sibling entries 34 (Ja'far) and 37 (Ibn Rawahah) may touch the same
file; this registration stands on its own citations either way.

His death: killed at Mu'tah, "فِي جُمَادَى الأُوْلَى، سَنَةَ ثَمَانٍ"
(`229-p4`, `229-p6`), so `deathYearHijri` 8 and `placeOfDeathArabic`
مؤتة. His age of fifty-five (`229-p6`) has no field in the model and stays
in the source text.

## What the entry does not state

Wives is a clean miss: trigger-word greps for تزوج/امرأة/زوج across the
extracted pages hit only the editor's footnotes (which quote the Ahzab
verse and its tafsir context), never the author's text, and the eleven
pages were read in full. It is marked `notInSource`. No muakhah is
stated — "أَنْتَ مَوْلاَيَ" is affection and manumission, not brotherhood
— so no `PACT_BROTHER`. The Khadijah purchase and manumission narrative
(`223-p8`–`223-p13`), the unnamed daughter who met the Prophet weeping
(`229-p9`), and the Umm Qirfa sariya detail (`228-p2`) have no fields or
modellable targets and stay in the source text.

The entry does state a brother, and he cannot be modelled: جَبَلَةُ بنُ
حَارِثَةَ says "إِنَّ أُمَّنَا كَانَتْ مِنْ طَيِّئٍ" and "ابْعَثْ مَعِي
أَخِي زَيْداً" (`223-p4`, `224-p6`–`224-p7`) — a full brother, shared
mother stated — but no Jabalah ibn Harithah slug exists in the catalog, so
no edge is authored. `catalog:checklist` keeps one ⚠️ on siblings for
exactly this reason; minting a Jabalah node is a separate batch's work,
not this single-subject entry's.

## Legacy values visited

`data/catalog/people/zaid-ibn-harithah.ts` carried four legacy values:
`sex` MALE, the long `fullName` chain, the `companion` title, and a `SON`
edge to `sharahil-ibn-kaab`. The chain is promoted to the new full-name
claim (شراحيل reading, شرحبيل variant kept alongside). `sex` and the
`companion` title stay `legacy-unreviewed`: the entry implies both — first
Muslim, Badr veteran — and states neither outright, the same footing the
neighbouring batches left them on.

The `SON` edge to Sharahil is a contradiction, not a promotion: the entry
gives Zaid's father as Harithah ibn Sharahil, so the seed skipped a
generation and made Zaid the direct son of his own grandfather. The edge
is removed from the catalog entry. No replacement `SON` edge is authored
because no Harithah-ibn-Sharahil slug exists on origin/main; the chain is
carried in `fullName` and the reason recorded here.
`sharahil-ibn-kaab.ts` declares no edge toward Zaid and is untouched.

## Review

Nothing is reviewed. The claims are authored but nobody has compared them
against the stored pages, so every claim is Not reviewed, and the batch
carries no approval block.
