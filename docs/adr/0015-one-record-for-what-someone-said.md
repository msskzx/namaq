---
status: accepted
---

# One record for what someone said

A profile field holds what is said *about* a person. `virtues` is the sira's own
wording for why the subject matters, and a prophetic hadith in praise of someone
lands there as part of that. Nothing held what a person *said*, and the sira is
full of it: fifty runs of verse in chapters one to five alone, before counting
prose.

`Utterance` is one record for both, with a `kind` of `POETRY` or `SAYING`. It
carries the text as the source prints it, a speaker, who the words are about, an
occasion in the source's wording, an optional event or battle, and a `grading`.
The two kinds are not two models because the sira does not treat them as two
things: a poem and a saying both reach it as somebody's words reported with an
isnad, and both are quoted to prove something about a person.

The speaker is a link when the app has a subject and plain text otherwise. Most
of the verse in the sira is by poets who appear once: Ma'bad al-Khuza'i turning
Abu Sufyan back after Uhud, the woman behind the Meccan line at Uhud whom the
chapter never names. Recording the name as text keeps them where they belong
without making a node out of a name, which is the same rule that keeps a
narrator out of the graph.

`grading` is the source's own words and nothing else: أخرجه مسلم, إسناده حسن,
حديث منكر, قول من قال كذا أصح. The app does not grade a report, the way it does
not assess a claim it has not reviewed
([ADR 0008](0008-separate-review-from-visibility.md)). A verdict is a quotation
here, which is why the column is free text rather than a vocabulary.

## Not a hadith model

This is not the place a hadith corpus would go, and generalising it into one
would be a mistake. A hadith record wants an isnad, a collection, a book and a
number, and a grading vocabulary that somebody's scholarship stands behind.
Every one of those either contradicts a decision this repository already made or
asserts something it has no source for.

Transmission chains stay in the source text and a narrator does not become a
node, which is what a hadith model exists to contradict. And the Siyar is not a
hadith collection: it quotes hadith as evidence for a life, and a life is what
this app models. A prophetic saying fits here already, as `SAYING` spoken by the
Prophet with the source's own takhrij in `grading`, which is all the app can
honestly say about it.

If a hadith corpus is ever imported it will arrive with its own source model and
its own gradings, and it will not want to be retrofitted into a table built for
Abu Talib's verse.

## Not in the graph

An utterance is profile content, so it lives in PostgreSQL and has no node in
Neo4j. The graph answers who was connected to whom; a poem is not a connection,
and adding it would put a node between two people who are already joined by the
relation the poem is about.
