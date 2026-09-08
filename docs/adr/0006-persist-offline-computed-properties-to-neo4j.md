---
status: accepted
---

# Persist offline-computed subject properties to Neo4j

Every property computed offline over the graph and stored for later reads is
written to Neo4j, on every subject it applies to. PostgreSQL may keep its own
copy for operator inspection, but Neo4j is the source responses read.

Neo4j is the only store with complete subject coverage. PostgreSQL holds
profile rows, and a [graph-only person](../../CONTEXT.md) has none -- 276 of
576 people at the time of writing. A derived property persisted only to
PostgreSQL therefore does not exist for them, and any feature reading it treats
those subjects as unranked or unplaced rather than as ordinary subjects.

Three properties reached this conclusion separately. `layoutX`/`layoutY` were
PostgreSQL-only until the [layout plan](../graph-layout-plan.md) moved them,
`nasabRank` until the [graph-only people
plan](../graph-only-people-search-plan.md) did the same, and `graphRank` until
the [subject search plan](../graph-subject-search-plan.md). Each time the gap
surfaced as a feature quietly excluding graph-only subjects rather than as an
error. Recording the rule is meant to stop the fourth property from repeating it.

The cost is duplication: two stores hold the same derived scalar, and a
compute-and-persist script has to write both and validate both. That is
accepted deliberately. The alternative -- creating PostgreSQL rows purely so
derived data has somewhere to live -- would invent profile records for people
about whom nothing is recorded, which
[ADR 0005](0005-use-a-precomputed-global-graph-map.md) already rejected for
coordinates.

This governs derived properties only. Authored data keeps its existing
direction: PostgreSQL is authoritative for titles, battles and events, which
are projected into Neo4j by the sync scripts, while person nodes are authored
in the graph seed.
