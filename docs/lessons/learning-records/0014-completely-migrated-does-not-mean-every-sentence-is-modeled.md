# "Completely migrated" does not mean every sentence is modeled

When the owner asked for al-Zubayr to be migrated completely, the first thing missing was a
way to say what "completely" would mean. The model holds a selection: 24 spans for names, titles,
ages, appearance, battles and the like. The entry has 342 sentences over pages 41 to 67.
`model:check` was happy with 24 spans for years, because it checks that each span is valid and
says nothing about what no span covers. The same blind spot made the Jibril hadith pages drop
a whole turn of conversation until the owner read them
([0008](0008-prove-a-split-by-putting-it-back-together.md)).

`npm run model:coverage -- siyar-v4-3-az-zubayr` now finds the entry from its heading to the next
entry's heading and puts every sentence in one of two piles: covered by a span, or not modeled.
The result is 24 covered and 318 not modeled, which is mostly the chains of narration, the texts of
the hadith and the battles' narrative. Eight of the 318 are date sentences, tagged
`time-layer:waiting` or `time-layer:unreadable`, and the second tag is for `بضع وخمسون`.

**Evidence:** the command's output (counts are in `data/works/siyar-alam-al-nubala/summary.md`) and
`src/lib/model/coverage.test.ts`, which runs the count over every entry and fails when the piles do
not add up to the whole or when a span sits outside the entry.

**Implications:** a migration is complete when every sentence is accounted for, not when every
sentence is a field. The nothing-is-dropped guarantee is the real deliverable, and the not-modeled
pile is a to-do list that other predicates can shrink. It also puts a number on the owner's
question "what is still unaccounted for?": the answer used to be "we do not know".
