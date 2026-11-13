# A split of a text is proved by recombining it, not by checking it

A check that each piece is valid cannot find a missing piece; recombine the pieces and compare with the whole.

Kind: detour · Outcome: solved · Date: 2026-10-05 · Topics: testing, source-extraction, text-matching

**Problem:** Splitting a text into pieces passes a validity check on each piece while a missing piece goes unnoticed.

**Fix:** Hadith fixtures were first marked hand-checked but dropped words; a test that joins every scene row, strips quotation marks and compares with the full text caught the gaps and held.

**When it applies:** Bukhari 50 and Muslim's hadith extracted as scenes; model:check validates spans but not what no span covers.

**Rule it changes:** Any extraction that splits a text needs a check that recombines the pieces and compares with the whole; do not call a fixture checked until it has run.

**Evidence:** src/lib/model/hadithView.test.ts, "loses no word of either hadith across its scenes"; docs/plans/siyar-parsing.md (model:coverage)

**Same problem as:** [0005](0005-checks-that-dont-rederive-pass-the-wrong-inputs.md)

## What happened

Bukhari 50 and Muslim's hadith were first extracted as "hand-checked" fixtures with
three turns each, and the page showed them as the hadith. Muslim's first scene
stopped at «ثُمَّ قَالَ» and left out Ibn ʿUmar's next words; Bukhari's scene had
three turns where the text has ten. The owner found each gap by reading. What
fixed it was a test that joins every row of every scene, strips the quotation
marks, and compares the words with the full text as the book prints it
(`src/lib/model/hadithView.test.ts`, "loses no word of either hadith across its
scenes").

**Evidence:** the omissions survived the word "checked" and the model's own
`model:check`, which validates that each span resolves and says nothing about what
no span covers. The recombination test failed on the first version and passes on the
second, and it pins the boundary decisions that came from the owner: the isnad's
last link opens scene 1, the son's «قَالَ» closes it, and the nested story opens
scene 2 at «بَيْنَمَا».

**Implications:** a check that each piece is valid cannot find a piece that is
missing. Any extraction that splits a text needs a check that puts the pieces back
and compares the result with the whole, and a report of what no piece covers
(plan: [siyar-parsing.md](../../docs/plans/siyar-parsing.md), the `model:coverage`
command). Do not call a fixture or batch checked until that check has run. Same
family as [0005-checks-that-dont-rederive-pass-the-wrong-inputs](/records/namaq/0005-checks-that-dont-rederive-pass-the-wrong-inputs).
