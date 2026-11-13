# Group headings: an eligibility question, not an extraction one

A group heading is out of scope because the citable unit is a paragraph and a heading has none, not because it is an index label.

Kind: challenge · Outcome: solved · Date: 2026-09-30 · Topics: evidence-model, source-extraction

**Problem:** Deciding what a source-citation model may cite when a candidate unit, such as a group heading, carries a value but has no citable paragraph.

**Fix:** Pushed back on the answer that headings are out of scope as index labels; the narrower reason held: the citable unit is a paragraph, a heading has none, and a citation without a passageAnchor proves nothing.

**When it applies:** The Siyar pipeline cites at paragraph granularity; PassageKind shows that choice is still open.

**Rule it changes:** Teach design consequences that were never decided outright, since the heading case falls out of the paragraph-granularity choice and not from a rule about headings.

**Evidence:** PassageKind (the paragraph-granularity choice)

## What happened

Pushed back correctly on an agent's answer that the Siyar's group headings
(شهداء بدر, السابقون الأولون) are out of scope for being index labels — they do
carry a model value, namely martyrdom at a battle. The right reason they are
excluded is narrower: the citable unit is a paragraph, a heading has none, and a
citation without a `passageAnchor` proves nothing. Prior knowledge established:
already reads the pipeline at the level of what a claim is allowed to assert,
so lessons can start at the seams rather than at the artifact list.

**Implications:** teach design consequences that were never decided outright.
The heading case is one — it falls out of the paragraph-granularity choice
rather than from any rule about headings, and `PassageKind` shows the choice is
still open. That asymmetry is the recurring lesson shape for this mission.
