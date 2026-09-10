# Exploration rules review

Status: confirmed by the user. Initial code audit completed; see
[implementation plan and handover](graph-exploration-implementation-plan.md). This document records decisions from
the current review; it makes no claims about implementation compliance.

## Confirmed rules

1. Support separate local (selected subject) and global relationship filtering.
   Local choices reveal the selected subject's matching direct connections.
   Global relationship filters start off in exploration. Additional connections
   between existing subjects require the matching global filter, unless already
   supported by an active local contribution. Changing selection does not move
   or reinterpret earlier contributions. Local controls are the default in
   exploration. An explicit Selected subject / Entire graph switch chooses
   scope. With no subject selected, local controls are disabled; the UI never
   silently switches to global.
2. Filter state governs which nodes and relationships are shown. Search,
   expansion, and ordinary reset actions respect the current on/off choices
   rather than enabling excluded filters. Start over restores all filter
   defaults; Keep only selected resets global filters to their defaults (off)
   while retaining the selected subject's local choices. Defaults also apply when there is no saved
   or user-chosen state. This revises
   the earlier unconditional rule to show every recorded connection between
   retained subjects: only connections allowed by the filters are visible.
   Contribution retention still applies, subject to filter eligibility.
3. Companionship starts off. One manual toggle handles both recorded directions
   (`COMPANION_OF` and `ACCOMPANIED_BY`). When off, searches and other actions
   respect that exclusion; when on, companion relationships are eligible to
   appear. Explore, ordinary reset actions, and group or bulk relationship
   on/off toggles do not change this toggle. Bulk actions exclude companionship
   in both directions, preserving its current state whether on or off.
   Start over restores all filter defaults, including companionship off,
   while clearing exploration contributions and cap history. Explore includes
   companions when their filter has been manually enabled and excludes them
   when it is off; the action never changes filter state.
4. A subject introduced by global filter F retains its cap for F throughout
   that exploration, including later independent search/revelation, removal
   and reintroduction, and filter off/on. Manual subject expansions remain
   unrestricted. There is no next-global-hop action; repeated toggling cannot
   advance the same filter. A still-active global filter can act on manually
   revealed subjects that have never acquired its cap. Start over clears the
   cap history.
5. Removing a searched starting point removes only its search contribution.
   Another active contribution can retain the subject. Its own active
   expansions remain until explicitly collapsed.

6. Battle filters include participation-status filters, including injured.
   The README also documents killed and captured as examples of recorded
   statuses. The complete supported set has not been verified in code; this
   review does not invent additional historical statuses. Battle node type
   starts off and is enabled manually. On first enablement all statuses are
   included, including status not recorded. Multiple selected statuses match
   with OR semantics (for example injured or captured); subsequent actions
   respect the user's status choices.
7. Battle status applies to each person's participation in a particular battle.
   A nonmatching participation connection is hidden. The person remains if
   independently supported by another eligible contribution, such as a family
   relationship; otherwise the person is removed from the visible exploration.

8. Collapse branch removes the selected subject's outward exploration
   contributions, including subsequent expansions belonging to that branch,
   while retaining the selected subject. Subjects independently supported by
   another branch or search remain. This is distinct from switching off one
   relationship contribution.
9. Remove from exploration hides the selected subject and all its incident
   connections and collapses its branch. Independently supported descendants
   remain. Active global filters cannot immediately reintroduce the explicitly
   removed subject; explicitly searching it restores its eligibility. Both
   removal actions affect exploration state, not historical data, and browser
   Back can undo them.

10. Keep only selected subject and direct relations replaces the visible
    exploration with that subject and its filter-eligible direct neighbors,
    removing all other subjects and connections. Reset global filters to their
    defaults (all off), rather than temporarily suspending them. Preserve the
    selected subject's local choices. Discard other exploration contributions
    so they cannot restore subjects outside this direct neighborhood.
11. Opening a graph shows its subject with that subject's ancestors and
    descendants, as the subject's own expansions. One rule covers both scopes:
    a fresh visit and Start over on the workspace open on Prophet Muhammad,
    and a person's profile opens on that person. Neither line is capped, so a
    subject with many recorded descendants arrives with all of them. Other
    local relationship choices, companionship, battles, and global
    relationship filters start off. Restored URLs continue to represent saved
    exploration state.

    This supersedes the earlier rule, which opened on the recorded wives,
    sons, daughters, and grandchildren. Those are single recorded hops rather
    than a line, so they left a profile graph with no rule of its own and made
    the two scopes behave differently.
12. Hidden nodes and relationships must not respond to hover or display hover
    content. The user reports that they currently do; this is a reported bug,
    not yet reproduced or diagnosed under the docs-only review boundary.

13. Buttons support optional icons through a shared component. Reuse or extend
    an existing component if available; add one only if none exists. Use icons
    where they clarify the action, following the UI rule in `AGENTS.md`.
    Component availability and the existing icon system await code inspection.

14. Search may show a result whose node type is disabled, with an explanation.
    Adding it requires the user to manually enable that type; search does not
    silently change node-type filters.
15. Expansions expose loading and retry states, preserve the existing graph on
    failure, and never silently truncate results. Empty results are shown
    explicitly without removing the existing exploration.
16. Direct and lineage contributions are independent. Collapsing one preserves
    subjects supported by the other, consistent with the retention rules.

Later revisions: [ADR 0007](adr/0007-filters-choose-the-relationship-vocabulary.md)
settles what Explore (previously All direct relations) applies and what Show
full graph turns on. The Paternal lineage button is withdrawn from the panel
while its future is decided; the action itself still restores from a saved URL.
Two actions are renamed in the interface, with their behavior unchanged: rule
9's Remove from exploration is Hide node, and rule 10's Keep only selected is
Keep only this node. Rule 1's scope choice is one slider carrying both
scopes rather than two buttons, and rule 6's status choices sit inside the
battles group, under the participation relation they qualify. Node kinds join
the same panel, above the slider, since they are not a scoped choice.

Rule 1 revises the scope model in [ADR 0004](adr/0004-merge-overview-into-exploration.md).
Rule 2 revises [ADR 0001](adr/0001-separate-expansion-from-connection-visibility.md)'s
unconditional connection visibility. Terms remain in [CONTEXT.md](../CONTEXT.md).
These current decisions supersede conflicting historical control, reset, and
search-auto-enablement rules in the exploration and search plans. The current review takes precedence for these revised behaviors.

## Acceptance criteria and validation

| Rule | Acceptance criterion | Later validation |
| --- | --- | --- |
| Selected scope | With Muhammad and his wives present, select Aisha and enable Father: that action introduces only Aisha's father. | Inspect shared relationship logic and add or run a focused regression if needed. |
| Global scope | Global filters start off. Enabling global Father permits father connections between existing subjects. It also introduces missing fathers with the previously agreed per-relation one-hop cap; toggling does not advance the cap. | Inspect scope state and test cross-connections independently from local contributions. |
| Contribution removal | Collapse Muhammad's Wives contribution while Aisha has an independent Parents expansion: retain Aisha and her parents. | Check provenance and overlapping-contribution tests. |
| Connection visibility | Connections between retained subjects appear only when allowed by current filters. | Check subgraph construction and rendering filters, including inverse-pair presentation. |
| Filter preservation | Search, Explore, and ordinary resets preserve on/off filter choices; companionship starts off. Start over restores defaults. | Test each action with filters on/off and with default versus restored state. |
| Start over | After companionship is manually enabled and other filters changed, Start over restores every filter default, including companionship off, clears previous contributions and cap history, and reveals Muhammad with his recorded direct wives, sons, daughters, and grandchildren. | Test reset from nondefault filter states and browser Back restoration. |
| Bulk and group toggles | With companionship off, group/all-on leaves it off; with companionship on, group/all-off leaves it on. Both recorded directions retain the same state. | Test group and master toggles in both directions with companionship initially on and off. |
| Companion expansion | Explore includes companions only when their filter is enabled, without changing that state. | Test direct expansion with companionship on and off. |
| Companion directions | The dedicated toggle handles both COMPANION_OF and ACCOMPANIED_BY under the chosen subject/global scope. | Test from the Prophet and a companion, including inverse-record deduplication. |
| Persistent cap | Searching or removing/reintroducing a Father-introduced subject does not make it trigger global Father; manual expansion still works. Start over clears history. | Check provenance lifecycle, restoration, and cap regressions. |
| Search contribution removal | Removing a searched subject preserves it if another contribution supports it, including its own active expansion. | Test isolated roots and overlap with local/global contributions. |
| Battle participation status | Battle node type defaults off. Manually enabling it initially includes all statuses and unrecorded status. Selecting injured and captured matches either. | After docs confirmation, verify supported values and test defaults, multi-selection, and preserved choices. |
| Battle retention | A nonmatching participation connection disappears, while its person remains if another eligible contribution supports them. Status in one battle does not determine status in another. | Test one person in two battles with different statuses, plus independent family support and participation-only support. |
| Collapse branch | In Muhammad → Aisha → Abu Bakr, collapsing Aisha's branch keeps Aisha and removes Abu Bakr unless independently supported. Subsequent expansions belonging only to the branch are removed too. | Test nested contributions, shared descendants, and browser Back. |
| Remove from exploration | Removing Aisha hides her and all incident connections, collapses her branch, retains independently supported descendants, and blocks immediate global-filter reintroduction. Explicit search can restore her. | Test removal under active global filters, shared support, explicit search restoration, and browser Back. |
| Local connections versus global connections | With Muhammad selected and local Father, Father-in-law, and Wives enabled, reveal the matching direct subjects and his connections to them. Wife–father connections stay hidden while the matching global filter is off, unless independently revealed locally. | Test the recorded wife/father example with global Father off/on and an independent local Father contribution. |
| Keep only selected | Retain the selected subject and its eligible direct neighbors; reset global filters to defaults (off), preserve selected-local choices, and discard other subjects and contributions. | Test a multi-branch exploration, filter exclusions, and absence of old contributions restoring discarded nodes. |
| Fresh view | Show Muhammad with recorded direct wives, sons, daughters, and grandchildren; other local choices, companionship, battles, and global relationship filters off. Do not infer grandchildren through two-step parentage. | Test fresh initial state separately from restored URLs and Start over, including no further generations. |
| Hidden hover targets | After filtering, collapsing, removal, or Keep only selected, hidden nodes and edges produce no hover highlight or tooltip. | Verify rendered and hit-test membership; visually reproduce by moving over former node/edge positions, including a previously hovered item. |
| Default control scope | Exploration opens with local controls; global controls are entered deliberately rather than used by default. | Test initial control state and scope changes without changing earlier contributions. |
| Button icons | The shared button supports text-only and icon-with-text use; icons clarify appropriate actions and icon-only controls have accessible names. | Inspect the existing component/icon system; verify representative buttons in Arabic/English, light/dark themes, and keyboard use. |
| No selection | Local controls are disabled and the scope never silently switches to global. | Test deselection and explicit scope changes. |
| Removal restoration | Refresh/shared links preserve removals; search or explicit local expansion restores a removed subject; Start over clears removals; Show full graph respects them. | Test each restoration path with active global filters. |
| Disabled-kind search | Results explain disabled kinds and require manual enablement before adding a subject. | Test battle search while battles are off, with no implicit filter mutation. |
| Loading and failure | Loading is visible; failure offers retry and retains the graph; empty results are explicit; full-depth results are not silently truncated. | Test pending, empty, failed, retry, and large-result cases. |
| Direct/lineage overlap | Collapsing either contribution preserves subjects still supported by the other. | Test both collapse orders and shared descendants. |

## Affected components

Documentation identifies `src/lib/relationship/`,
`src/components/graph/GraphCanvas.tsx`, `src/lib/graphFilter.ts`, and
`src/app/api/graph/route.ts` as relevant audit areas. These paths and their
current responsibilities have not been verified against code in this review.
The layout docs also identify `src/components/graph/GraphSurface.tsx`; inspect
its rendering and hit-testing integration when diagnosing hidden hover targets.
After confirmation, first trace scope and contribution state, then relationship
retrieval, then visibility and controls. This is an audit handoff; code changes
are not yet proposed.

## Validation and operations

The code audit follows final documentation confirmation. Use existing automated
coverage as evidence and identify uncovered acceptance criteria. Repository
checks are `npm run lint`, `npx tsc --noEmit`, and `npm test`. Browser verification
is reserved for geometry and visual behavior that these checks cannot establish.

No database changes are required for this documentation review. Any later person
data changes must use the canonical synchronization pipeline. Any later graph
structure changes require layout dry run, review, and apply under `AGENTS.md`.

## Confirmation and remaining verification

Product questions raised in this review are settled and the user confirmed
the documentation. The linked implementation plan records verified code gaps;
this specification is not a claim that the implementation satisfies it.

Nonblocking verification tasks for the code phase:

- Verify documentation-referenced paths, current responsibilities, button/icon
  availability, battle-status values, and the direct grandchild records.
- Map each criterion above to existing coverage and report gaps. Identify exact
  implementation changes only after this audit; no new source paths are proposed.
- Preserve the earlier baseline where not revised: full-depth lineage, factual
  inverse descriptions, saved fixed positions, explicit camera actions,
  bilingual/theme support, and browser navigation restoration. Use the linked
  exploration and layout plans for their acceptance scenarios.

No data writes, migrations, or source-code changes are authorized by the docs
confirmation alone; the next step is the requested compliance audit. Any fixes
will be grounded in its findings.
