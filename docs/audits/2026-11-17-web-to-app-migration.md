# Web-to-app migration: people, tarajim and hadith

Date: 2026-11-17. Code inspected: `b9039cd2`, main through PR #836. The initial inventory and measurements used `b361ce03`; #836 was integrated and its reader changes checked before submission. It adds no website page route or historical-data changes. Research and planning only. No application code, authored data, source registry, review decisions or databases were changed.

## Recommendation and evidence limits

**Inferred recommendation.** Port the existing people features with a small, versioned offline catalog first. Reuse the app's navigation, paper theme, books manager and matrix quiz UI. Finish and review the al-Zubayr span-model pilot before scaling Siyar extraction. Treat hadith as a separate source-ingestion milestone: the two website route templates currently have a three-unit fixture fallback, not a verified collection ready to ship. Do not make offline profiles wait for completion of every Companion entry or for a whole hadith collection.

Evidence labels used throughout:

- **Checked in code** means a repository file, command result, data count or merged PR was inspected at the revision above. It does not certify the historical truth of a catalog value.
- **Checked in source** means the quoted passage was read in the named digital witness. A repository transcription and a host transcription are identified separately. Neither means a printed scan was inspected.
- **Inferred** means a proposed design, cost assessment or conclusion beyond those direct checks. Proposed tests are acceptance criteria, not tests already added or run.

**Checked in code.** Read [AGENTS.md](../../AGENTS.md), including the shared-components table, [palette](../palette.md), the [records index](../records/README.md), the relevant records cited below, and [data pipelines](../data-pipelines.md). Engineering descriptions below refer to code, not classical books. Historical wording is quoted rather than rewritten. Quiz prompts quoted below are application artifacts under audit, not endorsements of their historical claims. This is not a fresh source audit of all 611 people or all 243 approved questions. No native render, device cold-start benchmark, production-database inventory or printed-page scan was performed.

## 1. The gap is wider than people and two hadith routes

### Complete website route inventory

**Checked in code.** Enumerated all 46 `src/app/**/page.tsx` files and the Expo routes under `mobile/src/app/`. The table distinguishes route availability from feature parity. An existing counterpart does not establish that every visual detail matches. Source roots are [website routes](../../src/app) and [phone routes](../../mobile/src/app); the app's five-tab grouping is [tabGroups.ts](../../mobile/src/lib/tabGroups.ts).

| Website route | Phone counterpart or missing feature | Status |
| --- | --- | --- |
| `/` | `(tabs)/(home)/index`, home feed | Present; no new migration route needed |
| `/quran` | `(tabs)/(quran)/quran` | Present |
| `/quran/branches` | `(tabs)/(quran)/branches` | Present, shared builder and platform BranchTree |
| `/quran/compare` | `(tabs)/(quran)/compare` | Present, shared comparison data and tree rules |
| `/quran/prophets` | `(tabs)/(quran)/prophets` | Present |
| `/quran/prophets/[slug]` | `prophets/[slug]` | Present |
| `/quran/tajwid/tuhfat-al-atfal` | `(tabs)/(quran)/tuhfa` | Present |
| `/quran/words` | `(tabs)/(quran)/words` | Present |
| `/quran/oaths` | `(tabs)/(quran)/oaths` | Present |
| `/quran/lataif` | `(tabs)/(quran)/lataif` | Present |
| `/quran/openings` | `(tabs)/(quran)/openings` | Present |
| `/quran/order` | `(tabs)/(quran)/order` | Present; migration does not expand its source coverage |
| `/quran/qiraat` | Reader/ayah qira'at sheet | Feature present without a dedicated route; retain a deep-link destination |
| `/quran/read` | `(tabs)/read` | Present; #836 adds listening with ranges/repeats on both platforms, plus native recitation downloads |
| `/quran/read/[page]` | Reader page state | Present as state rather than one route per page |
| `/quran/read/ayah/[surah]/[ayah]` | `/ayah` and reader navigation | Present as an ayah destination |
| `/quran/read/recite` | Reader recitation mode and `quiz/play` | Present as a mode, not a route clone |
| `/quran/books` | `(tabs)/(library)/books` | Present, books manager |
| `/quran/books/[id]` | `(tabs)/(library)/book` | Present for registered Quran books |
| `/quran/books/[id]/[page]` | Same reader's printed-page state | Present for supported books; not the historical source reader below |
| `/quran/themes/legacy` | No native equivalent | Extra gap: old curated theme-pair page. Current compare covers related use cases, but this legacy dataset/view is not proved equivalent |
| `/library` | `/library`, `screens/library` | Present: saved, forgotten and notes. Do not confuse this with the books tab |
| `/utilities` | `(tabs)/(home)/utilities` | Present, prayer times/qibla/calendar tools |
| `/search` | `(tabs)/(home)/search` | Present for current Quran/prophet-story/Tuhfa/note categories, not all historical subjects |
| `/quizzes` | `(tabs)/quizzes`, `quiz/solo`, `quiz/play` | Quran kinds present; historical bank topics and person-circle mode missing offline |
| `/quizzes/openings` | `quiz/openings` | Present |
| `/quizzes/party` | `quiz/party/index` | Present; party still needs a network connection |
| `/quizzes/party/[code]` | `quiz/party/[code]` | Present; network-dependent |
| `/quizzes/questions` | No native review console | Extra website route: question-bank review. Keep authoring/review tooling out of the public phone flow |
| `/biographies` | No native hub | Missing tarajim navigation hub; web uses SectionHub rather than another corpus |
| `/people` | None | Missing people search, title filtering, list/cards and pagination |
| `/people/[slug]` | None | Missing full profile and its linked features, detailed below |
| `/nasab` | None | Missing multi-subject lineage plot, common ancestor and descendants toggle |
| `/graphs` | None | Extra gap: general graph, not just nasab |
| `/events` | None | Extra gap: historical event listing/filtering; prophet-story events in Quran search are different |
| `/events/[slug]` | None | Extra gap: historical event detail and its people/evidence links |
| `/battles/[slug]` | None | Extra gap: battle detail, attendance/outcome/evidence and connected people |
| `/titles` | None | Extra gap: title browser and title-to-people links |
| `/hadith` | None | Missing unit index, currently capable of listing fixture units |
| `/hadith/[unit]` | None | Missing unit, conversation, chain and source-reader views |
| `/sources` | No direct native shelf or settings link | Credits are reachable through the separate `/attributions` settings link; historical source shelf/contents not available offline |
| `/sources/[slug]` | None | Extra gap: historical work, bound volumes, accounts and anchored page reader |
| `/about` | External settings link, no dedicated native page | Informational route reachable online; decide whether external access is sufficient |
| `/privacy` | External settings link, no dedicated native page | Reachable online; offline policy text would need a bundled copy |
| `/attributions` | External settings link | Credits reachable online; no offline native attribution page |
| `/experiments` | None | Extra website feature/status directory. Do not automatically expose unfinished experiments in the app |

**Checked in code.** Search is an important correction to the apparent gap. [Web SearchView](../../src/app/search/SearchView.tsx) and [phone search](../../mobile/src/screens/search.tsx) both enumerate `surah`, `ayah`, `word`, `tree`, `compare`, `event`, `tuhfa`, `note`. Here `event` means a prophet-story event. A universal historical people/hadith/source-text search is not already implemented on the website's `/search`; adding it is work on both platforms. PeopleSearch and GraphSearch are separate existing subject-search interfaces to reuse. This report does not count that future universal search as an existing website-only feature.

**Inferred scope decision.** People/tarajim and hadith are the main requested additions, but not the entire route gap. Include their supporting graph, historical events, battle detail, titles and source-reader destinations in the migration. Ask the owner about the legacy themes route and informational pages. Keep the experiments directory and review console web-only unless explicitly requested.

### Every related people and hadith feature

**Checked in code.** [People list](../../src/app/people/page.tsx) uses title/search query state, 12-item pages, suggestions and infinite loading. [Profile](../../src/app/people/[slug]/page.tsx) includes names/kunya, appearance, titles, virtues, historical notes and evidence; [Timeline](../../src/components/people/Timeline.tsx) combines events, participations and death. It also embeds GraphCanvas, ModelEntries, ProfileHadith, SourceAccountReader, AyatGroup and said/spoken-about UtteranceGroup. An offline name list alone would leave most of this page missing.

**Checked in code.** [GraphCanvas](../../src/components/graph/GraphCanvas.tsx), its [controls](../../src/components/graph), and [relationship logic](../../src/lib/relationship) support subject selection/search, local/global exploration, node-kind and relation filters, controlled expansion, exploration history, connected subjects and evidence. [Unified graph loading](../../src/lib/fetchUnifiedGraph.ts) reads several subject kinds, not just people. Preserve stable slugs and typed edges. Precomputed layout/ranks are derived metadata, not classical evidence for a relationship.

**Checked in code.** [NasabView](../../src/components/nasab/NasabView.tsx) accepts repeated `subject=person:...` selections, five quick picks, removal of selected subjects, a global ancestors/descendants toggle, missing-subject feedback and RTL layout. [nasabLayout](../../src/lib/relationship/nasabLayout.ts) handles shared ancestors, disconnected components, missing fathers and non-cyclic primary-father selection, with readable chains alongside the drawing. Multiple stated fathers must not silently become one historically certain father merely because layout chooses a primary edge. [Nasab API](../../src/app/api/nasab/route.ts) queries paternal edges and descendant expansion from Neo4j and joins profile metadata.

**Checked in code.** The [descendants-and-wives plan](../plans/nasab-descendants-and-wives.md) is partly stale. The global descendants toggle now exists. Per-node one-generation expansion and wives beside husbands remain proposals, not existing website parity requirements. The current web renderer [NasabPlot](../../src/components/nasab/NasabPlot.tsx) is a separate SVG drawing with straight elbows and rectangular boxes. Port its semantics through the common tree rather than copying that renderer's older look.

**Checked in code.** [Hadith index](../../src/components/hadith/HadithIndex.tsx), [HadithUnit](../../src/components/hadith/HadithUnit.tsx), [HadithBody](../../src/components/hadith/HadithBody.tsx), [IsnadSvg](../../src/components/hadith/IsnadSvg.tsx) and [PageReader](../../src/components/hadith/PageReader.tsx) cover unit selection, book/kitab/bab, full-text versus conversation/chain presentation, speaker-linked turns, source pages, compiler remarks, commentary notes and `explains`, `explainedBy`, `sameEvent` links. [ProfileHadith](../../src/components/people/ProfileHadith.tsx) adds pagination, the same presentation toggle and person highlighting, with roles `isnad`, `speaks`, `mentioned`. Preserve those distinct roles; a mention is not a narrator claim.

## 2. Siyar parsing: where it stands and how to finish

### Measured status, rather than old progress counts

**Checked in code.** Counts from files on this revision:

| Measure | Current result | Meaning and limitation |
| --- | --- | --- |
| Catalog people | 611 | Includes legacy-unreviewed values; not 611 fully sourced biographies |
| Legacy history batches/accounts | 105 batches, 105 accounts, 105 distinct person subjects | These are the extracted legacy accounts, not complete sentence modeling |
| Companion checklist | 105 checked rows, 153 unchecked rows | Some unchecked rows are collective headings; not an independently verified total of remaining people |
| Claims in those batches | 1,261 | 1,247 `NOT_REVIEWED`, 14 `REVIEWED`; approval for publication is a different gate |
| Approval blocks | 100 present, 5 absent | Presence was counted; hashes/import eligibility and production publication were not certified |
| Source-page store | 1,566 main `.md` pages and 586 `.notes.md` files | Across source directories, including Sira; not 1,566 Companion pages or a whole Siyar edition |
| New span-model Siyar units | 1 | `siyar-v4-3-az-zubayr` only |
| Pilot records | 64 spans, 14 reports, 22 statements, 35 mentions, 24 identifications, 31 assertions | Structural counts do not imply completed extraction or source review |
| Current pilot coverage | 337 sentences; 22 covered; 315 not modeled; 9 unresolved names; 0 unresolved events | `npm run model:coverage -- siyar-v4-3-az-zubayr`, pages 41–67 |
| Model validation | Passed, one work/one unit | `npm run model:check`; does not turn the 315 unmodeled sentences into coverage |

**Checked in code.** [Companion checklist](../companion-extraction-checklist.md), [works directory](../../data/works), [history batches](../../data/history/batches), [coverage implementation](../../src/lib/model/coverage.ts), and [model types](../../src/lib/model/types.ts) support these distinctions. [R0014](../records/R0014-completely-migrated-does-not-mean-every-sentence-is-modeled.md) explains why migration and modeling counts must be separate.

**Checked in code.** The last checked row in the checklist's book order is **أروى عمة رسول الله**, linked to [PR #213](https://github.com/msskzx/namaq/pull/213) and [its batch](../../data/history/batches/arwa-bint-abd-al-muttalib-siyar175/batch.json). The next rows include عاتكة, البيضاء, برة, أميمة and ضباعة. Earlier unchecked holes remain, including collective headings, أبو زيد, ابن أم مكتوم and خالد بن الوليد. Therefore “resume after Arwa” would skip existing holes. The checklist is a partial, hand-discovered index, not proof that all earlier chapters were completed.

**Checked in code.** The Arwa batch is an older **Islamweb** witness, `sourceSlug: siyar-alam-al-nubala-islamweb`, volume 2, p.272. It must not be relabeled as physical volume 2 of the later Risalah/Shamela binding. [Source-volume manifests](../../data/history/sources) and edition identity must travel together. New checks must validate this mapping, rather than applying one edition's offsets to every batch.

### What stopped and why

| Evidence checked | Result |
| --- | --- |
| [#315](https://github.com/msskzx/namaq/pull/315), [#342](https://github.com/msskzx/namaq/pull/342) | Al-Zubayr became the new span-model pilot, then was reparsed. This did not convert the 105 legacy entries |
| [Parsing plan, #337](https://github.com/msskzx/namaq/pull/337), [current plan](../plans/siyar-parsing.md) | New entries are intended to use the span model; catalog remains authoritative while the owner evaluates it |
| [#347](https://github.com/msskzx/namaq/pull/347) and [R0013](../records/R0013-a-reader-that-reads-must-also-refuse.md) | Date parsing/refusal checks were added. Unknown number wording is not permission to guess |
| [#349](https://github.com/msskzx/namaq/pull/349), [#353](https://github.com/msskzx/namaq/pull/353) | Coverage and unresolved-name diagnostics were added |
| [#359](https://github.com/msskzx/namaq/pull/359) | Event identifications, `died.age` and `office` support were added; unresolved events are now separated from people |
| [#358](https://github.com/msskzx/namaq/pull/358) | Three wives gained catalog entries. This did not finish modeling their source passages |
| [Progress document](../plans/data-model/progress.md), “Held by the owner”, dated 2026-10-05 | Explicit hold on further Siyar conversion, wording-owned-by-one-route work and a real mu'allaq chain until the owner reads/tests what exists |

**Checked in code.** History for these work/unit paths has no later completed Siyar unit after the October pilot work. The progress document still gives older counts and lists some implemented items as pending. The checked current coverage result above takes precedence over its old 38-span/21-assertion measurements. [R0017](../records/R0017-a-name-heuristic-counts-battles-as-unresolved-people.md) records an old diagnostic problem; #359 already addressed the people/event distinction. Do not schedule that fix again.

**Inferred.** The documented reason to pause broad conversion is the owner's evaluation hold and unresolved modeling choices, not evidence that the source ran out. No record inspected proves why every individual legacy checklist hole was left. This research task does not change that decision or authorize data edits, publication or marking any batch reviewed.

### Proposed final authoring and phone structures

**Checked in code.** The model already separates Work, Edition, Witness, Unit, Span, Report, Statement, Mention, Identification, Assertion, review records and approved inferences. See [types](../../src/lib/model/types.ts), [span](../../src/lib/model/span.ts), [review](../../src/lib/model/review.ts), [profile projection](../../src/lib/model/profile.ts), [plan](../plans/data-model/plan.md), [evidence design](../plans/data-model/00-evidence.md) and [time layer](../plans/time-layer.md). `CHILD_OF`, `MARRIED`, event attendance/absence, `ABOUT_AYAH`, `EXPLAINS_AYAH`, `is-sahabi`, sex, cousin and office predicates exist. The proposed generic status replacing `is-sahabi` is not implemented merely because it appears in a plan.

**Inferred proposal.** Keep that authoring model, with these explicit contracts:

| Record | Contract |
| --- | --- |
| Work / edition / witness | Separate stable IDs; exact book, editor, publisher, printing, bound volume versus printed part, and host-page mapping. A digital witness's `checkedAgainstPrint` is truthful |
| Source page | Immutable main text and separately identified editorial apparatus; edition/volume/page/host URL and content hash. Preserve the text even if no assertion uses it |
| Unit | One source entry with its exact page span, headings and ordering. Explicitly classify collective headings and contested Companion scope |
| Span | Stable location within a named main-text/notes witness, bounded offsets or anchors and text hash; printed-page crossing supported. No second hand-written “quote” as the authority |
| Report / statement / scene / turn / chain | Preserve author voice, transmitted voice, compiler remarks, explicit speaker basis, transmission wording, gaps and tahwil. Reconstruct the full entry with its original order |
| Mention / identification | Separate the printed name from an identified person/event; keep unresolved and competing identifications. Add an Agent/profile only under the existing scope rules, not for every chain name |
| Assertion | Typed predicate, subject/object IDs or literal value, exact supporting spans and attribution. Keep contradictory readings separately; absence of a predicate does not erase the source sentence |
| Review / inference | Hash the complete evidence closure; an edit lapses review. Publication approval, reviewed status and owner-approved inference remain separate |
| Not-modeled ledger | Every uncovered sentence gets a reason, such as outcome, unresolved referent or unsupported predicate. No silent omission or “complete” label based on JSON validity |

**Inferred proposal.** A phone pack should contain a **derived read model**, not the authoring directory or server models. Its manifest needs `schemaVersion`, content revision, source editions, per-file byte size/hash and dependencies. Typed tables should include people/index/aliases, titles, relationships with evidence IDs, events/battles/participations, utterances, ayah references, source accounts/page locations, hadith unit summaries and optional unit/page chunks. Keep authored and derived values distinguishable. Referential checks must validate person/subject/unit/page IDs, source status and graph edge directions before export. Keep full source pages in optional packs where rights and project policy permit; citations in the core pack must remain useful offline without fetching a book.

**Inferred proposal.** Do not import `src/lib/model` wholesale into mobile. It currently uses Node filesystem loaders, Prisma or web aliases in several layers. Extract only pure types, span rendering, conversation/chain transforms and selectors to `shared/`, with relative imports and no packages/React/database. Keep exporters, source parsing and database projection on the authoring side. Catalog and span-model values must not acquire two competing authorities on the phone.

### Ordered completion checks against the book

**Inferred plan.** The later [Siyar parsing plan](../plans/siyar-parsing.md) says new span-model entries are ready to implement and that nothing blocks them. Its restriction is on converting existing batches/catalog before the owner tests the model. Finishing the pilot first is this report's recommended sequence, not a documented blanket stop on new-entry parsing. Existing-data conversion still requires the owner's decision.

1. Reconcile the partial checklist with the full Companion headings in the cited edition. Record every heading, physical volume, printed part/page, host ID and inclusion/skip/contested decision. The scope table in [data pipelines](../data-pipelines.md) is a working index, not a newly proven book-wide total. Never use a missed `history:search` result as proof of absence.
2. Finish al-Zubayr first. Read each uncovered sentence on pp.41–67; give it a modeled span or an explicit not-modeled reason. Resolve names only where the entry, headings, nasab or permitted notes supply a basis. Classify every `model:diff` difference; do not promote source burial place to death place or derive an unsupported date. The current diff includes additional model spouses and ages, so conversion cannot be a blind overwrite.
3. Compare the digital witness with the actual printed edition, including the first/last page of each entry, every page transition, headings, notes and ambiguous numbers/names. Preserve corrections as witness differences with scan/page links. A normalized letter match alone is not proof that all words, punctuation or notes survived.
4. Require exact reconstruction of each entry's complete source text across spans/scenes, plus coverage counts and the explicit remaining-sentence ledger. Use [R0008](../records/R0008-prove-a-split-by-putting-it-back-together.md). Test deliberate missing, duplicated, reordered and cross-page text, not just valid pieces.
5. Resume small source-order batches of three to five entries, then ten when stable. Fill earlier holes explicitly. Apply the Companion/contested-scope policy and skip the two senior-Tabi'un runs described in the pipeline document. Keep narrator-only mentions as source text where the present scope forbids new graph nodes.
6. For every batch, compare all existing catalog values against source evidence, including wives, siblings, appearance and participation outcomes. Use [extraction checklist](../extraction-checklist.md), `catalog:checklist`, the scoped evidence ledger, `model:check`, `model:coverage` and `model:diff`. An existing legacy value is a research lead, never its own proof.
7. Review closure and publication approval follow their separate existing procedures. Do not set `REVIEWED` because an extraction passed tests or was approved for import. Do not auto-resolve contradictory sources, per [R0015](../records/R0015-two-sources-that-disagree-are-not-an-error.md). Dry-run projections and compare website/phone exports before applying an authorized revision.

### Short source checks and edition cautions

**Checked in source, host transcription.** Al-Dhahabi, *Siyar A'lam al-Nubala*, Mu'assasat al-Risalah, third edition, 1405 AH / 1985, Siyar **part 1, p.41**, corresponding to this repository's **physical volume 4, p.41**, heading for al-Zubayr:

> أَبُو عَبْدِ اللهِ

The same page includes:

> وَأَوَّلُ مَنْ سَلَّ سَيْفَهُ فِي سَبِيْلِ اللهِ

Links: [Shamela 10906/1467](https://shamela.ws/book/10906/1467), [stored page](../../data/history/sources/siyar-alam-al-nubala-risalah/v4/41.md), [registered edition](../../shared/sources.ts). The host page was fetched; these are short transcription checks, not a claim that all pilot pages were compared with scans. AGENTS explicitly distinguishes the Siyar's printed parts from the three preceding bound volumes.

**Checked in source, digital witness.** Al-Bukhari, *al-Sahih*, Sultaniyya printing, al-Matba'a al-Kubra al-Amiriyya, Bulaq, 1311 AH, as reproduced by Dar Tawq al-Najah, first edition, 1422 AH, **vol.1, p.19, hadith 50**:

> حَدَّثَنَا مُسَدَّدٌ قَالَ: حَدَّثَنَا إِسْمَاعِيلُ بْنُ إِبْرَاهِيمَ، أَخْبَرَنَا أَبُو حَيَّانَ التَّيْمِيُّ، عَنْ أَبِي زُرْعَةَ، عَنْ أَبِي هُرَيْرَةَ

And later on the same page:

> قَالَ أَبُو عَبْدِ اللهِ: جَعَلَ ذَلِكَ كُلَّهُ مِنَ الْإِيمَانِ.

Links: [Shamela book 1681](https://shamela.ws/book/1681), [digital book JSON with edition metadata and vol/page fields](https://files.turath.io/books-v3/1681.json). The quotation strips host hyperlink tags only. The second passage demonstrates why the compiler's remark needs its own voice, rather than another Prophetic turn. It does not verify the app's entire fixture, identify every narrator or grant a redistribution licence for modern apparatus. A scan comparison remains a proposed gate. [Earlier edition research](../plans/data-model/research/bukhari-editions.md) marks its own fetched paraphrases unverified; those were not used as classical quotations here.

**Checked in code.** The source registry already lists Siyar. It does not register these three test works as production Bukhari/Muslim/Fath sources. Since this PR may change only the report, it does not add a source. Any implementation that actually ingests a new work must register its exact edition, witness, licence and uses in `shared/sources.ts` in that same PR. The existing rule says to link out and not host a whole book; a proposal for full historical-book downloads needs an explicit owner decision about that rule and the permitted text. An old author's public-domain text does not settle rights to a modern editor's notes.

## 3. Offline data sizes and startup cost

### What was measured

**Checked in code.** Measured the results of `loadCatalog()` using UTF-8 `Buffer.byteLength(JSON.stringify(value))` and Node's default `gzipSync`, plus a direct filesystem inventory. Sizes below are bytes, not heap usage. Compression over one concatenation is an estimate, not the HTTP transfer size of an implemented pack.

| Dataset | Records | Minified JSON bytes | Gzip bytes | Suggested phone treatment, inferred |
| --- | --- | ---: | ---: | --- |
| All catalog people, including their existing claims references | 611 | 413,001 | 65,566 | Build in a small derived people pack; load on feature entry |
| Name/full-name/sex index | 611 | 88,500 | 15,771 | Build in; load when historical search opens, not from root settings |
| Authored person relations, before reciprocal projection | 742 | 95,383 | 10,586 | Build in typed relationships/evidence IDs; do not count this as a complete graph export |
| Derived nasab rows: slug, name, sex, sorted father IDs | 611; 439 unique father edges | 67,099 | 11,340 | Build in; reuse canonical reciprocal projection, not only authored `FATHER` rows |
| Battles | 43 | 68,453 | 12,741 | Build in core details where citation rights allow |
| Historical events | 49 | 37,533 | 9,534 | Build in core details |
| Utterances | 42 | 32,842 | 9,443 | Build in cited selections, preserve speakers and provenance |
| Orderings | 5 | 883 | 277 | Build in with their source qualifications |
| Three fixture hadith views | 3 | 49,032 | 7,614 | Test fixtures only; do not publish them as a verified corpus |

**Checked in code.** The nasab measurement used [catalogRelations](../../src/lib/catalog/relations.ts) to add canonical reciprocals and deduplicated `(father, child)` pairs. Counting only the 88 directly authored `FATHER` relations would omit most father lines authored as `SON` or `DAUGHTER`. There are 549 male and 62 female catalog sex values. These counts describe recorded metadata, not a fresh source verification of it. Honorifics and distractor rules must use evidence status as well as a populated field.

| File inventory, checked in code | Files | Raw file bytes | Gzip of concatenation | Caution |
| --- | ---: | ---: | ---: | --- |
| `data/catalog` | 774 | 1,059,871 | 198,633 | Authoring TypeScript/metadata, not a device payload |
| `data/history` | 2,365 | 6,497,950 | 1,423,513 | Partial source pages, notes, batches and summaries; not a whole Siyar book |
| `data/works` | 4 | 60,155 | 11,727 | One pilot's authoring records |
| `src/lib/model/fixtures/jibril` | 15 | 67,746 | 8,942 | Artificial test edition metadata and fixtures |
| `data/quiz/questions.json` | 1 | 667,896 | 76,341 | All 472 entries/statuses, not the approved-only device export |

**Checked in code.** [modelUnits](../../src/lib/modelUnits.ts) first tries database read models and otherwise calls [hadithView/listUnits](../../src/lib/model/hadithView.ts). The latter defaults to `src/lib/model/fixtures/jibril`, containing `bukhari-jibril`, `muslim-jibril`, `fath-iman-50`. Their edition files say `publisher: test`, `printing: test`, `checkedAgainstPrint: false`. [Hadith database plan](../plans/hadith-in-the-database.md) also distinguishes preview fixtures from production units. No production database was queried here; the fixture count is not a measured live production inventory. A complete Bukhari/Muslim/Fath corpus size is **unknown** because no such verified export exists in the repository. Measure its actual permitted text and indices before deciding whole-collection downloads.

**Inferred.** The people and nasab core is small enough to bundle as derived JSON, subject to actual pack and device measurements. Avoid double counting a separately listed index/relations that also appear inside people records. Include minimum exact citation selections, edition/volume/page and honest legacy/review labels in the built-in core. Do not export legacy summary prose as a classical quotation. Unsupported historical fields need source work or an explicit unavailable state; an old profile value is not evidence under this task's source rule. Larger permitted account-page selections and later hadith unit packs can be optional downloads. Offline citation reading must work for installed material; missing packs should be named and offered explicitly, not turn into blank profiles or silent network requests. A full historical source reader is a separate policy/size decision, not implied by the 1.42 MB compressed partial authoring directory.

### Reuse and required download safeguards

**Checked in code.** [shared/books.ts](../../shared/books.ts) registers built-in books and optional al-'Ukbari/al-Kashshaf downloads. [Phone books](../../mobile/src/lib/books.ts) provides on/off/downloading/failed states, document-file storage, hide/remove, a loaded cache and a basic `entries` array shape check. It is reusable UI/storage precedent. It does **not** already provide a versioned historical schema, complete reference validation, content hashes or an atomic replacement that preserves the last good version through an interrupted update.

**Inferred proposal.** Extend that manager rather than add a second downloader. Download to a temporary revision, check byte count/hash/schema/references and source manifest, then switch the installed manifest atomically. On failure keep the old revision. Reject incompatible packs with a clear state. Test cancellation, disk-full, truncated JSON, valid JSON with dangling IDs, missing dependency, corrupted saved file, offline relaunch and interrupted replacement. Removal deletes downloaded text/cache, not the person's notes, saved subjects or reader position. Installation must not require an account. The website may fetch on demand, but should consume the same versioned read-model schema.

### Startup measurements are a baseline, not a promise

**Checked in code.** [Mobile startup audit](mobile-startup-bundle-audit.md) measured an older `d27195a8` snapshot: 4,844 Metro modules, 16,573,688-byte Hermes bundle, 5,898,669-byte gzip and about 1.09 MB of fonts. Its roughly 34.3-second compile time is **not app launch time**. Its Node JSON parse measurements are **not Hermes/device cold starts**. Subsequent lazy loading and the current single Quran-text refactor mean those old bundle numbers are not this revision's measurement.

**Checked in code.** [R0038](../records/R0038-a-light-import-pulled-all-tree-data-into-the-first-frame.md), [lazyScreen](../../mobile/src/lib/lazyScreen.ts), the app route wrappers and root layout show how settings imports previously pulled tree data into the first frame. Route wrappers must remain small; implementation belongs in lazily required `screens/`. Importing one constant through a feature barrel can pull its entire pack into startup. The same risk applies to a historical search index used by home or settings.

**Inferred acceptance criteria.** Compare current release builds before/after on a low-memory Android device and an iPhone, measuring time to first home content, first people/search open, peak memory, offline relaunch and installed size. Record device/OS/Hermes/build mode and repeated cold runs. Compare root import graphs and add a guard excluding history/hadith packs from `_layout`, theme, settings and LoadingScreen. Set a numerical launch budget after measuring the current baseline; do not infer one from desktop JSON parsing. Keep historical home cards off until their pack can be loaded without blocking the existing Quran home feed.

## 4. One tree, and the limits of that reuse

**Checked in code.** The authoritative entries are [createTreePresenter](../../shared/quran/phraseTrees.ts), [compareTree](../../shared/quran/braid.ts), [web BranchTree](../../src/app/quran/branches/BranchTree.tsx) and [phone BranchTree](../../mobile/src/components/BranchTree.tsx). [oneTree.test.ts](../../shared/quran/oneTree.test.ts) checks builder paths, tree-line drawers, Branch consumers and the matrix-only quiz rule. It is partly pattern-based and does not already establish that NasabPlot or IsnadSvg uses BranchTree. [R0051](../records/R0051-one-tree-means-one-builder-not-one-drawer.md) and [R0054](../records/R0054-a-guard-on-one-feature-misses-the-copies-in-another.md) require checking every caller rather than giving a new drawer a misleading shared name.

**Checked in code.** `Branch` in [branches.ts](../../shared/quran/branches.ts) contains `words`, `ayat`, `children`, written forms, word likeness tones, ayah runs and a nested `rejoin`. Presenters and node contents assume Quran/verse semantics. A person slug is not `surah:ayah`; a proper name is not a Quran word to color by the exact/form/root rule. Existing word colors must remain exact=terracotta, form/hamza-seat=amber, root=purple for Quran content. They must not imply that two people are the same person, related or equally certain.

| Graph requirement | Reuse assessment |
| --- | --- |
| Paternal forest with shared ancestors and selected subjects | **Inferred: feasible.** Extract a generic typed node/edge presentation contract under the one tree entry; preserve `layoutNasab` semantics through an adapter. Render person labels with ordinary text and callbacks, not Quran parsing |
| Rounded boxes, curved stems, selection, paper colors, reduced motion | **Inferred: reuse the existing platform BranchTree drawing.** Add supported node content/layout props instead of a new renderer. Keep platform drawing differences behind the same contract |
| Multiple/disputed fathers and disconnected roots | **Inferred: feasible with explicit support.** Preserve all sourced candidates in details; a primary layout parent is only a layout choice. Test cycles, missing parents, alternatives and separate components |
| Spouse links and children attached to two parents | **Checked in code / inferred limit.** These are proposed sideways/cross-parent links in the nasab plan; the current nested `children` model cannot express arbitrary two-parent relationships faithfully. Extend typed edges deliberately or keep these links in the existing details/list UI until designed |
| General people/event/title/battle graph | **Checked in code / inferred limit.** Its arbitrary typed edges, cycles, relation filtering and expansion are not a rooted hierarchy. Do not silently drop edges or duplicate people to pretend it is a tree. Reuse its pure exploration/selection logic; a general graph needs an explicit supported graph mode or an owner-approved separate general-graph view |
| Isnad graph | **Checked in code / inferred limit.** [isnadGraph](../../src/lib/model/isnadGraph.ts) preserves route structure, transmission modes, gaps and repeated/shared narrators; [IsnadSvg](../../src/components/hadith/IsnadSvg.tsx) draws it today. A compare split/rejoin covers some simple shapes, not a demonstrated representation of every directed multi-route graph. Prove support for shared intermediate nodes, tahwil, edge labels, gaps and crossing routes before calling it reusable |

**Checked in code.** [tabaqa.ts](../../src/lib/model/tabaqa.ts) contains hand-authored narrator identities, layer numbers and extra tail links for the two fixture units. The table itself carries no per-value edition/page citations. Its presence is not source verification of narrator identity, layer or chain continuity. `isnadGraph` also represents a gap as an `…` node today. **Inferred:** the production port must source these annotations or leave them unset; represent a real textual gap with an explicit edge annotation or longer connector in the shared tree, rather than copying a dot/placeholder node. Test source fidelity and identity before using layer numbers to judge quiz distractors.

**Checked in code.** The [isnad-row plan](../plans/hadith-chain-rows.md) already records Taqrib al-Tahdhib edition/page research and explicitly calls the current implementation a demo, with the cited stored version not built. Reuse that research as a checklist, not as fresh source verification. **Inferred:** source-backed narrator layers would need the planned `RIJAL` genre, `tabaqa` predicate, cited units and identifications before replacing the demo table. Creating narrator profiles beyond Companions also needs an explicit scope decision; it is not an automatic consequence of porting hadith links.

**Inferred proposal.** First add a small generic forest contract with discriminated `quran` and `person` payloads, stable identity, labels, selected state and typed relations. Keep the Quran adapters and all existing callers intact. Add topology fixtures for a shared ancestor, two disconnected families, a daughter, alternate father assertions, a cycle and a very wide descendant generation. Compare web/native structural output. Guard all tree drawers, including NasabPlot and IsnadSvg during their migration, rather than weakening the existing guard or adding them to an unexplained allowlist. Do not build wives or a second native nasab renderer to bypass this step.

**Inferred.** Large graph interaction is separate from tree appearance. Use bounded incremental descendant expansion, virtualized subject lists and accessible text chains. Avoid a force simulation during app startup. On a phone, pan/pinch and node taps must coexist with Expo swipe-back, card swipes, scrolling and screen-reader navigation. Verify those interactions on devices. The initial deliverable can preserve every relationship as a list while general graph mode remains a separately approved PR.

## 5. Links, source reading and search

| Link or behavior | Checked current state | Inferred migration contract and test |
| --- | --- | --- |
| Person ↔ ayah | Profile AyatGroup and model `ABOUT_AYAH`/`EXPLAINS_AYAH` link people to ayat; reader already supports native ayah navigation | Store only `surah:ayah[:word]` plus the relationship's evidence ID. Build reverse indices once; show “about”, “explains” and disputed claims distinctly. Test both directions, multiple people per ayah and invalid references |
| Person ↔ hadith | `modelUnitPeople`, ProfileHadith and chain/speaker links distinguish isnad, speaking and mentioned roles | Shared role selector plus native typed unit/person intents. Unknown or unresolved narrators remain readable text. A chain name should not create a full Companion profile automatically. Test same name/different identity and absent profiles |
| Person ↔ event/battle/timeline | Profile Timeline, events/battles APIs, participation versus outcome distinction | Use the same typed dates and source-attributed claims. No invented event attendance, precision, age or Gregorian conversion. Test competing dates, missing years and source order |
| Person/title/general graph/nasab | Stable slugs, graph URL state and repeated nasab subject parameters | Central typed navigation serializer/parser; map old web links to native state. Back restores selected subjects, filters and expansion. Test unknown/removed slugs and cold-start links |
| Person/claim ↔ printed source page | Historical SourceAccountReader, SourceContents and `/sources/[slug]` use account, edition, volume and page anchors | Reuse app book-reader navigation/chrome but add a historical-page adapter. Keep physical volume and printed part distinct. Offline citation always shows exact selection and bibliographic location; installed pages open the right anchor |
| Hadith ↔ commentary/parallel report | `explains`, `explainedBy`, `sameEvent` are distinct links | Preserve explicit basis spans and direction. Same event does not mean identical text, grade or chain. Test return navigation without losing mode or page |
| Search everything | Current web and phone universal search lacks historical people/hadith/book text; PeopleSearch/GraphSearch cover separate subject discovery | Add typed groups for people, titles, historical events/battles, hadith units and installed source text to both platforms. Reuse Arabic normalization and ranking, not a new search algorithm per screen. Never label prophet-story events as historical events accidentally |
| External sources | Platform ExternalLink and its guard already exist | Every online host link uses ExternalLink/openExternal and announces leaving Namaq. Offline users retain a useful citation even if opening the host fails |
| Personal state | Notes/saved/forgotten and quiz state are already local | Namespaced historical bookmarks, last position and quiz progress remain offline with no login; removing/replacing a content pack does not erase them |

**Checked in code.** Relevant entries are [modelUnitPeople](../../src/lib/modelUnitPeople.ts), [source components](../../src/components/sources), [phone navigation intents](../../mobile/src/lib/ways.ts), [searchAll](../../shared/quran/searchAll.ts), [subjectSearch](../../src/lib/subjectSearch.ts), [phone book screen](../../mobile/src/screens/book.tsx) and [ExternalLink guard](../../src/components/common/ExternalLink.test.tsx). The book screen may reuse reading controls, but existing Quran book offsets are not arbitrary historical page anchors. [R0052](../records/R0052-a-printed-page-is-found-again-by-its-letters.md) explains recovery of page locations; a recovered alignment must not invent missing printed pages. [R0040](../records/R0040-a-dump-page-gap-is-not-always-lost-text.md) also requires distinguishing absent page numbers from lost text.

**Inferred search design.** Search core names/aliases/subjects offline from the built-in index. Search full text only in installed, permitted packs and state that scope. Build compact per-pack indices off-device; defer loading them until a search reaches that category. Test Arabic variants, vocalization, two people sharing a name, exact versus alias matches, group ordering, empty results, removed packs and cancellation/stale results during fast typing. Search results should restore page/span context, not just open the book's first page.

## 6. Quiz rework: inventory, samples and general rules

### Existing families and what the phone has

**Checked in code.** [Question types](../../src/lib/quiz/types.ts) define ten historical families. [Generator](../../src/lib/quiz/generate.ts) reads the catalog, history claims and Prisma people/titles. [Assembler](../../src/lib/quiz/assemble.ts) selects approved bank rows. [Phone quiz](../../mobile/src/lib/quiz.ts) limits solo kinds to `BRANCHES` plus Quran `CHOICE_TOPICS`; it does not bundle the historical bank or run that server generator offline. `PERSON_CIRCLE` is a historical subject scope, not an eleventh question family. No hadith family exists in the registered generator/bank.

**Checked in code.** The full bank contains 472 entries, with 243 approved. All 22 `AYAH_LINK` entries are retired. The nine active families are below. One representative per family was read, plus the explicit problematic examples afterwards. Samples describe the artifact and its distractors, not a certification of historical truth.

| Family | Approved | Sample key or subject and what was checked | Result |
| --- | ---: | --- | --- |
| `KUNYA` | 21 | `KUNYA:PERSON:aban-ibn-said:kunya:أبو الوليد`; asks “ما كنية أبان بن سعيد؟”, four kunya choices | Checked in code: no full answer in this sample prompt. Generator uses a broad kunya pool, without an invariant against aliases revealing the answer |
| `PERSON_TITLE` | 22 | Abd al-Rahman ibn Awf / `the-six-of-the-shura`; distractors include أحمد, سيد ولد آدم, المصطفى | Checked in code: same storage kind “title”, but cohort membership versus personal Prophetic epithets makes the correct choice conspicuous. Inferred quality defect: require semantic title class/difficulty, not merely sex |
| `TITLE_HOLDER` | 22 | `TITLE_HOLDER:TITLE:al-qarinayn:titles:abu-bakr-as-siddiq` | Checked in code: generator excludes known other holders from distractors and filters known sex. A collective title is not proof of a unique holder; wording and all true holders need review |
| `VIRTUE_HOLDER` | 59 | Aban ibn Said; passage mentions “هو وأخوه خالد”, while Khalid ibn Said is an option | Checked in code: passage gives kinship clues and combines several claims; no full-name leak in this sample. Broader alias/name leaks confirmed below |
| `RELATION` | 63 | Abdullah ibn al-Harith / `HALF_BROTHER` / Rabiah ibn al-Harith; other choices include a remote ancestor and another Ibn al-Harith | Checked in code: three same-sex alternatives do not establish era compatibility or exclude patronymic hints. No uniform era/alias rule exists |
| `AYAH_LINK` | 0 | Retired Abd al-Rahman ibn Awf / `48:18`, with numeric-reference choices | Checked in code: all 22 retired; do not re-export them because the type still exists |
| `AYAH_REVEALED_ABOUT` | 5 | Aisha / `24:11`, prompt “في من نزلت هذه الآية؟”, four women as options | Checked in code: this sample's choices fit sex. Must preserve the exact ayah and distinguish source-supported revelation-about from mere biography association |
| `BATTLE_HIJRI_YEAR` | 25 | Badr al-Ula, choices 2, 36, 20, 16 AH | Checked in code: options are year values. Inferred quality defect: broad year pool makes the correct era conspicuous; source date/precision still needs validation |
| `EXCUSED_ABSENCE_REASON` | 6 | Amr ibn al-Jamuh / Badr; choices are cited absence passages for different people | Checked in code: options share a broad reason kind but vary greatly in length and person-specific wording. Some clauses imply a spouse or different life circumstance. Need homogeneous, source-supported selections and ambiguity checks |
| `EVENT_HIJRI_YEAR` | 20 | Isra/Mi'raj, choices 1 before Hijra, 11, 6, 18 AH | Checked in code: this sample offers only one pre-Hijra option. Inferred quality defect: distractor-era cue and a need to preserve competing/qualified dates, not assert this date is historically settled |

### Automated checks and their limits

**Checked in code.** Read-only script over all **243 approved entries**, using `promptArabicOverride` when present:

- Normalized Arabic by removing vowel marks/tatweel, folding alif forms and final alif-maqsura, stripping punctuation and collapsing whitespace. Found **0 full displayed-answer substrings** in effective prompts.
- Compared `(normalized prompt, sorted choice IDs, correct ID)`. Found **0 exact duplicate tuples**. This is a narrow duplicate check, not proof that questions do not ask the same fact in different wording/direction.
- Compared catalog sex for answer versus person distractors in `RELATION`, `TITLE_HOLDER`, `VIRTUE_HOLDER`. Found **18 flagged entries**, comprising **13 virtues and 5 relations**, with **0 title-holder flags**. Flags identify pool differences, not 18 independently proven logical errors. Of the five relation flags, three are `PACT_BROTHER`, one `CALLED_TO_ISLAM`, one a cousin prompt explicitly allowing male or female cousins.

**Inferred limit.** Different sex is not always an invalid distractor. The cousin prompt says “ابن عم ... أو ابنة عمه”, and a call-to-Islam relation can involve either sex. Conversely, an explicit male role or a female-only quotation may make a mixed pool an obvious giveaway. Test the **question's role and wording**, rather than rejecting every mixed-sex question mechanically. No complete source-verified era metadata exists for a meaningful automated era pass. Exact duplicate counts must not be presented as a semantic duplicate audit.

### Concrete remaining problems

| Finding | Evidence and status | General fix and regression test, inferred |
| --- | --- | --- |
| Short-name leak survives the full-answer check | Checked in code: approved `VIRTUE_HOLDER:PERSON:jaafar-ibn-abi-talib:virtues:jaafar-ibn-abi-talib` asks a passage containing “لأنا بقدوم جعفر أسر مني بفتح خيبر” and “أفضل من جعفر”; the correct choice is جعفر بن أبي طالب | Match source-attributed names/kunyas/aliases and identifying subspans, not just the full display label. Reject or select a complete non-revealing quotation. Never silently rewrite the author's words. Test this entry and an unrelated person also named Jaafar to avoid careless substring rejection |
| Patronymic pair reveals the answer | Checked in code: approved Saad ibn Khaythamah virtue prompt says “قَالَ خَيْثَمَةُ لابْنِهِ سَعْدٍ”; answer سعد بن خيثمة | Detect identity-bearing named relations in the prompt. Reject a question that spells out its answer via father/son labels. Test direct, inverted, vocalized and alias forms |
| Wrong sex in explicit brotherhood questions | Checked in code: approved `PACT_BROTHER` questions for Iyas ibn al-Bukayr, Khalid ibn al-Bukayr and Nawfal ibn al-Harith include, respectively, Umm Haram, Zaynab bint Khuzaymah and Ruqayyah bint Muhammad | Classify the expected answer role explicitly and restrict distractors to supported compatible people. Unknown sex cannot silently mean “eligible”. Test every registered relationship type and inverse, including a missing role-map entry |
| Female-answer virtue has three men as alternatives | Checked in code: approved Khadijah virtue question uses the passage ending “ورزقت منها الولد”, answer خديجة بنت خويلد, distractors غالب بن فهر، هاشم بن عبد مناف، الحارث بن نوفل | Use quote-aware role constraints and plausible same-class candidates; test female speaker/subject passages and unknown metadata. Do not invent gender/era facts merely to fill four choices |
| An approval is not proof of verbatim source text | Checked in code: Jaafar's displayed prompt joins several claims; the bank wording “أشبه خلقك خلقي وخلقك خلقي” differs from its cited excerpt “أَشْبَهَ خَلْقُكَ خَلْقِي، وَأَشْبَهَ خُلُقُكَ خُلُقِي”. Historical claims remain `NOT_REVIEWED` | Export exact source-span selections with explicit omissions and full citations, not `virtues` prose as if it were a quotation. Test byte/span provenance, dropped words, duplicated clauses and edits that lapse approval. Re-review the question after a source-text correction |
| Era and semantic-kind clues remain | Checked in code: the date and title examples above come from broad pools; generator has no general attested-era/semantic-class policy | Choose source-supported alternatives of comparable period and kind; where metadata cannot support that, skip or mark a deliberate easy difficulty. Test a cohort title against personal epithets, a pre-Hijra question with one pre-Hijra option and a same-era pool shortage |
| Semantically repeated or mutually answering questions are not covered by exact dedup | Checked in code: stable keys deduplicate identical generated candidates; [R0029](../records/R0029-questions-in-one-quiz-can-answer-each-other.md) and current Quran mixing address repeated ayah exposure. No equivalent canonical historical fact/inverse/alias exposure rule is present | Assign a canonical fact key and an exposure key to predicate/direction/inverse and shared evidence. Do not put “X's title?” beside “Who held title Y?” when one reveals the other. Test differently worded prompts, inverse relations and source-quote overlap |

**Checked in source, repository transcriptions, not a fresh host/scan comparison.** The Jaafar evidence is in [its batch](../../data/history/batches/jaafar-ibn-abi-talib/batch.json), and attributes the exact clauses to *Siyar*, Risalah third edition 1405/1985, Siyar **part 1, pp.214 and 216**, physical **vol.4**, [Shamela p.214](https://shamela.ws/book/10906/1640), [p.216](https://shamela.ws/book/10906/1642):

> أَشْبَهَ خَلْقُكَ خَلْقِي، وَأَشْبَهَ خُلُقُكَ خُلُقِي، فَأَنْتَ مِنِّي وَمِنْ شَجَرَتِي

> لأَنَا بِقُدُوْمِ جَعْفَرٍ أَسَرُّ مِنِّي بِفَتْحِ خَيْبَرَ

The Saad evidence is in [its batch](../../data/history/batches/saad-ibn-khaythamah/batch.json), the same edition, Siyar **part 1, p.266**, physical **vol.4**, [Shamela](https://shamela.ws/book/10906/1692):

> فَأَسْرَعُوا، قَالَ خَيْثَمَةُ لابْنِهِ سَعْدٍ:

These are evidence of a leak and of a mismatch between the bank and its stored citation. They do not independently authenticate the underlying reports or certify a fresh printed-edition comparison. Exact quotations may contain the answer; fidelity and quiz suitability need separate checks.

### Earlier fixes: done versus partial

**Checked in code.** [Gender fix PR #139](https://github.com/msskzx/namaq/pull/139), current [generator](../../src/lib/quiz/generate.ts), [bank](../../src/lib/quiz/bank.ts) and [review policy](../quiz-question-review.md) show:

- Done: recorded sex is available for the current 611 catalog people. Several relation roles and title-holder pools use it. Person-title questions exclude already-held alternative titles; title-holder questions exclude other known holders. Candidate values are deduplicated, three distractors are required, and stable keys merge repeated evidence.
- Done: assembly reads only `APPROVED` bank rows. Fingerprints invalidate changed generated questions; reviewer fields are required. Retired AYAH_LINK entries do not belong in the active export. These gates are worth retaining.
- Partial: `VIRTUE_HOLDER` still draws from unrestricted people; unknown-sex paths and unmapped relationship roles can fall back to broad choices. Three explicit brotherhood examples above remain approved. The old PR's counts are historical, not the current catalog or bank counts.
- Partial: the generator treats a non-disputed claim with at least one citation as eligible. That does not require `reviewStatus: REVIEWED` or prove the citation supports the answer. A bank question's editorial approval and the evidence's scholarly review are distinct states.
- Partial: choice-value uniqueness and exact fingerprints do not enforce normalized display-label uniqueness, alias-proof prompts, semantic fact uniqueness, era fit or exactly one defensible answer. Excluding catalog-known true targets is useful but not proof that every other option is false in an incomplete corpus.

**Inferred shared validation contract.** Each exported question needs a canonical answer ID, compatible answer kind/role, exact source-span basis, source and question review metadata, versioned fingerprint and exposure keys. Normalize labels to reject visually duplicate choices while retaining their original text. Close known forward/inverse/equivalent relations before selecting alternatives. Where several answers remain possible, narrow the question with a source/unit/route constraint or exclude it; do not guess falsehood from missing data. A changed source closure must require re-review even if the displayed question text stays the same. Batch validation should produce a review queue rather than silently replace a bad question.

### Proposed hadith question types, not existing functionality

| Proposed type, inferred | Leak or ambiguity risk | General gate and test |
| --- | --- | --- |
| Identify an explicitly stated narrator/collector in a specified route | Showing the chain or a speaker label names the answer; narrator and collector are different roles | Hide identifying labels in the question state; bind it to one verified work/unit/route and exact span. Distractors must have the same role and attested compatible era. Test alternate routes and repeated names |
| Identify a speaker from an explicitly attributed turn | Bubble heading, profile link or preceding turn can give the answer; bare `قال` may be unresolved | Ask only where a checked speaker basis exists. Hide the heading/link until answering. Skip ambiguous identifications; test a contested turn and one inferred from an approved basis |
| Complete the next exact matn segment | Authentic variants may make multiple answers true; invented Arabic alternatives breach the source rule | Specify edition/unit/route and use exact, cited text selections for all choices. Do not generate Prophetic wording. Test two valid variants, missing text and a page crossing |
| Identify work/kitab/bab for a quoted selection | Visible page header, citation or book link gives the answer; shared wording may occur in several books | Conceal the answer-bearing metadata before submission and constrain the question to a checked set. Skip a selection whose alternatives are all true. Test the same hadith appearing in Bukhari and Muslim |
| Identify an explicitly printed transmission formula, tahwil or next chain step | Graph position/labels can reveal it; a chain gap is not proof of meeting or authenticity | Ask only printed features, never derive hadith grade or narrator meetings. Same-kind alternatives, one scoped route, exact cited formulas. Test gaps, shared nodes and tahwil routes |

**Inferred recommendation.** Start with one owner-selected hadith family after a small real source unit is checked. Do not ship all five just because they can be named. Some may be too easy or require too much verified metadata to make fair distractors. There are no existing hadith bank samples to certify; that absence is itself a planning constraint.

**Checked in code / inferred integration.** Reuse the current quiz state machine, shared grading/mixing/settings, persistence and native/web question UI. The existing [one-tree guard](../../shared/quran/oneTree.test.ts) now explicitly forbids tree rendering in quizzes. New people/hadith questions must be **matrix-only**, with neutral text before submission and answer colors/marks only after answering. Add types to the shared quiz registry and use the same UI; do not port the web historical generator's database calls into mobile or build a hadith-specific quiz screen. Test no answer colors, titles, links, accessibility labels or source panels that reveal the answer before lock; verify marking, explanations/citations, resume and offline evidence afterwards. Quran ayat in new questions go through the Quran text module; [oneQuranText](../../shared/quran/oneQuranText.test.ts) permits no new bypass, and its baseline may only shrink.

## 7. PR-sized implementation sequence

All steps below are **inferred proposals**. This report authorizes none of their data publication, review-state changes or schema choices. Preserve the existing five-tab structure until the owner decides placement. Each implementation PR should keep website behavior aligned with the app, run the AGENTS checks and an independent review, and have a bounded acceptance test rather than promise a whole corpus.

| Order and PR | Reuse and bounded deliverable | Tests and completion gate | Owner decision needed |
| --- | --- | --- | --- |
| 1. Agree source/review and navigation boundaries | Existing five tabs, books manager, source registry and span-model ADRs. Record which supporting historical routes ship and which stay web-only; no bulk parsing yet | Route-to-native destination checklist, source/licence manifest review, current release startup baseline | Lift or retain Siyar conversion hold; core versus optional packs; whole-book policy; public legacy/unreviewed labels; location of biographies/hadith without an accidental sixth tab |
| 2. Define and export one offline historical read model | Catalog authority, canonical reciprocal relations, existing projection selectors; pure DTOs/selectors in `shared/`, server exporter outside it. Produce people/title/event summaries, links and exact citation selections | Deterministic export/hash, no Node/Prisma/React in shared code, all IDs resolve, reciprocal father-edge regression, no source text synthesized from profile prose | Whether unreviewed legacy values are included with labels; do not silently impose a new reviewed-only policy |
| 3. Add pack support to the existing books manager | Existing download states/files/cache, extended manifest and temporary-install switch. Add source metadata and optional account-page selections, not a second store | Corruption/truncation/upgrade/offline/relaunch/removal tests; retain notes and last good pack; installed size measurement | Exactly which permitted excerpts ship built in versus optional; remote full-book links versus any approved download exception |
| 4. People index and profile core | Native lazyScreen wrappers, lists, TopBar, existing theme/controls; shared profile selectors. Names, titles, appearance/virtues, exact citations and honest status labels | Offline first open, title/search filters, pagination or virtualized equivalent, RTL/English, large text, missing data, stale rapid searches, deep link and Back | Approve screen sketch and navigation placement; use app style instead of copying old gray web cards |
| 5. Historical source-page reader adapter | Existing native book reader controls/position, source account/edition/page selectors; exact anchored selections with main text/notes distinction | Correct physical volume/printed part, multi-page anchors, missing/removed pack, quote jump/return, page reconstruction and rights manifest | Source apparatus availability and scan-check standard |
| 6. Profile links, timelines, events, battles, titles and utterances | Existing timeline/date/attendance semantics, typed intents and catalog selectors; add reverse person/ayah and event indices | Competing/unknown dates, absence versus attendance/outcome, multiple ayah/person links, typed event versus prophet-story event, no dangling navigation | Whether all supporting detail views ship together or a deliberately scoped first release |
| 7. Generic person forest through the one tree entry | Existing BranchTree drawing and pure nasab layout, typed payload adapter; web and phone nasab adopt the same contract | Every existing Quran tree test/guard stays green; nasab identity/topology fixtures; rounded nodes/stems, RTL, no Quran word colors on names; device pan/back/scroll tests | Approve generic contract and any departure from the old nasab drawing; wives remain outside this PR |
| 8. General relationship exploration | Existing pure graph transitions/expansion/filtering and stable IDs; start with accessible connection lists, then an explicitly approved graph mode | Cycles/multiple edge kinds, expansion limits/history, evidence lookup, offline graph consistency and low-memory device checks | Whether a full interactive network is required for first release; graph mode versus separate general-graph view |
| 9. Search all installed content on both platforms | Existing Arabic search normalization, subject suggestions, group rendering and typed navigation. Add historical groups and optional per-pack text indices | Arabic/alias/ranking fixtures, ambiguity, scope labels, stale-result cancellation, removed packs, target/page restoration | Which default groups appear and whether optional book text participates automatically |
| 10. Correct and export the historical quiz bank | Existing review workflow, fingerprints, approved-only assembly and shared matrix UI; add canonical fact/exposure/role/source-closure validators before exporting | All ten families explicitly handled including retired AYAH_LINK; leak examples above, mixed-role/gender/era, duplicate labels/facts, multiple true answers, no pre-answer reveal, offline resume. Run quiz validation and projection dry-run after authored bank changes | Question wording/review authority, source-review publication threshold, acceptable difficulty/era rules |
| 11. Finish the Siyar pilot and reconcile the source index | Existing spans, coverage/diff/date refusal, checklist and source manifests; one pilot before broad conversion | Printed scans versus witness, whole-entry reconstruction, every sentence accounted for, all diff rows classified; no review status set by implication | Approve conversion of existing records after testing the pilot; settle unresolved predicates/identifications, contested scope and generic status/companion-title change |
| 12. Continue Siyar in small reviewable batches | Same authoring model and export; each PR contains three to five, later ten source-order entries and its checklist/coverage update | Full extraction checklist and legacy ledger, source-page transitions, citations, honest unmodeled counts, lapsed-review checks, projection dry-runs and pack diff | Approval/review of each batch remains separate; unresolved source/schema issues go back to owner |
| 13. Ingest a small real hadith source unit | Existing span/scene/chain/voice/edition model, exact printed-source comparison and source registry. Replace fixture-only assumptions in a permitted pilot pack | Complete reconstruction, Bukhari/Muslim variants kept separate, compiler remarks separated, explicit identity/speaker basis, print citation/rights checks. Fixture metadata cannot pass production validation | Work/edition/witness/collection scope, permissible notes, publication/review policy; real mu'allaq work remains held unless lifted |
| 14. Hadith index/unit/profile links and chain presentation | Shared pure HadithUnitView transforms, native source reader and existing common tree only where topology is supported; full text and conversation modes, commentary/parallel links | Offline installed/missing units, unresolved names, source/voice fidelity, role-specific profile links, DAG/tahwil/gap fixtures, phone gestures and accessibility | Approve any general DAG extension before a renderer; choose default presentation and pack size |
| 15. First hadith quiz family and release verification | Same matrix UI and validation pipeline as people quizzes; one small reviewed question set | All risk gates above, no invented text/distractors, route-specific truth, hidden labels, accessibility, offline scoring and release cold-start/memory comparison | Choose first family or defer quizzes until enough plausible cited alternatives exist |

**Inferred design acceptance.** New screens use the app's paper tokens in both themes, right-aligned Arabic source text, suitable vocalized-text line spacing, existing icon controls with accessible names, the existing shrinking top bar and navigation. Toggles keep the on knob on the right regardless of text direction. Use content/status labels with colors rather than an unexplained new palette. Quran text uses its shared module at the appropriate page/ayah/copied level; source-book quotations remain the documented exception. Reuse the current matrix answer marks, never pre-answer word-match colors. Screenshots/device renders should verify the implementation PRs; this research PR does not claim render parity.

## Method, reproducibility and validation

**Checked in code.** Route inventory used `rg --files src/app | rg '/page\.tsx$'` and the matching Expo route inventory. Sizes were calculated without running database imports, seeding, source ingestion or database projection. Temporary measurement scripts were outside the repository. `loadCatalog()` produced the catalog counts. `catalogRelations()` supplied reciprocal nasab edges; deduplicating father pairs yielded 439. `listUnits()` and `hadithView()` were called with their default fixture root solely to measure that fallback. File inventories excluded directories and compressed the concatenated file bytes; they are not proposed deployment archives.

Read-only model checks run:

```text
npm run model:coverage -- siyar-v4-3-az-zubayr
  337 sentences; 22 covered; 315 not modeled; 9 unresolved names; 0 unresolved events
npm run model:check
  Checked 1 unit in 1 work; passed
npm run model:diff -- az-zubayr-ibn-al-awwam
  Inspected the source/catalog differences; no projection or edit applied
```

**Checked in code.** The quiz scan covered all 243 approved entries for the narrow full-answer/tuple/sex checks described above, then read representative questions across all ten declared families and the named defects. It did not prove every distractor false from classical sources or every prompt free of indirect hints. The current bank's metadata and old review decisions were not changed.

**Checked in code.** Independent review corrected two points before submission: the exact external settings destinations and the distinction between new-entry parsing and held conversion of existing Siyar data. Final verification on `b9039cd2`: `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` all passed. Vitest reported 446 passing files, 4,610 passed tests and one skipped test. The production build used the local preview PostgreSQL instance. All relative report links resolve, and the staged diff contains only this file. No UI test is required for a report-only change; future screen changes require the repository's UI checks and native device coverage.

Records that changed this plan: R0008 for reconstruction, R0013 for refusal rather than guessed dates, R0014 for coverage versus migration, R0015 for contradictory sources, R0017 for current people/event diagnostic separation, R0029 for cross-question leaks, R0038 for startup import boundaries, R0040 and R0052 for source-page fidelity, R0051 and R0054 for one tree and complete guard coverage.

## Open questions for the owner

All are **inferred decision points**, not blockers to submitting this research report.

1. May existing-data Siyar conversion resume, or should the explicit October hold remain until the pilot's source/diff review is complete? New-entry parsing is permitted by the later plan; pilot-first ordering here is a recommendation. Who can approve publication, mark source claims reviewed and approve inferences?
2. Should the phone show current legacy/unreviewed values with clear status, as the existing visibility policy permits, or use a stricter initial pack? What source-review threshold applies to quiz eligibility separately from profile visibility?
3. Where should tarajim/hadith live within the current five-tab app? Which supporting views must ship in the first release, and should the legacy themes route, informational pages and experiments directory remain web-only?
4. Which exact historical/hadith editions and digital witnesses may be distributed, and may permitted full historical books be downloadable despite the current “never host a book in full” rule? Are modern editor notes excluded or separately licensed?
5. Is a source-checked set of selected accounts/units sufficient initially, or is a whole collection required? Whole-collection size and index cost must be measured after choosing the source. Should narrator profiles expand beyond the present Companion scope, and should the planned cited RIJAL/tabaqa model be implemented in this release?
6. Should `is-sahabi`/the companion title become a general cited status now, or remain during this migration? A title/edge change also requires rechecking unified graph ranks/layout, not just profile labels.
7. Is a paternal forest plus cited alternative-parent details sufficient for first nasab release? Are per-node descendant expansion, wives/two-parent links or a full general network required immediately?
8. What topology contract should the shared tree accept for non-Quran nodes and isnad DAGs? Approve explicit edge support before claiming all chain layouts fit the current compare rejoin model.
9. Which installed-book text should search by default, and how should users distinguish “not downloaded” from “no result” without a login?
10. Which single hadith quiz family should launch first, and what era/role/difficulty standards should govern distractors when attested metadata is insufficient?
11. Which Android/iPhone devices and measured launch/memory budgets will gate the first historical pack release?
