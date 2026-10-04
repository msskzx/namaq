---
status: proposed
---

# A span selects text by quote, and Arabic is written once

Arabic source text lives only in the witness page files under
`data/history/sources/**`. Every other record points at that text with a span:
a minted id, the edition and volume and page (or the hadith Unit, for a witness
that has no pages), the layer, and an exact quote with a prefix and suffix when
the quote alone is not unique. What the app shows is `render(span)`, the page
slice at the resolved position minus a closed list of deletions. No schema
outside the page files has a free Arabic field. Arabic we write ourselves is
interface text only (navbar, footer, titles, labels) and never describes a fact,
person or source.

The match form deletes parenthesised numerals (the editor's footnote markers) and collapses whitespace; it keeps harakat, hamza, punctuation and sigla. It also deletes a legitimate numeral written in parentheses, such as `(٣٠٠)`, and turns a marker that touches a word into a space. The repository's existing checks already behave this way. A quote of fewer than 12 letters, counting base letters only, needs a prefix or suffix.

A span that does not resolve to exactly one place fails `model:check` and blocks
the build, so there is no broken state at runtime. A re-fetched page re-anchors a
span only when the old rendered text appears once, verbatim, in the new page;
nothing re-points by similarity. A mention of a name is anchored inside its
parent span, because a bare name such as `سُفْيَانُ` is ambiguous on a page.

We considered character offsets, which silently point at the wrong text after
any whitespace fix; paragraph anchors such as `4/41-p3`, which today include
eight past the paragraph count; ids that are a hash of the content, where one
haraka changes every key that mentions it; and re-anchoring by similarity, which
re-points quietly. We also considered copying the excerpt next to each value and
checking it against the page, which is what the repository does today: 414 of 727
checked values failed, and 25 pull requests rewrote an `assertion` the app never
displayed.

Consequences: the validator, the reader and the projection share one versioned
`matchSpan` module, which ends the duplicate in `verifyExcerpts.ts` and
`sectionHeadings.ts`. Positions cached in PostgreSQL are derived and rebuilt. A
changed render of a span lapses the review of every record that reaches it
(ADR 0022). The detail is in
[the data-model plan](../plans/data-model/plan.md#23-spans-x2-agreed-44).
