# Audit: Sahihayn in full

[checked in repo] Research snapshot: 19 November 2026, `main` at `ac1ae7543580aceaf5ae9e1168404cdd9c76f4aa`. This file adds no app code or data. Status labels apply to each paragraph, list item and table row; an explicit cell label overrides the row label. "Checked against source" means an inspected external document or a measured downloaded artifact; it does **not** imply visual collation with print. "Checked in repo" means repository files or a local verification result. "Inferred" marks a recommendation, interpretation or proposed check.

[inferred] Recommendation: stage delivery of the **complete text, including isnads**, retaining every original placement and authorial comment. Do not publish a matn-only extraction made by a quote-mark heuristic. The measured text sizes do not justify sacrificing the isnads; source quality and attribution need the work first.

## Scope and what has changed since the previous audit

[checked in repo] [The previous hadith audit](2026-11-18-hadith-sources.md) covers the Forty concordance, commentary and narrator datasets. This audit does not repeat that concordance or its grading discussion. [#962](https://github.com/msskzx/namaq/pull/962) and [#974](https://github.com/msskzx/namaq/pull/974) are merged. The current [builder](../../scripts/hadith/buildForty.ts), [pins](../../data/hadith/forty-pins.json) and [mapping](../../data/hadith/forty-map.json) implement the Forty from Turath exports; eight Nawawi errata now name a witness. [#979](https://github.com/msskzx/namaq/pull/979), merged during this audit, additionally ships the outside-Sahihayn records and Ibn Rajab selections. The source registry already lists the selected Bukhari and Muslim editions in [shared/sources.ts](../../shared/sources.ts).

[checked in repo] The phone's [Forty bundle](../../shared/data/hadith/forty.json) is 201,308 UTF-8 bytes and contains 42 anthology entries and 100 record occurrences across its books. Its Sahihayn subset has 18 Bukhari and 59 Muslim occurrences, 76 distinct `(book,number,route)` keys across those 77 occurrences, and 14 drawn isnads. These are measurements of the current selection, not full-book counts. [AppForty](../../shared/hadith.ts) has fixed book keys and anthology entries; it is not a full Sahihayn library schema.

[checked in repo] The registry also has a separate hadith-api Bukhari witness for story quotations, under `sahih-al-bukhari` and `hadith-api`.

[inferred] A full-library adoption should update the existing edition's uses rather than add another indistinguishable book record. The story witness and the Forty's Sultani witness must remain identifiable when their text or references differ.

[checked in repo] The records that change this recommendation are [R0008](../records/R0008-prove-a-split-by-putting-it-back-together.md), [R0026](../records/R0026-a-citation-does-not-authorize-every-chip.md), [R0034](../records/R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages.md), [R0040](../records/R0040-a-dump-page-gap-is-not-always-lost-text.md), [R0052](../records/R0052-a-printed-page-is-found-again-by-its-letters.md) and [R0059](../records/R0059-a-later-author-can-be-in-the-main-text.md). [R0063](../records/R0063-a-grade-quote-ends-where-the-scholars-judgement-ends.md), added in the new main, also requires keeping quoted judgments within their actual scope. Their consequences here are whole-text reconstruction, claim-level evidence, checking the unit of a dump, distinguishing absent page markers from absent text, retaining page boundaries, and separating authorship even above a footnote rule.

## 1. Print witnesses and the layers that can ship

| Status | Work and primary witness | Layers to distinguish | Shipping decision |
| --- | --- | --- | --- |
| checked against source | Bukhari: Sultaniyya, Bulaq, 1311 AH, reproduced by Dar Tawq al-Najat, first 1422 AH, nine parts. The [Shamela 1681 card](https://shamela.ws/book/1681) identifies the reproduction and explicitly describes added Abd al-Baqi numbers and marginal references. The [Sultani committee's report, preliminary part, printed pp. 2–3](https://shamela.ws/book/1681/2) records collation and correction work. | Transmitted text, chapter material, variant readings and inherited vocalization; the committee's report and corrections; the later reprint's numbering/references; digital markup and narrator links. These are distinct layers, even when adjacent on a page. | [inferred] The book rule applies to the classical author's text. The card alone is not a digital redistribution licence or proof that every string in the file is Bukhari's.|
| inferred | Retain that Bukhari witness as the primary reference, consistent with the shipped Forty. | Preserve the work's chapter placements, Quran quotations, suspended reports, Companion/Successor quotations and compiler remarks, with their actual voices. Keep edition front matter, critical apparatus and modern cross-references outside the author-only reading stream. | Use modern numbers as explicitly labelled reference metadata. Do not identify every marginal or editorial addition as Bukhari's words, or assume that a print's punctuation and vowels are an autograph. |
| checked against source | Muslim: Muhammad Fuad Abd al-Baqi, Isa al-Babi al-Halabi, Cairo, 1374/1955; [Shamela 1727](https://shamela.ws/book/1727). Five parts, the fifth an index, with continuous printed pagination. The editor's [1/1](https://shamela.ws/book/1727/1) and [1/2](https://shamela.ws/book/1727/2) explain numbering, sources and commentary. | Muslim's introduction and reports; later chapter titles; Abd al-Baqi's chapter/group numbers, notes and indexes; print vocalization; digital markup. The editor says that the numbered original hadith groups exclude their multiple routes from that count. | [inferred] The original text and each route must be distinct from later explanations. The fifth-volume indexes are not Muslim's own composition.|
| inferred | Retain Abd al-Baqi's Muslim as the primary locator for continuity with the Forty, with an Istanbul print as a control witness. | Store later chapter titles in an attributed navigation layer, if adopted. A chapter title does not become Muslim's own text because the exporter marks it as a heading. | An author-only Muslim pack can omit later titles from its text while retaining their boundaries as metadata. Adding Nawawi's actual titles separately needs a cited Nawawi source, not a claim that Muslim wrote them. |
| checked against source | In his introduction, Abd al-Baqi names a fully vocalized Istanbul print dated 1329 AH and says its eight parts underlie his four text parts. [1/1–2](https://shamela.ws/book/1727/1). The [Wikisource scan listing](https://ar.wikisource.org/wiki/ملف:صحيح_مسلم1.pdf) instead describes an Amira/Istanbul printing dated 1334 AH. | The dates and bindings identify different print witnesses. A listing labelled simply "Turkish edition" does not establish that it is the very copy Abd al-Baqi describes. | [inferred] No equivalence between those specific printings has been established in this audit.|
| inferred | Use an individually identified Istanbul scan for variant and vowel checks after inspecting each title page and colophon. | Maintain an explicit `(edition,part,printedPage)` crosswalk. Do not halve an Istanbul part number and infer a page or route match. | Do not switch the production edition merely because another host offers a more accessible PDF. |

[checked against source] Abd al-Baqi, *Sahih Muslim*, Halabi 1374/1955, volume 1, printed p. 1, [digital transcription](https://shamela.ws/book/1727/1), exact excerpt:

> والثاني وضع رقم مسلسل لأحاديث الصحيح الأصلية، دون الطرق المتعددة لكل حديث.

[checked against source] The same editor, same edition, volume 1, printed p. 2, [digital transcription](https://shamela.ws/book/1727/2), exact excerpt:

> وقد علقت على المتن خلاصة وزبدة شرح الإمام النووي

[inferred] These two editorial statements are evidence about the edition, not proposed text for its author-only app payload. Numbers and apparatus need their own provenance; stripping a horizontal rule alone does not establish authorship.

[checked against source] Al-Nawawi, *al-Minhaj sharh Sahih Muslim*, Dar Ihya al-Turath al-Arabi, Beirut, second 1392 AH, part 1, printed p. 21, [Shamela 1711/21](https://shamela.ws/book/1711/21), exact excerpt from the inspected digital witness:

> ثم ان مسلما رحمه الله رتب كتابه على أبواب فهو مبوب في الحقيقة ولكنه لم يذكر تراجم الابواب فيه

[inferred] This supports separating later chapter labels from Muslim's text. It does not identify the author of every heading in every later print. Preserve uncertainty in the edition metadata rather than assigning a guessed author to an entire heading layer.

## 2. Numbering and cross-references

| Status | Scheme | What the identifier identifies | Recommendation |
| --- | --- | --- | --- |
| checked in repo | Bukhari's conventional sequential number | The Forty uses `number` for the selected print's number, with separate volume, printed pages and Shamela page ID. | [inferred] Keep existing references valid.|
| checked against source | Bukhari numbering commonly called Fath al-Bari / Abd al-Baqi numbering | The current Shamela edition card attributes the added numbering to Abd al-Baqi. [Sunnah's Bukhari 8](https://sunnah.com/bukhari:8) distinguishes reference 8, in-book Book 2/Hadith 1, and older USC-MSA Vol. 1/Book 2/Hadith 8. These are different reference schemes. | [inferred] The label "Fath al-Bari numbering" does not establish that Ibn Hajar authored a modern printed sequence.|
| inferred | Primary Bukhari reference | Conventional sequential number, with the edition ID and a separate original-location ID. | Use the 1–7563 sequence as the main display reference where present in the selected witness. Retain additional occurrences and material without a number; 7563 is not a count of every textual unit in the book. |
| checked against source | Muslim's Abd al-Baqi group number | The editor explicitly distinguishes a parenthesized number for the original hadith from multiple routes. His per-book references also coexist with that number. [Introduction, 1/1](https://shamela.ws/book/1727/1). | [inferred] A group number alone does not select one complete chain.|
| inferred | Primary Muslim reference | Abd al-Baqi's group number plus a stable edition-local route ID and the printed route label. | Keep the conventional group reference, including the sequence through 3033, while retaining every route separately. Unnumbered introduction material needs location IDs of its own. |
| checked against source | Sunnah.com | [Muslim 8a](https://sunnah.com/muslim:8a) has in-book Book 1/Hadith 1. Its letter suffix is a web subdivision. The downloaded hadith-api artifact instead identifies the matching Jibril record as `hadithnumber: 93`, `arabicnumber: 8.01`, reference Book 1/Hadith 1. | [inferred] Neither `93`, `8.01` nor `8a` is a safe universal primary key.|
| checked against source | Tuhfat al-Ashraf | Al-Mizzi's work organizes the material through musnads and chains, across the Six Books and related material. [Official HadithWeb description](https://sunna.alifta.gov.sa/Book/Details?bookId=93). The Tawq edition's [scan catalogue](https://waqfeya.com/book.php?bid=7014) names Tuhfa among its marginal cross-references. | [inferred] A Tuhfa number identifies an entry in another work. It is not a second sequential numbering of either Sahih.|
| inferred | Tuhfa mapping | A separately sourced, potentially one-to-many relation between the selected Sahih occurrence and the identified Tuhfa edition/entry. | Do not derive this by arithmetic, shared keywords or a narrator name. No complete validated Tuhfa crosswalk was established here. |

[checked against source] The [Sunnah Bukhari overview](https://sunnah.com/bukhari/about) uses the conventional 7563 total and its individual records expose that reference. Abd al-Baqi's own Muslim introduction makes his parenthesized number a reference mechanism. These are observed examples of use, not a survey of scholarly citations or installed apps.

[inferred] The practical primary pair is therefore conventional Bukhari numbering and Muslim's Abd al-Baqi groups, with edition-local occurrence IDs underneath. Their universal rank as "most cited" has not been measured. Store aliases as strings with a scheme, edition and checked relation; keep source disagreements or unmapped aliases visible in the research ledger. Do not coerce fractional provider IDs into integers or turn Muslim decimal aliases into letters by an unverified formula.

[inferred] A crosswalk row should retain the work and edition, printed number, printed route label, local route ID, volume/pages, source page IDs, kitab/bab location, external reference and exact-text evidence for the match. Match candidates by text and chain, then review them. Repeated placements, split records, shared numbers and absent introduction entries require one-to-many or unmapped states.

## 3. Digital witnesses and the collation gate

| Status | Witness inspected | New finding | Decision |
| --- | --- | --- | --- |
| checked in repo | Turath exports of Shamela 1681 and 1727 | The existing Forty builder expects the SHA-256 pins below and reads page objects containing text, volume and printed page. It strips notes and narrator markup and converts selected text for display. | [inferred] This is the current acquisition path, not proof of full-book fidelity.|
| checked against source | Current Shamela web witnesses | [Bukhari 1681](https://shamela.ws/book/1681) identifies the Sultani/Tawq edition; [Muslim 1727](https://shamela.ws/book/1727) identifies Halabi/Abd al-Baqi. Bukhari no. 2 occupies printed 1/6–7 within one [digital page 11](https://shamela.ws/book/1681/11). Muslim route 1 under no. 8 occupies printed 1/36–38 within [digital page 62](https://shamela.ws/book/1727/62). | [inferred] A digital page is not necessarily one printed page. Inline printed-page markers must survive extraction.|
| checked against source | OpenITI `0256Bukhari.Sahih.Shamela0001681-ara1` | Downloaded in full. Its metadata names Tawq 1422, but its body contains Mustafa Dib al-Bugha's introduction, signed 1976, and 26 headings identifying his commentary. It contains no U+064B–U+0652/U+0670 vowel marks. | [inferred] It is not a drop-in author-only, vowelled replacement for the current export. The same historical Shamela ID does not prove the same digital revision or content layers.|
| checked against source | OpenITI `0261Muslim.Sahih.Shamela0001727-ara1.mARkdown` | Downloaded in full; its metadata names an undated Ihya al-Turath Beirut witness. It contains no vowel marks in the same measured ranges. Its annotation and page markers are corpus markup. | [inferred] A research comparison witness, not a verified copy of the pinned vowelled Turath export.|
| checked against source | hadith-api Arabic Bukhari and Muslim, branch `1` | Downloaded in full. Bukhari has 7,589 rows, including 26 fractional IDs and nine empty texts. Muslim has 7,563 rows, including 203 empty texts. Only 7,219 Muslim rows have an `arabicnumber` field. The files do not give a per-record printed volume/page for the selected Namaq editions. | [inferred] Useful for sizing and alias investigation. Counts or an Unlicense file do not make this a complete edition-bound source.|
| inferred | Preferred extraction witness | Reuse the existing pinned Turath exports and the same print editions, subject to full-book coverage, rights and collation checks. Use the web copies for targeted comparison and independently acquired scans as the print control. | Do not silently substitute the OpenITI copy, the hadith-api corpus or a different Islamweb edition because download access is easier. |

[checked in repo] Existing Turath pins in `data/hadith/forty-pins.json`:

| Status | Export | SHA-256 |
| --- | --- | --- |
| checked in repo | `1681.json` | `4c996e02ce331188a332b4716ba9196ffb9646eb582d0873da4a8c57ab95665e` |
| checked in repo | `1727.json` | `04f4159a0426704a83c3f966507c2421e0f12e9553965b485294ea2870803075` |

### What was actually checked against print

[checked in repo] **Completed visual print collations in this audit: Bukhari 0/30; Muslim 0/30. Accuracy against print is not established, and no pass percentage is reported.** The workspace's enforced network allowlist excludes the Turath and scan hosts. Requests to the exports, Archive scan links and Wikimedia files returned proxy HTTP 403. Web lookup found the edition/catalogue pages but could not retrieve the required PDFs; the attempted browser download path also failed. Existing Forty provenance and electronic page labels have not been counted as new visual checks.

[checked against source] Scan candidates located are [Bukhari Tawq/Sultani, Waqfiya catalogue](https://waqfeya.com/book.php?bid=7014), with [volume 1](https://archive.org/download/waq54495waq/01_54495.pdf), the [Sultani Wikisource file record](https://ar.wikisource.org/wiki/ملف:السلطانية.pdf), and [Muslim Halabi/Abd al-Baqi, Waqfiya catalogue](https://waqfeya.net/books/صحيح-مسلم-ط-الحلبي-ت-عبد-الباقي/3653da53b173472aa2390ff462cd7df2), with its [combined scan](https://archive.org/download/FP14478/14478.pdf). Catalogue metadata was inspected; the scans were not visually collated in this run. A host's public-domain label on a scan is not a redistribution grant for a different modern transcription.

[inferred] The following is a **predeclared sample, not completed results**. Select the complete first printed route for each Muslim group, and add any continuation needed to read that route whole. Bukhari targets include volume boundaries and widely separated placements. Both sets deliberately include structural cases, so the eventual pass rate will describe this diagnostic sample, not estimate a random whole-corpus error rate. Printed locators must be recorded from the actual scans; they are deliberately not invented below.

| Status | Sample | Bukhari target no. | Muslim group target no. | Print result |
| --- | --- | --- | --- | --- |
| inferred | 01 | 1 | 1 | Pending |
| inferred | 02 | 2 | 8 | Pending |
| inferred | 03 | 3 | 16 | Pending |
| inferred | 04 | 8 | 38 | Pending |
| inferred | 05 | 50 | 55 | Pending |
| inferred | 06 | 100 | 99 | Pending |
| inferred | 07 | 500 | 223 | Pending |
| inferred | 08 | 875 | 300 | Pending |
| inferred | 09 | 876 | 500 | Pending |
| inferred | 10 | 1000 | 750 | Pending |
| inferred | 11 | 1500 | 1000 | Pending |
| inferred | 12 | 1772 | 1015 | Pending |
| inferred | 13 | 1773 | 1250 | Pending |
| inferred | 14 | 2000 | 1337 | Pending |
| inferred | 15 | 2500 | 1500 | Pending |
| inferred | 16 | 2737 | 1718 | Pending |
| inferred | 17 | 2738 | 1750 | Pending |
| inferred | 18 | 3000 | 1907 | Pending |
| inferred | 19 | 3500 | 1955 | Pending |
| inferred | 20 | 3648 | 2000 | Pending |
| inferred | 21 | 3649 | 2250 | Pending |
| inferred | 22 | 4000 | 2500 | Pending |
| inferred | 23 | 4414 | 2553 | Pending |
| inferred | 24 | 4415 | 2577 | Pending |
| inferred | 25 | 5000 | 2643 | Pending |
| inferred | 26 | 5062 | 2699 | Pending |
| inferred | 27 | 5063 | 2750 | Pending |
| inferred | 28 | 5970 | 2900 | Pending |
| inferred | 29 | 6861 | 3000 | Pending |
| inferred | 30 | 7563 | 3033 | Pending |

[inferred] For each row, compare the entire chain, transmission modes, narrative frame, matn, authorial continuation and adjacent heading against scan images. Record edition, part, printed page range, PDF leaf, link, source hash, exact discrepant strings and disposition. Assess consonantal wording, omissions/additions, vowel marks, boundaries and author/editor separation separately. Whitespace, punctuation, ligature rendering and orthographic variants must be listed explicitly rather than silently counted as identical. An illegible page is unverified, not a pass. A second reader should review discrepancies before approving an erratum.

[inferred] Until these 60 comparisons are completed, the preferred witness is a continuity recommendation, not an accuracy winner. A text-to-text agreement check, OCR result, edition title or SHA pin cannot substitute for the requested print comparison.

### Vowels and splitting

[checked against source] The hadith-api downloads contain 1,665,790 measured vowel-mark code points for Bukhari and 1,486,329 for Muslim. Under the explicitly limited word detector in the reproduction instructions, 87.42% and 91.52% of Arabic word tokens carry at least one of those marks. Those numbers do not measure correct or complete vocalization. The inspected OpenITI files contain zero marks in those ranges.

[checked in repo] `buildForty.ts` uses the first quote mark as `isnadEnd` and only draws a chain when the linked narrator sequence passes its simple conditions, including no tahwil. `muslimRoutes` retains route text without producing those drawings. It also parses several forms of printed route labels. These are selection-specific tools, not evidence that every full-book record can be split reliably.

[checked against source] The same report's quote placement differs between witnesses: [Sultani Bukhari no. 2, 1/6–7](https://shamela.ws/book/1681/11) opens its quotation before the narrated story, while the downloaded hadith-api version opens a quote inside the dialogue. [Muslim no. 8, route 2, 1/38](https://shamela.ws/book/1727/63) abbreviates its matn by referring to another route. The excerpts below are from digital transcriptions, not a claim of completed scan collation.

[checked against source] Al-Bukhari, Sultaniyya reproduced by Tawq 1422, volume 1, printed p. 6, hadith 2, [Shamela 1681/11](https://shamela.ws/book/1681/11), exact opening of its quoted narrative:

> أَنَّ الْحَارِثَ بْنَ هِشَامٍ ﵁ سَأَلَ رَسُولَ اللهِ ﷺ فَقَالَ: يَا رَسُولَ اللهِ، كَيْفَ يَأْتِيكَ الْوَحْيُ؟

[checked against source] Muslim, Halabi/Abd al-Baqi 1374/1955, volume 1, printed p. 38, group 8, route 2, [Shamela 1727/63](https://shamela.ws/book/1727/63), exact excerpt:

> وَسَاقُوا الْحَدِيثَ. بِمَعْنَى حَدِيثِ كَهْمَسٍ وَإِسْنَادِهِ. وَفِيهِ بعض زيادة ونقصان أحرف.

[inferred] Keep an unsplit authoritative record and add reviewed spans for chain, frame, speech, continuation and collector comment. Mark tahwil, shared route tails and backward matn references explicitly. Do not expand an abbreviated route into a new quotation or attach its chain to another route's exact words. A "matn-only" mode may hide reviewed chain spans, but should not be a second rewritten text. Generated diagrams should wait where structural parsing is unresolved. Missing tashkeel must remain missing unless a named witness supplies an approved correction.

## 4. Offline size, counts and storage shape

[checked against source] The following measurements were made from downloaded full research artifacts, not the inaccessible pinned Turath exports. The hadith-api files include metadata in English and empty records; their raw-file sizes are therefore separated from an Arabic `{id,text}` projection. No translations or grades enter that projection. The OpenITI measurements retain their own metadata, markup and modern additions. They are research baselines, not shippable final packs.

| Status | Artifact | Raw UTF-8 bytes | Gzip bytes, level 9 |
| --- | --- | ---: | ---: |
| checked against source | hadith-api Bukhari, downloaded JSON | 9,770,083 | 1,491,153 |
| checked against source | hadith-api Muslim, downloaded JSON | 8,685,140 | 1,190,866 |
| checked against source | Bukhari `{id,text}`, source vowel marks retained | 8,819,891 | 1,398,542 |
| checked against source | Bukhari `{id,text}`, specified vowel marks removed | 5,488,311 | 1,046,768 |
| checked against source | Muslim `{id,text}`, source vowel marks retained | 7,721,910 | 1,104,980 |
| checked against source | Muslim `{id,text}`, specified vowel marks removed | 4,749,252 | 840,303 |
| checked against source | OpenITI Bukhari, as downloaded, unvowelled | 6,039,255 | 1,361,723 |
| checked against source | OpenITI Muslim, as downloaded, unvowelled | 4,933,663 | 1,003,907 |

[checked against source] The two independently compressed vowelled Arabic projections total 16,541,801 raw bytes and 2,503,522 gzip bytes. The corresponding mark-stripped projections total 10,237,563 raw bytes and 1,887,071 gzip bytes. These exclude page maps, complete chapter metadata, narrator identities, search indexes, diagrams, fonts, commentary and packaging. Vowels were removed only for this size comparison; stripping hamza-bearing combining characters or changing the displayed text is not proposed.

[checked against source] The Bukhari API file contains every integer ID from 1 through 7563 plus 26 fractional IDs, with nine empty texts at 5710, 5711, 5712, 5774, 5775, 6074, 6075, 6174 and 6175. Its row count is 7,589, and its nonempty row count is 7,580. Muslim has 7,563 provider rows and 7,360 nonempty texts. Those are **provider counts**, not counts of unique Prophetic sayings, original print groups, complete chains or authorial textual units. No missing text is supplied or reconstructed by this audit.

[checked against source] The OpenITI Bukhari file has 12,531 page-marker occurrences but only 1,422 distinct volume/page pairs, including its marker conventions. Muslim has 8,752 occurrences and 1,295 distinct pairs. These totals cannot serve as scanned leaf counts or certify the coverage of a different export.

[inferred] Do not use a row count or the last hadith number as the full-book completeness test. Inventory numbered reports, routes, introduction material, chapter headings and their attached quotations, unnumbered material, authorial comments and edition apparatus separately. A full Bukhari pack needs the text between numbered reports too. A full Muslim pack needs his introduction and abbreviated routes even where no self-contained matn follows.

[inferred] Retain original order and every placement of a repeated report. Repetition is part of the work's arrangement; a related-matn index can connect occurrences without replacing them. A record ID should identify a source occurrence, not a deduplicated saying. Keep source text once, with a separate chapter tree, page map, source-span classification, aliases and optional person links. Keep modern material outside the author stream but in the research source archive for review.

[inferred] Make separately versioned book packs with manifests, hashes, edition metadata and locally available page references. Load a chapter or bounded range instead of statically importing a whole structured library into every app entry point. Measure a real Expo build and phone startup before claiming memory use or installed size. Gzip transport bytes are not JavaScript heap use, SQLite/FTS size, or the eventual app download size. Store no precomputed diagrams for every narration until their size and value are measured.

### Reproduce the measurements

[checked against source] Downloads measured on 19 November 2026, with SHA-256 values below. The hadith-api branch snapshot is `df57907be35291c91ad6a6691180e22ca9920784`; the OpenITI snapshot is `44e1c36738a2bf5c14dafa232a6ae1891e6171cd`. Content hashes, rather than branch names alone, identify the measured bytes.

| Status | File, relative to repository | SHA-256 |
| --- | --- | --- |
| checked against source | [hadith-api/editions/ara-bukhari.json](https://github.com/fawazahmed0/hadith-api/blob/df57907be35291c91ad6a6691180e22ca9920784/editions/ara-bukhari.json) | `e34a3402889ca378871da3c5984b7875c680920e93f1c8738ac7afe502179562` |
| checked against source | [hadith-api/editions/ara-muslim.json](https://github.com/fawazahmed0/hadith-api/blob/df57907be35291c91ad6a6691180e22ca9920784/editions/ara-muslim.json) | `194073b24090c5368e4d14a3f55c9e0ef144c7437bd7e5aa83aa4d2bc54a8ea0` |
| checked against source | [OpenITI/0275AH, Bukhari Shamela0001681](https://github.com/OpenITI/0275AH/blob/44e1c36738a2bf5c14dafa232a6ae1891e6171cd/data/0256Bukhari/0256Bukhari.Sahih/0256Bukhari.Sahih.Shamela0001681-ara1) | `16f95173b9ea1927b577ff85dc7e2a8351b8287e4ea9863782c4c5fc87ac8132` |
| checked against source | [OpenITI/0275AH, Muslim Shamela0001727](https://github.com/OpenITI/0275AH/blob/44e1c36738a2bf5c14dafa232a6ae1891e6171cd/data/0261Muslim/0261Muslim.Sahih/0261Muslim.Sahih.Shamela0001727-ara1.mARkdown) | `8126f063f53504b68d6e9e133cec049c10acf498c501f5f4897013efc1e56d9e` |

[checked against source] Measurement method: Python 3.12, zlib 1.3.2, UTF-8, `json.dumps(..., ensure_ascii=False, separators=(',', ':'))`, projection order matching the downloaded records, IDs converted with `str(h['hadithnumber'])`, and `gzip.compress(data, compresslevel=9, mtime=0)`. The download sizes use the original bytes. The stripped projection removes only U+064B through U+0652 and U+0670. Arabic word tokens for the limited vowel statistic use `[\u0621-\u064a][\u0621-\u0652\u0670]*`. Empty rows remain in the projections. The reproduced byte and hash totals are tied to these serialization choices; they are not estimates of a different source pack.

## 5. Narrators and people pages

[checked in repo] A standalone narrator-linking audit was not found by searching this snapshot's `docs/audits/`. The earlier hadith audit and [hadith-on-profiles plan](../plans/hadith-on-profiles.md) cover the relevant design. [unitRows.ts](../../src/lib/model/unitRows.ts) distinguishes isnad, speaking and mentioned roles and uses identified mentions for profile relations. That model path is separate from the Forty's generated record strings.

[checked in repo] [AppIsnad](../../shared/hadith.ts) nodes currently have an ID, label and coordinates, without a person slug. [The mobile drawing](../../mobile/src/components/Isnad.tsx) renders labels rather than narrator-profile links. The [web drawing](../../src/components/hadith/IsnadSvg.tsx) supports a link when an identified agent has an available profile. The offline [people bundle](../../shared/data/tarajim/people.json) contains 160 people, including `umar-ibn-al-khattab`, `abu-hurayrah`, `aisha-bint-abi-bakr` and `anas-ibn-malik`. This is not a biography database for all Sahihayn narrators.

[inferred] The smallest linking step is a reviewed occurrence-to-existing-person ledger for a few unambiguous Companion occurrences. Retain the quoted name, exact record/span, chosen person slug and identity evidence. A display name, digital narrator ID or shared kunya alone is not sufficient. Do not merge graph nodes merely because labels match; do not create unsourced biography stubs or rank claims to fill a diagram.

[inferred] Publish the full text independently of complete biography coverage. Add person links only where identity and an existing cited profile are established. Use the canonical people pipeline for new biography data and preserve the repository rule that a person mentioned only as a narrator does not automatically become a Neo4j node. Comprehensive narrator identification and tabaqa extraction remain separate reviewed work, as the previous audit explains.

## 6. Permissions and what providers actually state

| Status | Provider / platform | Inspected statement | Consequence for this audit |
| --- | --- | --- | --- |
| checked in repo | Namaq book rule | [AGENTS.md](../../AGENTS.md) permits whole old-author text in the public domain, with page numbers and edition links, excluding modern editors' notes and additions. `shared/sources.ts` labels the adopted Sahih author texts public domain. | [inferred] This is Namaq's policy and registry assertion, not a licence issued by a digital host.|
| checked against source | Shamela | [Terms](https://shamela.ws/page/terms), Arabic and English, retain applicable rights in books/editions with their holders and do not grant reuse beyond rightsholder permission or applicable law. | [inferred] Free reading and citation do not provide a blanket corpus licence. Preserve the author/editor distinction and the acquisition terms.|
| checked against source | Turath | Its [public site](https://app.turath.io/) and the export path already recorded in Namaq were identified. A permissive licence specifically covering the two exported digital texts was not located in the reviewed material. The exports could not be re-downloaded under this environment's current policy. | [inferred] No affirmative digital-file grant is claimed. The source ledger must distinguish reliance on classical author text from permission for any modern editorial material or database contribution.|
| checked against source | OpenITI | [Documentation](https://openiti.org/documentation/) states CC BY-NC-SA 4.0 for its releases. The inspected Bukhari file includes modern al-Bugha material. | [inferred] Research use does not make this a commercially unrestricted shipping source. Its corpus licence and embedded modern material are separate issues.|
| checked against source | hadith-api | Its [repository licence](https://github.com/fawazahmed0/hadith-api/blob/df57907be35291c91ad6a6691180e22ca9920784/LICENSE) is Unlicense. The Arabic files were measured above. They do not supply the selected print's page map. | [inferred] Record the publisher's declaration exactly; it does not certify upstream rights, edition identity, complete text or vocalization accuracy. Do not infer rights in translations from the historical Arabic authors' dates.|
| checked against source | Sunnah.com | [About, reproduction policy](https://sunnah.com/about), prohibits scraping and mass book/collection reproduction on other websites while allowing selected teaching/presentation quotations. [Developers](https://sunnah.com/developers) describes a checked subset API and an offline dump not yet available. | [inferred] No full offline-app grant is inferred from the API's existence or the word "open". Seek an express grant for that use if choosing its supplied dataset.|
| checked against source | Dorar, official hadith platform | [API terms](https://dorar.net/api-services/terms) require attribution/reference links and authorized-product scope, prohibit bulk collection/full storage and republication, limit caching to 24–48 hours, and restrict direct data sale. | [inferred] Those published API terms do not authorize a permanent offline Sahihayn copy. The scholarly books and Dorar's database/service rights are separate.|
| checked against source | Isnad research application | Its [third-party notice](https://github.com/Salman-Naif/Isnad_Database/blob/main/THIRD_PARTY_LICENSES.md) separates its MIT code from Shamela books and editions' rights, and says the hadith data are not distributed in the repository. | [inferred] This is a concrete example of an app separating code licensing from text rights. Its MIT licence cannot license its listed third-party material for Namaq.|
| inferred | Islamweb and other library mirrors | A page from a different mirror should be recorded with its own edition, terms, text boundaries and acquisition date. | No reusable full-text licence for a chosen Islamweb witness was established here. Do not infer one from a download button or a copyright footer. |

[inferred] Under the book rule, the intended product can contain Bukhari's and Muslim's classical author text whole. That does not settle every modern edition, database, typography or export right in every jurisdiction. Retain a rights record for the actual acquired file and each included layer. Use publisher permission for modern notes if the owner wants them; otherwise exclude them. No request for permission has been sent to a publisher or service in this audit.

## 7. Recommendation and the smallest next PR

[inferred] Choose staged full-text delivery, not matn-only delivery. First finish acquisition and the missing print checks. Then ship a Bukhari text pack, followed by a Muslim text pack, each with complete source order, author text, route/placement IDs, printed pages and local references. Basic reading and search should work offline without complete narrator graphs. Add diagrams and biographies incrementally after structural and identity review.

[inferred] The smallest next PR should establish the **edition-bound acquisition and collation ledger**, before a reader change. It should retain the pinned exports, source/rights manifest and a source-backed result for each of the 60 sample records; identify author, heading and editor layers; and inventory the entire source without dropping unnumbered material. A text pack is not approved by this research file's provisional witness preference. The current access gap is a blocker to calling that first data PR verified.

[inferred] Acceptance for the subsequent Bukhari pack should include every conventional number accounted for, all unnumbered chapter material classified, every author-text character covered exactly once by the retained spans, repeat placements preserved, and source-page boundaries reconstructible. Muslim needs the same checks plus its introduction, every printed route label, tahwil, shared tails and backward matn references. Round-trip reconstruction must cover the full author stream, not only the numbered matns. Footnotes excluded from that stream should remain distinguishable in the research archive.

[inferred] Add crosswalk tests for Bukhari 8's competing reference schemes and Muslim 8's group/route/provider IDs. Keep current Forty references stable and resolve them into the full library's occurrences rather than shipping a competing copy of each record. Measure full-pack compression, actual installed size, chapter loading and local search on a phone. A feature PR must later follow the feed-card and quiz workflow; this research PR changes neither.

## Open questions for the owner

- [inferred] Can the running environment's allowed domains include `files.turath.io`, `shamela.ws`, `archive.org`, `*.archive.org` and `upload.wikimedia.org`, or can the exact pinned exports and scans be provided through an accessible source? The requested 30-per-book visual check is still outstanding.
- [inferred] Confirm Sultani/Tawq 1422 and Halabi/Abd al-Baqi 1374/1955 as the primary editions, and identify the exact Istanbul printing to use as the control witness.
- [inferred] Should later Muslim chapter titles ship as a separately attributed classical layer, or should the first author-only pack use the edition's structure without printing those titles as Muslim's words?
- [inferred] Which jurisdictions and commercial distribution plans should the rights ledger cover, and who will resolve any digital-file/database rights beyond the old-author book rule?
- [inferred] Who will review the 60 collation records and approve source-backed corrections? The diagnostic sample should not become an unsupported whole-corpus accuracy claim.
- [inferred] Approve a Bukhari-first staged full-text release, with Muslim next and comprehensive narrator graphs later, or require both full packs at the first release?
- [inferred] Should the first full packs be bundled or installed as optional offline downloads? The measured research projections are small, but actual Expo payload, search-index and phone-memory measurements remain to be made.
