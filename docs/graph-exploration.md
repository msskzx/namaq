# Graph exploration

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
   while retaining the selected subject's local choices. Defaults also apply
   when there is no saved or user-chosen state. Only connections allowed by
   the filters are visible; contribution retention still applies, subject to
   filter eligibility.
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
   Battle node type starts off and is enabled manually. On first enablement
   all statuses are included, including status not recorded. Multiple selected
   statuses match with OR semantics (for example injured or captured);
   subsequent actions respect the user's status choices.
7. Battle status applies to each person's participation in a particular battle.
   A nonmatching participation connection is hidden. The person remains if
   independently supported by another eligible contribution, such as a family
   relationship; otherwise the person is removed from the visible exploration.
8. Collapse branch removes the selected subject's outward exploration
   contributions, including subsequent expansions belonging to that branch,
   while retaining the selected subject. Subjects independently supported by
   another branch or search remain. This is distinct from switching off one
   relationship contribution.
9. Remove from exploration (renamed **Hide node** in the interface) hides the
   selected subject and all its incident connections and collapses its
   branch. Independently supported descendants remain. Active global filters
   cannot immediately reintroduce the explicitly removed subject; explicitly
   searching it or explicitly expanding a local relationship restores its eligibility. Show full graph respects removals. Both removal actions affect
   exploration state, not historical data, and browser Back can undo them.
10. Keep only selected subject and direct relations (renamed **Keep only this
    node**) replaces the visible exploration with that subject and its
    filter-eligible direct neighbors, removing all other subjects and
    connections. Reset global filters to their defaults (all off), rather
    than temporarily suspending them. Preserve the selected subject's local
    choices. Discard other exploration contributions so they cannot restore
    subjects outside this direct neighborhood.
11. Opening a graph installs, for its subject and without the reader pressing
    anything, every direct relation the subject has, and its line in both
    directions. One rule covers both the workspace and an embedded profile
    graph. A fresh visit and Start over on the workspace open on Prophet
    Muhammad; a person's profile opens on that person. Neither line is capped.
    Companionship stays off, as its own switch governs it (ADR 0007). Battles
    and every global relationship filter start off too, and restored URLs
    continue to represent saved exploration state.
12. Hidden nodes and relationships must not respond to hover or display hover
    content.
13. Buttons support optional icons through a shared component
    (`src/components/common/Button.tsx`), per the UI rule in `AGENTS.md`.
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
while its future is decided; the action itself still restores from a saved
URL. Rule 1's scope choice is one slider carrying both scopes rather than two
buttons, and rule 6's status choices sit inside the battles group, under the
participation relation they qualify. Node kinds join the same panel, above
the slider, since they are not a scoped choice.

Rule 1 revises the scope model in [ADR 0004](adr/0004-merge-overview-into-exploration.md).
Rule 2 revises [ADR 0001](adr/0001-separate-expansion-from-connection-visibility.md)'s
unconditional connection visibility. Terms remain in [CONTEXT.md](../CONTEXT.md).
