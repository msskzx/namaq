---
title: "A later author's note can sit inside the main text"
summary: "Removing footnotes alone does not isolate a classical author's words when a digital witness inserts a later commentary into the body."
disclosure: "open"
sourceProject: "namaq"
kind: "obstacle"
problem: "An author-only selection must exclude modern editorial additions even where the witness does not place them below its footnote separator."
approach: "Select the numbered report itself, inspect the attribution immediately afterward, and source the later scholar directly rather than treating all body text as the original author's words."
outcome: "solved"
conditions: "Al-Nawawi's al-Adhkar, Dar al-Fikr 1414/1994, Shamela 1956, printed page 20, after report 38."
evidence: "shared/adhkar/author-excerpts.json, report 38; Nata'ij al-Afkar, Dar Ibn Kathir 1429/2008, volume 1 page 113, Shamela 30108/122."
implication: "A footnote separator establishes layout, not authorship. Read later attributions and preserve the distinction when selecting an author-only passage."
date: "2026-11-17"
topics: ["source-extraction","evidence-model"]
buildsOn: ["namaq/R0034-a-dump-keyed-by-ayah-can-hold-pages-not-passages"]
---

The al-Adhkar witness places a paragraph attributed to al-Suyuti after report 38
on printed page 20. It is above any footnote separator. Al-Suyuti lived after
al-Nawawi, so that paragraph cannot be al-Nawawi's own continuation.

The selection stops at the numbered report's end. The grading comparison comes
directly from Ibn Hajar's page-numbered Nata'ij al-Afkar instead. On volume 1
page 113 he questions al-Nawawi's «بإسناد صحيح» and calls what the second half's
narrator alone reports «من قبيل الحسن». Both judgments remain attributed. No word from the inserted al-Suyuti
paragraph is shipped as al-Nawawi's text.

This is an authorship decision from the named speakers and their dates. The
content tests check our selected spans against the saved witness; they cannot
establish authorship from the witness's page layout.
