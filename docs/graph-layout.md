# Stable graph layout decisions

[ADR 0005](adr/0005-use-a-precomputed-global-graph-map.md) explains why every graph consumer shares a precomputed map. [Local setup](local-setup.md) owns the recomputation procedure.

## Agreed decisions

| Decision | Agreed behavior |
| --- | --- |
| Q1: shared positions | Compute x/y using all nodes and all relationship types, then reuse those positions for every query and graph consumer. Include every node kind and graph-only ancestors. |
| Storage annotation | Save coordinates on every Neo4j subject. Use Neo4j as the graph response's coordinate source and retain existing PostgreSQL metadata updates. |
| Q2: selection | Keep the camera steady when the selected subject is comfortably visible. Otherwise pan enough to reveal it outside the panels, retaining zoom. Selection never rearranges nodes. |
| Q3: data changes | Recalculate after historical data updates, reviewing the result before applying it. Positions may change through these updates and remain fixed between them. |
| Q4: additions | Expansion and global filtering preserve the camera. An explicit Show additions action frames the additions and their connecting subjects. Fit graph frames the entire visible exploration. |
| Q5: dragging | Disable individual node dragging; keep graph pan and zoom. |
| Q6: navigation | A link naming a subject other than the graph's own frames that selection at a readable zoom. The opening view is fitted instead, as is any load with nothing selected: its selection is the graph's own subject and what it exists to show is that subject's whole line, which no fixed zoom frames. Start over reframes its reset graph. Back/Forward retains the camera, with Q2's minimal pan for an obscured restored selection. |
| Q7: feedback lifetime | Show additions targets the latest completed action's additions. Keep it available until used, dismissed, or the visible subjects change again. It does not expire after five seconds. |
| Q8: update handling | Historical data changes infrequently. Use ordinary loading/refetching to receive saved coordinates; add no special handling for recalculation during an open exploration. |

The Q8 decision excludes a Refresh graph prompt, layout revisions in API
responses, cross-request revision checks/restarts, and historical layout
storage. It deliberately leaves coordination with an open exploration outside
this change. Normal persistence validation and error handling still apply.

Recomputation must be deterministic on unchanged data and account for rendered label dimensions when spacing nodes. Some long or crossing edges are an accepted trade-off.

## Integrity constraints

Missing or invalid coordinates must produce a recoverable load error. Silently dropping subjects, inventing origin coordinates or falling back to live physics would break the shared map.

Validate complete, finite coordinates before writing. PostgreSQL and Neo4j writes are separate, so failures must surface and be safe to retry. Review the dry run before applying a structural graph update.
