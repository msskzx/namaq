# Nasab rank pipeline

`Person.nasabRank` in PostgreSQL is a prominence rank (1 = most prominent)
computed offline from the nasab/family graph in Neo4j and used to break ties
in people search and to order the default "browse all people" listing.

The graph is static/seed-stage, so this is a manual, on-demand recompute —
not something run live per request, and not a cron job. Run it whenever new
Person nodes or relationships are added to the Neo4j seed data.

## Dry run

```bash
npm run people:rank
```

Prints, without writing anything:

- Neo4j node/edge counts.
- The **raw** ranking: every person ordered purely by the centrality
  algorithm's score, before any override.
- The **final** ranking: the same list after the Prophet Muhammad ﷺ override
  (see below), which is what would be persisted.
- How many profiles would be updated (`toWrite`), how many ranked people have
  no PostgreSQL profile (`graphOnly` — expected, e.g. ancestors that don't
  yet have a profile page), and how many PostgreSQL profiles have no Neo4j
  node (`postgresOnly` — left untouched).

## Apply

```bash
npm run people:rank -- --apply
```

Writes `nasabRank` and `nasabRankComputedAt` to every PostgreSQL profile with
a matching Neo4j node. This **renumbers essentially every profile**, not just
ones near a newly added node or relationship — ranks are relative ordinal
positions (1..N), not raw scores, so adding a single person to the graph can
shift everyone else's number even if their relative order doesn't change.

## Validate

```bash
npm run people:rank:validate
```

Exits non-zero if the Prophet override fails (his slug is missing from the
graph) or if no profiles would be ranked at all (likely a Neo4j connectivity
or empty-graph problem). Intended as a CI hook once CI exists for this repo.

## Prophet Muhammad ﷺ is always rank 1

This is a guaranteed contract, not an emergent property of the centrality
algorithm: `applyProphetOverride` in
[`src/lib/nasabRank.ts`](../src/lib/nasabRank.ts) runs unconditionally as the
last step of every rank computation, moving his slug (`prophet-muhammad`) to
rank 1 and renumbering everyone else 2..N in their existing relative order.
It throws rather than silently doing nothing if his slug isn't found in the
graph. Swapping the underlying centrality algorithm (currently PageRank, via
the pluggable `CentralityAlgorithm` type) never risks this guarantee, since
the override is applied to the algorithm's output, never baked into its math.

## Search integration

`nasabRank` and a live title count (from the existing `PersonTitles`
relation) are used as sequential tie-breakers in
[`src/lib/personSearch.ts`](../src/lib/personSearch.ts): text-match quality
always decides first, then `nasabRank` (lower/more prominent first), then
title count (more first). A person with no computed `nasabRank` (not yet
ranked, or no Neo4j node) sorts after every ranked person at the same
match/title tier — never ahead, so unranked profiles behave exactly as they
did before this pipeline existed.

## Current boundary

Every relationship type in the graph contributes to the rank (not just
direct lineage), since the nasab/family graph includes marriage and extended
relations that also reflect a person's place in it. The title-count signal
uses the existing `PersonTitles` join table rather than a graph; a dedicated
titles graph (title nodes clustering the people who share them) is being
prepared separately and, when ready, can replace that source without
changing how search combines the two signals.
