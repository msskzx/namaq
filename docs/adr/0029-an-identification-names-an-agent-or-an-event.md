---
status: accepted
---

# An identification names an agent or an event

[ADR 0022](0022-a-shown-value-rests-on-an-attributed-statement.md) ties a Mention to an
Agent through an Identification. The objects of `PARTICIPATED_IN` and `ABSENT_FROM` are
mentions too (`بَدْرٍ`, `اليَرْمُوْكِ`, `فَتْحِ مَكَّةَ`), but what they name is a battle
or an event, which has a catalog slug and is not a person. Until now they could not be
identified, so `model:coverage` counted five of the 16 unresolved names of the al-Zubayr
entry although nothing about them was unresolved.

An Identification now names exactly one of `agent` or `event`. The kind is set on what
the mention is identified as, never on the mention string: `اليَرْمُوْكِ` is a river and
a battle, `بَدْرٍ` is also the well, and `فَتْحِ مَكَّةَ` contains a place. The basis
span says which is meant, here the `يَوْمَ` that opens each of the five phrases.
`model:check` fails an identification that names both or neither, checks an event slug
against the battles and events of the catalog, fails an agent identification on the
object of a participation, and fails an event identification on the subject of any
assertion.

`model:coverage` reports `unresolvedPeople` and `unresolvedEvents` separately. A mention
is an unresolved event when it is the object of a participation and has no
identification; every other unidentified mention is an unresolved person. An identified
participation carries the battle slug as its object in the profile entry.

We considered a mention role `EVENT`. It would have hidden the count without saying
which battle is meant, and it fixes the kind on the string. We also considered letting a
participation's object skip identification and read the slug from the catalog, which
makes the catalog the author of the text's reading.

Consequences: `Identification.agent` becomes optional, and the readers that want a
person (`profile`, `unitRows`, `conversation`) skip an event identification.
