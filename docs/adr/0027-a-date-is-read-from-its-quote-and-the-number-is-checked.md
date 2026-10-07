---
status: accepted
---

# A date is read from its quote, and the number is checked against it

An assertion such as `died.year` stores a `parsed` number beside the quote it rests
on. Until now nothing read the quote: `model:check` only tested that `parsed` was a
finite number, so a hand-typed `37` beside `سَنَةَ سِتٍّ وَثَلاَثِيْنَ` would have passed.
That is the failure [ADR 0021](0021-a-span-selects-text-by-quote.md) rules out for text,
and it would have repeated for numbers.

A registry maps each predicate that carries `parsed` to a reader of Arabic number words
and Hijri month names, and `model:check` fails when `parsed` differs from what the reader
makes of the quote, or when the predicate has no reader. A sentence the reader cannot
read stays not modeled, tagged `time-layer:unreadable`, and nothing is guessed. A
reader takes the one number phrase in the quote and ignores the other words, so a quote
can be the natural clause (`أَسْلَمَ الزُّبَيْرُ ابْنُ ثَمَانِ سِنِيْنَ`). A quote with two
number phrases is unreadable.

Month and day are separate predicates (`died.month`, `died.day`, `born.month`,
`born.day`) that rest on the same statement as the year: a day needs a month and a month
needs a year on that statement, and competing readings sit on different statements. We
considered one `died.date` predicate with a structured value. It would have changed the
shape of `died.year`, which the catalog diff and the projection already read, and it
would have hidden which part a competing statement disagrees about.

Only an explicit ordinal day is read. `لعشر خلون`, `لعشر بقين`, `النصف`, `أول` and `آخر`
are not, because turning a count of nights into a day of the month is a convention the
reader would have to choose, and the owner ruled out deriving dates in this layer. The
same rule keeps out an indefinite count (`بضع وخمسون`), two values in one sentence and any
offset (`قبل المبعث بعشر`). A year before the hijra is read as a negative number with no
year zero, the convention in `src/lib/hijriYear.ts`. Nothing is converted to the
Gregorian calendar.

Plan: [time-layer.md](../plans/time-layer.md).
