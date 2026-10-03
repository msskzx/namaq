# Review of Plan B: a model of attributed spans

Scope: `docs/plans/data-model/plan-b.md` only, checked against `00-evidence.md`, AGENTS.md, ADRs 0008/0010/0011/0015/0018/0020, `prisma/schema.prisma`, `src/lib/catalog/types.ts`, the page store under `data/history/sources/siyar-alam-al-nubala-risalah/` and `data/history/batches/az-zubayr-ibn-al-awwam/batch.json`.

## 1. Verdict

**Adopt with changes.**
The plan has the right core: text written once in page files, stand-off quote selectors instead of paragraph indexes, speaker plus chain on every statement, and narrator identity as a reviewable record separate from the text.
Four defects block it as written. Approval hashes the record but not the text it resolves to, so a page edit changes what a published record displays without lapsing anything. The `Chain` type cannot represent a dropped segment (mu'allaq, mursal, munqati'), which is the first thing Bukhari needs. Several judgments are still ours and carry no source span: the author as an "implicit" speaker, Report grouping by `REVIEWER`, and identifications whose basis is the mention itself.
Its own migration table and phase table disagree, and the `LEGACY` state contradicts P2. The plan also gives no cost figures for hadith-scale extraction and review, and no way back from phase 3.

## 2. What the plan gets right and must be kept

- **P1, the page file as the only authored Arabic** (§1, §5). It removes the copy-drift class the evidence measures: 414 of 727 catalog values failed, and 25 PRs rewrote `assertion`. Stricter checking cannot get there. The §7 argument against "keep copy-and-check" is correct.
- **Quote selectors with a derived positional cache** (§2.3). A re-split page changes the cache and leaves the span alone. A text change fails loudly and names the orphaned spans. That fixes the "8 anchors past the paragraph count" and the silent re-pointing.
- **One `matchSpan` module** shared by the validator, the reader and projection (§2.3, phase 0). It ends the real duplication between `scripts/history/verifyExcerpts.ts` and `src/lib/history/sectionHeadings.ts`.
- **Mode of hearing as a printed span, with the class derived** (P3, `Link.mode: SpanRef`). Keep this exactly.
- **Mention and Identification split from Agent** (§2.4), with unidentified mentions rendered as text and never as nodes (`عَنْ رَجُلٍ`). Graph edges come only from reviewed identifications (check 7).
- **Wordings are never merged** (§2.5, §7 "One Hadith entity" rejected). This is right for hadith.
- **Gradings exist only as statements with a speaker** (§1 refusals). `ESTABLISHED/LIKELY` is dropped.
- **Edition, Volume and Witness are separate**, with the volume label as data and the number as key (§2.2). This fixes the mixed `"1"` / `السيرة 1` labels, which are real: `az-zubayr-ibn-al-awwam/batch.json` line 136 has `"volume": "1"` on a page anchored `4/41-p1`. `Witness.vowelled` per range makes the bare Shamela vols 1-2 visible to validators.
- **Per-record approval** (§4) replaces whole-batch `batchRevision`, which today lapses wholesale.
- **The tafsir stance** (§3.3): "Ibn Abbas, via [chain], in al-Tabari", never "the meaning of 1:2 is".

## 3. Defects

### D1. A published record's displayed text can change without lapsing its approval. Severity: blocks

Plan text: "Unit of approval: one record ..., keyed by its `contentHash`. ... editing one record lapses that record only" (§4). "The displayed text is cut from `PageText`, never from `exact`" (§2.3).

Failure: `v4/41.md` is re-fetched, and Shamela has corrected `بنُ العَوَّامِ` to `بْنُ العَوَّامِ`. The match rule treats diacritics as significant, so `sp_zub_name` orphans and validation fails. That case is fine. Now take a correction outside `exact` but inside the rendered cut, or a span with `pageTo` whose second page is re-split so the cut joins differently. The span still matches. The rendered string changes, and `as_zub_fullname` keeps its published hash. A more dangerous case: a matn span `«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...»` whose page is re-transcribed from a second witness after a `witness:diff` decision (§4 "spans are resolved against the edition's primary witness"). Change the primary witness and every published matn now renders from another digitization under the same approval.

Fix: put `sha256(resolved rendered text)` and the witness id into each record's `contentHash`, through the spans it references. Changing a page or the primary witness then lapses exactly the records whose rendered text moved, and `model:validate` lists them.

### D2. A chain cannot hold a gap, so mu'allaq and mursal reports have no representation. Severity: blocks (for hadith)

Plan text: "Mu'allaqat (chain dropped) = chain with a `BALAGHA`/`QALA` link and missing segment, rendered as such" (§8). But `type Link = { narrator: MentionRef; mode: SpanRef; ... }` and `type Chain = { links: Link[] }` (§2.5) have no gap element.

Failure: Bukhari's
`وَقَالَ مَالِكٌ: أَخْبَرَنِي زَيْدُ بْنُ أَسْلَمَ، أَنَّ عَطَاءَ بْنَ يَسَارٍ أَخْبَرَهُ، أَنَّ أَبَا سَعِيدٍ الخُدْرِيَّ أَخْبَرَهُ ...`
skips al-Bukhari's link to Malik. Encoded as `links[0] = {narrator: مَالِكٌ, mode: قَالَ}`, it reads as Bukhari having heard Malik with قال. That is the same shape as `حَدَّثَنَا ... قَالَ: حَدَّثَنَا` chains, where قال only frames. The projection then draws `(Bukhari)-[:NARRATED_FROM {mode: QALA}]->(Malik)`, and that edge is false. The same failure hits a mursal (`عَنْ سَعِيدِ بْنِ المُسَيِّبِ أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ`) and al-Dhahabi's frequent `وَرُوِيَ عَنْ` and `بَلَغَنِي`.

Fix: add `{ kind: 'GAP', marker?: SpanRef }` as a chain element and forbid edges across it. Separate the compiler's ta'liq (`وَقَالَ`) from an in-chain `قَالَ` by position. The source's own word marks the gap, and the gap's length is never inferred.

### D3. modeClass loses distinctions the source makes. Severity: serious

Plan text: `modeClass: 'SAMA_PLURAL'|'SAMA_SINGULAR'|'IKHBAR'|'AN'|'QALA'|'BALAGHA'|'OTHER'`.

Failure: the plan's own st_b1 has `أَخْبَرَنِي` and st_b2 has `أَخْبَرَنَا`. Both collapse into `IKHBAR`, while حدّثني and حدّثنا stay apart. That asymmetry is our classification, and the muhaddithun treat it as meaningful (أخبرني for qira'a alone). `سَمِعَ` / `سَمِعْتُ` / `أَنَّهُ سَمِعَ ... يَقُولُ` have no class. Neither do `أَنْبَأَنَا`, `أَنَّ` (the mu'annan), `كَتَبَ إِلَيَّ` or `نَاوَلَنِي`. All of them fall to `OTHER requiring review`, so review volume rises and the meaning is lost. The graph edge carries `mode: SAMA` (§3.2), and that discards plural and singular too.

Fix: make the class table one-to-one with the printed lemma plus person/number (`haddatha/1pl`). Put a coarser grouping in a separate, documented derived view. Never project a coarser value than the span. Have the edge carry `modeSpanId`.

### D4. Non-contiguous mode words break the contiguous-span rule. Severity: serious

Plan text: "A span must be one contiguous run" (§2.3). Yet st_b2's last link is `أَنَّ...قَالَ→النبي ﷺ`, and st_b1 uses `أَنَّهُ سَمِعَ ... يَقُولُ`.

Failure: `mode: SpanRef` is a single span, so `أَنَّ رَسُولَ اللَّهِ ﷺ قَالَ` either becomes a span that swallows the narrator's name (the mention span then overlaps the mode span), or two spans that the type does not allow.

Fix: `mode: SpanRef[]` (ordered parts, each contiguous). State that the narrator mention and the mode spans must not overlap. The plan's own Mention example `حَدَّثَنَا الحُمَيْدِيُّ` (§2.4) already overlaps the mode `حَدَّثَنَا`. That should be `الحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ`.

### D5. Judgments that are ours and carry no cited basis. Severity: serious

- `speaker: mention(al-Dhahabi, role SPEAKER, implicit: work author)` (§3.1). A Mention is defined as having a `span` (§2.4), and this one has none, so it breaks P2. Phase 2 makes it the default: "default speaker = author, review only spans containing قال/عن/روى". Siyar narrates without those words all the time, as in `وَكَانَ ... يَقُولُ` or `فَذَكَرَ`. Under that default, a companion's words get attributed to al-Dhahabi. That is the "speaker changed" error the evidence counts (~65 of ~300).
- `Report.basis: 'REVIEWER'` (§2.5) groups st_b1 and st_b2 as one hadith on our word. The worked example uses exactly that basis.
- §3.4 `i1 → abdullah-ibn-amr-ibn-al-as, basis [main span]`. The basis is the mention itself. A name that reads عبد الله بن عمرو is no evidence that it means ibn al-'As rather than another عبد الله بن عمرو. That is our identification wearing a citation.
- Phase 4: "an editor's footnote" or "a tarajem/rijal work" is the basis. No rijal work is in scope before Q1 is answered. In practice, then, the Siyar's isnad narrators get PROPOSED identifications with no admissible basis, or get reviewed on our knowledge.

Fix: allow `basis` only as spans from a work other than the mention's own span, with a typed role (`EDITOR_NOTE`, `RIJAL_ENTRY`, `SAME_WORK_EXPLICIT`, for example `يَعْنِي ابْنَ عُيَيْنَةَ`). Represent the author-as-speaker as a frame span (the entry heading or the `قَالَ` before it) or as an explicit work-level rule, and review it per statement. Drop `REVIEWER` as a Report basis, or label such reports in the UI as "grouped by Namaq".

### D6. P8 shows text the book did not print. Severity: serious

Plan text: "a book's copy of an ayah is still kept as the book's text, but the app shows the `Ayah` row" (P8, §3.3).

Failure: Tabari quotes `{الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ}`, but books often quote part of an ayah, use imla'i spelling, or quote a qira'a other than the one `Ayah.text` holds (`schema.prisma` `Ayah` has a single `text` plus `recitation`). Take a commentator citing `مَلِكِ يَوْمِ الدِّينِ` while the `Ayah` row reads `مَالِكِ`. Showing the row puts the wrong reading inside the commentator's sentence, and his commentary may turn on that reading. That breaks "holds exactly as it was said".

Fix: always render the book's span inside the book's text and link to the `Ayah` row beside it. A diacritic-insensitive mismatch is shown as a flagged difference and never substituted.

### D7. Render transformations make the displayed string something other than the span. Severity: serious

Plan text: "the footnote marker `*` and the siglum `(ع)` handled by the declared render rule (marker removed, siglum kept as a separate `NOTES`-adjacent token)" (§3.1).

Failure: in the real `v4/41.md`, `* (ع)` sits mid-name, followed by a paragraph break and then `ابْنِ قُصَيِّ`. The profile shows a string with the marker deleted, the siglum moved and the break joined. No validator compares that string to anything, so "a displayed string is always render(span)" holds only up to an unspecified function. The entry number `٣ -` is excluded by choice, and that is correct, but nothing records the choice.

Fix: specify `render` as a closed, tested list of deletions (footnote markers only), with the rest of the span shown verbatim. The siglum is the editor's or al-Dhahabi's text and stays in place, or the span ends before it. Add a test that `render(span)` equals the page text minus listed markers.

### D8. Span identity survives a re-split but not a re-fetch. Severity: serious

The match form keeps "diacritics, hamza and punctuation" (§2.3). That is correct for exactness, but every tashkeel correction by Shamela or a re-transcription orphans spans en masse, and the plan gives no re-anchoring procedure. The phase-1 converter "emits a fix list" (≈248+8). The evidence says agent fixes changed meaning 1 time in 5. A short repeated selector (`عَنْ`, `أَبُو سَلَمَةَ` in a «رَوَى عَنْهُ» list) needs prefix/suffix of "up to 32 chars", and a re-fetch can make that unique selector ambiguous. The plan rejects ambiguity loudly, which is correct, but then hundreds of mentions per entry fail at once.

Fix: a `span:reanchor` tool that proposes a new selector only when the old rendered text appears verbatim exactly once. Anything else goes to review as a record lapse (D1). Short mention selectors should anchor to their parent statement span (offset within a span that is itself quote-anchored) rather than to the page.

### D9. English and bilingual display have no home. Severity: serious

P5 says "The only project-authored strings are closed vocabularies ... and UI translations". `Agent` has "no name text". AGENTS.md requires every user-facing string in `en` and `ar`, and the app shows English names and the graph labels nodes in English. Under this plan an English name is neither a span nor a closed vocabulary, so the English UI cannot show a person. The quiz bank (`data/quiz/`) also authors Arabic and English text outside page files, which P1 forbids.

Fix: add a declared, separately stored `Transliteration` / `Gloss` kind that is visibly ours, never shown as a source quote and never in Arabic. State how `data/quiz/` relates to P1.

### D10. Internal contradictions. Severity: serious

- §6.1: "Seeds ... deleted at phase 4"; §6.2 phase 3: "Seeds deleted".
- §6.1: legacy becomes "`Assertion` with `restsOn: []`, status `LEGACY`". But P2 says "An assertion without a statement fails validation", and `Assertion.status` is `'PROPOSED'|'REVIEWED'|'DISPUTED'`, with no `LEGACY`. §3.4 uses `REJECTED`, which is in neither the `Identification` nor the `Assertion` enum.
- P4: "`Edition` key includes editor, printing and the digital witness", while §2.2 keys Edition by `slug` and puts Witness below it. The second is right. Fix P4.
- §3.2 graph uses `HEARD_FROM {mode: SAMA}` and `NARRATED_FROM {mode: AN}`, two edge types the plan never defines. §5 lists only `HEARD_FROM`.

### D11. The scalar is our reading and is displayed as a value. Severity: minor

Plan text: "`{ scalar: number|string; spans }`... it is the one place our reading enters" (§2.6). Converting `سَنَةَ سِتٍّ وَثَلاَثِيْنَ` to 36 is mechanical (check 4). An enum like `KILLED` from `فَقُتِلَ` / `اسْتُشْهِدَ` / `قُتِلَ صَبْرًا` is classification. Fix: split `scalar` into parsed (machine-checked) and classified (reviewed, shown with its span always visible).

### D12. ADR 0011's evidence role disappears. Severity: minor

ADR 0011 records each citation's role: direct record, transmitted report, author's synthesis, editor's analysis. Plan B's `Statement` carries speaker and chain but no role, and the mapping table (§6.1) drops it silently. Speaker plus chain covers much of it, but not "author's synthesis" against "author's own report". Fix: map it explicitly, or retire ADR 0011 in an ADR.

## 4. Contradictions with the owner's goals or the repo

- **"Not our opinion"**: D5 (implicit speaker, `REVIEWER` reports, self-based identification) and D2 (gaps encoded as false links).
- **"Holds exactly as it was said"**: D6 (Ayah substitution) and D7 (render rule).
- **Hadith held to a higher standard than history**: the plan applies one review regime to both. It never says that a statement whose speaker is the Prophet ﷺ needs stricter gates (two reviewers, mandatory chain, no `LEGACY`, no default speaker).
- **AGENTS.md "Shamela is the only digital host"**: P4 and §4 "witness variants" assume several witnesses, and phase 1 accepts "a declared second witness". The plan raises this as Q3 but already builds on the answer.
- **Repo state**: `Utterance` (`schema.prisma` line 571) has `speakerName String?` "naming him here does not make him a node". The plan maps Utterance to Statement but not `speakerName`, which would need a Mention with no Identification. `PersonVirtue` and ADR 0020 shipped in #302 and are not applied to the DB (evidence). The plan lists `PersonVirtue` as replaced without saying whether ADR 0020's migration runs first.
- **Paths**: `data/history/sources/siyar-alam-al-nubala-risalah/` has a `source.json` beside `v1 v2 v4 v5`. The plan moves pages to `<edition>/<witness>/v<n>/` but does not say what becomes of `source.json`, or how many of the 22 `src`/`scripts` files that read `passageAnchor`/`excerptArabic` change.

## 5. Missing

1. **Costs in numbers.** Hadith 1 of Bukhari as encoded in §3.2: 7 links → 7 narrator mentions, 7 to 9 mode spans, 7 identifications, 1 matn span, 1 frame, 1 statement, plus a report. That comes to roughly 25 records, each needing review for one wording. Across ~7,500 entries with repeats, that is ~150-200k records and ~50k identifications, because §8 says repeated isnads are "stored per statement (no sharing)", so the same `الحُمَيْدِيُّ → سُفْيَانُ` pair is identified again every time. Add the page-file size per edition and the reviewer-hours per kitab. The plan names "the bottleneck" and gives no figure.
2. **Identification reuse.** A mechanism to carry an identification across identical chain segments in one work, citing the same basis, without a reviewer approving each copy blind.
3. **Rollback.** Phase 3 deletes seeds and `catalog/*.ts` and drops the DBs. There is no tag, no dual-run period and no criterion for reverting. At minimum: keep the old pipeline runnable on a branch until phase 3 acceptance passes on the preview DBs, and git-tag the last pre-migration commit.
4. **Hadith-specific gates**: Prophetic-matn rules, the ﷺ formula as printed and never added, how `رَضِيَ اللَّهُ عَنْهُ` in the source is kept as text, and text in the matn's quotation marks against the narrator's interjections (`قَالَ: وَأَحْسِبُهُ قَالَ`, idraj).
5. **Tafsir without a chain.** "قَالَ بَعْضُهُمْ" or "وَقِيلَ" in a tafsir has an anonymous or unidentified speaker. The plan's `Agent.kind: ANONYMOUS` exists, but nothing says how the UI attributes it. It should say "an unnamed opinion reported by al-Tabari" and never fall back to the mufassir's own view.
6. **Event and battle identity.** Acknowledged as "untested" in §8. It needs the same Mention/Identification design before a second Sira work arrives.
7. **The review UI.** Per-record review over spans is the whole safety case. The plan assumes a "batch-of-chains review UI" and does not design it.
8. **Statement nesting (`enclosedBy`) in the chain model.** Al-Dhahabi quoting Ibn Sa'd quoting al-Waqidi is both a chain and an enclosure. When to use which is unspecified.

## 6. The single change that would improve the plan most

Make approval cover the rendered evidence, not only the record. Every published record's hash should include the resolved text of each span it depends on, plus the witness, so a page re-fetch, a re-split that alters a cut, or a change of primary witness lapses exactly the affected records and lists them (D1). Without this, P1's "text written once" becomes "text changeable once, silently, under an approval".

## 7. Questions the authors must answer

1. How is a dropped chain segment (mu'allaq, mursal, `بَلَغَنِي`) typed, and what stops projection from drawing an edge across it?
2. Does `contentHash` include resolved span text and witness? If not, how does a reviewer learn that published text changed?
3. What is the admissible basis for an Identification before any rijal work is ingested? Is "basis = the mention itself" (§3.4) allowed?
4. Who is the speaker of a Siyar sentence with no قال/عن/روى, and is that decided per statement or by default?
5. Why does `IKHBAR` lose singular and plural when `SAMA` keeps them, and which table covers `سَمِعَ`, `أَنَّ`, `أَنْبَأَنَا` and `كَتَبَ إِلَيَّ`?
6. Does the app ever show `Ayah.text` in place of a book's own quotation, and what happens when the qira'a differs?
7. Where do English names live under P5, and is `data/quiz/` exempt from P1?
8. Is `LEGACY` a status with no statement, against P2? Which phase deletes the seeds, 3 or 4?
9. What does Bukhari's بدء الوحي cost in records and reviewer-hours, and how many identifications are re-reviewed duplicates?
10. What is the rollback path if phase 3's "drop + project = identical" fails on the preview DBs after seeds and `catalog/*.ts` are gone?
11. Do Prophetic statements get a stricter gate than history, and what is it?
12. How does ADR 0011's evidence role map into `Statement`, or is that ADR retired?
