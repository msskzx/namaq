---
title: "The page was keyed by who read it, not by where it sits in the book"
summary: "A source page belongs to its volume, keyed by (volume, printedPage), with the account demoted to a span."
disclosure: "open"
sourceProject: "namaq"
kind: "challenge"
problem: "Choosing the key and owner for stored source pages, so that citations resolve without adding a new subject kind."
approach: "Rejected a proposed WORK_SECTION subject kind; keyed a page by (volume, printedPage), made the account a span over pages, and moved pages into a per-source store. The cleaner key held."
outcome: "solved"
conditions: "Citations resolve passage to page to volume; the account is not in that chain."
evidence: "The design session that rejected WORK_SECTION and moved pages into a per-source store"
implication: "Lead with the key and only then ask what still needs a bearer, instead of offering defensive modelling constructs."
date: "2026-09-30"
topics: ["evidence-model","migrations"]
---

Reached the decision that a source page belongs to its volume, keyed by
`(volume, printedPage)`, with the account demoted to a span. Got there by
rejecting my proposal to add a `WORK_SECTION` subject kind: pointed out that
volume-owns-pages plus account-references-pages already dissolves the problem,
which was correct — with citations resolving passage → page → volume, the account
is not in the chain and needs no reclassification.

**Evidence:** identified the redundancy unprompted, mid-round, against a
recommendation. Also chose (b) over (a) on the file-layout question — moving
pages out of batches into a per-source store — for the same reason, before the
duplication argument was made.

**Implications:** stop offering defensive modelling options. The pattern in both
corrections was the same: I proposed a construct to carry weight that a cleaner
key already carries. Lead with the key, and only then ask what still needs a
bearer. See [0004-no-legacy-during-dev](/records/namaq/0004-no-legacy-during-dev).
