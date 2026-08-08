# Canonical people pipeline

PostgreSQL `Person.slug` is the canonical identity for a person with a profile
page. Neo4j `:Person.slug` is the same identity in the relationship graph.

Run a non-mutating reconciliation report with:

```bash
npm run people:sync
```

The report distinguishes the following cases:

- **Profiles missing from Neo4j**: a profile needs a graph node.
- **Property mismatches**: `name`, `fullName`, or `nameTransliterated` differ
  for the same slug.
- **Graph-only people**: valid people such as ancestors that do not yet have a
  profile page. They are reported but never treated as errors or removed.

After reviewing the report, synchronize profile-backed people to Neo4j:

```bash
npm run people:sync -- --apply
```

This is deliberately one-way and non-destructive: it uses `MERGE` by slug,
updates the shared properties supplied by PostgreSQL, and never deletes Neo4j
nodes, relationships, or graph-specific properties. A `null` optional profile
property is not used to clear an existing Neo4j value, so importing incomplete
profile data cannot erase graph enrichment.

Use the strict validation mode in CI to fail when there are missing graph nodes,
conflicting shared fields, or invalid slug/name data:

```bash
npm run people:validate
```

## Current boundary

The pipeline intentionally does not create PostgreSQL profiles for graph-only
people, resolve renamed slugs, or decide which historical spelling is correct.
Those are editorial decisions and should be reviewed before becoming automated.
