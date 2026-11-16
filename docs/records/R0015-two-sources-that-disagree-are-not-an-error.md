---
title: "Two sources that disagree are not an error"
summary: "Two sources that contradict each other are data, while one source contradicting itself is an error."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Deciding whether a validator should reject contradictions between sources when the data model must hold disagreeing traditions."
approach: "orderingProblems separates a cycle within one work, a data error, from a cycle that appears only across two works, a dispute that keeps both orderings and flags the events."
outcome: "solved"
conditions: "ADR 0022 says the catalog never picks one reading; ordering of events is checked as a graph, with the work recorded on each ordering."
evidence: "src/lib/catalog/ordering.test.ts; src/lib/catalog/ordering.ts; orderings/badr-before-death-of-uthman-ibn-mazun.ts"
implication: "When a check fires, ask who is contradicting whom: one author, a typo, or two, data; keep the source on every ordering."
date: "2026-10-08"
topics: ["evidence-model","data-sync"]
---

The first idea for ordering events was the obvious one: a graph, so check it for cycles and reject
the catalog if one exists. The critic agent pointed out that this makes Namaq pick a side. If one
work says A came before B and another says B came before A, rejecting the catalog would force
the author to delete one of them, and ADR 0022 says Namaq never picks one reading.

So `orderingProblems` (`src/lib/catalog/ordering.ts`) separates two cases that look alike. A cycle
among the orderings of one work is a data error, because one author does not contradict
themselves: someone misread a sentence. A cycle that only appears when two works are combined is
a dispute: both orderings stay in the catalog, and the events involved are flagged so a later
display leaves them unplaced and shows both readings. The same split applies when an ordering
contradicts an event's year: it is an error when both come from the same work and a dispute when
they do not.

**Evidence:** the tests in `src/lib/catalog/ordering.test.ts` (a cycle in one source fails, the
same cycle across two sources is flagged), and `orderings/badr-before-death-of-uthman-ibn-mazun.ts`,
the first record, which cites the claim `ibn-mazun/death` ("توفي ... بعد بدر بيسير").

**Implications:** a validator that rejects every contradiction cannot hold a tradition in which
sources disagree, which is the main thing a history of this kind records. The useful question
when a check fires is "who is contradicting whom": one author, which is a typo, or two, which is
data. It is also why the source (the work) is a field of every ordering and not something
inferred later.
