# The owner's goals, rules and answers

Recorded 2026-10-03 from the owner, to compare with [plan.md](plan.md) before an action plan is formalised. The owner's own words come first; the comparison with the plan follows.

## What the application is for

An educational application for students. It shows the actual text and, beside it, interactive visualizations: graphs, fields, timelines and the rest of the structured data and search. Everything structured and every search result is backed by evidence. The app needs logic and inference over the data, but it introduces **no knowledge the text does not present**, since the project has no scholarly expertise to add any. The most important thing is that learners get interactive visualizations that are **correct and backed by evidence**.

Quizzes (solo and party) rely on the extracted knowledge, which scholars will also have to review. Their goal is to let learners test their knowledge and compete in a fun way with their peers. The project began as a graph visualization and found that it had to be backed by evidence; the scope has grown, the goal is the same: **learn by different interactive mechanisms, with references.**

## Goals

| # | Goal |
| --- | --- |
| G1 | Educational for students; Arabic-first. |
| G2 | The text itself is available, main focus is visualizations: graphs, timelines, badges, fields, searches and other structured views, all interactive. |
| G3 | Every structured fact and every search result traces to evidence in the text. |
| G4 | Logic and inference over the data are allowed; new knowledge that the text does not present is not. |
| G5 | Visualizations are correct above all, and interactive for learners. |
| G6 | Quizzes (solo, party) are built from the extracted, scholar-reviewed knowledge; learners test themselves and compete with peers. |
| G7 | Quizzes have a difficulty scale the learner chooses, and every topic is its own toggle rather than merged ones. |
| G8 | Learning by many interactive mechanisms, each with references. |

## Rules

| # | Rule |
| --- | --- |
| R1 | Two fields, **published** and **reviewed**. For now data is published without review so it shows on the preview site and database. Nothing is marked reviewed until a qualified person has reviewed it; that is a scholar, never the owner and never an agent. The two are separate acts: the owner publishes, a scholar reviews. |
| R1a | Two environments. **Preview** accepts published data and shows everything, reviewed or not, with its status. **Prod** holds and shows only reviewed data: a record is reviewed on preview first, then marked reviewed in both, and prod's database never holds an unreviewed record. Review records (reviewer, date) live in the files so both databases rebuild from them. An edit to a reviewed record lapses its review and removes it from prod until it is reviewed again. |
| R2 | We never author groupings of works, hadith, ayat, utterances or poetry. We extract, aggregate and display. A grouping or tag is allowed only when it comes from the work itself (for example Bukhari's books and chapters), is attributed to that work, and stays scoped to it. |
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

1. **Inference is not defined.** The model is filled from the text. A value exactly in the text is recorded as it stands. A value not exactly there is either implied by the text or absent, and we add nothing when it is absent. An implied value is a rare special case, for example a Companion martyred at Uhud, whom the text never says took part. The owner reviews each one. An agent that finds one reports it (passage, implied value, why the model cannot hold it) and does **not** insert it. Needed in the plan: a place for these reports, and a rule that an approved inference is stored as a derived value citing its premises and shown as derived, never as quoted (G4).
2. **Timelines.** The plan has no time model (hijri dates, relative dating as in `docs/plans/relative-event-dating.md`, uncertainty and disagreement). Needed for G2. Today an event with an unknown date shows at the end of the timeline. When the text places it between two dated events, the view should show it between them with no exact date, and name the two events as its premises. This is the same kind of special case as gap 1: reported by the agent, approved by the owner.
3. **Search.** The plan lists search normalisation as an extra issue; G3 requires every hit to resolve to a span.
4. **Quizzes.** The plan only covers a question citing a statement that later lapses. Needed: a difficulty scale (what makes a question hard, for example the attribute asked, the number of distractors that look alike, how many sources state it), per-topic toggles with no merged groups, and a review field on questions (see `docs/quiz-question-review.md`).
5. **Visualizations.** The plan covers projection to PostgreSQL and Neo4j but not what an interactive view needs from the model (evidence per edge, per point on a timeline, per field).
   - **Conversation view.** A Report has one `origin`, so a hadith with several speakers cannot be shown as "A said, B said, A said". Needed: an ordered list of turns on a Report, each {speaker Mention, span, optional addressee}, identified from the text like any Mention.
   - **Example, the hadith of Jibril (Umar's narration).** Three speakers. Umar narrates and speaks in the first person (`فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ`, `قُلْتُ`). The Prophet ﷺ answers (`قَالَ رَسُولُ اللهِ ﷺ: الإِسْلاَمُ أَنْ تَشْهَدَ...`). The stranger asks (`يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ`) and answers (`صَدَقْتَ`). Turns alternate: stranger, Prophet, stranger, Prophet, and so on, with Umar's narration between them.
   - **What the example shows.** (a) Many turns are a bare `قَالَ` with no name; the speaker follows from the alternation, which is a gap 1 case: the agent reports it and the owner approves. (b) The stranger is `رَجُلٌ` until the Prophet says `فَإِنَّهُ جِبْرِيلُ`; that later span is the basis for identifying him, and the turn stays unidentified without it. (c) The Prophet's turns fall under the Prophetic gate (P9).

Conflicts, to resolve in the plan:

1. Axis X12 requires, from the pilot, two humans, one hadith-qualified, to review a Prophetic statement before it publishes. R1 says publishing continues without review for now and that review is done by scholars the owner will ask. The gate should become a *reviewed* gate only: a Prophetic statement is published unreviewed with a visible "not reviewed" status, and `reviewed` is set only by a scholar.
2. Question 9 asked whether Namaq groupings of non-Prophetic reports may be published. R2 answers no, for every kind of work. The `NAMAQ` basis and the "grouped by Namaq" label go from P5, section 2.8, section 2.11 and X6. A grouping survives only as the work's own units (books, chapters) or a span basis (takhrij, atraf, explicit statement in the same work).
3. The `Ayah` table is one text (question 4). R3 requires all qira'at, so the table needs a reading dimension.
4. Question 8 (English names as glosses) is out of scope under R4. This also corrects P5's "never Arabic". The app is Arabic, so Arabic we write ourselves is allowed as interface text: navbar, footer, page titles, buttons, status labels. It must never describe a fact, person or source; those come from spans (P1). Source pages (`/sources`) may show metadata such as author and volume. The book reader and the source text are exact: we do not rename, regroup or reorder chapters. The reader's index follows the book's own contents, not our `account` records, which must be fixed to match. `Gloss` records are dropped.

## Research the owner needs before an action plan

| # | Question | Needs |
| --- | --- | --- |
| Z1 | Which digital edition of Sahih al-Bukhari **and of Sahih Muslim** (both are in scope): complete, with the editor's footnotes, scholar-reviewed, vowelled, with a stable numbering, available to extract from. A verified source is required: a typo seen on a third-party site (بالعبث for بالبعث in Bukhari 50) shows that an unverified copy cannot serve as a span source | an agent-led comparison of candidates, then the owner's choice |
| Z2 | Whether Shamela has that edition and its terms of reuse | the same research |
| Z3 | Which rijal work is the basis for identification, and whether a digital edition of it exists | the same research |
| Z4 | Which sources hold the qira'at, and how a reading is recorded beside the Hafs text in `Ayah`. The Qur'an is cited by surah and ayah, not by printed page. Candidates, from memory and unchecked: Tanzil (vowelled Uthmani, Hafs only, reuse unmodified with attribution), Quran.com / QUL (several scripts, possibly other qira'at), the King Fahd Complex mushaf as the check | research, then a plan change |
| Z5 | Tafsir books worth extracting first, with the same edition criteria | the same research |
