# Review, round 2: plan.md and research.md

Verdict: revise, with small fixes. Round one's eight items are mostly fixed. The edits left four stale or contradicting spots, and the pilot order in the plan differs from the order the owner now wants.

## 1. Round-one must-fix items

| # | Item | State |
|---|---|---|
| 1 | Inference types and approval (2.13, 2.7, 2.5) | Mostly fixed. `Inference`, `DerivedValue`, `InferenceId`, `data/inferences/` and the `APPROVED` check exist. Half-fixed: "only the owner changes it to APPROVED; an agent never writes an approval" has no mechanism. Files are edited by agents, and `by: 'owner'` is a literal anyone can type. Give approval a command, as publish has (`model:approve`, run only on the owner's words), or say that the owner's PR merge is the approval. |
| 2 | Premises wider than assertions (2.13) | Fixed by the `Premise` union. `TurnRef` and `AgentId` are used but not defined. |
| 3 | Turn versus Statement, plural spans (2.5) | Fixed, with a containment check. The ERD (2.1) still shows Turn to one Span and a mandatory speaker; both are stale. Section 3.2 still says "its own span". |
| 4 | Data flow and prod layout (2.10) | Fixed and drawn. Gap left: prod admits a record only if it has a review for its current revision. A reviewed Assertion rests on a Statement, Mentions and an Identification that may be unreviewed. The plan does not say whether the closure must also be reviewed. Without a rule, prod can hold an Assertion whose evidence is missing. Also `Agent` is not a reviewed record, yet prod needs the node. |
| 5 | SharhLink basis (2.4) | Fixed in 2.4. Section 9's decisions table still says "a basis span or a numbering map", which contradicts it. |
| 6 | Stale items (section 8 item 5, X11, E3, section 9 numbering, ERD) | Fixed except the ERD's `Record` entity, which does not exist elsewhere, and `Inference` and `Premise` are missing from the 2.12 PostgreSQL list (`Premise` is there; `Inference` is not). |
| 7 | Phase 3 measurements (6.2, 7) | Fixed. |
| 8 | research.md labelling | Mostly fixed. Leftovers: the Numbering row says "Verified for Abd al-Baqi", the KFGQPC row says "Partly verified through search", and the header says nothing is verified. Row 13 states "well-known critical editions" from memory. |
| 9 | Blockers listed (6.2) | Done. |

## 2. New inconsistencies

1. **Pilot order.** Phase 2 (thin slice) precedes phase 3 (al-Zubayr) in the diagram and X10. The coordinator wants al-Zubayr first. Phase 1's acceptance also needs the verified Bukhari/Muslim witness, so al-Zubayr would wait on research it does not need. Split phase 1 into text core (Siyar witness exists) and slice witness.
2. **Phase 0 omitted from the blockers list.** ADRs 0021-0023, the snapshot, the AGENTS.md rewrite and the `pre-model` tag come before either pilot. "Phase 3 has no blocker beyond phase 1" is false.
3. **P9 and 2.10 (Prophetic gate row)** still say "Who the second reviewer is waits on Q1" and 2.6 says "two humans confirm the segment". The plan now has one hadith-qualified scholar; the second reviewer is a leftover from the earlier gate.
4. **Section 8 item 3 and research.md Z1 conclusion** call the Sultaniyya (Bulaq) text and the Dar Tawq al-Najat edition "different printings". Row 11 says Tawq al-Najat is based on the Bulaq edition, so the claim is the planner's inference and may be wrong. Say "which one the text follows is open".
5. **E3** is labelled "include" while its text says out of scope. Change the label to "defer".
6. **2.10 Unit row** lists five record kinds; `Turn` and `Inference` are not reviewable or publishable records, and the plan does not say whether an Inference has a revision or a review.

## 3. E3: quizzes out of scope

Acceptable, with two conditions. G6 and G7 describe quizzes as a goal of the app, not of the data model, and owner-goals gap 4 asks for a difficulty scale, toggles and a review field on questions, none of which touch spans. The citation rule in E3 is the part this plan owns. Conditions: add "quiz plan" as an open item in section 8 so it is not lost, and keep the existing `docs/quiz-question-review.md` rule visible, since quizzes already exist in the repo.

## 4. P9 and X12 owner-only rule

It does not matter. 2.10 states it, and 2.10 governs. Add a six-word pointer ("see 2.10 for who runs the command") in X12 to avoid a reader taking "only scholars review" to mean the command needs no instruction.

## 5. Pilot readiness

**al-Zubayr: sufficient to start**, once phase 0 and the text core (phase 1 without the slice witness) exist. No research or owner answer is needed. The 3.1 example is real, the Siyar witness exists, and phase 3's acceptance is concrete. Needed first: the ADRs and tag (phase 0), `matchSpan`, `render` and `model:check`. Fix the order and the phase 1 split.

**Thin slice: not sufficient to start.** Still needed: the owner's choice of Bukhari and Muslim edition and witness (Z1), a print-checked text of Bukhari 50 and the Muslim hadith, the Muslim hadith number and numbering, a Fath al-Bari entry that names the stranger, and the owner's confirmation that a Turn may show "speaker not stated". The inference approvals come after spans exist and the approval mechanism in item 1 is settled.

## Must-fix list

1. Define the approval mechanism for an Inference (2.13).
2. State the prod closure rule for a reviewed record's dependencies, and how Agents reach prod (2.10).
3. Reorder phases so al-Zubayr precedes the thin slice, split phase 1, and add phase 0 to the blockers (6.2, X10).
4. Remove the stale lines: section 9's "numbering map", the "second reviewer" and "two humans" phrases (P9, 2.6, 2.10), the ERD's Turn rows and `Record`, section 3.2's "own span", and E3's "include".
5. Soften "different printings" (section 8 item 3, research Z1).
6. research.md: drop "Verified" and "Partly verified" from rows 14 and 35 and qualify row 13.
7. Add "quiz plan" to section 8.
