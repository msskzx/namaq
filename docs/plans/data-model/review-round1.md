# Review, round 1: plan.md and research.md against owner-goals.md

Verdict: revise. The owner's decisions are applied almost everywhere. The problems are a few internal contradictions, gaps in the data model for the pilot, and overstated or unsafe claims in research.md.

## 1. Owner decisions

Applied and consistent: Muslim in scope (1, 2.2, 3.2, 6.2 phase 8); SHARH genre with Fath al-Bari as one sharh among many (2.2, 2.4); per-source filter, default all, never silent (2.11); Turns (2.5, 2.5a); timeline between-events rule (2.13); R2 (P5, 2.8, X6, grep finds no NAMAQ or Gloss outside "dropped" notes); R1/R1a (2.10, 2.11, P7, P11); P9 as a review gate (P9, 2.10, X12); all qira'at and Qur'an cited by surah and ayah (2.15); the Siyar bulk conversion deferred (6.2, X10).

Problems:

- **Inference path is not "owner-approved, never agent-inserted" in the data.** 2.13 says the agent writes a report and the owner approves, but nothing says how an approval reaches the files. Who inserts the derived Assertion after approval, and where is the approval recorded? 2.7 `Assertion.status` has no field for it.
- **Turn.inferred** (2.5) points to an `InferenceId` that is defined nowhere. Turn also has both `speakerBasis` and `inferred`, which overlap.
- **2.14 "reaches its span in one step"** is not met for a Turn whose speaker is inferred: the premises are the alternation, with no span. State which spans the premises are.
- **Fath al-Bari as a basis** (2.6) is correct, but `COMMENTATOR_NOTE` identifies the stranger as Jibril by a commentator's gloss. The owner said the app adds no knowledge; say the label shows the sharh as the source. Section 3.2's phrase "which is why a sharh is useful before any rijal work exists" is the planner's rationale, not an owner decision.

## 2. Internal consistency

1. **6.2 phase 0** says "Q1, Q5 decided later" while section 8 item 5 says Q5 is "to be decided later", but owner-goals says Q5 is decided (publish, R1). Fix section 8 item 5 and 9's "Decisions" table.
2. **X11** says "Shamela only until the owner changes it", but section 8 items 6 and 7 are open research, and research.md Z2 finds Shamela grants no re-hosting. State that preview may use Shamela and public release is blocked (E1 does, X11 does not).
3. **E3** points to "owner-goals gap 4" for the quiz plan. No such plan exists, and G6/G7 are covered nowhere else. Say plainly that quizzes are out of scope for this plan.
4. **2.1 diagram** lacks `Premise` entities that 2.12 lists, and shows `Review` against Assertion only, while 2.10 reviews Report, Statement, Identification and Membership.
5. **6.2 phase 2** says the filter requirement is "written down" while 2.11 already holds it. The phase 2 acceptance row should name where.
6. **Section 9** still lists reviewer responses referring to the old phase numbers (rows for "phase 3 rollback", "phase 5 cost", "phase 6"). The text says "new phase 4" in one and old numbers in others. Renumber or mark them as "old numbers".
7. **2.10 Carried reviews** versus **P9**: the plan says carried `reviewStatus` never counts, but AGENTS.md says marking reviewed needs the owner's explicit instruction. 2.10 says this; P9 and X12 should too.
8. **Section 7** has no row for the pilot's measured outputs that phase 7 and the storage estimate depend on ("measured in phase 3"). Phase 3's acceptance lists only resolution time. Add segment decisions and render size.

## 3. Technical soundness

- `value.derived` plus `premises: AssertionId[]` is the right shape for an assertion-level inference. It is too narrow for two cases the plan itself uses: a Turn's speaker (premises are Turns and spans, not Assertions) and a timeline placement (premises are two events, which may be Agents, not Assertions). Allow `premises: (AssertionId | SpanRef)[]` or give Turn its own derived field.
- `DerivedValue` is not defined. A closed type per predicate is needed, or a derived value can carry free text, which breaks P1.
- `Turn.span` as a single `SpanRef` conflicts with the "contiguous run" rule (2.3) when a turn's words are interrupted by narration (`قَالَ ... قَالَ`). Allow `spans: SpanRef[]`, as Statement does.
- `Turn` duplicates part of `Statement` (words plus speaker). Say why a Turn is not a Statement with a speaker Mention, or merge them. Otherwise the same words may exist twice and disagree.
- `SharhLink` fits the Unit model. Its basis "the numbering map of the edition" is not a span, which breaks P2 as written. State what the map is evidence of, or require the lemma span.
- Review store: `data/reviews/` is fine, but a review keys on a revision hash that includes rendered text. Two environments rebuild from the same folder, so say how prod learns a record is reviewed while preview holds the same record unreviewed: one file, one flag per record, or one database per environment built from a filtered file set. 2.12 shows only one pipeline. The data flow files to preview DB to prod DB is not drawn.
- Neo4j in prod "holds only reviewed" while derived layout and centrality (AGENTS.md `graph:layout`) are computed over every edge. Prod ranks would differ from preview. Say which graph the layout runs on.

## 4. Pilot readiness

Not sufficient to start the pilot as written. The one-companion al-Zubayr conversion is nearly ready. The thin slice is not.

(a) Blockers needing research or an owner answer:

1. A verified witness text for Bukhari 50 and the Muslim hadith, compared with print. research.md says none has been checked; the plan's phase 1 acceptance depends on it.
2. The Muslim hadith: which number and which edition numbering. Not identified anywhere.
3. Which Fath al-Bari entry explains Bukhari 50 and whether its text names the stranger. Z5 only verified the book page exists. The identification basis is unproven.
4. The owner's approval of each bare-`قَالَ` turn inference, which cannot be prepared until the spans exist.
5. Whether `Turn` may exist before a speaker is approved (the plan says yes, "speaker not stated"). The owner should confirm that view is acceptable.

(b) An implementing agent can decide: `InferenceId` and `DerivedValue` shapes; Turn versus Statement; the `data/reviews/` file format; the `matchSpan` module layout; file names for the slice; the inference-reports file template; whether the conversation view is a page or a panel.

## 5. research.md

- **Overstated**: "Verified" on rows 9 and 10 means a summarizer said the page exists. It verifies nothing about the text. Rename the column to "page seen" and drop the word "verified" from the Z1 table.
- **Shamela terms** (Z1/Z2) were read through a summarizer. The legal reading is explicitly unverified, yet "does not grant re-hosting" is stated as fact in plan.md section 8 item 7. Qualify it.
- **Z3** says Tahdhib al-Kamal is "the natural candidate". That is the researcher's opinion from memory. The owner asked for a comparison; none was done (no Tahdhib al-Tahdhib or Taqrib check). Do not rely on it.
- **Z4** is the weakest: one claim of Warsh and Qalun on Tanzil is contradicted by the download page and kept as a note. The KFGQPC "eight readings" comes from a repository listing, not from the complex. Nothing is usable yet.
- **Z5**: tafsir candidates were not researched; Fath al-Bari numbers and the Salafiyya edition's dates come from a page summary. Z5's "Numbering link" row says "Unverified", which is honest, but section 8 item 3 of the plan calls Shamela's Bukhari "Sultaniyya via Dar Tawq al-Najat" as settled. Bulaq 1311 and Tawq al-Najat 1422 are different printings in the research's own words; the edition identity (P6) is not established.
- Archive.org links are listed as candidates without any check that they exist or carry a text layer. Do not rely on them.

## Must-fix list

1. Define `InferenceId`, `DerivedValue`, and where an approval is recorded and who inserts the derived record (2.5, 2.7, 2.13).
2. Widen `premises` beyond `AssertionId`, or give Turn and timeline their own derived form (2.7, 2.13).
3. Resolve Turn versus Statement and make `Turn.span` plural (2.5, 2.3).
4. Draw and state the file to preview to prod data flow and the layout question for prod's graph (2.10, 2.12).
5. Fix `SharhLink` basis so a numbering map is not a span-free basis (2.4).
6. Correct section 8 item 5, X11 and E3 (stale or contradictory); fix section 9's old phase numbers and the section 2.1 diagram.
7. Add what phase 3 must measure for phase 7 and storage (6.2, 7).
8. research.md: remove "Verified" labelling, qualify Shamela terms and the Tahdhib al-Kamal recommendation, and mark the edition identity for Bukhari as open. Qualify plan.md section 8 items 2, 3 and 7 to match.
9. List the thin slice blockers in section 4(a) above in the plan's phase 0.
