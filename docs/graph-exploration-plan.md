# Graph exploration design

Current review: [Exploration rules review](graph-exploration-review-plan.md)
records the confirmed rules and remaining questions from the docs-only review.
Its confirmed decisions take precedence over conflicting historical proposals.

Status: discovery interview in progress. This document records the requested
outcomes, verified current behavior, and open decisions. Recommendations are
proposals until the user answers them; this is not an approved implementation
plan.

## Requested outcomes

- Start with a searched person and learn by following their relationships.
- Choose which relationships to reveal around each selected person, then
  continue through other people in the graph.
- Interpret choices such as sons or parents relative to the selected person.
  Choosing sons must not reveal that person's father merely because their own
  relationship to their father is recorded as SON.
- Make ancestors and descendants accessible while exploring a selected person;
  remove the search-mode dropdown.
- Show the recorded connections between wives and their fathers when those
  people are visible together, such as Aisha and Abu Bakr or Hafsa and Umar.
- Preserve the full graph's value for discovering clusters while deciding how
  it fits with the new exploration flow.

## Verified current behavior

These findings come from repository code and seed data, not a live database or
browser check.

- `src/lib/graphFilter.ts` filters relationship labels across the entire view.
  Its one-hop person-search restriction accepts either endpoint and has no
  selected-person-relative relationship interpretation.
- `src/components/graph/GraphCanvas.tsx` implements Explore neighbours by
  replacing `focus` and clearing person, ancestor, and descendant roots. It
  does not retain a sequence of independent expansions.
- `src/app/api/graph/route.ts` returns one-hop Person relationships for person
  and focus queries. It does not fetch every recorded edge between the returned
  neighbors. Person-search filtering also excludes edges that do not touch a
  search root, and raw WIFE/FATHER_IN_LAW filters would exclude FATHER/DAUGHTER
  edges even if those edges had been fetched.
- Seed data records wife and father-in-law connections to Prophet Muhammad,
  and father relationships from Abu Bakr to Aisha and Umar to Hafsa. The
  reported missing connections are therefore explainable by view behavior;
  their presence in the deployed database has not been checked.
- The API's current `ancestorsOf` query follows the paternal FATHER chain.
  `descendantsOf` follows SON/DAUGHTER chains through recorded children.
  README descriptions of ancestors as both paternal and maternal disagree
  with the current API.
- The focus response constructs edges from the anchor to its neighbor even
  when the stored relationship points the other way. Path responses preserve
  the relationship's stored direction. Directional exploration must account
  for this discrepancy.
- Search currently has Relations, Ancestors, and Descendants modes. The graph
  also supports title, battle, and event nodes, so the scope of the new
  exploration controls needs an explicit decision.

## Design tree

### Round one: agreed decisions

1. **Placement:** exploration is the default. Retain Overview for discovering
   clusters, as proposed in the first round.
2. **Expansion scope and retention:** after Muhammad → Wives → select Aisha →
   Parents, retain Muhammad and the revealed wives and add only Aisha's recorded
   parents. Each person's expansion choices are independent.
3. **Connections between visible people:** automatically show all recorded
   relationships between them. This adds edges without introducing additional
   people; additional hops are a separate question.
4. **Ancestry meaning:** offer Ancestors through both parents and a separate
   Paternal lineage / Nasab option. Remove the search-mode dropdown. How these
   options are presented and operated remains open.

The person-relative meaning of choices such as sons and parents is also a
requirement from the original request: sons must not reveal the selected
person's own father due to an inverse stored relationship.

See [the glossary](../CONTEXT.md) and
[the expansion decision](adr/0001-separate-expansion-from-connection-visibility.md).

### Agreed interaction model

Search identifies a person. Selecting a visible person changes whose controls
and information are shown; selecting alone does not expand relationships.
The selected-person panel offers direct-relation expansion choices and visible
Ancestors, Paternal lineage / Nasab, and Descendants controls. These reveal
people around that selected person and preserve previous expansions.

The selected-person panel and search-mode dropdown's removal are agreed. The
specific button appearance, collapse behavior, and page shell remain open.

### Round two: agreed decisions

5. **Where expansion lives:** a selected-person panel with visible
   direct-relation and lineage controls. Search only identifies the subject;
   the selected person's panel determines what to reveal.
6. **Initial reveal:** show only the searched person and their
   available expansion choices, with an explicit All direct relations action,
   rather than revealing their entire neighborhood automatically.
7. **Lineage depth:** Ancestors, Paternal lineage, and Descendants go all the
   way through the recorded parentage reachable from the selected person.
   There is no user-facing generation limit or Show another generation step.
   Results must not be silently truncated; loading behavior for large results
   still needs to be specified.
8. **Searching during an exploration:** add/select the searched
   person in the current exploration, with a separate Start over action to
   begin a new exploration.
9. **Node kinds:** support people, battles, titles, and events in
   exploration. Offer controls appropriate to the selected kind; lineage
   actions apply only to people. Battles and events remain off by default and
   require activation through the node-type filters. Preserve the existing
   people/titles-on default; enabling a kind does not by itself mean revealing
   every node of that kind.

### Follow-up findings and proposals

- The current defaults already include people/titles and exclude battles/events.
  Companion relationships and the shared Companion title have separate default
  exclusions; their treatment in exploration is still open.
- Recommend **Paternal lineage** for the English label, with help text describing
  father → grandfather → earlier fathers. The technical term is patrilineal
  descent. **Lineage** alone does not distinguish the father-only chain from
  other descent lines; see [OpenStax on descent](https://openstax.org/books/introduction-anthropology/pages/11-3-reckoning-kinship-across-cultures).
  Final Arabic/English labels remain open.
- Expansion controls should be buttons with visible active state, scoped to the
  selected subject. Global node-type filters remain a distinct concept.
- The user proposes a map-style page that fills the viewport on arrival, with
  a collapsible search/results/details panel and hideable navigation/controls.
  This proposal concerns the page layout, not entering browser fullscreen.
- Current root layout always mounts a top navbar, a 72px spacer, and a footer.
  Current graph fullscreen is a CSS overlay that omits selected-node actions.
  A new viewport layout must offer the same exploration controls and preserve
  the embedded graph layout on person profiles.

### Round three: agreed decisions

10. **Page shell — agreed:** a viewport-filling graph with a collapsible panel
    on the right in Arabic and left in English. Put site navigation and settings
    in its menu, retaining small Search/Menu controls when the panel is hidden.
11. **Collapsing an expansion — agreed:** remove only that expansion's
    contribution, preserving people independently searched, expanded, or reached
    through another expansion. Example: collapsing Muhammad's Wives expansion
    preserves Aisha and her parents if Aisha has an independent Parents
    expansion, while wives with no other reason to remain disappear.
12. **Global filter scope — agreed after clarification, superseded by round six:** node-type filters in Exploration and
    global relationship filters in Overview. Hiding a node type preserves
    expansion choices for when it is enabled again.
    Clarification: node-type filters apply to the whole view (people,
    titles, battles, events). Relationship expansion buttons apply only to the
    selected subject (Aisha → Parents). The proposal removes the old whole-view
    Sons/Wives/etc. switches from Exploration so they cannot hide recorded
    connections between visible people; those switches remain in Overview.
13. **Restoration and navigation — agreed:** refresh/shared-link restoration
    of selection, expansions, and type filters, plus browser Back/Forward
    through exploration changes and a separate Start over action.

### Expansion choices — agreed after clarification

The three lineage actions are additional to the person's available direct
relationship choices. Group the controls for readability and show only options
with recorded connections for the selected subject:

- Immediate family: father, mother, sons, daughters, wives/husband, brothers,
  sisters, as available.
- Extended family: grandparents, grandchildren, uncles, aunts, cousins, and
  other recorded extended-family relationships.
- Marriage relations: fathers-in-law, mothers-in-law, and other recorded
  in-laws.
- Other connections: companions, titles, battles, events, and other recorded
  relationships. Battles/events require their node types to be enabled.
- All direct relations: the subject's immediate connections together.
- Across generations: Ancestors, Paternal lineage, and Descendants, following
  recorded parentage all the way.

These choices apply to the selected subject only. Sons must reveal that
person's sons, not their own father. Non-person subjects receive the applicable
connection choices, such as a battle's participants or a title's holders.

### Expansion choice versus connection description

The user's Father-expansion example establishes two separate perspectives:

- An expansion choice names the requested neighbor's role relative to the
  selected subject: Father requests that person's father.
- In `{source} - {relation} -> {target}`, the relation describes the source's
  role relative to the target. If the selected person is shown as source,
  expanding Father must read Muhammad — Son → Abdullah, or Aisha — Daughter →
  Abu Bakr. It must not read Muhammad — Father → Abdullah.
- The inverse description Abdullah — Father → Muhammad is factually equivalent
  but starts with the father. The requested selected-person-first presentation
  uses Son/Daughter instead. Preserve stored facts when changing presentation;
  never reverse endpoints without changing the relationship label accordingly.

Use the selected subject first for descriptions of connections touching that
subject. Selection changes the description and corresponding arrow direction,
not the relationship fact or node positions. Connections not touching the
selection retain a stable factual orientation. These choices were delegated
to the agent in question 15 and are recorded below.

### Round four: agreed decisions

14. **Fresh starting view — agreed, superseded by round seven:** Muhammad
    alone, selected with expansion controls open and no relationships
    automatically expanded.
15. **Inverse relationship presentation — delegated and decided:** draw one
    visual connection per verified inverse pair. Keep the existing
    `{source} - {relation} -> {target}` format, with the selected subject first
    for incident connections and the relationship label adjusted to that
    perspective. Other connections retain a stable factual orientation. Keep
    distinct relationships between the same subjects and preserve the stored
    records. Do not require both inverse descriptions to appear at once.
    Inverse roles must come from relationship evidence: FATHER alone does not
    establish whether the child is a son or daughter. Where a specific inverse
    is unavailable, use an accurate neutral description or retain an explicit
    factually supported direction, rather than infer a role from a name.
16. **Layout while expanding — agreed, placement revised by the layout
    follow-up:** keep existing nodes and zoom steady and provide an explicit
    Fit graph action. Newly revealed subjects use their saved global positions
    rather than the originally agreed placement near the expanded subject;
    see [the graph-map decision](adr/0005-use-a-precomputed-global-graph-map.md).
17. **All direct relations and companions — agreed:** include every recorded direct
    connection allowed by enabled node types, including companions. Show
    counts on expansion buttons so large expansions are apparent in advance.
18. **Learning information in the panel — agreed with narrower scope:** show
    the person's full name and titles only for now, alongside exploration
    controls and the View profile action. Omit lifespan and other proposed
    preview information. Existing Person data has no dedicated biography or
    summary field; do not synthesize historical content to fill a preview.
    Some graph-only people have no profile, so a missing profile must not
    prevent graph exploration; use the graph name when full name is unavailable.
19. **Phone layout — agreed:** use a collapsible bottom sheet whose compact state
    shows the selected subject and whose expanded state provides search,
    details, and expansion controls, leaving the graph visible above it.

Questions 14–19 are settled, including the delegated choice in question 15.

### Round five: master toggle and reset agreed; control scope reopened

20. **All direct relations control — agreed:** use a master toggle for the selected
    subject's eligible direct-relation choices. Turning it on enables those
    individual choices; turning an individual choice off remains effective.
    Across-generation actions remain independent. The user additionally
    requires existing filtering and the new exploration controls to share
    relationship logic throughout the system, rather than maintain separate
    implementations.
21. **Single workspace proposal — agreed, see round six:** selecting a
    subject makes controls local to that subject; no selection makes the same
    controls global. This replaces the earlier separate Exploration/Overview
    control arrangement from questions 1 and 12.
22. **Start over — agreed:** return to Muhammad alone with no expansions, people/titles
    enabled and battles/events disabled. Preserve language/theme settings and
    let browser Back undo the reset.

### Round six: single workspace and global relationship filters — agreed

23. **Single workspace — agreed:** relationship controls belong to one
    workspace, not two modes. With a subject selected, a relationship choice
    (e.g. Father) expands that subject alone. With none selected, the same
    choice becomes a global relationship filter across the whole exploration.
    Deselecting preserves the exploration already built — the panel becomes
    the current graph rather than resetting. Show full graph is a separate,
    explicit action that reveals the entire dataset within that same
    exploration; Overview as a distinct view is retired.
24. **Global relationship filter behavior — agreed:** a global relationship
    filter shows every recorded connection of its type between subjects
    already present (generalizing the automatic-connection rule from question
    3), and additionally introduces one hop of matching subjects for anyone
    present who lacks theirs. Example: with Muhammad and his wives visible,
    turning on Father reveals Muhammad's father and each wife's father in one
    action.
25. **Introduction cap — agreed:** a subject introduced by a global
    relationship filter can never itself trigger that same filter's automatic
    introduction again, permanently, preventing the filter from cascading
    through the whole dataset — Muhammad's father does not bring in Muhammad's
    grandfather. The cap is scoped per relationship type: a subject introduced
    by Wives remains eligible to trigger Father. Retriggering the filter
    (toggling it off and on) does not reset the cap or walk further out;
    considered and rejected, since it would blur the exploration into
    revealing the whole cluster.
26. **Cap does not limit manual exploration — agreed:** selecting a capped
    subject and using its own expansion choices, including full-depth Paternal
    lineage, is unrestricted. A still-active global filter also picks up one
    hop from whatever a person manually reveals, since manually-revealed
    subjects are not filter-introduced. Filter-introduced subjects follow the
    same collapse/retention rule as expansion (question 11): they remain only
    while something still supports their presence.
27. **Filter scope is fixed at trigger time — agreed:** a relationship
    control's scope (a specific subject, or the whole exploration) is decided
    by whatever is selected the moment it is switched on, then stays live
    under that scope until switched off. Selecting or deselecting something
    else afterward does not retroactively change an already-active filter's
    scope.
28. **Growth feedback — agreed:** when a global relationship filter's live
    rule adds subjects, this surfaces as lightweight, non-blocking feedback
    (for example a brief count), rather than being silent or requiring
    confirmation first.

See [the introduction-cap decision](adr/0003-cap-global-relationship-filters.md)
and [the single-workspace decision](adr/0004-merge-overview-into-exploration.md).

### Round seven: fresh visit now auto-expands the default subject

29. **Fresh starting view — revised:** a brand-new /graphs visit (no subject,
    expand, filter, or full-graph state in the URL) now auto-expands the
    default subject's own direct relations, equivalent to clicking All direct
    relations once, rather than showing that person alone with no
    connections. Restoring a shared/refreshed URL that already carries its
    own subject/expand/filter/full state is unaffected -- this only changes
    what a completely fresh visit seeds. Reuses `expandAllDirectRelations`
    exactly as the button does, so it is still subject to the same
    node-kind/relation-type visibility filters (e.g. companions stay hidden
    by default even though the underlying expansion technically includes
    them).

### Shared relationship logic — required by question 20

Use one shared module for relationship meaning across scopes. Its interface
must make the scope explicit; selection is an input to scope, not a second
copy of relation definitions or predicates. The module should own normalized
identity/direction, relationship-role matching, inverse evidence, grouping,
counts, filter-introduction provenance and its cap, and visible-subgraph
rules. Query adapters and rendering callers use those same definitions. The
specific interface is proposed implementation work now that question 21 is
resolved (round six).

Replace the existing scattered raw-label filtering as part of this work rather
than layering an unrelated local expansion predicate on top. Cover graph API
queries, GraphCanvas, the filter panel, person embeds, homepage previews, and
battle participant previews as applicable. Query retrieval can vary by scope
and scale; the meaning of a relationship cannot vary by caller.

Verified constraints for the eventual implementation:

- Existing role definitions, global exclusions, one-hop pruning, and API query
  filters are spread across `relations.ts`, `graphFilter.ts`, GraphCanvas, and
  the graph route. The current filter panel itself is mostly presentational.
- No structured gender field exists on Person or GraphNode. Reciprocal
  parent/child records supply role evidence, but lineage responses may omit
  those reciprocals. Other inverse records are not universally present.
- Scoped/unified graph responses use different identity formats, and some flat
  responses currently reverse endpoint direction. Normalize them before
  evaluating directional rules. Audit preview consumers that assume the old
  endpoint ordering when fixing those responses.

See [the shared-logic decision](adr/0002-share-relationship-semantics-across-scopes.md),
[the introduction-cap decision](adr/0003-cap-global-relationship-filters.md),
and [the single-workspace decision](adr/0004-merge-overview-into-exploration.md).

### Acceptance scenarios from settled decisions

These are requirements for the eventual implementation and tests, not claims
about functionality already built:

- A fresh /graphs visit starts with Muhammad selected and his own direct
  relations already expanded (round seven); a URL that already carries
  subject/expand/filter/full state restores exactly as saved instead.
- Choosing a search result adds/selects only that subject initially. It keeps
  subjects already in the exploration and does not expand neighbors implicitly.
- Muhammad → Wives → select Aisha → Parents preserves Muhammad and the wives
  and reveals only Aisha's recorded parents through that action.
- A Sons expansion reveals the selected person's sons, not the selected
  person's own father through an inverse SON record.
- A Father expansion described with the selected person first uses Son or
  Daughter as supported by the recorded relationship. The expansion label
  Father must not be copied onto a selected-child → father description.
- Revealing wives and fathers-in-law also displays the recorded Aisha–Abu Bakr
  and Hafsa–Umar relationships without another expansion.
- Ancestors follows both recorded parents; Paternal lineage follows the
  father-to-father chain; Descendants follows recorded children. All continue
  through the full reachable recorded lineage.
- Collapsing Muhammad's Wives expansion preserves Aisha and her parents if
  Aisha has her own active Parents expansion. Subjects supported only by the
  collapsed expansion disappear.
- Battles and events start disabled; node-type visibility can be toggled
  without erasing expansion choices.
- A shared URL or refresh restores selection, expansions, and type filters;
  browser Back/Forward retraces exploration changes.
- The default map-style page exposes search and expansion controls through a
  collapsible panel, including a way to reopen it. Arabic/English and light/dark
  support apply throughout. Embedded profile graphs retain their own layout.
- Expansion keeps existing positions and zoom steady, reveals additions at
  their saved global positions, and offers Fit graph. See the
  [graph-map decision](adr/0005-use-a-precomputed-global-graph-map.md).
- All direct relations includes companions and every other recorded direct
  relation permitted by the enabled node types. Expansion controls display
  counts. Counts represent distinct subjects, not duplicate inverse records.
- Selected-person preview information consists of full name and titles only.
  Phone controls use a collapsible bottom sheet.
- One verified inverse pair produces one visible connection. Selected-person
  descriptions follow the selected person's role without changing stored facts.
- All direct relations is a master toggle; individual choices can subsequently
  be switched off, and lineage actions remain independent.
- Start over restores the default subject and node-type settings, preserves
  language/theme, and can be undone through browser Back.
- Equivalent relationship requests produce consistent results across callers
  because they use the same shared relationship module with explicit scope.
- Deselecting a subject preserves the exploration built so far; Show full
  graph is required to reveal the wider dataset.
- With Muhammad and his wives visible and nothing selected, turning on the
  Father global relationship filter reveals Muhammad's father and each wife's
  father, but not any of their fathers in turn.
- A subject introduced by one global relationship filter remains eligible to
  trigger a different one: a Wives-introduced subject can still trigger
  Father.
- Selecting a filter-introduced subject and using its own expansion choices
  reveals further generations without restriction.

### Subsequent branches

Recompute the next question round from the answers above. Topics still to
resolve, without assuming their answers:

- Specify removal of searched starting points and the treatment of overlapping
  direct and lineage expansions, consistently with independent branch retention.
- Specify loading, empty/error results, full-depth traversal, counts, and
  layout behavior for large expansions, without silent truncation.
- Preserve compatibility with existing graph URLs and embedded views.
- Implementation boundaries, acceptance scenarios, automated coverage,
  documentation, and final confirmation of shared understanding.

### Layout exploration

An illustrative Arabic/English interaction sketch demonstrates a single-person
starting view, explicit expansion buttons, automatic connections among visible
example people, a collapsible panel, and node-type filters. It uses a small
example subset and is not a complete graph-data implementation. The independent
expansion collapse behavior has been agreed in question 11.

The sketch's selection, expansion, reset, panel reopening, and language switch
were checked in a browser, with layout inspection at narrow, medium, and wide
widths and in light/dark appearance. Application code has not been changed.

## Documentation during the interview

The [stable graph layout follow-up](graph-layout-plan.md) examines movement
during selection and filtering after PR #33's implementation. It replaces
nearby placement with one precomputed global map; other earlier commitments
remain the baseline until that interview explicitly revises them.

Maintain `CONTEXT.md` strictly as a glossary. Record an ADR only for a settled
decision with a meaningful
trade-off, significant reversal cost, and rationale a future reader needs.
Update this plan as each question round resolves; do not label unbuilt behavior
as implemented in README.
