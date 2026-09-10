---
status: accepted
---

# Use a precomputed global graph map

Compute each subject's position using the complete graph, including every node
type and relationship type, and reuse those saved coordinates for every graph
query. Selection, expansion, and filtering reveal parts of this shared map
without rearranging it, allowing learners to retain their spatial bearings.

This replaces placement near the expanded subject with placement in the global
map: a small exploration can contain gaps or long connections. Every subject,
including graph-only ancestors without a profile, needs a saved position; a
per-exploration force-layout fallback would violate the decision. Recalculate
the map when historical data changes, reviewing the result before applying it.
Positions remain fixed between recalculations, but an update may move them.

Persist coordinates on every Neo4j subject, including subjects without a
PostgreSQL row. Graph responses use Neo4j as their consistent coordinate source;
retain the existing PostgreSQL metadata updates. This covers the complete graph
without creating profile records solely for layout storage. Detailed camera
and update behavior is recorded in [graph layout](../graph-layout.md).

Historical data updates are infrequent, so ordinary loads and refetches receive
the latest saved positions. Special coordination with open explorations,
layout revision protocols, and an update-specific refresh prompt are outside
this change.
