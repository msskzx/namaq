# The owner's goals, rules and answers

Recorded 2026-10-03 from the owner, to compare with [plan.md](plan.md) before an action plan is formalised. The owner's own words come first; the comparison with the plan follows.

## What the application is for

An educational application for students. It shows the actual text and, beside it, interactive visualizations: graphs, fields, timelines and the rest of the structured data and search. Everything structured and every search result is backed by evidence. The app needs logic and inference over the data, but it introduces **no knowledge the text does not present**, since the project has no scholarly expertise to add any. The most important thing is that learners get interactive visualizations that are **correct and backed by evidence**.

Quizzes (solo and party) rely on the extracted knowledge, which scholars will also have to review. Their goal is to let learners test their knowledge and compete in a fun way with their peers. The project began as a graph visualization and found that it had to be backed by evidence; the scope has grown, the goal is the same: **learn by different interactive mechanisms, with references.**

## Goals

| # | Goal |
| --- | --- |
| G1 | Educational for students; Arabic-first. |
| G2 | The text itself is shown, with visualizations beside it: graphs, fields, timelines and other structured views, all interactive. |
| G3 | Every structured fact and every search result traces to evidence in the text. |
| G4 | Logic and inference over the data are allowed; new knowledge that the text does not present is not. |
| G5 | Visualizations are correct above all, and interactive for learners. |
| G6 | Quizzes (solo, party) are built from the extracted, scholar-reviewed knowledge; learners test themselves and compete with peers. |
| G7 | Quizzes have a difficulty scale the learner chooses (kunya questions are very hard for the owner), and every topic is its own toggle rather than merged ones. |
| G8 | Learning by many interactive mechanisms, each with references. |

## Rules

| # | Rule |
| --- | --- |
| R1 | Two fields, **published** and **reviewed**. For now data is published without review so it shows on the preview site and database. Nothing is marked reviewed until a qualified person has reviewed it; that is a scholar, never the owner and never an agent. |
| R2 | We never author groupings of works, hadith, ayat, utterances or poetry. We extract, aggregate and display. |
| R3 | The Qur'an's qira'at are all held, not one reading. |
| R4 | The app is Arabic only for now. |
| R5 | A displayed value or search hit is evidence or a stated inference from evidence, never our own addition. |

## The owner's answers to the plan's nine questions

| Q | Answer | Status |
| --- | --- | --- |
| 1 Reviewers | Reviewing is done by qualified scholars the owner will ask, not by the owner. Publishing without review continues for now; nothing carries `reviewed`. | decided |
| 2 Which rijal work | The owner does not yet know what Bukhari conditions or how he identifies narrators; see the explanation below. | research needed |
| 3 Bukhari edition | A digital edition reviewed by scholars is needed; to be agreed after research by agents and the owner. | research needed |
| 4 Mushaf and qira'a | Hold all qira'at. | decided |
| 5 Bare Sira volumes | Publish them (not reviewed). | decided by R1 |
| 6 Shamela only? | Unknown: check that Shamela has the wanted edition, complete, with footnotes and reviewed. | research needed |
| 7 Shamela terms | Unknown; to be checked. | research needed |
| 8 English names | Not a concern: the app is Arabic only for now. | decided (out of scope) |
| 9 Namaq groupings | None: no groupings of works, hadith, ayat, utterances or poetry; extract, aggregate, display only. | decided |

### What Bukhari's conditions have to do with the model (for question 2)

The model records a hadith's chain exactly as the book prints it, with each narrator's mode of hearing. Two separate things sit on top, and neither is decided by us:

- **Identification** answers "which person is this narrator name?" (for example, which Hammad). It is made from a rijal work (a biographical dictionary of narrators), with a basis span from that work. It is not something Bukhari does in his book.
- **Grading** answers "is this report sound?". Al-Bukhari's own conditions (his شروط) are why a hadith is in his Sahih at all; the plan holds a grade only as a quotation of whoever graded it, and the Sahih's authority as a work is the author's own claim, scoped to that work.

So what the owner needs to settle is which rijal work is the basis for identification and which edition of the Sahih is the text, not how Bukhari identifies people.

## How the plan meets these goals

Aligned:

- Evidence for everything shown (G3, G5, R5): the plan's spans, statements and per-record publication.
- No new knowledge (G4): groupings and our own identifications are excluded; unbased narrators stay text.
- Two fields (R1): per-record publication with a separate review field, matching the plan's approval and visibility axes.

Gaps in the plan, to close before an action plan:

1. **Inference is not defined.** The plan forbids our own words but has no rule for derived data (a timeline computed from dates, a graph edge from a relation, an age, a count). Needed: a derived value is allowed only when a stated, tested rule computes it from cited statements and the view shows its premises (G4).
2. **Timelines.** The plan has no time model (hijri dates, relative dating as in `docs/plans/relative-event-dating.md`, uncertainty and disagreement). Needed for G2.
3. **Search.** The plan lists search normalisation as an extra issue; G3 requires every hit to resolve to a span.
4. **Quizzes.** The plan only covers a question citing a statement that later lapses. Needed: a difficulty scale (what makes a question hard, for example the attribute asked, the number of distractors that look alike, how many sources state it), per-topic toggles with no merged groups, and a review field on questions (see `docs/quiz-question-review.md`).
5. **Visualizations.** The plan covers projection to PostgreSQL and Neo4j but not what an interactive view needs from the model (evidence per edge, per point on a timeline, per field).

Conflicts, to resolve in the plan:

1. Axis X12 requires, from the pilot, two humans, one hadith-qualified, to review a Prophetic statement before it publishes. R1 says publishing continues without review for now and that review is done by scholars the owner will ask. The gate should become a *reviewed* gate only: a Prophetic statement is published unreviewed with a visible "not reviewed" status, and `reviewed` is set only by a scholar.
2. Question 9 asked whether Namaq groupings of non-Prophetic reports may be published. R2 answers no, for every kind of work. Plan section 2 and X6 must drop that option.
3. The `Ayah` table is one text (question 4). R3 requires all qira'at, so the table needs a reading dimension.
4. Question 8 (English names as glosses) is out of scope under R4.

## Research the owner needs before an action plan

| # | Question | Needs |
| --- | --- | --- |
| Z1 | Which digital edition of Sahih al-Bukhari: complete, with the editor's footnotes, scholar-reviewed, vowelled, with a stable numbering, available to extract from | an agent-led comparison of candidates, then the owner's choice |
| Z2 | Whether Shamela has that edition and its terms of reuse | the same research |
| Z3 | Which rijal work is the basis for identification, and whether a digital edition of it exists | the same research |
| Z4 | Which sources hold the qira'at, and how a reading is recorded beside the Hafs text in `Ayah` | research, then a plan change |
| Z5 | Tafsir books worth extracting first, with the same edition criteria | the same research |
