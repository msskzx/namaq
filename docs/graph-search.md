# Graph search decisions

[Graph exploration](graph-exploration.md) owns the current filter, search-enablement, reset and removal rules. Those rules supersede conflicting behavior in this decision record.

## Agreed decisions

1. **A separate endpoint, not a widened one.** `/api/graph/suggest` covers all
   four kinds. `GraphSearch` calls it alone and `matchGraphNodes` is deleted,
   along with the now-dead `nodes` prop at its three render sites.
   `/api/people/suggest` returns to people with PostgreSQL profiles only. The
   two searches answer different questions: the directory searches profiles,
   the workspace searches the graph.

2. **Shared through a library function, not an internal HTTP call.** Both
   routes call one exported function. A route handler fetching another handler
   in the same app needs an absolute origin URL that differs per environment,
   serializes twice, and loses end-to-end types, for no isolation benefit.
   Both remain real routes; only what sits behind them is shared.

3. **Subject vocabulary throughout.** `src/lib/personSearch.ts` becomes
   `src/lib/subjectSearch.ts`: `SubjectSearchCandidate`, `rankSubjectSearch`,
   `filterAndRankSubjects`, `normalizeSubjectSearch`. One normalizer serves
   every kind, including its Latin spelling-equivalence table -- those
   spellings appear inside battle and event names too. `fullName` becomes an
   optional field that non-person candidates leave null.

4. **Non-person results become exploration roots.** Selecting any suggestion
   appends `subject=<kind>:<slug>` and sets `selected=<slug>`, identically for
   all four kinds. The exploration model already permits this:
   `parseSubjectParam` accepts every kind (`src/lib/relationship/urlState.ts:17`),
   `buildRouteFetchParams` routes any subject into `relationSubjects`, and the
   graph route matches by kind and slug across labels
   (`src/app/api/graph/route.ts:264`).

5. **Selecting a hidden kind reveals it.** `DEFAULT_KINDS` is
   `['person', 'title']` and `useExplorationGraph.ts:49` drops any fetched node
   whose kind is not included, so a battle root would otherwise be discarded in
   silence. Selecting a suggestion of a hidden kind adds that kind to the
   active set. Searching a battle by name is a sufficient statement of intent.

6. **The Companion title node is not a special case.** It ranks normally;
   selecting it sets `showCompanionTitle=1`, the same rule as decision 5
   applied to the one node with its own visibility flag. Ranking only breaks
   ties among subjects that already matched the query text, so it cannot
   surface unless the query matches its name.

7. **Neo4j is the candidate source for all four kinds.** The syncs already
   write `name` and `nameTransliterated` onto Title, Battle and Event nodes;
   people additionally carry `fullName`. One PostgreSQL query over person slugs
   sets `hasProfile`. Two queries, one candidate source.

8. **One ranking signal: `graphRank`.** Match score first, then `graphRank`,
   then name. `graphRank` is PageRank over the unified graph
   (`src/lib/graphRank.ts:1`), the only prominence signal defined across kinds.

9. **`nasabRank` and `titleCount` are removed as signals.** `graphRank`
   subsumes both -- `HOLDS_TITLE` edges already feed it, so a title count is a
   second vote for titles. The `/people` listing order
   (`src/app/api/people/route.ts:37`) and the workspace side list
   (`src/components/graph/GraphCanvas.tsx:331`) are repointed at `graphRank`.
   Measured on the live data, the two orderings correlate at Spearman 0.924,
   but the first page of `/people` changes substantially: senior companions
   rise (Umar 61st to 2nd, Abu Ubayda 143rd to 6th) and lineage-only figures
   fall (Abu Talib 4th to 18th). This is a deliberate product change and takes
   its own commit.

10. **`graphRank` is persisted to Neo4j.** `computeGraphLayout.ts` writes
    `layoutX/layoutY` to Neo4j but `graphRank`/`clusterId` only to PostgreSQL,
    so the 276 graph-only people have no `graphRank` at all. It is written to
    Neo4j alongside the coordinates. See
    [ADR 0006](adr/0006-persist-offline-computed-properties-to-neo4j.md).

11. **`hasProfile` and `kind` are explicit on every result.** The current
    convention that an absent `hasProfile` means "has a profile" is the kind of
    implicit rule that let the old `matchGraphNodes` comment go stale.

12. **No per-kind slot reservation.** One merged list capped at 10, no
    guarantee that each matching kind appears. Match score sorts before
    `graphRank`, so an exact battle-name match already outranks a
    contains-match on any person, and battle and event names are distinct from
    personal names. Revisit if the data grows well beyond its current size.

13. **No search index.** The whole searchable set is 659 subjects (576 people,
    40 titles, 26 battles, 17 events). Loading candidates and ranking them in
    memory, as the current endpoint does, stays appropriate at this size. This
    is a considered choice, not an omission.

14. **The graph route reads `graphRank` from Neo4j.** `attachNeo4jLayout`
    already matches every node on `(type, slug)` in one batched query; it
    returns `graphRank` alongside the coordinates, and `attachPostgresRanks` is
    deleted. Without this, decision 9's repointing of the side list would sort
    all 276 graph-only people last, since they have no PostgreSQL row -- the
    same defect `nasabRank` has today. One source also retires the hazard the
    route currently documents at `src/app/api/graph/route.ts:53`, where
    PostgreSQL rank enrichment has to be kept from overriding Neo4j
    coordinates.

15. **`clusterId` is no longer served.** Nothing has ever read it from the
    payload, and `src/lib/graphLod.ts`, the level-of-detail feature it was
    shaped for, is imported by nothing. It remains computed and persisted: it
    is a live input to the offline layout, which seeds cluster centres from it
    (`src/lib/graphLayout.ts:70`). This is not the `nasabRank` case, and it
    argues nothing about `src/lib/graphCluster.ts`.

## Rollout constraint

The retirement of `nasabRank` required deploying its replacement before dropping the PostgreSQL columns or removing the old Neo4j property. Removing data while deployed code still reads it makes the directory fail. The recomputation completed on 2026-09-08; this record does not establish whether the later cleanup was applied.

## Deferred proposals

Mobile graph usability, profile links for graph-only ancestors, data enrichment and unused level-of-detail code were outside the original search change. Treat these as proposals to check against current code, not approved new features.
