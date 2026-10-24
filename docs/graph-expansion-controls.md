# Expansion decisions

[Graph exploration](graph-exploration.md) owns the current filter, scope and retention rules. Those rules supersede conflicting behavior below. These decisions explain the storage semantics and rejected alternatives behind expansion.

## Agreed decisions

1. **Match both directions for one-way relations, incoming only for reciprocal
   ones.** The rule is a statement about storage, not grammar. Both directions
   are needed rather than merely the outgoing one because any kind can now be a
   root: expanding a Person by `HOLDS_TITLE` wants the title, expanding a Title
   by `HOLDS_TITLE` wants its holders. This is unambiguous precisely because
   these relations have no reciprocal edge to double-count.

2. **A blanket undirected match is rejected.** `A -FATHER-> B` names the
   source's *role* toward the target; `A -HOLDS_TITLE-> B` names the source's
   *action*. Matching family relations both ways would return a person's
   children under "Father", which `expansion.test.ts:39` already pins.

3. **Reverse edges in the sync scripts are rejected for cross-kind relations.**
   `ACCOMPANIED_BY` earned its place because companionship is a real reciprocal
   relationship. "Held by" is not: inventing it adds 484 edges and a filter
   toggle each, to avoid one branch in one function.

4. **Reciprocity becomes a checked property for the relations that should have
   it.** The static test at `neo4j/graphSeedData.test.ts` -- which covered only
   `FATHER`/`MOTHER`/`SON`/`DAUGHTER` -- extends to every reciprocal type.

   **Amended during implementation.** The plan said to grow `INVERSE_PAIR` into
   that map. Doing so would have been a silent UI regression: `INVERSE_PAIR`
   feeds `governingRelationType`, and `GraphCanvas`'s `ALL_RELATION_TYPES`
   keeps only types that govern themselves, so every type added as a key
   disappears from the Filters panel -- `FATHER` and `SON` would collapse into
   one switch. The reciprocity map is therefore a separate export,
   `RECIPROCAL_INVERSES`, and `INVERSE_PAIR` is untouched.

   Inverses are not written automatically: a `FATHER` edge's inverse is `SON`
   or `DAUGHTER` depending on the child, which the query text does not encode.
   The test accepts any listed inverse for that reason.

5. **The middle tier of expansion controls is deleted.** `ExpansionControls`
   renders three tiers today: All direct relations, one button per relation
   type grouped into immediateFamily/extendedFamily/marriage/other, then the
   three lineage actions. The middle tier goes, leaving four buttons. The
   Filters panel already offers per-relation control, and three tiers of
   relation controls is the complaint this plan started from.

6. **"All direct relations" respects the active filters.**
   `expandAllDirectRelations` (`src/components/graph/GraphCanvas.tsx:396`)
   expands every relation with a non-zero count, ignoring the hide-list. Since
   `COMPANION_OF` is excluded by default, a fresh visit currently fetches ~253
   companion nodes that the renderer then hides.

7. **Switching a relation on fetches it, via `filter`.** Decisions 5 and 6
   together would otherwise create a dead control: with no per-relation
   expansion button left, and All direct relations no longer over-fetching,
   switching `COMPANION_OF` back on would un-hide data nothing had loaded. The
   machinery to avoid this already exists -- `?filter=` reaches `globalFilters`
   via `parseExplorationInput`, `buildExploration` reveals every neighbor of
   that type across all visible subjects, and `useExplorationGraph` then
   fetches whatever became visible, looping until nothing new appears.

8. **`relation` is deleted, and one param survives.** The Filters panel writes
   `filter` instead. The `relation` param, the `NO_EXCLUDED_RELATIONS`
   sentinel, and the `excludedRelations` branch of `filterVisibleGraph` all go;
   `filterVisibleGraph` keeps its `showCompanionTitle` and `personSearchSlugs`
   handling. The two-layer split is what produced this bug, and once the middle
   tier is gone there is no reason a user should distinguish "revealed but
   hidden" from "not revealed".

   Switching off a filter removes its contribution to discovery. It does not
   hide recorded links between retained subjects or override independently
   expanded branches -- **except companionship**, which is hidden with its
   switch. Both stored directions hang off the Prophet in bulk (253
   `COMPANION_OF` and 253 `ACCOMPANIED_BY`), so on a default visit 37 of them
   were still drawn between people held up by family relations, against a
   switch reading off. `ACCOMPANIED_BY` follows `COMPANION_OF` here as it
   already does everywhere else, through `governingRelationType`. Both endpoints of an independent expansion remain
   while they have a matching connection; unsupported nodes disappear.
   Searched roots remain visible on their own, including after Start over.
   This follows the earlier [connection-visibility decision](adr/0001-separate-expansion-from-connection-visibility.md)
   and the user's clarification during phase three. Switching a filter back
   on may require fetching neighborhoods again.

9. **Old `?relation=` links are not translated.** Nothing in the repo generates
   them -- every one in existence came from a user clicking a toggle. A
   faithful mapping would mean carrying the `NO_EXCLUDED_RELATIONS` sentinel
   logic into the new param indefinitely, since an absent `relation` means
   `DEFAULT_EXCLUDED_RELATIONS` rather than "nothing hidden". Old links fall
   back to defaults.

10. **The live graph is checked, not only the seed.** The static test guards
    what the seed declares; nothing guarded what the graph actually contains,
    which is why four wrong edges survived. A live check reports drift in both
    directions -- person-to-person edges the graph holds that the seed never
    declared, and edges the seed declares that the graph lacks -- excluding the
    relation types the sync scripts legitimately own (`COMPANION_OF`,
    `ACCOMPANIED_BY`, `HOLDS_TITLE`, `PARTICIPATED_IN`, `INVOLVED_IN`,
    `PART_OF`). The two checks catch different failures: one guards what is
    declared, the other what is deployed.
