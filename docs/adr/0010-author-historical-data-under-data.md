---
status: accepted
---

# Author historical data under `data/`

Namaq currently authors historical facts in PostgreSQL seed modules, graph-only
people and relationships in Neo4j Cypher modules, and evidence in
`data/history/`. Some PostgreSQL writers are dormant, so files and live rows can
already disagree. Repository records under `data/` are the only
authoring source for historical subjects, relationships, source accounts,
claims, and citations. Seed code, PostgreSQL, Neo4j, and graph layout values
become derived projections and must not be edited as independent facts.

This decision uses two authored layers. Historical source material and cited
claims record what particular works and editions say, including disagreement.
Canonical subject and relationship records state the editorial selection that
Namaq currently projects. Calling `data/` authoritative therefore means it can
rebuild Namaq; it does not declare one historical account to be unquestionable
truth.

Existing historical data was extracted without recorded sources. We will migrate
the repository's existing records once as an explicitly unreviewed legacy
baseline. We will not infer citations, treat the current live databases as
authority, or delay the workflow until old data is researched. New additions and
later changes must be paired with eligible historical-source claims before
promotion. ADR 0011 records how each citation's evidence role is classified.

The agreed layout is one canonical file per subject slug under
`data/catalog/<kind>/`. These are data-only TypeScript modules loaded directly
by seed commands; no generated seed copy is introduced. Each selected value
references supporting claim keys or carries an explicit legacy marker during
migration. Review batches remain revisioned approval units with one focal subject
and any supporting records needed to make its change coherent. An approved
revision covers its source material, claims, citations, and proposed canonical
operations. The same approval authorizes evidence import and deterministic
catalog promotion; claim review status remains independent.

Existing PostgreSQL subject writers and their Neo4j synchronization paths remain.
Person-to-person relationships are projected from the catalog directly to Neo4j;
we will not add a PostgreSQL relation model that provides no application
functionality. Relationship writes must be idempotent, so encountering the same
semantic relationship through the other person cannot change the graph.
Equivalent declarations combine their claim references, while incompatible
declarations fail validation. Profile-backed and graph-only people use one
canonical person type with an explicit profile capability.

Version one uses one eligible historical source per focal subject and does not
rank claims. When that source reports alternatives, the catalog follows the
author's stated preference, then the consulted editor's. If neither chooses, it
retains an existing value or uses the first report in source order for a new
field. All alternatives and citations remain recorded.

We considered retaining `prisma/*SeedData*.ts` and `neo4j/graphSeedData*.ts` as
coequal authoring sources. That preserves the current split, cannot give one
answer when stores disagree, and leaves dormant writers easy to miss. We also
considered treating historical source text as sufficient to generate app values.
That fails when sources conflict or a value requires editorial interpretation.

Consequences: data changes gain an explicit research, review, promotion, seed,
sync, and drift-check path. Clean rebuilds become possible. Uncited legacy values
remain visible as unreviewed legacy data rather than receiving invented evidence,
and backfilling them can proceed independently after cutover. Deletion semantics,
relationship normalization, and operational details are specified in
[the implementation handoff](../authoritative-data-workflow-plan.md). Explicit
removal follows ADR 0012.
