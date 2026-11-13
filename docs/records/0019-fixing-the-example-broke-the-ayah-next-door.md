# Fixing the highlight the owner pointed at broke the one next to it

Four highlight rules, each checked only on the ayah named in the message, each moved highlights nobody looked at.

Kind: detour · Outcome: solved · Date: 2026-10-18 · Topics: testing, text-matching

**Problem:** A rule that runs over a whole text was fixed and checked only on the example the owner named, and it moved results nobody looked at.

**Fix:** Four highlight rules each broke a neighbouring ayah; a before/after diff of every mark over all 5,082 matches led to pairing the ayat of equal windows in order, which changed 93 matches and held.

**When it applies:** The similar-ayat view colours a word amber when the other side has it letter for letter; 5,082 matches in similar.json.

**Rule it changes:** Diff a changed data file against the previous one and read a sample, and add stated invariants to src/lib/quran/similar.test.ts as checks over every pair.

**Evidence:** Commits on claude/similar-ayat from "ignore a leading wa or fa" to "link each similar-ayat highlight to its partner"; src/lib/quran/similar.ts (marks, paired)

## What happened

The similar-ayat view colours a word amber when the other side has it letter for
letter. The owner asked why the لا of الحاقة ٣٩ (وما لا تبصرون) was amber: it
matched the فلا of an oath in الواقعة ٧٥. The fix stopped colouring a particle that
stands alone. It was checked against that one ayah, which came out right, and
shipped. The owner's next message: the إنه that opens both الواقعة ٧٧ and الحاقة ٤٠
had lost its colour. Four highlight rules went in that way in under an hour, each
checked only on the ayah named in the message, and each moved highlights nobody
looked at.

The rule that finally held came from a before/after diff of every mark in all
5,082 matches. The diff showed that pairing the ayat of two equal windows in order
(٧٥↔٣٨، ٧٦↔٣٩، ٧٧↔٤٠) changed 93 matches, against hundreds for the earlier rules,
and the changed rows could be read one by one.

**Evidence:** the commits on `claude/similar-ayat` from "ignore a leading wa or fa"
to "link each similar-ayat highlight to its partner", and [`src/lib/quran/similar.ts`](../../src/lib/quran/similar.ts)
(`marks` and `paired`).

**Implications:** a rule that runs over the whole text has to be judged over the
whole text. Before reporting a change to `similar.json`, diff its marks against the
previous file and read a sample of what changed. Every rule that can be stated as an
invariant belongs in [`src/lib/quran/similar.test.ts`](../../src/lib/quran/similar.test.ts) as a check over every pair, as
"no mark lacks a partner" now is. The example the owner named
only shows that the rule handles one case.
