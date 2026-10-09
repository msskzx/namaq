---
status: accepted
---

# Title, status and office are three predicates

A title is an epithet the text gives a person (الصِّدِّيق, حَوَارِيُّ رَسُوْلِ اللهِ). A
status says which generation a person belongs to (`companion`, `tabii`). An
office is a post held, with a scope and, where the text states them, dates
(`caliph`, `amir` of a place or army). They differ in shape, so each has its own
predicate. `companion` is a status and leaves the titles, and Amir al-Mu'minin is
an office designation and not a title.

A companion is a person who met the Prophet ﷺ while believing in him and died a
Muslim. Every person in a volume of the Companions is a companion unless the
text says otherwise, so the model records `companion` for each of them without a
rule file or a derivation. The basis is any text of the author that shows it: the
volume title, the first paragraph of the entry, a virtue, an epithet. Where the
text places a person elsewhere, the model records what it says. Marwan ibn
al-Hakam sits under «كِبَارُ التَّابِعِيْنَ», and the author calls a claimed sight of the
Prophet only possible, so he is `tabii` and the remark stays a separate statement.

`is-sahabi` is renamed `status`. The app is unreleased, so there is no adapter.
The rename and the removal of the `companion` title are not built yet; nothing
else depends on them, so they follow in their own change
([plan](../plans/status-and-office.md)).

`office` is built. Its scope could be a linked entity (a place, an army or an
event) or the span that names it. A span is simpler and matches
[ADR 0021](0021-a-span-selects-text-by-quote.md): the assertion is
`{ classified: <kind>, spans }`, where the kind is `caliph` or `amir` and the
quote carries the scope and any date the text states, in the author's words. No
second record is needed and nothing is computed from the quote. `model:check`
fails an office with no kind or an unknown one. Dates in the quote stay text
until the time layer needs them as numbers; a linked scope can be added then,
because the span stays as its evidence.
