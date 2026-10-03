# Review of Plan A

Reviewer scope: `plan-a.md` only, checked against `00-evidence.md`, AGENTS.md, `prisma/schema.prisma`, `src/lib/catalog/types.ts` and the page `data/history/sources/siyar-alam-al-nubala-risalah/v4/41.md`.

## 1. Verdict

**Adopt with changes.**
The text layer (quote selectors, one normalisation module, no display copies) is right and should be built first.
The rest has three blocking gaps. Statement objects and `about[]` link to entities with no Identification behind them, so the identification is ours. Span-hash identity cascades into mention, identification and publication keys, so one re-fetch can lapse a page's records en masse. Phase 2 converts Siyar claims before chains exist, which would attribute transmitted reports to al-Dhahabi.
Migration has no way back, and the plan never prices the hadith work.

## 2. What the plan gets right and must be kept

- P1/P3: text exists once, and a span is a `TextQuoteSelector` that fails loudly (2.2). Rejecting character offsets and paragraph anchors (7.2, 7.3) is correct. It removes the drift class behind the 414/727 failing values and the `4/92-p15` anchors in the evidence.
- One versioned normalisation module that keeps every haraka (2.2). It also ends the duplicate between `verifyExcerpts.ts` and `sectionHeadings.ts`.
- Mention vs Entity vs Identification with a `basis` (2.4). This is the right shape for narrators, and the right answer to `سُفْيَانُ`.
- `mode` backed by `modeSpan`, plus "the vocabulary names the printed formula; it does not judge it" (2.5).
- Tradition as a reviewable grouping over unmerged Reports (2.6, 7.6).
- Grading is itself a sourced report, and `confidence` is removed (2.7, 2.8).
- `namaq span` tool: agents never type Arabic into a record (4.1).
- Approval per record, not per batch hash (4.4).
- `model:check` steps 1-2, 6 and 10 re-derive rather than compare copies.

## 3. Defects

### D1. Statement objects carry identifications made by us, with no basis (blocks)

Hits 2.7 and 3.1. In 3.1:

> `predicate: relation.son-of` / `spans: [sp:zb-nasab]` / `object: p:al-awwam-ibn-khuwaylid`

The span says `العَوَّامِ`. The step from that word to the entity `p:al-awwam-ibn-khuwaylid` is an identification, but it has no Mention or Identification record, no `basis` and no review. The same holds for `about[]` on every statement, for `participated` objects (which battle is `بَدْرًا`?) and for `tafsir.meaning-of` `about: [entity:p:abdullah-ibn-abbas]` in 3.3, where the chain's own Mention `ابْنِ عَبَّاسٍ` is bypassed. Section 1 says the model refuses "an identification without a source span or an authored-and-reviewed record", and 2.7 breaks that rule.

Scenario: a tarjama of `عَبْدُ اللهِ بنُ عُمَرَ` uses a nasab line that names `عُمَرُ`. The extractor sets `object: p:umar-ibn-al-khattab`. Nothing records why, and check 7 lets the edge reach the graph because "every graph edge comes from a published Statement".

Fix: every entity reference in `about[]` and `object` must go through a Mention (a span) plus an Identification. Basis `explicit-in-text` covers the cheap cases. Check 7 must require it.

### D2. Span id cascades into mention, identification and publication keys (blocks)

Hits 2.2, 2.4 and 4.4. The plan says ``id` = short hash of (edition, from, exact, prefix, suffix)``, ``Mention` key `m:<span id>``, ``Identification` key `id:<mention>-><entity>``, and `published.revision` = "hash of this record and the spans it names".

Scenario: Shamela fixes one haraka in the line before `حَدَّثَنَا سُفْيَانُ`, or the normalisation module goes to v-N+1 and changes how `(١)` is dropped. The prefix changes, so the span id changes. Then the mention key changes, then the identification key, then every published revision that names them. Every reviewed identification on that page goes back to unreviewed, which is the same mass lapse the plan rejects in 7.8. The plan's own "re-anchor tool proposes new selectors" turns into a full re-review.

Fix: give spans, mentions and identifications stable minted ids. Keep the selector as a field and the content hash as a separate `anchorHash`. A re-anchor that resolves to identical `exact` text keeps the publication. Only a change to `exact` lapses it.

### D3. Phase 2 attributes transmitted reports to al-Dhahabi (blocks)

Hits 6.2 (phases 2 and 5) and P2. Phase 2 converts all Siyar claims into Unit/Report/Statement, but chains arrive only in phase 5. The al-Zubayr page (`v4/41.md`) has:

> وَرَوَى: اللَّيْثُ، عَنْ أَبِي الأَسْوَدِ، عَنْ عُرْوَةَ، قَالَ: أَسْلَمَ الزُّبَيْرُ ابْنُ ثَمَانِ سِنِيْنَ

and, a few lines above it, in al-Dhahabi's own voice, `أَسْلَمَ وَهُوَ حَدَثٌ، لَهُ سِتَّ (٢) عَشْرَةَ سَنَةً`. Phase 2 has only the 3.1 template, `voice: author, chain: [], origin: entity:al-dhahabi`, so `attributedTo` is derived as al-Dhahabi for both ages. That is the "speaker changed" error that made up the reviewer's ~65/300 meaning changes, now produced by the model itself.

Fix: phase 2 must at least record `voice: transmitted` with `origin` = the last named speaker (a Mention), and leave the chain empty and flagged `chain: deferred`. Check 3 should reject an author-voice report whose span starts with `رَوَى` / `قَالَ فُلاَنٌ`.

### D4. Mode of hearing is flattened, losing jazm vs tamrid (serious)

Hits 2.5. The mode vocabulary has `qala` and `unspecified` but no `yudhkaru` / `ruwiya`, even though the muallaq paragraph names `وَيُذْكَرُ`. Bukhari's `وَقَالَ اللَّيْثُ` (sighat jazm) and `وَيُذْكَرُ عَنْ ...` (sighat tamrid) are not the same claim about how a report was heard. Under this vocabulary both become `qala` or `unspecified`, and `NARRATED_FROM {mode}` in 5 carries only the code. `modeSpan` keeps the letters, but every derived edge and filter drops them. Check 3 says "Each Link's `modeSpan` immediately precedes its mention". That fails on `سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ`, a discontiguous formula, and on `قَالَ: حَدَّثَنِي سَعِيدٌ` in 3.2.

Fix: add the passive and tamrid forms (`yudhkaru`, `ruwiya`, `balaghani`, `qala-li`, `dhakara`), let `modeSpan` be a list of spans, and put the `modeSpan` id on every projected edge.

### D5. A grade that appears from nowhere through `Work.authorClaim` (serious)

Hits 2.8. "Bukhari's inclusion in al-Sahih is a property of the Work (`Work.authorClaim`)". Nothing stops the UI from treating that as a per-report grade. The authorial claim does not cover the muallaqat, the tarajim al-abwab or the mawquf athar in a bab. Scenario: the 3.2 `وَقَالَ اللَّيْثُ` muallaq report is shown under the "Sahih al-Bukhari" banner, and a reader takes it as graded sahih.

Fix: `authorClaim` names its scope (`musnad-marfu` only). Check 7 forbids any projected grade field on a report unless a `grading` Statement targets that report.

### D6. Tafsir and tarajem chain-less opinions have no home (serious)

Hits 2.5, 3.3 and 8. Al-Tabari regularly writes `وَقَالَ آخَرُونَ: ...` or `قَالَ بَعْضُ أَهْلِ العَرَبِيَّةِ`, with no isnad and no named speaker. The model's choices are `voice: transmitted` with an empty chain, which reads as a hadith-style `muallaq` and is wrong, or `voice: author`, which attributes the view to al-Tabari and is also wrong. `origin` must be a mention, but `آخَرُونَ` is not an entity. Siyar's `وَقِيْلَ` (3.4) has the same problem: the plan keeps the word in the span, but `attributedTo` still derives al-Dhahabi.

Fix: add `voice: reported-anonymous` with an origin of `unnamed-group` that has a span (`آخَرُونَ`, `قِيْلَ`). Keep `muallaq` for hadith collections only.

### D7. The work's own riwayah is missing: how the book itself was heard (serious)

Hits 2.2 and 2.5. Sahih al-Bukhari reaches any edition through a riwayah (al-Firabri, then Abu Dharr, al-Asili, Ibn Asakir and others, as in al-Yunini's sigla). The Sultaniyya prints riwayah variants in its margins: a word, or even a `حَدَّثَنَا` vs `أَخْبَرَنَا`, differs by riwayah. Under the plan the first `حَدَّثَنَا` is al-Bukhari's, with no record of which riwayah the edition follows or of marginal variants. The owner asked for "exactly how something was heard and from whom", and that has to include the book itself.

Fix: add `Edition.riwayah` (a chain of Mentions with spans from the edition's introduction), and treat a marginal riwayah variant as a footnote span tied to a `Collation`.

### D8. Displayed strings that are not source spans (serious)

Hits P1 and 2.4. Four cases:

1. 3.2 and the diagram show `النبي ﷺ` and `رَسُولُ اللَّهِ ﷺ`, but the Siyar page prints `-صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-`, and hosts often insert the ligature themselves. Either the display is ours or the normalisation maps it, and the plan states neither.
2. `Entity` display name is "the name in a chosen tarjama heading". A narrator with no transcribed tarjama (`أَبُو حَصِينٍ` until Tahdhib is loaded) has none, so the UI will fall back to the slug or an English name: our words.
3. Closed-vocabulary battle and title names are "backed by a span", but one span from which work, and which reading wins when two works spell it differently?
4. Volume labels and "al-Dhahabi, Siyar 4/41:" are authored display.

Fix: a display name is always `Mention` text from a cited span, with the chosen mention recorded. Entities with no span render as "unnamed in the corpus", never as a slug. The plan should also state the honorific rule.

### D9. `legacy-unreviewed` disappears from profiles (serious)

Hits the 6.1 row `legacy-unreviewed` -> "shown nowhere, a work queue only". AGENTS.md says the marker "says the value is in use and its evidence is still owed", and ADR 0008 says review status never hides data. Phase 2's acceptance only covers "every profile value of the 105 batches". Every person whose values are still seed-backed loses fields on the day phase 4 drops the old tables. The plan does not count how many those are.

Fix: either state this as a deliberate break with ADR 0008 and AGENTS.md, with a count, or keep `LegacyValue` displayed under a "no source yet" label until each value is promoted or retired.

### D10. Migration steps with no way back (serious)

Hits 6.2. In phase 4, "drop old tables", `claim.assertion` "dropped", `excerptArabic` "text dropped" and the batch approval "replaced" are one-way. Phase 1 also lists citations that fail to resolve "with reason", but nothing says what happens to those claims afterwards. Scenario: 318 of the 1,354 v4-5 citations failed the matcher before its fixes. If even 5% still fail, those values drop out of profiles at phase 4 with no fallback.

Fix: tag the pre-migration commit, dual-project (old and new tables side by side) for one release with a diff report, block phase 4 until the unresolved list is empty or explicitly retired by the owner, and keep `excerptArabic` in a frozen archive file under `data/` rather than deleting it.

### D11. Identification uniqueness contradicts the dispute example (minor)

2.4 says "at most one per mention may be `asserted` and published at a time unless the stance is `disputed`", and 3.4 says "the graph projects the asserted one; the profile shows both". When two works disagree and neither side is ours, which one is `asserted`? Choosing one is our opinion. Fix: when identifications compete, all are `disputed`, and the graph shows no edge, or a marked edge for each.

### D12. Spans keep footnote markers out of the match but still carry them in numbers (minor)

`لَهُ سِتَّ (٢) عَشْرَةَ سَنَةً`: `words-to-number` has to be specified to run on the normalised text, and its behaviour should be pinned by a test using this exact span.

## 4. Contradictions with the owner's goals or the repo

- **Our identifications** (D1): the owner wants facts, not our opinion. The `object`/`about` entity references are unbased identifications.
- **ADR 0008 / AGENTS.md legacy rule** (D9): "shown nowhere" contradicts "review status never hides data" and the `legacy-unreviewed` paragraph in AGENTS.md. Risk 6.3 adds "identifications unpublished until reviewed". That ties publication to review for a whole class, which AGENTS.md treats as two separate gates ("Two separate actions gate a batch, and neither implies the other"). Q2 asks about this only for hadith.
- **ADR 0010 layout**: it is moved from `data/history/batches/` to `data/works/` and `data/entities/`, with no superseding ADR named. Phase 0 lists ADRs 0021-0022 only.
- **Approval and who publishes**: AGENTS.md gives publication to the user. Per-record publication for tens of thousands of records needs a stated mechanism, such as the owner publishing a change set and that writing per-record revisions. Otherwise "per record" means agents publish.
- **AGENTS.md citation rule** ("Mark omitted intervening text with an ellipsis"): the plan forbids ellipsis spans (4.1) and does not list AGENTS.md as a doc to rewrite in phase 1. Only the narrator rule appears, in phase 5.
- **Repo state**: the plan's prefix for `sp:zb-nasab-2` is `"(ع) "`, but in `v4/41.md` the `* (ع)` ends paragraph 1 and `ابْنِ قُصَيِّ` starts paragraph 2. Under "collapse whitespace" the prefix is really `"* (ع) "` across a paragraph break. That fits the method, but the worked example was not run against the file. The ADR 0020 virtue migration is "not applied to the database" (evidence), and the plan's phase ordering does not say whether it lands first.
- **Shamela-only rule**: Bukhari and Tabari from Shamela need new transcription checks (vowelling and honorific insertion) that the plan does not give. Q5 raises this only for Sira.

## 5. Missing

1. **Costs.** For one Bukhari hadith of 5 links: 1 unit, 1 report, about 2 isnad/matn spans, 5 mention spans, 5 mode spans, 5 identifications and 1-2 memberships, so about 20 records and 5-6 human identification decisions. Across about 7,500 reports that is about 150k records and about 37k identifications to review, almost all `namaq-authored` until Tahdhib is transcribed. The plan says "volume of hand work for chains: tool pre-splits" and gives no numbers. It needs a cost table per genre and a review budget.
2. **What a plain Siyar claim costs.** Today it is claim + citation. Under the plan it is Unit (shared) + Report + 1-2 Spans + Statement, plus Mentions and Identifications for every entity in `about`/`object` once D1 is fixed. That is roughly 3x the records, but the hard part is the report-boundary and voice decision (D3). The plan should say who makes that decision and how it is checked.
3. Riwayah of the work (D7) and the honorific policy (D8).
4. Grading target = Entity (`ثقة`, `صدوق`), admitted in section 8 but not put into 2.8.
5. Event and battle identification across works (admitted in section 8, not modelled).
6. Rollback and dual-run (D10). Data size of the PostgreSQL `Span` table with cached text. Performance of resolving every span at build time across about 5k pages.
7. A test plan per check, matching AGENTS.md's "search and graph features are the highest priority": the `NARRATED_FROM` projection and profile resolution.
8. How Qur'anic quotations in Siyar (not only tafsir) are found and linked. The `Ayah` table's own text edition (rasm and vowelling source) also needs naming, since P9 makes it the only Qur'an text.
9. What an unresolvable span does to its statement at runtime: hidden, shown as broken, or blocking the build.

## 6. The single change that would improve the plan most

**Route every entity reference through Mention and Identification, and give those records stable ids that do not depend on the span hash.** This closes D1, which is our opinion entering the data, and D2, mass lapse on re-fetch, together. It also makes the identification review budget countable, which is the true cost of this design.

## 7. Questions for the authors

1. In 3.1, what record justifies `object: p:al-awwam-ibn-khuwaylid`, and who reviewed it?
2. When a page prefix changes by one haraka, which keys change, and which reviewed records lapse?
3. In phase 2, what voice and origin does `أَسْلَمَ الزُّبَيْرُ ابْنُ ثَمَانِ سِنِيْنَ` (Urwah via al-Layth) get on `v4/41.md`?
4. Which mode code does `وَيُذْكَرُ عَنْ` get, and does the `NARRATED_FROM` edge keep it apart from `وَقَالَ`?
5. Which riwayah of al-Sahih does the chosen edition follow, and where is that recorded?
6. How do `وَقَالَ آخَرُونَ` in al-Tabari and `وَقِيْلَ` in the Siyar avoid being attributed to the author?
7. How many seed-backed values disappear from profiles when `LegacyValue` becomes "shown nowhere"?
8. What is the estimated count of identifications to review for the Kitab al-Ilm pilot and for the whole of Bukhari, and who reviews them?
9. How does `ﷺ` reach the display when the page prints `صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ`?
10. What is the way back if phase 4 goes wrong?
