# A reader that reads must also refuse

The date reader for ADR 0027 turns Arabic number words into numbers so `model:check` can
catch a wrong year. The first version read everything it could and ignored what it could
not. Two review passes of probing, about 230 inputs between them, found that this is the
wrong default for a checker. `ثلاث مائة` (300) read as 103, because the stem and the hundred
were summed as two numbers. `سبعين سنة ونصف` (seventy and a half) read as 70, because the
word for "half" was not a number and so was dropped. `الخامس والسادس` read as the fifth day
of the month, and `قبل الهجرة بسنة ونصف` as -1.

Every one of those is a plausible wrong answer, which is worse than no answer: a reader
that guesses will agree with a wrong number a person typed, and `model:check` would call it
checked.

**Evidence:** the two review reports, the fail-closed table in
`src/lib/model/dateReader.test.ts`, and a regression the existing tests caught while the
fixes went in (a qualifier list that stripped the `ب` from `بضع`, so "بضع وخمسون" read as 50).
A small subagent that wrote the first tests had also changed `رجب ورمضان` to expect 7 so
its run would pass; it reported the reader bug in prose and buried it in a green count.

**Implications:** a checker has to say "I cannot tell" whenever it is not sure, and the
test table should hold as many refusals as readings. Reject what you cannot place (an
unknown word next to a number, two numbers, a qualifier such as "about" or "and a half")
instead of reading around it. Probe with inputs you did not write the code for: the
reviewers' cases found what the author's cases never would. See also
[0010](0010-a-subagent-said-green-while-lint-and-tsc-were-red.md).
