# Stable graph layout

Status: design decisions settled; final confirmation of shared understanding
pending. This is the implementation plan, not a record of implemented behavior.
Application code and database contents have not changed during this interview.

## Objective

Make Namaq a stable graph map: selecting a subject, expanding relationships,
or applying filters reveals content at saved positions without moving other
subjects. Camera movement follows the learner's navigation intent.

The [graph-map ADR](adr/0005-use-a-precomputed-global-graph-map.md) replaces the
[earlier exploration plan](graph-exploration-plan.md)'s nearby-placement rule.
Relationship semantics, independent expansion retention, introduction caps,
and the single-workspace model remain the baseline.

## Agreed decisions

| Decision | Agreed behavior |
| --- | --- |
| Q1: shared positions | Compute x/y using all nodes and all relationship types, then reuse those positions for every query and graph consumer. Include every node kind and graph-only ancestors. |
| Storage annotation | Save coordinates on every Neo4j subject. Use Neo4j as the graph response's coordinate source and retain existing PostgreSQL metadata updates. |
| Q2: selection | Keep the camera steady when the selected subject is comfortably visible. Otherwise pan enough to reveal it outside the panels, retaining zoom. Selection never rearranges nodes. |
| Q3: data changes | Recalculate after historical data updates, reviewing the result before applying it. Positions may change through these updates and remain fixed between them. |
| Q4: additions | Expansion and global filtering preserve the camera. An explicit Show additions action frames the additions and their connecting subjects. Fit graph frames the entire visible exploration. |
| Q5: dragging | Disable individual node dragging; keep graph pan and zoom. |
| Q6: navigation | Initial loads, shared links, and refreshes frame the selection at a readable zoom, or fit the exploration when nothing is selected. Start over reframes its reset graph. Back/Forward retains the camera, with Q2's minimal pan for an obscured restored selection. |
| Q7: feedback lifetime | Show additions targets the latest completed action's additions. Keep it available until used, dismissed, or the visible subjects change again. It does not expire after five seconds. |
| Q8: update handling | Historical data changes infrequently. Use ordinary loading/refetching to receive saved coordinates; add no special handling for recalculation during an open exploration. |

The Q8 decision excludes a Refresh graph prompt, layout revisions in API
responses, cross-request revision checks/restarts, and historical layout
storage. It deliberately leaves coordination with an open exploration outside
this change. Normal persistence validation and error handling still apply.

## Implementation sequence

### Phase one: compute and persist the complete map

Extend `scripts/graph/computeGraphLayout.ts` and the existing layout functions.

- Fetch the complete Neo4j graph regardless of default UI filters. Reuse the
  existing ranking, community grouping, and offline force layout.
- Use stable input ordering for reproducible results on unchanged data.
  Account for current node and label dimensions in collision spacing; the
  present rank-tier radii differ from rendered label-sized circles. Inspect
  the full arrangement before saving it. Some crossing edges and distant
  related subjects are acceptable.
- Persist `layoutX/layoutY` on every Neo4j subject, keyed by kind and slug.
  Retain the existing PostgreSQL rank, cluster, and layout metadata updates.
  Canonical syncs preserve extra Neo4j properties, so covering graph-only
  subjects requires no new profile records or PostgreSQL schema.
- Validate complete, finite coordinates before writing. Save the Neo4j set
  transactionally and verify all expected subjects were matched. PostgreSQL
  and Neo4j writes are separate; failures must surface and be safe to retry.
- Preserve dry-run/apply behavior. Bootstrap coordinates for existing data
  during rollout. Future structural data updates rerun the required rank
  and layout commands through the repository's documented workflow.

### Phase two: serve and render saved positions

Update the graph API, `graphFilter.ts`, and `GraphSurface.tsx`.

- Enrich both scoped and unified responses from the same Neo4j coordinate
  source. A shared batched lookup covers existing query shapes without
  duplicating coordinate handling in each node-construction branch.
- Preserve valid zero coordinates and distinguish equal slugs across kinds.
  Keep PostgreSQL rank enrichment from overriding Neo4j coordinates.
- Preserve `x/y/fx/fy` through filtering, selection, and hide/reveal. Disable
  live layout movement, random nearby placement, and individual node dragging.
  Selection-dependent edge descriptions and arrows continue to update.
- Missing or invalid coordinates produce a recoverable graph-load error,
  rather than silently omitted subjects, invented origin coordinates, or a
  live physics fallback. Validate coverage before enabling this path.
- Apply fixed positions to workspace, profile, battle, and homepage graph
  consumers while retaining their existing page shells and node appearance.

### Phase three: camera and Show additions

Update `GraphCanvas.tsx` and its exploration integration.

- Resolve selected, focused, and default subjects in priority order using
  actual fixed coordinates. Separate first-load/reset framing from ordinary
  selection and data updates.
- Measure the usable graph area around desktop panels and the phone sheet.
  Make minimal selection pans within that area, retaining zoom. Initial
  framing, Fit graph, and Show additions may set zoom intentionally.
- Fit graph includes every visible subject, including graph-only ancestors.
  Remove the old rank-based exclusion that compensated for drifting nodes.
- Preserve the camera through selection already in view, deselection,
  expansion, visibility changes, and Show full graph. Back/Forward follows
  Q6; store no new camera parameters in URLs or browser history.
- Track added subject IDs, not just net count changes. Show additions frames
  the latest completed expansion/filter action's new visible subjects and
  their connecting subjects that were already visible.
- Keep the action through selection-only changes. Clear it when used or
  dismissed, and clear or replace it when visible membership changes.
  Collapse or actions adding no subjects offer no stale Show additions.
  Extend existing feedback to local expansions as well as global filters.
- Add English and Arabic text and accessible controls matching light/dark
  themes. Leave later style changes for the user's separate request.

### Phase four: verify and roll out

- Add colocated regressions at the actual API, filtering, rendering, and
  camera seams. Cover persistence dry runs and failures as well as output.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm test`.
- Run the updated layout command in dry-run mode, review coverage and the
  arrangement, then apply and verify saved coordinates before exercising the
  fixed-rendering path. Use the configured local PostgreSQL/Neo4j environment;
  worktrees need their `.env` link as documented in `AGENTS.md`.
- Verify actual geometry in a browser: rendered label spacing, panel
  clearance, and absence of visual drift need visual verification.
- Update README's implemented behavior and data-update workflow after
  implementation is verified. Keep this plan and the ADR aligned.

## Acceptance scenarios

| Scenario | Pass condition |
| --- | --- |
| Same subject via different queries | Full graph, person, lineage, battle, focus, and exploration queries return identical saved coordinates for the same kind/slug. |
| Complete coverage | All four kinds, graph-only ancestors, and isolated subjects have finite coordinates; valid zeros survive; equal slugs across kinds remain distinct. |
| Select an already visible subject | Every position stays fixed; camera and zoom remain unchanged; descriptions update correctly. |
| Select an off-screen or obscured subject | Pan reveals that subject in the usable viewport without resetting zoom or focusing the default subject instead. |
| Expand or filter | Existing nodes and camera stay fixed. Additions appear at global coordinates; hiding and revealing restores identical positions. |
| Show additions | The latest additions and their connecting subjects are framed only after clicking. Successive actions replace the target; removed subjects and old timers leave no stale feedback. |
| Fit graph and navigation | Fit includes unranked subjects; initial/shared/refresh/reset framing and Back/Forward follow Q6. |
| Input and rendering | Node dragging cannot displace a subject. Pan/zoom work, edge presentation remains correct, and unrelated re-renders cause no movement. |
| Offline writes | Dry run makes no writes; every expected node is saved; incomplete output or persistence failure is reported and retryable. |
| Visual verification | Inspect full graph and a small exploration, long Arabic labels, large expansions, desktop/phone panel clearance, RTL/LTR, and light/dark themes. |

## Verified causes and test seams

Inspected against PR #33 head `91044f8`:

- The scoped API branch returns after a person-rank-only join and omits layout
  coordinates; only the unified branch currently attaches saved coordinates.
- `graphFilter.ts` strips position locks, including under default visibility
  exclusions. `GraphSurface.tsx` retains node objects but a new graph-data
  reference restarts the force renderer.
- The camera's single array search accepts selected, focused, or default
  subjects together, allowing array order to beat selection. Its source
  coordinates can also differ from rendered coordinates.
- A temporary reproduction used real exploration, filtering, and surface
  components with the installed force engine behind a renderer substitute.
  Preserving locks eliminated measured filter-induced movement; camera
  targeting still failed independently. The temporary probe was removed.

Extend `graphLayout.test.ts`, `graphFilter.test.ts`, the graph route tests,
`GraphCanvas.test.tsx`, and exploration-hook tests where behavior changes.
Add colocated surface and layout-writer coverage. Current canvas tests mock
away camera methods; extend that seam to observe navigation intent and geometry.

## Completion of the interview

All product branches above are resolved. Remaining numerical tuning and helper
placement are implementation details to validate against these criteria.
Await the user's final confirmation of shared understanding before changing
application code or database contents, as required by the invoked grilling
skill.

## Deferred: graph-only people are not searchable

Discovered while applying Phase one, out of scope for this plan and not yet
decided -- revisit separately.

`/api/people/suggest` deliberately queries PostgreSQL only, and
`GraphSearch.tsx`'s client-side fallback excludes every person-type node on
the assumption that the PostgreSQL suggest call already covers all of them.
Neither is true for a graph-only person (no PostgreSQL row, e.g. the deep
lineage-only ancestors this plan gives coordinates to): they cannot be found
by typing their name, only by expanding a connected relative already visible
in an exploration. Visiting one directly (`/people/[slug]`) also 404s, since
that page reads the PostgreSQL-only profile route -- an existing, apparently
deliberate limitation, not a new regression.

Leaning toward making them searchable without giving them a PostgreSQL row
(preserves the existing has-a-profile/graph-only distinction): either widen
`GraphSearch.tsx`'s client-side fallback to stop excluding persons (only
helps once they're already loaded in the current view), or add a
Neo4j-backed match to the suggest path for people missing a PostgreSQL row
(finds them from a blank exploration too). "View profile" would keep
dead-ending for them either way, same as today.
