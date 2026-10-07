---
status: accepted
---

# A stated ordering is recorded, and the placement built from it is derived

An event with no year is shown as "Unknown" and sorted last, although sources often say it
came after one dated event and before another. The model's plan (section 2.13 of
[data-model/plan.md](../plans/data-model/plan.md)) and
[ADR 0024](0024-read-the-text-and-stop-where-it-is-unclear.md) said a placement between
two events needs an owner-approved Inference. This ADR changes that for what the text
states.

A sentence that says one event came before another (`قبل المبعث`, `بعد بدر`) is an
ordering constraint the text presents, so it is recorded directly, as a catalog record
`CatalogOrdering { earlier, later, claims }` between the two events. Only `BEFORE` is
recorded, and `AFTER` is the same pair read the other way. Two events in one year do not
contradict it. An offset (`بخمس عشرة سنة`) stays in the quote and is never computed.

The interval an undated event is shown in is derived from its constraints and the dated
events around them. It is displayed as approximate and never as a date, with both
premise events named and linked to their quotes, and it needs no per-item approval,
since it adds nothing the text does not state. An undated event with no constraint stays
last.

Sources can disagree, and [ADR 0022](0022-a-shown-value-rests-on-an-attributed-statement.md)
says Namaq never picks one reading. A cycle within one source is a data error. A cycle
across sources, or a constraint that contradicts an event's year in another source, is
kept with both readings, and the event is marked order disputed and left unplaced. For the
same reason an event whose `hijriYear` carries a disputed claim is not placed by that
year: its readings are listed and it keeps its place among the unplaced. The catalog's
single `hijriYear` field stays as it is, and the battle counts' habit of taking one
reading is not copied into the field the timeline sorts on.

A catalog ordering may cite a batch claim key or a model span reference `unit#span`.
`catalog:validate` resolves the span and fails when it does not exist, and editing a cited
span lapses the ordering's review.

Plan: [time-layer.md](../plans/time-layer.md). Decided on the owner's delegation on
2026-10-08.
