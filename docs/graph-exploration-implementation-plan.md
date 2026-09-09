# Exploration implementation plan and handover

Status: planned, not implemented. The user confirmed the
[exploration rules](graph-exploration-review-plan.md) and requested a compliance
audit and implementation plan. The final instruction was to wrap up, commit,
and push this documentation for handover. No application code was changed.

## Resume here

- Worktree: `/Users/msskzx/Projects/namaq/.codex/worktrees/exploration-rules-review`.
- Branch: `codex/exploration-rules-review`.
- Audited application commit: `53baccd584469655c6e581e6723383e7a2c16eb0`.
- Read `AGENTS.md` and the confirmed review plan before implementing. That plan
  supersedes conflicting older exploration, search, and reset descriptions.
- `.env` is verified as a symlink to the main checkout's file. Dependencies
  were installed with `npm ci`; Prisma Client was generated. No database writes
  or seed/layout commands were run.
- The original desktop task remains attached to the old worktree at
  `/Users/msskzx/.codex/worktrees/ba94/namaq`. Use the repository-local worktree
  above for all work. The desktop Worktree root setting was not changed.
- Apply `unslop` to prose, `ponytail` to implementation choices, and
  `write-comments` before code comments. Reuse existing modules and Font Awesome.

## Audit findings

Line references describe the audited application commit, not future edits.

| Confirmed requirement | Current evidence | Required change |
| --- | --- | --- |
| Explicit local/global scope, local by default | `src/components/graph/GraphCanvas.tsx:378–404` infers expansion scope from selection; `:453–468` separately mutates whole-view edge exclusions. | One explicit scope control; disable local controls without selection. Scope stays attached to the action. |
| Local contributions control their own connections; extra cross-connections need a global filter | `src/lib/relationship/exploration.ts:85–90` includes every edge between visible subjects; `src/lib/graphFilter.ts:41–51` then applies global raw-label exclusions. | Derive eligible nodes and logical connections from scoped contributions before rendering. Global off must not suppress an independently supported local connection. |
| Lifetime caps and restoration | `exploration.ts:15–19` stores roots, expansions, global filters only; `:61–82` rebuilds introduction provenance from the current snapshot. | Persist per-relation cap history. Searching a previously introduced node must not let it trigger the same global filter again. |
| Independent branch retention and collapse | `exploration.ts:55–59` adds expansion neighbors but not the anchor; `exploration.test.ts:52–64` supplies Aisha as a search root, masking anchor retention. | Give active contributions anchor support and branch ownership; preserve independent supports when collapsing. |
| Lineage/direct overlap | `src/lib/relationship/lineageExpansion.ts:17–48` flattens lineage into ordinary hops and loses the originating action identity. | Preserve the lineage contribution identity while reusing traversal. |
| Remove and Keep only selected | No removal/exclusion/branch fields in `ExplorationInput` or `urlState.ts:11–15`. `useExplorationGraph.ts:73–77` adds all full-graph subjects as roots. | Add explicit removal state and branch actions; full graph must respect removals. Keep only resets global filters to off and discards other contributions. |
| Minimal initial/reset family | `GraphCanvas.tsx:434–440` expands all direct relations on a fresh visit; `:667–673` resets to Muhammad alone. | Use the same explicit starting family for fresh visit and Start over: WIFE, SON, DAUGHTER, GRANDSON, GRANDDAUGHTER. Do not infer grandchildren. |
| Manual-only companion choice | `GraphCanvas.tsx:396–404` includes every counted relation; `:459–468` bulk/group toggles include companionship. | Bulk/group operations preserve companionship in either state. All direct respects the dedicated toggle; Start over resets it off. |
| Companion toggle covers both directions | `categories.ts:82` pairs ACCOMPANIED_BY with COMPANION_OF for visibility, but `expansion.ts:33–47` matches reciprocal labels incoming only. | Reuse the pairing for companion expansion/counts in both directions; do not make family matching indiscriminately undirected. |
| Disabled-kind search needs manual enablement | `GraphSearch.tsx:97–107` automatically enables a searched kind and companion title; `:110` uses router.replace. | Explain disabled results and require manual enablement before adding; use navigable history for exploration changes. |
| Battle-status filtering | `prisma/schema.prisma:237–255` stores status arrays; `relationship/status.ts` colors them; filter panel has no status choices. | OR filtering on participation records, including an explicit unrecorded option; retain independently supported people. |
| Failure preserves graph, retry available | `useExplorationGraph.ts:119–123` keeps previous SWR data, but `GraphSurface.tsx:129–131` replaces the canvas on error. Hook exposes no retry/completeness outcome and limits global fetch rounds to six. | Retain last successful graph, show nonblocking error/retry, and establish completion rather than silently stop at a round limit. |
| Hidden hover targets disappear | `GraphSurface.tsx:57–89` prunes node/link pools, but pointer painting at `:175–181` has no membership guard; fixed renderer uses cooldownTicks=0. | Reproduce before choosing a fix. Stale hit-test canvas is a hypothesis, not a verified cause. |
| Shared button with optional icon | No exported shared Button was found under src; ExpansionControls has a private ExpansionButton. GraphCanvas already uses installed Font Awesome. | Add a small shared Button in `src/components/common/Button.tsx` (proposed new file), with optional icon and native button props. |

Verified data and reusable behavior:

- `neo4j/graphSeedData.ts:157–160` records direct GRANDSON/GRANDFATHER pairs
  between Muhammad and al-Hasan/al-Husayn. Production database coverage was not
  checked; no new genealogy is required by the plan.
- Actual status values are DIED, INJURED, CAPTURED, WAS_CAPTURED, ABSENT_EXCUSED,
  and MARTYRED. Do not replace these with an invented KILLED value. Preserve
  existing translated labels; empty status arrays mean status not recorded.
- Existing matchers distinguish reciprocal family roles from one-way cross-kind
  relations. Preserve that behavior and verified inverse descriptions.
- Existing lineage traversal handles full depth and cycles. Fixed node positions,
  camera actions, bilingual strings, and theme support are existing foundations.

## Implementation sequence

### 1. Extend exploration state and its URL codec

Work in `src/lib/relationship/exploration.ts`, `urlState.ts`, and their colocated
 tests. Keep state serializable and transitions pure. Represent local choices,
explicit control scope, global choices, participation-status choices, cap history,
explicit removals, and contribution ownership. Use kind+slug identity throughout.

Retain an originating contribution identity for lineage and branch expansion.
Record enough support to distinguish dependent descendants from independently
searched or expanded branches. Avoid a generic event-sourcing framework: extend
the existing state and helpers. An active local contribution supports its anchor.

Persist cap history only for actual successful global introductions. Being a
source does not cap a subject; being introduced by filter F caps it for F.
Search/removal/reintroduction never erase that history. Explicit removal is a
separate veto: search/local expansion can clear that veto without clearing caps.

Implement transitions for search-root removal, branch collapse, explicit removal,
Keep only selected, and Start over. Keep only resets global choices to defaults,
retains selected-local choices, discards other branches, and preserves lifetime
caps. Start over clears caps/removals and installs the minimal default family.

Round-trip all state needed for refresh, links, and Back/Forward. Keep absent
(default) and explicitly empty choices distinct. Handle existing subject/expand/
filter URLs in the codec; document any legacy relation hide-list limitation
rather than silently claiming identical restoration. Do not add server storage.

### 2. Derive membership and connections from contributions

Update `exploration.ts`, `expansion.ts`, `lineageExpansion.ts`,
`renderExploration.ts`, and `status.ts`. Reuse `connections.ts` for inverse facts.

Compute node support and allowed connections together. A local action reveals
its subject's eligible relations; global filters permit matching cross-connections
and capped one-hop introductions. Preserve all independent supports, including
when multiple global filters reach the same subject. Companion matching must
cover both recorded directions without changing family role interpretation.

Apply kind and participation-status eligibility before introducing nodes. Status
matching is OR across enabled statuses for that battle participation, with a
separate unrecorded choice. Removing a nonmatching edge must not delete a person
supported by another branch. Apply explicit removals to every path, including
full graph. Use finite visited subject/filter pairs to stop automatic traversal;
a repeated filter toggle cannot advance a cap.

### 3. Integrate fetching, restoration, and failures

Update `src/components/graph/useExplorationGraph.ts` and tests. Reuse the existing
`src/app/api/graph/route.ts` neighborhood/lineage responses and status data;
change API queries only if a regression proves missing evidence or completeness.

Carry contribution and cap state through successful fetch completion without
creating navigation loops. Ignore obsolete responses after state changes. Replace
the unexplained six-round stopping condition with verified completion or an
explicit recoverable failure. Expose retry and empty/loading outcomes while
retaining the previous successful graph. Full graph uses the same eligibility
rules, including explicit removals.

### 4. Wire controls and initial behavior

Update `GraphCanvas.tsx`, `ExpansionControls.tsx`, `RelationFilterPanel.tsx`,
`GraphSearch.tsx`, and `src/components/language/translations.ts`.

- Explicit Selected subject / Entire exploration control; local default and
  disabled local controls without selection. Selecting another subject never
  changes existing contributions.
- One state model for scoped relationship choices, replacing the workspace's
  separate raw-label hide layer. Preserve embedded view behavior while sharing
  relationship semantics; audit every `filterVisibleGraph` caller before edits.
- Bulk/group state and handlers exclude companionship, including their computed
  all-on/all-off indicators. Its dedicated switch controls both directions.
- Add status controls when battles are enabled. Initialize all statuses on;
  subsequent kind toggles preserve user status choices until Start over.
- Search results for disabled kinds explain why adding is unavailable; no implicit
  kind or companion-title enablement.
- Add Collapse branch, Remove from exploration, and Keep only selected actions.
  Fresh view and Start over share the minimal family initializer.
- Add the shared optional-icon button and use it for appropriate graph actions.
  Reuse Font Awesome, retain labels/accessibility, RTL, and light/dark support.

### 5. Diagnose hover and validate the complete journey

Reproduce the reported hover issue with the actual renderer: hover a subject or
edge, hide it, then move over its former location. Repeat for filter changes,
collapse, remove, Keep only, and status changes. Inspect data membership, object
pools, current tooltip state, and hit-test canvas invalidation before fixing.
Use the same eligible graph for drawing and pointer interaction; preserve camera
and fixed positions. Do not remount the whole graph as an unverified workaround.

Add `src/components/graph/GraphSurface.test.tsx` (proposed new file) for membership
changes and stale-hover callbacks. Follow with browser verification; a mocked
renderer cannot prove that its real hit-test canvas was cleared.

## Acceptance and validation

The full acceptance matrix is in the confirmed review plan. Each implementation
phase must cover its rows before proceeding. Prioritize these regressions:

1. Muhammad local Wives/Father-in-law reveals neighbors without wife–father edges;
   global Father reveals those edges and capped missing fathers. Independent
   local Father still works while global Father is off.
2. A searched A introduces B globally; B remains capped after search, off/on,
   removal/reintroduction, refresh, and sharing. Manual B→C remains allowed;
   still-active global Father may introduce D from previously uncapped C.
3. Collapse and remove nested branches with shared nodes, cycles, multiple
   supports, and direct/lineage overlap in both collapse orders. Explicit removal
   blocks globals/full graph until manual restoration.
4. Fresh/Start over family defaults, companion bulk exceptions in both states,
   disabled battle search, status OR/unrecorded cases, Keep only global reset,
   and Back/Forward restoration. Use the reactive next/navigation mock pattern
   from `GraphSearch.test.tsx`.
5. Loading, empty response, failed fetch, retry, stale response, and full-depth
   completion. Keep the existing graph usable during failures.
6. Browser checks for hidden hover targets, camera stability, desktop/phone,
   Arabic/English, and light/dark. Verify the shared buttons by keyboard too.

Required checks after implementation: `npm run lint`, `npx tsc --noEmit`, and
`npm test`. Tests belong beside the code. Update README's implemented section
only once the new behavior is verified.

Baseline audit checks on the unchanged application:

- Lint passed with an existing warning at GraphSurface.tsx:128: unnecessary
  graphData dependency in useImperativeHandle.
- TypeScript passed.
- Vitest: 46 files, 343 tests passed. Passing existing tests does not establish
  compliance with newly confirmed behavior; several encode the older model.
- Hover reproduction and live database validation were not performed.

## Data, rollout, and remaining limits

No schema migration or historical data changes are expected. Preserve existing
PostgreSQL/Neo4j synchronization and fixed positions. If actual missing records
require data changes, use the canonical pipelines. Any graph structure changes
require layout dry run, review, then apply per AGENTS.md, even where older plans
claim an exception for inverse edges. Never seed or recompute merely to implement
client exploration state.

No product questions block implementation. Concrete state representation and
legacy URL adaptation are implementation details to validate in phase 1. Hover
root cause remains an investigation task, not a confirmed diagnosis. Review the
current branch against any newer main changes before implementation; this audit
is pinned to the commit above. No PR was created during this handover.
