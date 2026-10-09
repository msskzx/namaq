# The unresolved-name count includes battles, and no edit can clear them

Sixteen names were unresolved in al-Zubayr's entry, and the task was to resolve them. None
moved, and five of them are not people at all: `بَدْرٍ` (twice), `اليَرْمُوْكِ`, `الخَنْدَقِ` and `فَتْحِ مَكَّةَ` are the
objects of `PARTICIPATED_IN`. `coverageOf` counts every mention without a live identification,
and an identification names an agent, so an event mention can never leave the count.

**Evidence:** `src/lib/model/coverage.ts` (the `unresolved` filter), and the "Unresolved
names, dated sentences and office" section of `data/works/siyar-alam-al-nubala/summary.md`.

**Implications:** the number "16 unresolved names" mixes people owed an identification with
events that have no mechanism for one. Decide how a mention points at an event, or report
event mentions apart from people, before anyone treats the count as work to finish.
