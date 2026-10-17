# Fixing the highlight the owner pointed at broke the one next to it

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
to "link each similar-ayat highlight to its partner", and `src/lib/quran/similar.ts`
(`marks` and `paired`).

**Implications:** a rule that runs over the whole text has to be judged over the
whole text. Before reporting a change to `similar.json`, diff its marks against the
previous file and read a sample of what changed. Every rule that can be stated as an
invariant belongs in `src/lib/quran/similar.test.ts` as a check over every pair, as
"no mark lacks a partner on the other side" now is. The example the owner named
only shows that the rule handles one case.
