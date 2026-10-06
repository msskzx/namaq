---
status: proposed
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
`office` is decided here and built after the time layer settles how dates are
held; until then it takes only dates the text states.
