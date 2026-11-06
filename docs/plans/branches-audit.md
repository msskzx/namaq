# Branch comparison audit

The initial generated inventory contains 1,141 comparisons, of which 17 carry references to the thirty recorded source cases. This audit checks displayed difference labels and their evidence. Categories remain a separate editorial decision: an uncited comparison can be mutashabeh, while a grammatical difference chip requires support for that particular difference and selection.

## Findings

- The inventory publishes 1,032 uncited difference-tag instances. All fourteen gender-tagged comparisons are uncited. Examples include `بسورة / سور` and `تعلمون / تعلم`, for which the displayed gender label is misleading. The published legend and connectors now expose only source-supported tags; automatic alignments remain available internally.
- The cited comparison of 2:58–59 and 7:161–162 labelled `خطاياكم / خطيئاتكم` as singular/plural. Both forms are plural. Al-Karmani discusses the plural formation, including `خطايا` as a form of abundant plural. The unsupported singular/plural mapping has been removed from source cases K04 and I04. The distinct `معدودة / معدودات` source cases retain that label. [Al-Karmani, commentary on 2:58](https://quranpedia.app/uloom/karmani-burhan/sura2-aya58.html).
- Group-level citations previously authorized chips across additional uncited members. Z03 records 2:129 and 2:151, while its group also contains 3:164 and 62:2. Filtering down to those latter passages hid the citation but left its chip and example visible. Citations now retain their exact selected spans, and displayed evidence requires those spans to survive the current selection.
- Connector tags previously spread to pairs outside the citation's recorded selections. Published connector tags are now restricted to the cited pair and word spans. Additional group members retain their text without inheriting evidence for an uncited difference.
- The extension suffix on a source-backed case distinction suggested an absence of source support. The I06 citation explicitly supplies `الصابئين / الصابئون`. Supported chips display their names and references without an extension suffix.

## Checks

Regression tests cover unsupported grammatical chips, the two-plural example, retention of sourced differences, partial word selections, cross-ayah selections, filtered citation pairs, and connector authorization. The book-only and difference filters must use the same scoped evidence as the displayed legend.

## Classification candidates

The rain passages 22:63/35:27/39:21, recipients-of-scripture passages 3:23/4:44/4:51, and 89:6/105:1 are candidates for mutashabeh and focused pondering comparisons. Their substantial shared openings lead to distinct continuations. They are not classified as book-attested by the saved evidence. The broader 14:24/89:6/105:1 comparison shares an interrogative construction across different subjects; its value as a pondering comparison needs an explicit editorial decision.

The existing machine-generated kind is not a reviewed category. Numeric matching can prioritize a review queue, but publishing a category should retain its selection and rationale. Entries pending that decision remain accessible as word trees.

The initial kinds comprise 91 identical groups, 540 near-match groups, 509 shared-phrase groups, and one frame group. Of the 525 uncited near-match groups, 116 have a whole-ayah coverage score of at least 72 percent, 121 have at least 50 percent but less than 72 percent, and 288 fall below 50 percent. These numbers cannot establish editorial quality. The focused earth-and-rain comparison in 22:5/41:39 scores approximately 14.5 percent because its selected passage occupies only part of the longer ayah. Conversely, several garden-formula cliques begin or end with incomplete contextual fragments despite meeting local matching thresholds.

Shared-phrase groups that warrant specific review for memorization include 3:10/3:116, 2:149/2:150, and 2:63/2:93. Their shared openings have distinct continuations. This illustrates why neither the stored kind nor its whole-ayah score can directly become the new publication category.
