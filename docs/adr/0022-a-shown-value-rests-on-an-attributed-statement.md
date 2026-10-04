---
status: accepted
---

# A shown value rests on an attributed statement

Every value the app shows is an Assertion that rests on at least one Statement.
A Statement is one wording of a Report, made of spans, and the Report records who
said it: the work's author, a transmitter, an editor, or an unnamed group
(`REPORTED_ANONYMOUS`). A person named in the text is a Mention, tied to an Agent
only by an Identification that cites a basis span other than the mention itself,
where a name could belong to more than one person. A referent the whole tradition
agrees on, the Messenger of Allah and the Prophet, is `prophet-muhammad` through a
standing rule and needs no per-mention basis, since there is nothing to guess. A
name with no basis stays text and never becomes a graph node. Competing values
are competing Assertions, all shown; Namaq never picks one.

Inference is not our own addition. A value exactly in the text is recorded as it
stands. A value the text implies but the model cannot hold is reported by an
agent as an Inference file and shown only after the owner merges its approval,
as a derived value that lists its premises. A value the text does not state is
never added. Agents never write the approval.

Publishing and reviewing are separate acts. The owner publishes a record to
preview. A qualified scholar, never the owner and never an agent, reviews it, and
the review record lives in the files. A review covers the record's closure (its
Statements, spans, Mentions and Identifications), so editing any of them lapses
the review. Gradings quote their speaker, and a work's own claim to authenticity
is scoped to the part of the work it covers.

We considered a free-text `assertion` beside each value, a `confidence` field,
and our own labelled identifications drawn as graph edges. Each adds a judgment
that no source made, which is the one thing the project has no expertise to add.
We also considered hashing the approval over the quote alone, which misses a
change of witness or of the render rules.

Consequences: a new predicate or a new kind of derived value needs an ADR. The
`HistoricalClaim`, `Citation` and `SourcePassage` tables are replaced by
Assertion, Statement and Span after a dual run. Conversations inside a hadith are
recorded as scenes with ordered turns, separate from the chain of narrators. See
[the data-model plan](../plans/data-model/plan.md), sections 2.5 to 2.10 and 2.13.
