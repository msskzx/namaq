# Graph-only people are searchable

Status: agreed, not yet implemented. Follows up on
[the stable graph layout plan](graph-layout-plan.md)'s "Deferred: graph-only
people are not searchable" note, discovered while applying that plan's
Phase one.

## Problem

A [graph-only person](../CONTEXT.md) (present in Neo4j, no PostgreSQL row)
cannot be found by typing their name -- only by expanding a connected
relative already visible in an exploration. `/api/people/suggest` is
PostgreSQL-only by design; `GraphSearch.tsx`'s client-side fallback excludes
every person-type node on the assumption that PostgreSQL already covers all
of them, which is false for these people. Visiting one directly also 404s,
since `/people/[slug]` reads the PostgreSQL-only profile route.

## Agreed decisions

1. **Findable by search -- agreed.** A graph-only person should be findable
   by name from a blank exploration, not just by expanding into them.
2. **No profile destination -- agreed.** Rather than inventing a profile
   page from graph data alone, the "View profile" affordance is omitted for
   a graph-only person. There is nothing to show beyond what the graph
   itself already shows once they're revealed.
3. **One combined suggest endpoint -- agreed.** `/api/people/suggest`
   queries both PostgreSQL and Neo4j and returns one merged, ranked list,
   rather than a separate endpoint merged client-side. Its "the directory
   lives in PostgreSQL" framing is retired; the route now means "people,
   searchable, wherever they're recorded."
4. **One ranking, not two tiers -- agreed.** Matches are ranked by match
   quality then nasabRank, profiled or not, in a single list. A profiled
   person is, in practice, already the more prominent one, so a separate
   "profiled first" tier would be redundant with the ranking itself.
5. **nasabRank extended to Neo4j -- agreed.** `computeNasabRanks.ts`
   already computes nasabRank over the complete Neo4j family graph but only
   persists it for PostgreSQL-backed people, discarding it for everyone
   else -- the same gap `layoutX/layoutY` had before the layout plan's
   Phase one. Write it to every matching Neo4j subject the same way, so the
   combined ranking has a real signal for graph-only people instead of
   nothing.
6. **No client-side widening -- agreed, and reconsidered mid-interview.**
   `GraphSearch.tsx`'s `matchGraphNodes` keeps excluding all person-type
   nodes. Once the suggest endpoint covers every person (PostgreSQL-backed
   or graph-only), there is no remaining gap for the client fallback to
   fill, and widening it would only risk duplicate rows for someone already
   loaded in the current view. Its comment should be corrected to state
   this actual reason, not the previous (already-inaccurate) one.
7. **No extra dropdown label -- agreed.** The absence of a "View profile"
   button is enough to communicate that a result has no profile; an
   explicit label ("no profile", etc.) risks reading as a judgment about
   the person rather than a plain data-completeness note.

## Out of scope

Non-person kinds (title/battle/event) are unaffected -- they were never in
`/api/people/suggest` and keep their existing client-side match against
whatever the current view has already loaded.
