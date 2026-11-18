# Audit: Alfaz al-Quran

1. Use Ibn Qutaybah's «تفسير غريب القرآن», Ahmad Saqr edition, for the first context layer, with exact quotations for every quiz option.
2. Add al-Raghib's «المفردات في غريب القرآن», Safwan Dawudi edition, as a separate root-depth layer, never as an automatic contextual gloss.
3. Al-Siraj fits the context task well, but no offline redistribution permission was found; al-Sijistani's original is alphabetical, not per-ayah.
4. Reuse Namaq's QAC morphology and Madina word mapping; roots identify candidate entries, while cited passages and human review establish senses.
5. Ship only reviewed, rights-cleared author text; the daily question uses the same approved context bank, with no generated definitions or distractors.

Research date: 2026-11-18. Scope: documentation only. Read `AGENTS.md` and `shared/sources.ts` before research, then their fetched `origin/main` versions at `0742ca7b`. No feature, question bank, book bundle, or attribution registry change is included. Recommendations below distinguish observations from proposed editorial rules.

## The two layers

Layer 1 answers what this word or phrase means here. The long-press sheet should name its book, author, edition and printed page. «ما معنى؟» and the home feed's daily question draw all options from this layer's one selected book and edition. A missing explanation remains missing. It must not trigger a generated gloss or a silently substituted definition from another book.

Layer 2 opens a root article, where the reader can study related forms and senses. It complements layer 1 even when the root article has no passage that establishes the pressed occurrence's sense. The interface should distinguish a root article from a meaning explicitly attached to this ayah.

## Layer 1 comparison

These are selective gharib works, not promises of a definition for each Quran token. Whole-Quran scope means the book treats vocabulary across the Quran. It does not establish token coverage. This audit has not counted all alignable definitions in any of the three books.

| Book | Coverage and structure | Edition and digital quality | Rights and offline decision |
| --- | --- | --- | --- |
| Ibn Qutaybah, «تفسير غريب القرآن» | Introductory discussions of divine names and recurring expressions, then selected words and phrases in surah order through al-Nas. Individual verse numbers and quoted expressions support occurrence mapping. Some passages give multiple explanations or refer to his separate «تأويل مشكل القرآن». | Recommend Ahmad Saqr, Dar al-Kutub al-Ilmiyyah, 1398/1978, the edition identified by [Shamela 3259](https://shamela.ws/book/3259), 543 numbered pages. Shamela itself qualifies its relationship to the Egyptian printing. Searchable text has vowel marks, page numbers and separate editorial notes. It still needs collation; an edition label does not certify every transcription. [Waqfiya's Saqr scan](https://waqfeya.net/books/تفسير-غريب-القرآن--ابن-قتيبة/02f16f93f87c4e8999475053a17a8d67) is a scan candidate, not a licence. | The author's ninth-century text is public domain under Namaq's author-text policy. Saqr's introduction, notes and additions are separate modern material. No open redistribution licence for the complete modern edition was found. Offline author-only excerpts are the recommended route, with source acquisition terms checked and modern apparatus excluded. An OpenITI-derived file has additional conditions described below. |
| Al-Khudayri, «السراج في بيان غريب القرآن» | Selected words in Quran order; concise contextual explanations. Its wording is the modern author's selection and synthesis, even where he draws on classical books. This is a good format for the intended sheet and quiz. | The [author's own site supplies a PDF](https://alkhaderi.com/library/alsrag-fy-byan-ghryb-alkran). [Quranpedia lists Dar al-Minhaj / KSU Quran Chair, 1435/2014](https://quranpedia.net/book/26904), and describes his treatment of alternative interpretations. Pin one actual printing before pagination or extraction; the web has several editions. No clean, licensed, occurrence-keyed text export was verified here. | Contemporary copyrighted text. The author's download page has a rights-reserved footer and no explicit app redistribution grant. A free PDF and availability on Quranpedia or Waqfiya do not establish permission to bundle definitions. Do not ship, including as an optional offline pack, before written permission covers text extraction, app distribution and quiz reuse. |
| Al-Sijistani, «نزهة القلوب» | Selective gharib glossary across the Quran. The original organizes the first letter into vowel sections, rather than surah order or strict root order. [Shamela's description](https://shamela.ws/book/22910) explicitly distinguishes later surah rearrangements. It can support a context layer only after edition-specific occurrence mapping. | Machine-readable candidate: Muhammad Adib Abd al-Wahid Jamran, Dar Qutaybah, 1416/1995, [Shamela 22910](https://shamela.ws/book/22910), 540 pages. A separate scan candidate is Yusuf Abd al-Rahman al-Mar'ashli, Qatar Awqaf, 1434/2013, [608-page Waqfiya record](https://waqfeya.net/books/نزهة-القلوب-في-تفسير-غريب-القرآن-العزيز-ط-أوقاف-قطر/1fe343b636ec443e9c846aee8b667ca9). Do not transfer page numbers between them. An [older digital-library warning](https://www.islamarchive.cc/ketab_content/2955) says its attached scan is a different printing from Jamran's text. | The tenth-century author text is public domain under repository policy. Modern editing and a modern rearranger's contributions are separate. No blanket licence for either modern edition was found. An author-only pack is possible after collation and provenance review, but more alignment work makes it a weaker first choice than Ibn Qutaybah. |

Recommend Ibn Qutaybah now. It supplies contextual selection within the author's own surah sequence and avoids dependence on permission for a contemporary author's definitions. Al-Siraj would be worth reconsidering after written permission and a checked text export. Al-Sijistani remains a comparison witness, not a source of substitute quiz options inside an Ibn Qutaybah question.

This recommendation concerns the product's data source, not a claim that one scholar's explanations settle every interpretive question. Where a book records alternatives, the reader keeps their attribution and wording. An unresolved alternative is a reason to exclude that occurrence from a single-answer quiz.

## Layer 2 edition and text

Use Dawudi's edition as the citation standard: Dar al-Qalam / al-Dar al-Shamiyyah, first edition, 1412 AH, identified by [Shamela 23636](https://shamela.ws/book/23636). It has a searchable, print-paginated witness, identifiable author and editor sections, and explicit Quran references. That makes it the best-supported working choice found in this audit. This is not a manuscript-level comparison proving it superior to every edition.

[Waqfiya's Dawudi record](https://waqfeya.net/books/مفردات-ألفاظ-القرآن-ت-داوودي/0c9deaf0554041718754abf9439f410e) supplies an [Archive.org scan](https://archive.org/download/fp106319_202503/106319.pdf), but identifies the fourth edition, 1430/2009, with 1,015 pages. Shamela identifies the first edition and 901 pages. Do not assume matching pagination or identical readings. The linked PDF could not be inspected through the research fetcher in this session. Before production extraction, obtain a scan of the chosen printing and reconcile the title page, several interior pages and the final page. Keep printed page, digital page ID and PDF image index as separate values.

The dictionary follows original letters, as [al-Raghib explains in his introduction](https://shamela.ws/book/23636/37), and discusses derived and extended senses. It also contains particles and nonstandard headword forms. A QAC root string is therefore a search key, not a complete dictionary ID.

Shamela is the preferred readable witness for quotation selection. An accessible research download of its text is [OpenITI's Shamela0023636 version](https://github.com/OpenITI/0525AH/blob/6290621b58e063ed1aa47ffd0a6fc1630191e7cb/data/0502RaghibIsbahani/0502RaghibIsbahani.Mufradat/0502RaghibIsbahani.Mufradat.Shamela0023636-ara1). Its metadata names Dawudi and the same 1412 edition. It is useful for discovery and counting, but not a ready-to-ship definition bank. The checked file drops vocalization, retains note-call markers, and sometimes inserts headings inside running words. Its companion YAML still contains placeholder collation fields. A root heading count would overstate the number of genuine independent articles.

Al-Raghib's medieval author text is public domain under Namaq's policy. Dawudi's introduction, apparatus and original additions are not automatically included in that conclusion. No explicit permissive redistribution licence for the whole Dawudi edition or its Shamela transcription was found. A clean author-only text can ship under repository policy after its provenance and exclusions are checked; copying the edited PDF wholesale is a different decision.

[OpenITI publishes its corpus under CC BY-NC-SA 4.0](https://openiti.org/documentation/). Its [copyright discussion](https://openiti.org/docs/Copyright_Questions.html) also makes clear that digitization does not settle every publisher claim. If Namaq derives a shipping pack from OpenITI's files, retain attribution and the licence, check NonCommercial compatibility, and meet ShareAlike conditions for the adapted material. Do not describe the digital witness as MIT or CC BY-SA, or erase those conditions because the historical author is public domain. Independently acquiring the author text and reusing OpenITI's digitization are different provenance paths.

## Exact quotation samples

The following quotations copy the readable Shamela witness, including its displayed vowel marks. These are textual-witness checks, not a claim of collation against a scan. The heading words identify the target; they are not alternative definitions authored for this audit. Printed pages belong to the named edition, not to the URL's final integer.

All six context samples below are Ibn Qutaybah, Ahmad Saqr edition, Shamela 3259. Every option in the example question can be recovered from one of these cited passages.

| Quran occurrence | Exact explanatory excerpt | Printed page and witness |
| --- | --- | --- |
| 78:14, ثَجَّاجًا | «أي سَيَّالا.» | p. 508, [digital page 502](https://shamela.ws/book/3259/502) |
| 78:13, وَهَّاجًا | «أي وَقَّادًا؛ يعني: الشمسَ.» | p. 508, [digital page 502](https://shamela.ws/book/3259/502) |
| 78:34, دِهَاقًا | «أي مُتْرَعَةً مَلأى.» | p. 510, [digital page 504](https://shamela.ws/book/3259/504) |
| 77:27, فُرَاتًا | «أي عذبًا.» | p. 506, [digital page 500](https://shamela.ws/book/3259/500) |
| 80:31, الأَبُّ | «المَرْعَى.» | p. 515, [digital page 509](https://shamela.ws/book/3259/509) |
| 80:22, أَنْشَرَهُ | «أحياه.» | p. 514, [digital page 508](https://shamela.ws/book/3259/508) |

For root depth, Dawudi's al-Mufradat has «الأبّ: المرعى المتهيّئ للرعي والجز» under «أب», printed p. 59, [Shamela digital page 41](https://shamela.ws/book/23636/41). The quotation stops before the editor's note call. Al-Raghib explicitly quotes 80:31 immediately before this explanation. This gives a concrete connection between the context layer's short answer and the root layer's longer discussion, without rewriting either.

His article «أبا» begins «الأب: الوالد» on printed p. 57, [digital page 39](https://shamela.ws/book/23636/39), then discusses extended uses and particular Quran passages. The same article's presence does not make its opening gloss the answer for every occurrence involving fathers. In addition, the distinct headwords «أبا» and «أب» show why a reviewed alias table must preserve the dictionary's own entry identity.

## Mapping the Madina words

Namaq already has the source file `data/quran/quranic-corpus-morphology-0.4.txt` and its attribution in `shared/sources.ts`. A read-only count of that checked-in file found 128,219 segment rows, 77,429 distinct `surah:ayah:word` locations, 49,967 locations with at least one `ROOT:` field, and 1,642 distinct root strings. These are dataset counts, not book-match counts or coverage percentages for Madina page words. Particles and other rootless words explain why absence of `ROOT:` is not itself an annotation error.

[QAC's documentation](https://corpus.quran.com/documentation/morphologicalfeatures.jsp) describes prefixes, stems, suffixes, roots and lemmas. Group its segment records by location and retain the stem analyses, lemma and part of speech. Do not strip Arabic prefixes from displayed Quran text to guess a root. Handle multiple analyses explicitly, including contractions. Decode QAC's extended Buckwalter with the repository's existing morphology utilities rather than an unrelated stemmer.

The mapping path should be:

1. Start from the pressed Madina page word and its ayah identity. Obtain its text through `shared/quran/quranText/ayahWords.ts`, without hizb tokens.
2. Use `corpusWordsAt` and the existing `SPLITS` mapping to recover QAC word locations. Page indexes are zero-based; QAC locations are one-based. Current special cases include 2:181, 8:6, 13:37, 15:7, 27:20, 36:22 and 37:130. Some page words combine corpus words; some continue a corpus word and deliberately return no independent location. A continuation should resolve through the containing aligned range, not borrow the next root.
3. Resolve the QAC root or lemma to a stable al-Mufradat entry ID through a reviewed alias table. Preserve the literal headword separately. Handle doubled and weak roots, hamza spellings, alternative derivations, particles and proper names without a global spelling rewrite. For example QAC's root for الأَبّ is a candidate for al-Raghib's «أب» heading, not proof that the unrelated «أبا» article applies.
4. Store the chosen entry link with evidence and review status. A missing or disputed match produces no asserted root definition. It must not become an approximate nearest-root match.

For layer 1, map the book's quoted expression inside its own surah and ayah context directly to Madina word ranges. Root identity is not required to establish this contextual link. Some explanations cover a phrase, so keep a range rather than pretending each token has a separate definition. Compare normalized text only for alignment and retain the quotation untouched. Existing extraction work and `R0043` show why Uthmani spelling and Arabic Extended-A marks need attention. A broad consonant match only proposes candidates; it does not authorize a match when more than one occurrence fits.

[QAC's FAQ](https://corpus.quran.com/faq.jsp) says two annotators reviewed words in stages and gives a believed 99% morphological accuracy. This is a project estimate, not an independently measured 99% root accuracy for release 0.4, and certainly not a sense-selection score. Use it to propose links; verify every released quiz occurrence against its context source and review every dictionary alias. A later assessment should report a stratified root-alignment sample, including weak roots, homographs and all split cases, with disagreements and denominator.

The [download page](https://corpus.quran.com/download/) allows application use with attribution, a link and its notice, labels the annotation GNU GPL, and forbids changing verbatim copies of the file. The older FAQ also describes non-commercial research use. Record that inconsistency rather than treating the dataset as unrestricted MIT data. Preserve the original source and notice, put reviewed mapping corrections in a separate table, and resolve commercial-use and derived-distribution obligations before expanding redistribution. Offline operation is technically straightforward and does not remove these obligations.

## Does al-Raghib cite the ayah, and how often?

Yes. The «أب» example above explicitly quotes 80:31. His dictionary regularly uses Quran quotations to discuss particular senses, but a quotation can also illustrate a related derivative, an analogy, a contrast, or an interpretation reported with «قيل». A mention of the ayah somewhere in a root article does not identify the intended sense of every word in that ayah.

A reproducible count on the pinned OpenITI Shamela0023636 witness found **8,671 square-bracket blocks containing a slash** in the dictionary body. A block can hold a verse range or more than one reference. This measures edition-supplied ayah-reference markers around the author's discussion, not 8,671 distinct ayat, author-written verse numbers, independently verified quotations, or resolved word meanings. Introductions and the modern indexes were excluded. The text's heading corruption prevents treating every heading chunk as a genuine root entry.

To reproduce this count without a feature implementation:

- Download the pinned OpenITI file linked above. Its UTF-8 size is 2,232,195 bytes and SHA-256 is `721da9e2168f8dcd6dd6876a73b4a304496656e57ba9b2e26a07d7f871a78e19`.
- Keep the text after the first literal `### | كتاب الألف` and before the first literal `# الفهارس الفنية`.
- Remove `PageV` page markers matching `PageV\d+P\d+` and milestones matching `ms\d+`. Replace each newline followed by `~~` or `#`, and an optional space, with one space.
- Find nonnested bracket contents with `\[([^\[\]]+)\]`. Count those contents that contain `/`. The result is 8,671.

No percentage of Quran occurrences with a verified al-Raghib sense is established by this audit. That requires matching the cited quotation, locating its actual explanatory clause, and reviewing the attribution. The count above answers citation frequency without inventing semantic coverage.

For any future contextual selection from al-Mufradat, require a linked quotation of the target ayah, an exact author-text span explaining its target form, and a reviewer-confirmed connection. Otherwise show the root article as depth only. Never choose the first definition, choose by root alone, or summarize the article into a new definition. Layer 1 already supplies the context answers, so no automatic sense selection from layer 2 is needed for the proposed release.

## Distractors and quiz eligibility

The following is a proposed selection policy. It has not been validated with students.

Every option is an exact, contiguous explanatory span from the same layer 1 book and edition as the right answer. Store its original target occurrence and citation, even when it appears as a distractor elsewhere. Do not inflect it to fit the new question, add synonyms, merge definitions, remove a qualifier to change its force, or generate an intentionally false gloss. A short excerpt is acceptable only where it expresses a complete explanation on its own; retain the full surrounding passage for review.

Candidate ranking should prefer the same part of speech and a comparable grammatical form, then a similar semantic category and length. Nearby passages provide a useful candidate pool. Same morphological pattern is a useful ranking hint, but not evidence that an option is wrong. Nearby roots in dictionary order are a poor default because alphabetical proximity says little about believable confusion. Words from the same ayah or passage can work, but exclude synonyms and explanations that also apply to the target.

A reviewer must check the full target passage and all options, including alternative senses recorded there, and confirm exactly one answer fits the question as phrased. Store that decision. If there are too few unambiguous options, skip the question instead of filling the gap. Do not use a disputed interpretation as a supposedly wrong answer.

Example A asks «ما معنى ثَجَّاجًا في النبأ ١٤، عند ابن قتيبة؟» with the ayah shown from Namaq's Quran module. Its four options are the exact excerpts in the sample table:

| Role | Displayed definition | Original target and source |
| --- | --- | --- |
| Correct | «أي سَيَّالا.» | ثَجَّاجًا, 78:14, p. 508 |
| Distractor | «أي وَقَّادًا؛ يعني: الشمسَ.» | وَهَّاجًا, 78:13, p. 508 |
| Distractor | «أي مُتْرَعَةً مَلأى.» | دِهَاقًا, 78:34, p. 510 |
| Distractor | «أي عذبًا.» | فُرَاتًا, 77:27, p. 506 |

These target adjectives make a plausible initial pool. وَهَّاج and ثَجَّاج also share an intensive pattern. The feminine explanation of دهاقا and the mention of the sun in another option may make elimination easier, so this is a source-valid editorial example, not a calibrated final question. Preserve those words anyway. Water could be fresh and flowing simultaneously, but the question asks for Ibn Qutaybah's explanation of the specified word; his quoted explanation is the criterion. A reader test should determine whether that wording makes the distinction clear.

Example B reverses the target to «ما معنى فُرَاتًا في المرسلات ٢٧، عند ابن قتيبة؟». The correct option is «أي عذبًا.», and the three other cited options can be considered as distractors. Reversal demonstrates that each distractor is a real answer somewhere in the book. It still needs its own ambiguity review; approval of example A does not approve B.

Start with book-selected gharib whose explanation is short, self-contained and useful, such as الأَبّ, ثَجَّاجًا and فُرَاتًا. Frequency in QAC can help order the bank, but rarity alone does not establish difficulty. Common-looking words with an unfamiliar contextual sense may also qualify. Exclude particles with no suitable source explanation, unexplained common vocabulary, cross-references without an answer, long discussions that require rewriting, and passages with unresolved alternatives. For example Ibn Qutaybah records alternatives for «النبإ العظيم» on [p. 508](https://shamela.ws/book/3259/502); do not manufacture a unique answer from that passage.

Layer 2 could support a separate, explicitly root-level exercise later, asking for a definition attributed to al-Raghib's named entry rather than an ayah's contextual meaning. It would require exact al-Mufradat quotations for every option and review of the entry's multiple senses. It must have a separate bank and label. It is not a source of options for the layer 1 quiz or daily question in this proposal.

## Recommended data plan

1. Pin the selected edition and obtain the matching scan and transcription. Record acquisition URL and date, source licence or permission, checksum, author/editor boundaries, printed page and digital locator. Research downloads stay outside application assets. Check beginning, middle, end and every selected quotation against the scan before release. The audit's samples remain transcription-checked until that happens.
2. Maintain separate context and root records. A context record needs book and edition IDs, ayah and Madina word range, exact quote and offsets into the retained source passage, printed pages, source links, review status and rights status. A root record needs a stable entry ID, literal headword, exact author passage, pages and locators. A reviewed mapping table links QAC locations and root/lemma analyses to those entries. Neither record stores replacement mushaf text.
3. Select author-only spans. Exclude notes, modern introductions, supplied explanations and additions even if a digital witness puts them above the note separator. Preserve disputed attribution rather than assigning it to the original author. This follows `R0059`; note layout alone does not prove authorship.
4. Prove coverage with a report before making product claims. Count source passages, mapped word ranges, distinct covered page words and ayat, unmatched expressions, ambiguous matches, rootless words, aliases needing review, and quiz-eligible records. Separate contextual coverage from root-link coverage. Audit all seven current word-split exceptions. Do not label rootless particles or uncovered common words as failures to explain.
5. Author quiz decisions through the existing `data/quiz/` review process and `docs/quiz-question-review.md`. Options reference approved context quote IDs. Validation must reject mixed editions, absent spans, duplicate definitions, self-distractors, unresolved alternatives and unreviewed or uncleared records. Exact-substring checks protect quotations; scholarly review establishes applicability and wrongness. No question bank is authored in this PR.
6. Package approved text and indexes for local use. Long-press and quiz lookup must need no network. Add every adopted book and digital source to `shared/sources.ts` in the implementation PR, with the actual licence and uses. Evaluating a candidate here does not register it as an adopted app source. Do not ship full scans or modern apparatus alongside the author text.
7. Select the home question from the same approved layer 1 bank using the existing local-calendar `dayNumber` / `dailyIndex` approach in `shared/dailyPick.ts` and `mobile/src/lib/daily.ts`. A stable bank version and day select one stable question and option order across reloads. Persist today's ID and completion state so a pack update cannot replace an answered question mid-day. An empty eligible bank omits the card. Bank repetition, timezone changes and update behavior need explicit tests when built.

Keep runtime logic and data shared where both clients use them, as `AGENTS.md` requires. Future UI work should use the current Quran text module and shared sheet/card controls. This audit adds neither UI nor a new Quran-text path.

## Open questions for msskzx

- Is Ibn Qutaybah / Saqr the approved first context source, with al-Siraj reconsidered only after written permission? Who will perform the scholarly quotation and ambiguity review?
- Can we obtain the exact Dawudi 1412 scan and a confirmed Saqr printing, or should the citation standard change to a fully available edition before extraction?
- Which acquisition path should supply shipping text? OpenITI-derived packs require an explicit decision about CC BY-NC-SA compatibility; QAC's conflicting commercial-use language also needs resolution. Public-domain author text does not answer those digital-source questions.
- Should uncovered long-press words show only the available root article, with a clear label, or no meaning panel? Neither behavior may imply a contextual answer exists.
- What initial difficulty and bank size suit these students? The examples establish source provenance, not educational difficulty or distractor calibration.
- Should a separate al-Raghib root quiz be in scope later? The proposed first bank and daily question use layer 1 only.

## Evidence limits and records used

The named book cards, selected digital pages, rights statements and pinned OpenITI texts were read. No complete manuscript comparison, exhaustive word-level book alignment, scan collation of the samples, or learner study was completed. The 8,671 count is a mechanical reference-marker inventory only. No licence or permission letter was inferred from a download button, government sponsorship or a third-party upload.

Records that changed the recommendation: `R0026` requires occurrence-level evidence instead of spreading an article citation to every word; `R0034` prevents treating a page-keyed export as a ready-made per-ayah explanation; `R0043` informs candidate alignment across book spelling and Madina rasm; `R0059` requires authorship checks beyond stripping footnotes.
