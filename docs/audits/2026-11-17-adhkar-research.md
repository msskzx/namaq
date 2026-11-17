# Adhkar and du'a: sources and feature plan

Date: 2026-11-17. Repository snapshot: `b054d94e`, main through #891. Source research began at `30efff88`; the reuse plan was refreshed after the intervening shared Card/Tabs, canonical-text and reader changes merged. Research and planning only. This PR adds only this report; no source registry, content, application code or review state was changed.

## Recommendation and evidence labels

**Inferred recommendation.** Use **al-Nawawi's al-Adhkar, edited by 'Abd al-Qadir al-Arna'ut, Dar al-Fikr, revised edition 1414 AH / 1994**, as the main classical work. Start with a small, fully cited selection across the requested occasions. Require an attributed scholarly grading for every transmitted hadith used, including a separate virtue or repetition claim. Use Ibn al-Qayyim's al-Wabil al-Sayyib for attributed commentary and the timing discussion, and al-Albani's edition of al-Kalim al-Tayyib as one named grading source. Keep Hisn al-Muslim as a useful modern selection/index comparison, rather than present its modern compilation as a classical original.

**Inferred recommendation.** The first phone release should have bundled selected texts/ayah references, source and grading sheets, existing search integration, optional local reminders and an ephemeral repeat button. No login, streaks, worship totals, completion history or retained counter state. Whole-book reading and non-Quran audio need separate rights, source-completeness and implementation gates; neither is implied by a publicly accessible download.

Labels throughout:

- **Checked against source**: read the named digital witness, its edition metadata or the cited passage. The report identifies modern publisher/app descriptions separately from classical evidence.
- **Checked in repo**: inspected an existing component, data contract or test. This establishes implementation facts, not religious authority.
- **Inferred**: product/engineering proposals, size estimates, conservative rights treatment or conclusions that need an owner's decision.

Arabic religious text below is quoted from the identified witnesses. There are no new du'a formulations, combined variants, translations, virtue summaries or grades written for the feature. English planning descriptions and the schematic screen are proposals, not religious content. Hadith excerpts below have a named scholar's judgment and a bibliographic location alongside them. A quoted judgment reported by another author is identified as such.

**Checked against source, limitation.** Edition descriptions and passages were checked in Shamela and the corresponding page-numbered Turath digital witnesses. No printed scans were collated. A digital witness with printed pagination is not a scan-verified edition. Permissions for redistributing modern editorial apparatus or audio were not established. No production content pack or complete grading concordance was made in this research.

## 1. Source comparison

### Main collections and editions

**Checked against source.** The [Shamela collection catalogue](https://shamela.ws/category/23) supplies the edition metadata below. The actual texts were read from the linked digital witnesses, not inferred from book titles alone. Page numbers in this report are printed-page labels, not JSON array positions.

| Collection | Scope and grading practice checked | Editions with tahqiq and digital text | Rights treatment, inferred unless an explicit statement is quoted |
| --- | --- | --- | --- |
| **الأذكار**, al-Nawawi | Broad occasions, daily/nightly practice, prayer, travel, food, distress and related manners. The author explicitly discusses strong, weak and ungraded reports; inclusion is not an all-sahih certificate. His own judgments and his quotations of other scholars must remain distinguishable | **Recommended:** 'Abd al-Qadir al-Arna'ut, Dar al-Fikr, revised 1414/1994, one volume, 413 printed pages. [Shamela 1956](https://shamela.ws/book/1956), [page-numbered JSON](https://files.turath.io/books-v3/1956.json). Alternatives checked in the catalogue: Muhyi al-Din Mistu, Dar Ibn Kathir, 2nd ed.1410/1990, 638 pages, [13566](https://shamela.ws/book/13566); Bassam 'Abd al-Wahhab al-Jabi, al-Jaffan wa-al-Jabi / Dar Ibn Hazm, 1st ed.1425/2004, 430 pages, [10639](https://shamela.ws/book/10639) | Medieval author text is the public-domain candidate. Modern edition layout, notes, introduced text and editorial work are not covered by that conclusion. No open redistribution licence for the recommended complete edition was verified |
| **الوابل الصيب ورافع الكلم الطيب**, Ibn al-Qayyim | Extended discussion of remembrance and its benefits, followed by occasion-based chapters. Useful for context and timing. Author statements, quoted reports and editor notes are different voices. It is not a uniform per-item grading database | 'Abd al-Rahman b. Hasan b. Qa'id, reviewed by Hatim b. 'Arif al-Sharif and Yahya b. 'Abd Allah al-Thumali, Dar 'Ata'at al-'Ilm / Dar Ibn Hazm, 5th ed.1440/2019, 532 pages, [Shamela 18128](https://shamela.ws/book/18128), [JSON](https://files.turath.io/books-v3/18128.json). Alternate: Sayyid Ibrahim, Dar al-Hadith, Cairo, 3rd ed.1999, 153 pages, [216](https://shamela.ws/book/216) | Classical author text is the public-domain candidate. The catalogue says the publisher gifted the text **to Shamela**; that is not an app redistribution licence for the entire modern edition or its notes |
| **الكلم الطيب**, Ibn Taymiyya | A shorter occasion-based collection. The al-Albani digital witness visibly marks individual reports, including both strong and weak judgments. Keep those annotations attributed to al-Albani, not Ibn Taymiyya | Catalogued as Muhammad Nasir al-Din al-Albani, al-Maktab al-Islami, Beirut, 3rd ed.1977, 183 pages; attached-PDF metadata disagrees as detailed below, [Shamela 327, titled تخريج الكلم الطيب](https://shamela.ws/book/327), [JSON](https://files.turath.io/books-v3/327.json). A second catalogue edition is Sayyid al-Jumayli, Dar al-Fikr al-Lubnani, [21578](https://shamela.ws/book/21578); its catalogue prints **1407 AH / 1978 CE**, so that inconsistent date must be checked against its title page before use | Ibn Taymiyya's text and al-Albani's modern grading/editorial layer have separate rights. No general redistribution licence for the latter was verified. Short research quotations here do not authorize packaging his entire annotated book |
| **حصن المسلم من أذكار الكتاب والسنة**, Sa'id b. 'Ali b. Wahf al-Qahtani | Compact practical selection covering the requested occasions. The author's introduction explicitly says it abridges a larger work and abbreviates takhrij. Footnotes cite collections and named scholars, but a source citation is not automatically an explicit grade for every item/addition | Matba'at Safir, Riyadh; distributed by Mu'assasat al-Juraysi, 152 pages, [Shamela 31307](https://shamela.ws/book/31307), [JSON](https://files.turath.io/books-v3/31307.json). No printing number/year is supplied in this witness's metadata; do not invent one. The checked catalogue also lists a commentary by Majdi b. 'Abd al-Wahhab al-Ahmad, [96495](https://shamela.ws/book/96495), which is a separate work | A modern compilation, not a medieval public-domain work merely because its quotations are old. No author/publisher grant covering this exact witness and distribution was verified. Treat permission as required until established; public availability is not enough |
| **Quranic du'a** | The Quran provides the exact text. A selection's occasion, repetition or special virtue needs its own source; it does not follow from the verse being a du'a. Quran text itself does not take a hadith grade | Reuse the registered **Madinah Hafs 1441** page text, with volume/page and surah:ayah references. Example candidate: al-Baqara 201 on Madinah page31, [repository page31](../../shared/data/quran/mushaf/31.json). The existing [source registry](../../shared/sources.ts) identifies the Complex's unchanged-text permission and provenance | Reuse the existing registered Quran text/font permissions. Do not assume another app's Quran font, audio, translation or edited du'a selection has the same terms |

**Checked against source.** For al-Wabil, the 2019 catalogue statement is:

> أهداه للشاملة: مؤسسة «عطاءات العلم»، جزاهم الله خيرا

This is bibliographic provenance, not a quoted licence granting Namaq redistribution rights. The publisher/date/edition fields and this statement are visible in [the catalogue](https://shamela.ws/category/23) and [the digital witness's metadata](https://files.turath.io/books-v3/18128.json).

**Inferred recommendation.** The al-Adhkar edition is selected for broad classical coverage, direct authorial grading discussion and usable printed-page mapping. It is a source to curate and verify, not an automatically approved import. Keep the edition/witness identity fixed. Do not combine its words with an alternative edition's page numbers or another scholar's judgment without an explicit link.

### A checked edition-identity conflict in the grading witness

**Checked against source metadata.** Witness327's bibliographic description names al-Maktab al-Islami, third edition1977. In the **same JSON**, the attached-PDF root is:

> كتب الألباني/الكلم الطيب - ابن تيمية - ت الألباني - ط المعارف ط1

It names file `52068.pdf`. Thus the PDF metadata points to a Ma'arif first printing rather than the catalogue printing. [Inspect the witness metadata](https://files.turath.io/books-v3/327.json). The PDF title page was not collated here. All references to327 below preserve the catalogue identification and its digital volume/page labels; they are **not proof that the quoted text/page matches the 1977 printed edition**.

**Inferred gate.** Resolve the title-page, text and pagination identity against a chosen scan before accepting these examples into the feature or registering that exact edition as used. Do not silently pick whichever metadata field suits the citation. This does not change the observed al-Albani labels in the digital witness; it limits the verified printing identity. The recommended main al-Adhkar witness remains separate.

### What the authors say about their methods

**Checked against source.** Al-Nawawi, *al-Adhkar*, al-Arna'ut / Dar al-Fikr 1414/1994, **vol.1, p.4**, author introduction:

> وهو بيان صحيح الأحاديث وحسنها وضعيفها ومنكرها

On the same page:

> ولا أذكرُ من الأصول المشهورة أيضًا من الضعيف إلا النادر مع بيان ضعفه

Links: [Shamela p.4](https://shamela.ws/book/1956/2), [digital witness](https://files.turath.io/books-v3/1956.json). These are author statements. An editor's footnote explaining a grading term is not the author's per-report judgment.

**Checked against source.** Al-Nawawi, same edition, **vol.1, p.8**:

> قال العلماءُ من المحدّثين والفقهاء وغيرهم: يجوز ويُستحبّ العمل في الفضائل والترغيب والترهيب بالحديث الضعيف ما لم يكن موضوعًا

Later on that page:

> وإنما ذكرتُ هذا الفصل لأنه يجئ في هذا الكتاب أحاديثُ أنصُّ على صحتها أو حسنها أو ضعفها، أو أسكتُ عنها لذهول عن ذلك أو غيره، فأردتُ أن تتقرّر هذه القاعدة عند مُطالِع هذا الكتاب.

Link: [Shamela p.8](https://shamela.ws/book/1956/6). The first quotation stops before its editorial footnote marker; the footnote and the author's text must not be merged. This records al-Nawawi's stated position. It is not this report issuing a ruling or claiming all scholars use one policy.

**Checked against source.** Al-Qahtani, *Hisn al-Muslim*, Safir/al-Juraysi witness, printing/year unspecified, **vol.1, p.4**:

> وَقَدِ اقْتَصَرْتُ عَلَى مَتْنِ الذِّكْرِ، وَاكْتَفَيْتُ فِي تَخْرِيجِهِ بِذِكْرِ مَصْدَرٍ أَوْ مَصْدَرَيْنِ مِمَّا وُجِدَ فِي الأَصْلِ، وَمَنْ أَرَادَ مَعْرِفَةَ الصَّحَابِيِّ أَوْ زِيَادَةً فِي التَّخِرِيجِ فَعَلَيْهِ بِالرُّجُوعِ إِلَى الأَصْلِ.

Link: [Shamela p.4](https://shamela.ws/book/31307/3). Thus Hisn's convenient compactness does not remove the need to read the fuller source where attribution or a grade is incomplete.

### Coverage of the requested occasions

**Checked against source.** These are exact chapter headings in the recommended al-Adhkar edition, **vol.1**, with printed pages. They establish coverage, not that every report in the chapter has been verified or approved for a practice card.

| Occasion | Quoted chapter heading | Printed page and link |
| --- | --- | --- |
| Waking | «(باب ما يقولُ إذا استيقظَ مِن مَنامه)» | p.19, [Shamela](https://shamela.ws/book/1956/17) |
| After prayer | «(بابُ الأذكارِ بعدَ الصَّلاة)» | p.70, [Shamela](https://shamela.ws/book/1956/68) |
| Morning/evening | «(بابُ ما يُقال عند الصَّباحِ وعندَ المساءِ)» | p.76, [Shamela](https://shamela.ws/book/1956/74) |
| Sleep | «(بابُ ما يقولُ إذا أرادَ النومَ واضطجعَ على فراشِه)» | p.89, [Shamela](https://shamela.ws/book/1956/87) |
| Distress | «(بابُ دعاءِ الكَرْبِ والدعاءُ عندَ الأمورِ المهمّة)» | p.121, [Shamela](https://shamela.ws/book/1956/119) |
| Travel preparation | «(بابُ أذكارِه بعدَ استقرارِ عزمِه على السَّفر)» | p.215, [Shamela](https://shamela.ws/book/1956/213) |
| Riding/travel | «(بابُ ما يقولُه إذا ركبَ دابّتَه)» | p.219, [Shamela](https://shamela.ws/book/1956/217) |
| Eating/drinking | «(باب التسمية عند الأكلِ والشُّربِ)» | p.229, [Shamela](https://shamela.ws/book/1956/227) |
| After food | «(بابُ ما يقولُ إذا فَرَغَ من الطَّعامِ)» | p.235, [Shamela](https://shamela.ws/book/1956/233) |

**Inferred.** Use those source categories and explicit cross-links for an initial selection. Quranic du'a needs a separately reviewed list of ayah/range references. A search for every occurrence of a word such as `ربنا` is not a curated du'a collection and cannot establish an occasion or prescribed repetition.

## 2. Grading and text fidelity

### Display and publication policy

**Inferred proposal.** Each hadith item needs the exact wording, a source/edition/page, the original report locator if verified, and a named scholar's **verbatim** judgment with its own source/edition/page. Put the judgment beside the source in the existing reference/help sheet. Keep the scholar's name visible with it, not a bare green “authentic” badge. A book title or a modern app's “authentic” marketing claim is not the required grading record.

Preserve distinctions such as `حديث حسن صحيح`, `إسناده صحيح`, a judgment on one route, or a judgment on an added clause. The data may have an indexing category for filtering, but that category must not replace the quoted judgment or turn an isnad judgment into an unqualified judgment on every word. A grading record belongs to a specific text/version/route/addition.

**Inferred proposal.** The initial practice selection should contain only items whose required text, occasion, count and virtue evidence are checked and whose accepted named grading satisfies the owner's chosen strong-report policy. Weak, disputed or not-yet-graded items stay out of that default selection. This is a product selection policy for the owner to approve, not a new religious grading or a claim that al-Nawawi himself adopted it.

Do not relabel a weak item as “general du'a” to retain an unsupported Prophetic attribution, count, timing or promised virtue. Do not derive a missing grade by chain analysis or by combining routes ourselves. A missing judgment remains a research gap. Transmitted non-Prophetic reports, if added later, need their attribution and relevant source judgment too; they must not be presented as Prophetic hadith.

**Inferred proposal.** The complete book reader must retain the book word for word, including its weak reports and authorial discussion. It also needs the requested named-grading annotation layer for every hadith it exposes. Therefore “we graded the practice cards” is not enough to release a complete-book reader under this requirement. Either complete that concordance first, or leave full-book reading as an external source link until it is complete. Never drop a passage from the book or invent a judgment to make it look complete. Quran text has no hadith grade; any claimed hadith virtue associated with it still needs one.

### Checked examples: named judgments and separate variants

These are research examples, not an approved starter corpus. The quoted texts are deliberately short; no new devotional formulation or translation is supplied.

**Checked against source.** Al-Nawawi, *al-Adhkar*, al-Arna'ut / Dar al-Fikr 1414/1994, **vol.1, p.77, report208**, morning wording:

> اللَّهُمَّ بِكَ أصْبَحْنا وَبِكَ أمْسَيْنا، وَبِكَ نَحْيا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ

The named judgment on that report, quoted there by al-Nawawi:

> قال الترمذي: حديث حسن.

Link: [Shamela p.77](https://shamela.ws/book/1956/75). This is **al-Tirmidhi's judgment as reported by al-Nawawi**, not a claim that a primary edition of al-Tirmidhi was collated here. Al-Nawawi also introduces the report with an isnad assessment; keep each voice/scope separate. No numerical repetition or separate virtue should be invented for this item from its mere inclusion in the morning chapter.

**Checked against source.** Ibn Taymiyya, *al-Kalim al-Tayyib*, **graded/edited by Muhammad Nasir al-Din al-Albani**, digital witness327, **catalogued as al-Maktab al-Islami, 3rd ed.1977**, **vol.1, p.74, report29**, with the edition mismatch noted above:

> باسمك اللهم أموت وأحيا

And its waking wording:

> الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور

The entry is marked:

> ٢٩ - (صحيح)

Link: [Shamela p.74](https://shamela.ws/book/327/32), [edition metadata/text](https://files.turath.io/books-v3/327.json). The quoted grade belongs to **al-Albani's annotation**, not to Ibn Taymiyya by default. These two occasions are separately navigable selections within one source report; they are not two invented independent hadiths.

**Checked against source.** The evening continuation in al-Nawawi's report208, same **vol.1, p.77**, reads:

> اللَّهُمَّ بِكَ أمْسَيْنا، وَبِكَ نَحْيا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ

Its reported al-Tirmidhi judgment remains `حديث حسن` on that source report. In Ibn Taymiyya/al-Albani, *al-Kalim al-Tayyib*, witness327 catalogued as the 1977 edition, **vol.1, p.69, report20**, the evening continuation reads:

> اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير

The al-Albani entry is marked:

> ٢٠ - (حسن صحيح)

Links: [al-Adhkar p.77](https://shamela.ws/book/1956/75), [al-Kalim p.69](https://shamela.ws/book/327/22). The Mistu al-Adhkar digital edition also has `النشور` at **vol.1, p.148**. **Inferred consequence:** keep these witnessed wordings separately and collate their printed/primary sources before publication. Do not silently “correct” one from memory, attach the other version's grade, or join the fuller pieces into a new text. This finding establishes a source difference, not which wording is preferable.

**Checked against source.** There are differing judgments recorded for the Sa'd report involving pebbles/date stones:

| Source and report | Exact judgment | Attribution and limit |
| --- | --- | --- |
| Al-Nawawi, *al-Adhkar*, recommended edition, vol.1, p.17, report26 | «قال الترمذي: حديث حسن» | Al-Tirmidhi as reported by al-Nawawi; [source](https://shamela.ws/book/1956/15). Its editorial continuation is on p.18 and must not be merged into the author's voice |
| Ibn Taymiyya/al-Albani, *al-Kalim al-Tayyib*, witness327 catalogued as 1977, vol.1, p.64, report13 | «١٣ - (ضعيف)» | Al-Albani's annotation; [source](https://shamela.ws/book/327/15) |

**Inferred consequence.** Store both attributed judgments and their text/route scope. Do not average them, erase one or announce an app-generated verdict. A default selection needs an owner-approved scholarly selection policy. A disagreement flag is metadata about the records, not a fresh muhaddith's grade. See [R0015](../records/R0015-two-sources-that-disagree-are-not-an-error.md).

### A count and virtue also need their own exact evidence

**Checked against source.** Al-Nawawi, *al-Adhkar*, recommended edition, **vol.1, p.77, report207**:

> قُلْ هُوَ اللَّهُ أحَدٌ وَالمُعَوِّذَتَيْنِ حِينَ تُمْسِي وَحِينَ تُصْبِحُ ثَلاثَ مَرَّاتٍ تَكْفِيكَ مِنْ كُلّ شئ

The named judgment quoted there is:

> قال الترمذي: حديث حسن صحيح.

Link: [Shamela p.77](https://shamela.ws/book/1956/75). Again this is **al-Tirmidhi as reported by al-Nawawi**, not a new app judgment. The quoted clause supports an occasion, a numerical count and a virtue. The actual Quran content should be referenced as surahs112,113,114, rendered from the canonical mushaf pages. The exact counter unit/order must be reviewed with the source; do not turn a count for the prescribed recitation into “every ayah three times” or auto-apply it to other du'a.

**Inferred data rule.** A sound text with an unchecked added virtue is not permission to display that virtue. Require a grading/evidence link for each transmitted supporting report, including count/occasion/virtue additions. Preserve absent fields as absent; do not fill them with familiar phrases or a default religious count of1.

## 3. Data structure and offline size

### Proposed source-owned structure

**Inferred proposal.** Author exact witnesses and evidence first, then export a small versioned offline view into `shared/`. The shared pure code must import no React, database or native packages. Mobile and web consume the same IDs, variants and selection policy. Do not import the Node-based source parser or duplicate a Quran text table into the feature.

| Per-item field | Proposed contract |
| --- | --- |
| Identity | Stable item ID, source work/edition/report ID, text-variant ID and review/content revision. Multiple occasions may point to one report without inventing duplicate hadith identities |
| Kind and attribution | Quran recitation, Prophetic report, or explicitly attributed commentary. Preserve speaker/narrator/author/editor roles. Additional kinds require deliberate sourcing, not a fallback for ungraded hadith |
| Text | An exact span/selection from the witness with its content hash. Keep Arabic spelling/marks; punctuation or OCR corrections need a documented witness check. Do not assemble a “complete” wording from several versions |
| Quran references | Surah/ayah or reviewed word-range references, never another stored Quran text. Default to the appropriate complete ayah/surah level; a partial range must not invent an ayah-end mark |
| Repetition | `count` may be absent. Record its exact supporting quotation, source and the unit it applies to. Software session progress is separate and never part of authored source data |
| Occasion/time | Source-owned chapter heading/quotation plus reviewed tags for finding it. Preserve morning/evening wording differences. A reminder's chosen clock/offset is user configuration, not a sourced ritual timing claim |
| Virtue | Exact quotation with attribution, independent evidence link and any relevant grading scope. No AI-written synopsis or reward calculator |
| Citation | Work, exact title, author, edition/editor/publisher/printing, volume/section, printed page or range, report number where verified, host URL and witness ID. Host array index is not a printed page |
| Grading | Array of named scholar + verbatim judgment + scope + exact grading source/edition/volume/page/report + primary versus reported attribution. Preserve multiple judgments and uncertainty. No app-authored grading |
| Links | Typed Quran references, verified collection/report locators, whole-book page/anchor, parallel variant and commentary links. Do not fake an ayah key to route a non-Quran report |
| Publication/review | Source text, report identity, grade, count, occasion and virtue checked separately. Revision changes invalidate dependent review. Missing grading stays a research gap, not an approved card |
| Rights/audio | Per-witness rights basis and permitted use; optional audio recording ID, owner/reciter, licence/source, content revision and download policy. A text licence does not grant audio rights |

**Inferred example mapping.** For report208 above, `text` resolves to the quoted morning span on p.77, `occasion` to its exact morning clause/chapter, `grading` to al-Tirmidhi's quoted judgment via al-Nawawi, and `repetition`/`virtue` are absent unless separately established. For report207, the authored hadith evidence is separate from Quran references112/113/114. The verse payload comes only from the existing Quran pipeline. This report defines no new religious wording or fabricated grading record.

### Measured witness sizes versus deployment estimates

**Checked against source.** Downloaded the page-numbered witnesses for research and counted their decoded plain-text bytes, preserving their textual content while removing host markup. Compression uses Python gzip. These are not licensed deployment packs or scanned-book sizes.

| Witness | Digital page chunks | Plain-text UTF-8 bytes | Gzip bytes |
| --- | ---: | ---: | ---: |
| Al-Adhkar, al-Arna'ut 1994,1956 | 411 | 1,416,119 | 371,467 |
| Al-Adhkar, Mistu 1990,13566 | 619 | 1,494,645 | 391,494 |
| Al-Wabil, Dar 'Ata'at al-'Ilm 2019,18128 | 502 | 936,312 | 243,846 |
| Al-Wabil, Dar al-Hadith 1999,216 | 148 | 395,168 | 102,681 |
| Al-Kalim/al-Albani,327, catalogue1977/PDF mismatch | 311 | 106,131 | 25,887 |
| Hisn al-Muslim, Safir witness,31307 | 151 | 173,954 | 37,264 |

**Checked against source.** These chunk counts differ from printed-page counts. The recommended al-Adhkar witness supplies pp.3–413, not cover/title pp.1–2. The al-Kalim witness has many separate chunks sharing one page label and begins its report text at p.60; it is not a complete183-page facsimile or a safe whole-book import. The al-Wabil witness separates `المقدمة` and the book body. Front matter, notes, repeated page labels and missing labels require an explicit page ledger. Never infer one physical page per JSON object.

**Inferred estimate.** A first selection of roughly200 reviewed items, averaging2–4KB per item including exact quotations, grading/citation references and metadata, is about **0.4–0.8MB raw**, plus approximately0.05–0.15MB for search/category indices. A compressed pack might be around0.1–0.3MB; measure the real pack before publishing a size. Quranic du'a should mostly add references and metadata, not another copy of the mushaf. Full source pages/notes and a complete grading concordance are separate payloads. The table shows that text is manageable; review completeness and rights are the harder gates.

**Inferred proposal.** Bundle the initial selected texts, citations, judgments and compact search index, loaded when the feature opens. Put a permitted complete-book edition in the existing books manager as an optional download once the edition's rights and included text layers are established. Do not fetch a grading or source quotation on demand for every card; it must remain readable offline. Version and validate downloaded text/page maps together; retain the last good installation after failure. Keep user preferences separate from content installation.

**Inferred audio estimate.** If200 recordings averaged20 seconds at64kb/s, audio alone would be about32MB, or about64MB at128kb/s, before overhead. These are arithmetic assumptions, not a discovered licensed recording set. No complete permitted non-Quran recording set was verified here. Keep such audio optional and independently licensed. Existing Quran recitations may serve Quran selections under their existing source/download terms.

## 4. Fit with Namaq

### Reuse map and exact limits

**Checked in repo.** Read the latest shared-first rule, [UI catalogue](../../mobile/src/ui/README.md), [shared-first plan](../plans/shared-first.md), [existing shared-first guard](../../shared/sharedFirst.test.ts), the tree/Quran entries in AGENTS, and the app/web counterparts below. The shared-first work matters: reusable phone controls, Card and Tabs now live under `mobile/src/ui/`; `shared/quran/surahNames.ts` owns displayed surah names.

| Feature | Existing piece | Proposed use or required extension, inferred |
| --- | --- | --- |
| Navigation and paper theme | [TopBar](../../mobile/src/ui/TopBar.tsx), [Button](../../mobile/src/ui/Button.tsx), [Toggle](../../mobile/src/ui/Toggle.tsx), native palette, web common controls | Lazy screen under the existing navigation, icon actions, right-aligned source text, existing dark/light/black-paper settings. Do not create feature-local buttons, rounded boxes or another top bar |
| Shared card | The shared [native Card](../../mobile/src/ui/Card.tsx), HomeFeed composition and the [web common folder](../../src/components/common) | Native Card is implemented and used across home, library, quizzes and tools. Compose it directly with shared controls and source text. No generic web `common/Card.tsx` exists at this revision; reuse an appropriate common piece or add its matching counterpart there before the web feature. A radius token alone is not card reuse. Do not copy a card into the adhkar screen or import the entire home feed for its frame |
| Sources and grading | [Reference](../../mobile/src/ui/Reference.tsx), [Sheet](../../mobile/src/ui/Sheet.tsx), ExternalLink; web Reference/common components | Show exact quotation, scholar/voice and page, with a source-page jump. Extend the existing contract for grade scope/multiple judgments if needed. Secondary explanations belong behind help/reference actions, not an invented summary on the card |
| Complete book | [bookReader](../../shared/bookReader.ts), [readerBooks](../../shared/readerBooks.ts), native [book screen](../../mobile/src/screens/book.tsx), [books manager](../../mobile/src/lib/books.ts), web `/quran/books` | Reuse the reader chrome and page navigation. Current IDs/kinds and `BookEntry` assume Quran commentary entries with `surah/from/to`; add a real general-book entry/source-page adapter. Do not assign a fake surah to an adhkar paragraph. Extend shared book IDs/metadata and both clients, with a content/page-map revision |
| Quranic du'a | [Quran words module](../../shared/quran/quranText/ayahWords.ts), canonical mushaf pages, existing one-Quran-text guard | Render through the agreed pipeline at the surah/ayah/copied level appropriate to the card. Preserve all signs and the correct ayah medallion. Do not use old flattened converter text or set the Quran font in a new adhkar feature file. The canonical frontend module is still being completed; this feature must use/extend it, not create a bypass |
| Morning/evening reminders | [shared prayer calculations](../../shared/prayer.ts), [adhan planner](../../shared/adhanAlerts.ts), [native notification adapter](../../mobile/src/lib/adhan.ts) | Reuse current place/method/prayer times, opt-in permission and local scheduling. Add a typed adhkar reminder kind to the same scheduling policy; do not create an unrelated timer/service or a mandatory network account |
| Audio | [recitation sequencing](../../shared/quran/recitation.ts), native [player](../../mobile/src/lib/listen.ts), [downloaded recitations](../../mobile/src/lib/listenFiles.ts) and web equivalents | Quran selections reuse licensed ayah tracks. Non-Quran audio needs permitted recording IDs and a typed track adapter, not fake ayah keys. Extend shared sequencing/native player ownership where compatible; do not start two competing app-wide audio sessions |
| Search everything | [searchAll](../../shared/quran/searchAll.ts), native [search screen](../../mobile/src/screens/search.tsx), web SearchView | Add an adhkar/source-text result kind to both renderers, shared category/order and pure Arabic search. Search installed content offline and link to the exact item/variant/book page. No search/mood history is needed |
| Ephemeral counter | Existing Button/Text/haptics preferences; new small `ui/` piece if needed | Compose a repeat control from agreed shared controls, backed only by live React session state. Do not use quiz score/progress stores, bookmarks, feed-seen timestamps or an analytics event as its storage |

**Checked in repo.** `BookKind` currently names tafsir, i'rab and balagha; `ReaderBookId` names al-Sa'di/al-Kashshaf/al-'Ukbari. The page-turning functions can be reused, but those unions and Quran-addressed entries are not already a general classical-book catalogue. `SearchHit` currently has no adhkar kind. `shared/` cannot import React/native APIs, so a shared counter component belongs in the platform UI folder, while any pure counter transition can be shared.

### Whole book means the actual book, with its pages

**Inferred proposal.** Preserve a source page ledger including front matter, page labels, main text and editor notes as distinct layers. Page turns and hadith boundaries are independent: an entry can cross pages and several entries can share one page. Keep references to the exact printed edition. Verify first/last words across page transitions and reconstruct the original text before saying the book is complete. Test duplicated chunks, a report crossing pages, repeated page labels, the front matter and notes that quote other scholars. R0008, R0034 and R0052 describe the existing failures this avoids.

**Checked in repo.** AGENTS and [shared/sources.ts](../../shared/sources.ts) currently say Namaq links out and does not host a book in full. **Inferred implementation requirement:** the user's request establishes complete-book reading as the target, so its implementation should reconcile that link-only policy and source credits with the permitted distribution, rather than seek the same feature decision again. A rights basis for the exact edition/text layers still has to be established. Until that is settled, use selected cited quotations and ExternalLink. Do not label a selected-quotation pack or incomplete dump a “whole book”. Its named-grading coverage also has the gate described above.

### Timing: source claim versus reminder setting

**Checked against source.** Ibn al-Qayyim, *al-Wabil al-Sayyib wa-Rafi' al-Kalim al-Tayyib*, Ibn Qa'id / Dar 'Ata'at al-'Ilm and Dar Ibn Hazm, 5th ed.1440/2019, **single vol., book-body p.239**:

> الفصلِ الأول: في ذكر طرَفَي النهار

> وهما ما بين الصبح وطلوع الشمس، وما بين العصر والغروب.

At **book-body p.240**:

> وهذا تفسير ما جاء في الأحاديثِ: أن من قال كذا وكذا حين يصبح وحين يمسي؛ أن المراد به: قبل طلوع الشمس وقبل غروبها، وأن محل هذه الأذكار بعد الصبح وبعد العصر.

Links: [p.239](https://shamela.ws/book/18128/286), [page-numbered witness, pp.239–240](https://files.turath.io/books-v3/18128.json). These are Ibn al-Qayyim's explanation, not a fabricated hadith quotation. The witness's introduction/body sections and global host page IDs are different from its printed-page labels.

**Inferred recommendation.** Default reminder anchors may follow **fajr and asr**, consistent with that cited explanation, once the owner chooses the timing policy. Maghrib as an alternate user setting needs a separately cited basis/policy; this report does not attribute it to the passage above. A selected offset is a notification preference, not a newly prescribed religious time. Users can also open either collection manually.

**Checked in repo.** The current notification planner limits itself to60 alerts and14 days, tops up when the app opens/returns, and cancels pending records with a `data.prayer` field. **Inferred integration:** plan all reminders within one combined pending-notification budget and namespace the kinds. An adhkar reminder's anchor should not accidentally masquerade as the existing prayer notification it would cause the adapter to cancel. Reschedule on place, calculation method, timezone/day and preference changes. Test DST, timezone travel, denied permissions and days without computable prayer times; show a manual choice rather than inventing a prayer time. Do not promise indefinitely replenished reminders when the app is never opened; the current implementation has no such always-running scheduler.

**Inferred distinction.** Computed prayer time does not prove that a user has finished praying. An after-prayer collection can be opened from the existing prayer/adhkar navigation; any optional delayed prompt is a user scheduling choice, not evidence that prayer was performed or a source-mandated number of minutes after adhan. Waking, sleep, travel and eating need manual access or explicit optional user reminders, not inferred monitoring of personal activity.

### A counter that keeps nothing

**Inferred proposal.** Use one tap control for an item with a **source-backed** repeat count. Keep only current live progress, with a reset action. Reset when leaving the card/session and on background; never write counter/finished/last-read values to SQLite/localStorage, a profile, a feed exposure record or a server. The authored repeat count stays in content metadata; the user's progress does not.

Do not auto-increment because audio played, a card was visible or a notification was dismissed. Do not compute worship totals/rewards or a daily completion percentage. A source with no specified numerical repetition gets no invented target. A manual reset/stop does not delete content or preferences. Ordinary reminder preferences may persist separately; they are not counter statistics. Check accessibility, large text, accidental taps and reduced motion, using the existing optional haptics setting.

Tests should prove reset on card change/blur/background, no persistent write or telemetry from counter interaction, a correct target/unit from the cited source, and independent controls for text/audio. These are behavior tests, not an approved new architectural guard. If a new guard/pipeline is proposed later, it needs the second-agent vote and owner sign-off described in AGENTS.

## 5. Patterns from existing apps

**Checked against publisher sources, not installed renders.** Read official publisher pages and App Store descriptions through Apple's lookup API. The following are product descriptions, not sources for the texts, their authenticity or a licence to reuse recordings/translations. No app was installed, and persistence/privacy behavior was not independently audited.

| App and evidence | Pattern actually described | Fit for Namaq, inferred |
| --- | --- | --- |
| **Dua & Zikr / Hisnul Muslim**, Greentech Apps Foundation. [Publisher page](https://gtaf.org/apps/hisnul/), [App Store](https://apps.apple.com/us/app/dua-zikr-hisnul-muslim/id1402550533), [publisher description via Apple](https://itunes.apple.com/lookup?id=1402550533) | Occasion categories, search/highlights, adjustable text, references, translation/transliteration, per-item audio and offline audio downloads. Publisher page describes bookmarks/last-read entries and search-history removal; store description lists daily notifications and no ads. The two descriptions use different approximate item counts, so neither is a certified corpus inventory | Reuse category/search, readable text, source access and optional permitted audio patterns. Keep the app's existing paper theme. Do not copy third-party translations, transliteration or audio without a rights/source basis. Do not add last-read/completion/history as a counter side effect |
| **Dhikr & Dua**, Life With Allah / Ummah Welfare Trust. [Publisher app page](https://lifewithallah.com/app/), [App Store](https://apps.apple.com/gb/app/dhikr-dua/id1561598617), [description via Apple](https://itunes.apple.com/lookup?id=1561598617) | Publisher description says500+ selections, swipe navigation/index, translation/transliteration/hadith-virtue display, per-item or collection audio, item-specific repeat counters and a separate configurable counter. Also describes emotion categories, articles and sharing; says free/no ads | The index/swipe/source-virtue hierarchy and per-item counter are useful references. Avoid importing unsourced explanatory articles or adding a free counter that makes an arbitrary preset look prescribed. Mood labels need no retained personal data. The description does not establish whether counters persist, so this report makes no claim that they do |

**Checked against publisher source.** Life With Allah's description calls its “Daily Reminder” a tab carrying the reminders shared on its social media. That is not evidence of prayer-anchored device alarms. Greentech describes daily notifications; no fajr/asr anchoring was verified there. **Inferred:** Namaq should design its reminder behavior from its existing local prayer scheduler and cited timing policy rather than assume another app supplies that contract.

**Inferred selection.** Keep readable full text, clear source/grade access, quick occasion navigation and manual repeat progress. Skip engagement scores, competitive totals, streaks, automatically retained completion and marketing-style claims in place of grading. Those are Namaq's proposed limits; they are not accusations that either checked app implements every rejected pattern.

## 6. Main-screen sketch idea

**Inferred sketch, no UI built.** Use the existing top bar, search/help icons, shared category/tab piece and the approved shared Card. Labels for religious collections should be the checked source headings or exact short source wording, with bibliographic provenance. This wireframe uses English descriptions rather than inventing Arabic devotional copy.

```text
┌────────────────────────────────────────────┐
│ [existing grid/back]       [search] [help]  │
│                                            │
│ [morning source heading] [evening heading]  │
│ [other occasions / source index]            │
│                                            │
│ ┌──────── agreed shared Card ────────────┐  │
│ │ Exact source quotation, Arabic right   │  │
│ │ aligned, with room for vowel marks.    │  │
│ │ Quran content: existing text pipeline. │  │
│ └───────────────────────────────────────┘  │
│ [repeat 0/N, only if sourced] [reset]        │
│ [reference + named grade] [book] [audio*]   │
│                                            │
│ [existing next/previous navigation]         │
└────────────────────────────────────────────┘
* audio appears only for a permitted recording
```

The count is live state only. A compact reference action opens the existing sheet containing the complete citation, verbatim named judgment, variant information and exact virtue quotation. It must not hide the scholar's identity behind an unexplained color. The book action opens the exact printed page when that permitted, fully annotated book is installed; otherwise it is an explicit ExternalLink. An absent recording has no decorative play button.

No card-in-card, new slider/stepper, custom font, alternate Quran renderer or second adhan service is needed. Controls come from the shared UI folder. Source passages keep their own wording; help can show exact classical commentary with its attribution. Preview both phone themes, the black-paper choice, RTL, large type and offline/missing-pack states before the owner approves an implementation sketch.

## 7. Ordered PR-sized plan

All steps are **inferred proposals**, not authorization to implement or a statement that source review/rights work is already complete. Every implementation PR should update both app and web where relevant and use the current shared-first rule. No new architectural guard is approved here.

| Order | PR-sized deliverable | Existing pieces / bounded addition | Tests and owner gate |
| --- | --- | --- | --- |
| 1 | Choose and record the edition, rights and grading policy | Existing source registry, cited witnesses and source/review model. Register the actual new source editions/uses in `shared/sources.ts` in the implementation PR, never a generic “Shamela licence” | Verify title/printing/page identity and a rights basis for each included layer. Owner decides accepted grading policy, weak/disputed handling and permitted text layers; document the requested whole-book reader in the repository policy |
| 2 | Author a small cross-occasion pilot and export a shared read model | Existing source-span/review ideas and pure `shared/` conventions. Start with perhaps10–15 fully evidenced selections, not a scraped complete corpus | Reconstruct source selections; validate text/grade/occasion/count/virtue independently; test different evening variants and a conflicting grade. Missing fields prevent publication rather than getting AI filler |
| 3 | Reuse the shared Card and add the ephemeral repeat piece | Use the implemented `ui/Card`, `Tabs`, `Button`, `IconButton`, `Text`, `Sheet`, `Reference` and web common equivalents, adding a shared web card counterpart only if no existing piece fits. No feature-local controls/boxes | Preserve existing card callers, accessibility and themes. Verify counter reset and no persistence/telemetry. Owner approves the concrete visual sketch; new guard changes would need the separate two-vote process |
| 4 | Add the offline collection screen and source/grading sheet | Lazy screen wrappers, typed navigation, shared item selectors and the shared card/reference UI | First open offline; exact wording; full scholar/scope/citation; variant switching; no unsupported target/virtue; large Arabic text. Web matches app behavior |
| 5 | Add Quranic du'a through the canonical pipeline | Existing Quran pages/module and existing guards; source-owned reference selection only | All mushaf signs/ayah numbers, correct range boundaries and links. No new stored Quran text or font/converter bypass. Source review approves the reference list and any special occasion/count claim |
| 6 | Add adhkar to search everything on both clients | Existing SearchHit/source-provider/order contracts and Arabic normalization | Exact/variant/occasion results, no duplicated reports from multiple occasions, offline search and exact item/page return. Lazy-load the new index so root/home startup stays light |
| 7 | Add opt-in local reminders through the current prayer planner | Existing place/method/time calculations, notification permission and typed scheduling | Combined alert budget, reschedule/cancel ownership, timezone/DST, missing times, denial and foreground top-up. Owner chooses fajr/asr policy and any separately sourced maghrib alternative. No new monitoring/login |
| 8a | Add a general-book page adapter with a bounded fixture | Existing book reader/manager and versioned locations; generalize entries without fake ayah refs. Use a small checked fixture, not an unreviewed complete-book release | Preserve existing Quran-book callers; test about10 source pages, a cross-page report, notes, anchors and incompatible revisions. No full-book download is enabled |
| 8b | Author book pages and named-grade concordance in repeated batches | Same source/read-model path; each PR handles a bounded batch of perhaps10–20 reports with their actual page spans and source checks | Every included report and supporting claim has its named judgment; unresolved identity/rights/grade stays in the ledger. Repeat this PR size until the complete edition is accounted for |
| 8c | Enable the permitted complete-book installation | Existing books manager plus the completed manifest, page map and grading annotations | All source pages and hadiths accounted for, no dropped words/notes or invented grades, correct whole-book navigation and damaged-download recovery. Rights basis, included text layers and complete grading coverage must be established before delivery |
| 9 | Add optional audio without a second competing player | Existing Quran playback for Quran selections; typed permitted-recording adapter for other texts. Extend shared sequencing only where applicable | Exact text/recording correspondence, rights, offline playback, download interruption/repair, pause/repeat and source variants. Resolve existing download reliability issues before depending on optional packs. Owner approves recordings; no generated recitation |
| 10 | Expand the curated selection and release verification | Same data/review/export path, existing UI tests and shared contracts | Batches with a source checklist, review lapsing on edits and no ungraded transmitted claims. Measure actual pack bytes, release startup/memory and native reminder/audio behavior. Document remaining missing sources rather than manufacturing coverage |

## Research and verification notes

**Checked against source.** Downloaded six page-numbered witnesses to temporary research files, inspected metadata/TOC/passages, and checked the linked Shamela pages for the main method, grading and timing examples. Counted text bytes without committing the witnesses. Source coverage is sampled; it is not a certification of all reports, a printed-scan collation or an exhaustive copyright investigation. Public download/API access was used to inspect text, not treated as redistribution permission.

**Checked in repo.** Existing books, source registry, Quran text/page contracts, UI catalogue/guard, search union and prayer/notification/playback adapters were inspected. The shared-first changes from #841 through #888 and the Quran/reader changes through #891 were integrated during research, so the plan uses the implemented `mobile/src/ui/` Card/Tabs/controls and existing canonical-text entries rather than the previous control locations. This report proposes no new guard. A later guard/pipeline proposal requires a fresh second-agent vote searching for missed callers and testing the old path, plus owner sign-off; independent review of this report is not that vote.

Verification passed against `b054d94e`: lint, root/mobile typechecks, 456 test files (4,660 tests passed; one skipped), and the production build. Independent report review was completed; its printing-mismatch and stale component-reference findings were corrected. All 20 blockquotes matched the downloaded witnesses, and relative links resolved. This docs-only PR changes no visited UI flow. No native renders, app installs, audio sessions or scheduled notification deliveries were tested.

Records that changed the plan: R0008 for whole-text reconstruction, R0015 for attributed disagreement, R0034 for not mistaking dump chunks for source passages, R0038 for lazy loading, R0052 for printed-page mapping, and R0054 for using all agreed paths rather than creating a feature-specific bypass. No new record was added because no implementation problem was solved in this report.

## Open questions for the owner

All are **inferred decisions**, not missing religious text to be filled by the app.

1. Approve al-Nawawi / al-Arna'ut / Dar al-Fikr1414/1994 as the main edition, or prefer a different fixed edition after a printed-page check? Who performs source and grading review?
2. Which named scholarly judgments govern the initial practice selection, how are conflicting judgments displayed, and should weak items remain entirely outside practice/reminders? The app must never select a new grade itself.
3. Should first release contain only Prophetic/Quran selections, or also clearly attributed Companion/author material with the required evidence? Every transmitted claim still needs its appropriate named source judgment.
4. Which exact complete-book edition and text/editorial layers have a redistribution basis? The requested whole-book goal is already given; which feature milestone should precede its release while the required complete named-grading concordance is researched?
5. Is a source-checked pilot before a larger selection acceptable? What unresolved items should appear only in the research ledger rather than the public feature?
6. Should the default morning/evening reminders follow the quoted fajr/asr explanation? If maghrib is offered, which separate source/policy should govern it? What optional user offsets and notification cadence are wanted?
7. Approve reset-on-leave/background for the counter, with no history, completion records or analytics? Should optional ordinary bookmarks be considered later as a distinct user request rather than counter storage?
8. Where should the feature live in the current navigation, and which existing UI owner should review reuse or extension of the implemented Card/Tabs pieces before the screen is built?
9. Which permitted non-Quran recordings and named reciters should be used, if any? Quran recitations can reuse their existing terms; other apps' playable audio is not a licence.
10. Should English UI labels be supported at launch while religious translations remain absent until a specific sourced/licensed translation is approved? No AI-written translation or explanation is proposed.
