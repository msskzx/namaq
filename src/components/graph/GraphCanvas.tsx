'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, RefObject } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { GraphData, GraphNode, GraphNodeFull, GraphLink } from '@/types/graph';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress, faFilter, faMagnifyingGlass, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import GraphSearch from './GraphSearch';
import SlideSwitch from './SlideSwitch';
import RelationFilterPanel from './RelationFilterPanel';
import ExpansionControls from './ExpansionControls';
import GraphSurface, { kindFillColor } from './GraphSurface';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LanguageSwitcher from '@/components/language/LanguageSwitcher';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { getAllNavLinks } from '@/lib/siteLinks';
import { sortRelationTypes, governingRelationType, relationGroup, RELATION_ORDER, KIND_TO_RELATION_GROUP, RelationGroup } from '@/lib/relationship/categories';
import { COMPANION_TITLE_SLUG, filterVisibleGraph } from '@/lib/graphFilter';
import { profilePath } from '@/lib/nodeProfile';
import { parseExplorationInput, formatExpandParam } from '@/lib/relationship/urlState';
import { NodeKind, RelationType, subjectId } from '@/lib/relationship/types';
import { ExpansionRelationId, directRelationCounts } from '@/lib/relationship/expansion';
import { ExpansionGroup, expansionGroupForRelation } from '@/lib/relationship/expansionGroups';
import { useExplorationGraph } from './useExplorationGraph';
import { centerTargetForReveal, isComfortablyVisible, usableRect } from '@/lib/graphCamera';

interface GraphCanvasProps {
  url?: string;
  targetSlug?: string;
  showSearch?: boolean;
  // Params to seed into this page's URL on first load if not already
  // present, e.g. { person: slug } so the profile page's graph carries its
  // person in the address bar instead of only in the internal fetch URL.
  initialParams?: Record<string, string | string[]>;
  // Noun used for the node count summary and the side list heading. Defaults
  // to 'people' since most graphs are person-only; a bipartite graph (e.g.
  // titles and people) should override this to describe what's actually listed.
  nodesLabel?: string;
}

const relationName = (value: string) => value.toLowerCase().replaceAll('_', ' ');

// The full universe of node kinds the graph API can ever return, regardless
// of what's actually present in the current fetch. The kind filter (see
// `includedKinds` below) needs this fixed list, not the current graphData's
// kinds -- once narrowed to `kind=person`, the response contains nothing
// but person nodes, and deriving the toggle set from that response would
// make title/battle/event impossible to switch back on.
const ALL_KINDS = ['person', 'title', 'battle', 'event'] as const;

// Battle and Event nodes are the least central to a first-time visit (most
// people come here for the family tree), so on a general-purpose graph
// (showSearch on) they start off, opt-in via the Node Kinds panel like any
// other kind. A scoped embed (showSearch off) keeps its own naturally
// single-kind data included by default, as before -- see `defaultKinds`.
const DEFAULT_KINDS = ['person', 'title'];

// The full universe of relation types the graph API can ever return,
// regardless of what's actually present in the current (possibly
// kind-narrowed) fetch -- same rationale as ALL_KINDS above. Once `kind` is
// narrowed to e.g. `person`, the response contains no Title/Battle/Event
// nodes, so their relation types (HOLDS_TITLE, PARTICIPATED_IN, ...) never
// appear in that fetch; deriving the toggle/group set from it would make
// those categories vanish entirely instead of just having nothing to show,
// and re-including that kind wouldn't bring their filters back.
const ALL_RELATION_TYPES = sortRelationTypes(RELATION_ORDER.filter(type => governingRelationType(type) === type));

// Battle/Event being off by default (see DEFAULT_KINDS above) needs to
// carry over to their relation types too, the same way toggleKind's own
// group-sync keeps them in step whenever a kind is toggled by hand --
// otherwise the Relationship Types panel would show e.g. PARTICIPATED_IN
// as "on" while its Battle nodes are actually hidden. COMPANION_OF connects
// the Prophet to ~250 companions, dwarfing every other relation the same
// way the Companion title node dwarfs the Titles view (see
// `showCompanionTitle` below) -- hidden by default for the same reason.
const DEFAULT_EXCLUDED_KINDS = ALL_KINDS.filter(kind => !(DEFAULT_KINDS as string[]).includes(kind));
const DEFAULT_EXCLUDED_RELATION_GROUPS = new Set(DEFAULT_EXCLUDED_KINDS.map(kind => KIND_TO_RELATION_GROUP[kind]));
const DEFAULT_EXCLUDED_RELATIONS = [
  'COMPANION_OF',
  ...ALL_RELATION_TYPES.filter(type => DEFAULT_EXCLUDED_RELATION_GROUPS.has(relationGroup(type))),
];

// Written to the `relation` param to mean "explicitly show every relation
// type". An empty `relation` array and an absent `relation` param both
// serialize to the same URL (no param at all -- see `updateParams`), so
// without a sentinel there'd be no way to tell "user turned everything
// back on" apart from "never touched this", and the latter must fall back
// to DEFAULT_EXCLUDED_RELATIONS above.
const NO_EXCLUDED_RELATIONS = '__none__';

export default function GraphCanvas({ url = '/api/graph', targetSlug = 'prophet-muhammad', showSearch = true, initialParams, nodesLabel = 'people' }: GraphCanvasProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams?.get('selected') ?? (showSearch && !searchParams?.has('subject') ? targetSlug : null);
  const fullGraph = searchParams?.get('full') === '1';
  const focusSlug = searchParams?.get('focus') ?? null;
  // Relation types are stored as the set of EXCLUDED (hidden) values --
  // each toggle acts independently, and hiding one never implicitly hides
  // another. An absent `relation` param means "untouched", which defaults
  // to DEFAULT_EXCLUDED_RELATIONS rather than "nothing excluded" -- see
  // that constant and NO_EXCLUDED_RELATIONS above for why "show every
  // relation" needs its own sentinel to stay distinguishable from that.
  const excludedRelations = useMemo(() => {
    const raw = searchParams?.getAll('relation') ?? [];
    if (raw.length === 0) return new Set(DEFAULT_EXCLUDED_RELATIONS);
    if (raw.length === 1 && raw[0] === NO_EXCLUDED_RELATIONS) return new Set<string>();
    return new Set(raw);
  }, [searchParams]);
  // Kinds work the opposite way from relations: `kind` is a server-side
  // whitelist (see /api/graph's `kind` param), so a non-empty set is
  // exactly what's INCLUDED, not excluded. An absent `kind` param also
  // means "untouched", defaulting to `defaultKinds` below (DEFAULT_KINDS on
  // a general-purpose graph, every kind on a scoped embed) rather than
  // always meaning "every kind" -- unlike relations, this needs no
  // sentinel: toggleKind always spells out a non-default combination in
  // full instead of ever collapsing it down to an empty array (see there).
  const defaultKinds = useMemo(() => new Set<string>(showSearch ? DEFAULT_KINDS : ALL_KINDS), [showSearch]);
  const includedKinds = useMemo(() => {
    const raw = searchParams?.getAll('kind') ?? [];
    return raw.length > 0 ? new Set(raw) : defaultKinds;
  }, [searchParams, defaultKinds]);
  // The "Companion" title node (see COMPANION_TITLE_SLUG below) connects to
  // every companion in the dataset, so it dwarfs every other title's node
  // degree and crowds out the rest of the Titles view -- hidden by default,
  // opt-in via `showCompanionTitle=1` rather than an excluded-by-default
  // entry in `relation`, since this hides a specific NODE, not a relation
  // type.
  const showCompanionTitle = searchParams?.get('showCompanionTitle') === '1';
  // Only `person` is a 1-hop neighborhood search (see route.ts's `persons`
  // query) where a same-labeled edge could leak in from someone two hops
  // away who isn't actually connected to the searched person -- that's what
  // isDirect below guards against. ancestorsOf/descendantsOf walk an
  // unbounded SON/DAUGHTER chain instead, so every edge they return already
  // belongs to the requested lineage; including their slugs here would
  // wrongly prune the chain down to just its first hop.
  const personSearchSlugs = useMemo(() => new Set(searchParams?.getAll('person') ?? []), [searchParams]);

  const subjectParams = useMemo(() => searchParams?.getAll('subject') ?? [], [searchParams]);
  const explorationInput = useMemo(
    () => parseExplorationInput(
      { subjects: subjectParams, expands: searchParams?.getAll('expand') ?? [], filters: searchParams?.getAll('filter') ?? [] },
      targetSlug
    ),
    [searchParams, targetSlug, subjectParams]
  );

  const fetchUrl = useMemo(() => {
    try {
      const base = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const incoming = new URLSearchParams(searchParams?.toString() || '');
      // `selected` and `relation` are client view options with no server
      // meaning. `kind` is the opposite: it's a real query param the API
      // reads to decide which node kinds to return, so it's deliberately
      // forwarded rather than stripped -- but re-written from `includedKinds`
      // rather than passed through as-is, since on a general-purpose graph
      // an absent `kind` param no longer means "every kind" to the API
      // either (see `defaultKinds` above): without this, Battle/Event nodes
      // would still be fetched by default even though the UI hides them.
      incoming.delete('selected');
      incoming.delete('relation');
      incoming.delete('showCompanionTitle');
      if (showSearch) {
        incoming.delete('kind');
        includedKinds.forEach(kind => incoming.append('kind', kind));
      }
      for (const [key, value] of incoming.entries()) base.searchParams.append(key, value);
      return base.toString();
    } catch {
      return url;
    }
  }, [url, searchParams, showSearch, includedKinds]);

  // Graph structure only changes via pipeline scripts, never live user
  // action, so there's nothing to gain from the default revalidate-on-focus
  // behavior — and it actively hurts here: every refetch hands ForceGraph2D
  // a new graphData reference, which restarts its cooldown/engine and
  // snaps the camera back to fitToView, discarding wherever the user had
  // panned/zoomed to just from switching tabs and back.
  const { data: legacyGraphData, error: legacyGraphError, isLoading: legacyGraphLoading } = useSWR<GraphData>(showSearch ? null : fetchUrl, fetcher, { revalidateOnFocus: false });
  const exploration = useExplorationGraph({
    enabled: showSearch,
    baseUrl: url,
    kindParams: [...includedKinds],
    input: explorationInput,
    selectedSlug,
    fullGraph,
  });
  const graphData = showSearch ? exploration.data : legacyGraphData;
  const graphError = showSearch ? exploration.error : legacyGraphError;
  const graphLoading = showSearch ? exploration.isLoading : legacyGraphLoading;
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>;
  const selectedNode = graphData?.nodes.find(node => node.slug === selectedSlug);
  // Full name/titles only, for the selected-subject panel -- a lighter
  // fetch than the full /api/people/[slug] profile route (which also pulls
  // participations/events/ayat/claims), since this reruns on every subject
  // clicked through in the workspace. Non-person subjects (title/battle/
  // event) and graph-only people with no Postgres profile just keep
  // showing the graph label, per the "Learning information in the panel"
  // decision in docs/graph-exploration-plan.md.
  const isSelectedPerson = showSearch && (selectedNode?.type ?? 'person') === 'person';
  const { data: selectedPreview, error: selectedPreviewError } = useSWR<{ fullName: string | null; titles: { name: string; slug: string }[] }>(
    isSelectedPerson && selectedNode ? `/api/people/${selectedNode.slug}/preview` : null,
    fetcher
  );
  // This fetch 404s for a graph-only person (docs/graph-only-people-search-plan.md);
  // optimistic (true) until then, so the link doesn't stay hidden for the
  // common case while the fetch is still in flight.
  const selectedPersonHasProfile = !isSelectedPerson || !selectedPreviewError;
  const relationLabel = useCallback((type: string) => (t.relationTypes as Record<string, string>)[type] ?? relationName(type), [t]);
  const selectedSubjectId = selectedNode ? subjectId((selectedNode.type as NodeKind) ?? 'person', selectedNode.slug) : null;
  const selectedRelationCounts = useMemo(() => {
    if (!showSearch || !exploration.edges) return new Map<RelationType, number>();
    return directRelationCounts(exploration.edges, selectedSubjectId ?? graphData?.nodes.map(node => node.id) ?? [], RELATION_ORDER) as Map<RelationType, number>;
  }, [showSearch, selectedSubjectId, exploration.edges, graphData]);
  const groupedRelations = useMemo(() => {
    const groups = new Map<ExpansionGroup, RelationType[]>();
    for (const [relation, count] of selectedRelationCounts) {
      if (count <= 0 && !explorationInput.globalFilters.includes(relation)) continue;
      const group = expansionGroupForRelation(relation);
      groups.set(group, [...(groups.get(group) ?? []), relation]);
    }
    for (const [group, types] of groups) groups.set(group, sortRelationTypes(types) as RelationType[]);
    return groups;
  }, [selectedRelationCounts, explorationInput.globalFilters]);
  const hasEligibleDirectRelations = useMemo(
    () => Array.from(selectedRelationCounts.values()).some(count => count > 0),
    [selectedRelationCounts]
  );
  // Relation types present in the fetched graph, one toggle per type.
  // ACCOMPANIED_BY is COMPANION_OF's inverse edge (see
  // scripts/people/syncCompanionRelations.ts) -- governed by the same
  // toggle as COMPANION_OF (see governingRelationType), so it never gets a
  // toggle of its own.
  const relationTypesInData = useMemo(() => {
    const present = [...new Set(graphData?.links.map(link => link.label) ?? [])];
    return sortRelationTypes(present.filter(type => governingRelationType(type) === type));
  }, [graphData]);
  // Node kinds present in the fetched graph (person/title/battle/event).
  const kindsPresent = useMemo(() => [...new Set(graphData?.nodes.map(node => node.type ?? 'person') ?? [])], [graphData]);
  // On a general-purpose page (showSearch on), both the kind toggle and the
  // relation-type toggles need every possible option on offer, not just
  // whatever the current, possibly-narrowed fetch happens to contain --
  // otherwise narrowing `kind` down to e.g. `person` would also make every
  // Title/Battle/Event relation category vanish from the filter panel
  // instead of just having nothing to show, with no way to bring it back
  // short of widening `kind` again. A scoped embed (e.g. the person
  // profile's ancestor mini-graph, showSearch off) is inherently
  // single-kind anyway, so it keeps the old data-driven behavior of only
  // offering toggles for what's actually in that graph.
  const kindsUniverse = showSearch ? ALL_KINDS : kindsPresent;
  const relationTypesPresent = showSearch ? ALL_RELATION_TYPES : relationTypesInData;
  // The Companion title node is hidden by default (see
  // showCompanionTitle above), so filtering must run even with zero
  // manual relation toggles.
  const anyFilterActive = excludedRelations.size > 0 || !showCompanionTitle;
  // Once the unfiltered view has run one simulation pass, d3-force mutates
  // each link's source/target from a plain string id into a direct
  // reference to the node object it resolved -- in place, on the very same
  // link objects graphData.links holds (they're never cloned). A filtered
  // view built afterwards from those links would inherit stale references
  // into the *unfiltered* node array, which the current (filtered,
  // possibly node-cloned) simulation doesn't recognize, so the link fails
  // to attach to anything -- the exact "weirdly connected, missing
  // relations" symptom that only shows up switching filters via the UI,
  // not on a fresh navigation where links haven't been touched yet.
  // filterVisibleGraph converts source/target back to plain string ids,
  // forcing d3-force to re-resolve them against whichever node array is
  // current. See src/lib/graphFilter.ts for the filtering rules themselves
  // (and their own tests).
  const baseVisibleGraph = useMemo(() => {
    if (!graphData || !anyFilterActive) return graphData;
    return filterVisibleGraph(graphData, { excludedRelations, showCompanionTitle, personSearchSlugs });
  }, [graphData, anyFilterActive, excludedRelations, showCompanionTitle, personSearchSlugs]);
  // Keeps an explicitly selected node visible even when the active filters
  // would otherwise drop it (e.g. searching straight to a Title/Battle/Event
  // node while its kind, or the Companion title, is hidden) -- but only
  // builds a new graph object when that's actually necessary. Every normal
  // click (on the
  // canvas or the side list) selects a node that's already in
  // baseVisibleGraph, since that's the only thing rendered to click on, so
  // this reuses the same baseVisibleGraph reference in the overwhelmingly
  // common case instead of building a fresh one. That reference stability
  // matters: ForceGraph2D reheats and re-lays-out its whole simulation
  // whenever its `graphData` prop identity changes, which is what used to
  // shove nodes around and carry the just-selected one out of the viewport
  // on every single click -- worse on the phone's smaller canvas, where the
  // reshuffle is more likely to land the node off-screen.
  const alwaysVisibleNodes = useMemo(() => {
    if (!showSearch || !graphData) return selectedNode ? [selectedNode] : [];
    if (fullGraph) return graphData.nodes.filter(node => showCompanionTitle || node.type !== 'title' || node.slug !== COMPANION_TITLE_SLUG);
    const nodesById = new Map(graphData.nodes.map(node => [node.id, node]));
    const roots = explorationInput.roots.map(id => nodesById.get(id)).filter((node): node is GraphNodeFull => Boolean(node));
    if (selectedNode && !roots.some(node => node.id === selectedNode.id)) roots.push(selectedNode);
    return roots;
  }, [showSearch, graphData, explorationInput.roots, selectedNode, fullGraph, showCompanionTitle]);
  const visibleGraph = useMemo(() => {
    if (!baseVisibleGraph) return baseVisibleGraph;
    const missing = alwaysVisibleNodes.filter(node => !baseVisibleGraph.nodes.some(existing => existing.id === node.id));
    if (missing.length === 0) return baseVisibleGraph;
    return { nodes: [...baseVisibleGraph.nodes, ...missing], links: baseVisibleGraph.links };
  }, [baseVisibleGraph, alwaysVisibleNodes]);
  // Every edge is directional (e.g. FATHER points child -> parent), but a
  // bare relation-name tooltip can't tell you which end is which. Naming
  // both endpoints removes the ambiguity. The string is always built
  // source-to-target, in the same logical order regardless of language --
  // the tooltip's container now carries dir="rtl" for Arabic (see
  // graphCanvas below), so the browser's own bidi handling visually
  // reverses the run and mirrors "<"/">" for us, rather than us
  // hand-swapping the string and glyphs ourselves.
  const visibleNodesById = useMemo(() => new Map((visibleGraph?.nodes ?? []).map(node => [node.id, node])), [visibleGraph]);
  const linkTooltip = useCallback((link: GraphLink) => {
    const resolve = (endpoint: string | GraphNode) => (typeof endpoint === 'string' ? visibleNodesById.get(endpoint) : endpoint);
    const sourceLabel = resolve(link.source)?.label ?? '';
    const targetLabel = resolve(link.target)?.label ?? '';
    const relation = relationLabel(link.label);
    return `${sourceLabel} - ${relation} -> ${targetLabel}`;
  }, [visibleNodesById, relationLabel]);
  // Sorted by unified-graph prominence for the side list only; the canvas
  // itself renders visibleGraph.nodes directly, since force-layout doesn't
  // care about array order. graphRank spans every kind, so a battle or title
  // takes its place among the people rather than being dumped at the end;
  // only a subject the layout pipeline has not ranked yet sorts last.
  const rankedViewNodes = useMemo(() => {
    if (!visibleGraph) return undefined;
    return [...visibleGraph.nodes].sort((a, b) =>
      (a.graphRank ?? Number.MAX_SAFE_INTEGER) - (b.graphRank ?? Number.MAX_SAFE_INTEGER) ||
      a.label.localeCompare(b.label)
    );
  }, [visibleGraph]);

  // Embedded (showSearch false) graphs only: the workspace has its own,
  // separate camera effects below (Q2/Q6 in docs/graph-layout-plan.md).
  // Priority order matters here -- selected, then focused, then default --
  // resolved as sequential lookups rather than one `.find` with all three
  // ORed together, which picked whichever matched first in array order
  // regardless of which one actually mattered (see that plan's "Verified
  // causes").
  useEffect(() => {
    if (showSearch || !fgRef.current || !graphData) return;
    const nodeToFocus = graphData.nodes.find(node => node.slug === selectedSlug)
      ?? graphData.nodes.find(node => node.slug === focusSlug)
      ?? graphData.nodes.find(node => node.slug === targetSlug);
    if (!nodeToFocus) return;
    const timer = setTimeout(() => {
      fgRef.current?.centerAt(nodeToFocus.x || 0, nodeToFocus.y || 0, 700);
      fgRef.current?.zoom(3, 700);
    }, 300);
    return () => clearTimeout(timer);
  }, [showSearch, graphData, selectedSlug, focusSlug, targetSlug]);
  // Only runs when nothing above is already going to center on a specific
  // node (embedded graphs), or never automatically at all (the workspace,
  // which only ever fits via the explicit Fit graph button or its own
  // initial/reset framing effect below -- see onEngineStop in graphCanvas).
  const hasFocusTarget = Boolean(selectedSlug || focusSlug || graphData?.nodes.some(node => node.slug === targetSlug));
  // Every visible subject now has a fixed, precomputed position (see
  // docs/adr/0005-use-a-precomputed-global-graph-map.md) -- the previous
  // rank-based exclusion compensated for graph-only/unranked nodes that
  // could drift arbitrarily far under live physics, which no longer
  // happens, so Fit graph now includes everyone. `force` bypasses the
  // hasFocusTarget guard for the explicit Fit graph button -- the guard
  // only exists to stop an automatic fit from fighting a selection/focus
  // that already centered the camera, not to block a deliberate re-fit.
  const fitToView = useCallback((force = false) => {
    if ((hasFocusTarget && !force) || !fgRef.current) return;
    fgRef.current.zoomToFit(400, 40);
  }, [hasFocusTarget]);

  const updateParams = useCallback((changes: Record<string, string | null | string[]>, replace = false) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(changes).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) value.forEach(item => params.append(key, item));
      else if (value) params.set(key, value);
    });
    const navigate = showSearch && !replace ? router.push : router.replace;
    navigate(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [router, pathname, searchParams, showSearch]);

  const expandParams = useMemo(() => searchParams?.getAll('expand') ?? [], [searchParams]);
  const isExpansionActive = useCallback(
    (relation: ExpansionRelationId) => {
      if (!selectedSubjectId) return explorationInput.globalFilters.includes(relation as RelationType);
      return expandParams.includes(formatExpandParam({ subject: selectedSubjectId, relation }));
    },
    [expandParams, selectedSubjectId, explorationInput.globalFilters]
  );
  const toggleExpansion = (relation: ExpansionRelationId) => {
    if (!selectedSubjectId) {
      const filters = explorationInput.globalFilters;
      updateParams({ filter: filters.includes(relation as RelationType) ? filters.filter(item => item !== relation) : [...filters, relation] });
      return;
    }
    const token = formatExpandParam({ subject: selectedSubjectId, relation });
    const next = expandParams.includes(token) ? expandParams.filter(item => item !== token) : [...expandParams, token];
    updateParams({ expand: next });
  };
  const expandAllDirectRelations = () => {
    if (!selectedSubjectId) {
      updateParams({ filter: Array.from(new Set([...explorationInput.globalFilters, ...RELATION_ORDER.filter(relation => (selectedRelationCounts.get(relation) ?? 0) > 0)])) });
      return;
    }
    const tokens = RELATION_ORDER
      .filter(relation => (selectedRelationCounts.get(relation) ?? 0) > 0)
      .map(relation => formatExpandParam({ subject: selectedSubjectId, relation }));
    updateParams({ expand: Array.from(new Set([...expandParams, ...tokens])) });
  };

  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || !initialParams || !searchParams) return;
    const missing = Object.entries(initialParams).filter(([key]) => !searchParams.has(key));
    if (missing.length === 0) return;
    seededRef.current = true;
    updateParams(Object.fromEntries(missing), true);
    // Only seed once on mount; initialParams/updateParams identity isn't
    // meant to re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const rootSeededRef = useRef(false);
  useEffect(() => {
    if (rootSeededRef.current || !showSearch || !searchParams || searchParams.has('subject')) return;
    rootSeededRef.current = true;
    updateParams({ subject: [subjectId('person', targetSlug)], selected: selectedSlug ?? targetSlug }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, showSearch]);

  // A completely fresh /graphs visit (captured once, before the seeding
  // effect above adds subject/selected) reveals the default subject's own
  // direct relations too, as if All direct relations had just been clicked
  // -- otherwise the very first thing a new visitor sees is one lone node
  // with no connections. Restoring a shared/refreshed URL that already
  // carries its own subject/expand/filter/full state is untouched.
  const [isFreshVisit] = useState(
    () => showSearch && Boolean(searchParams) && !searchParams?.has('subject') && !searchParams?.has('expand') && !searchParams?.has('filter') && !searchParams?.has('full')
  );
  const initialExpandSeededRef = useRef(false);
  useEffect(() => {
    if (initialExpandSeededRef.current || !isFreshVisit || !hasEligibleDirectRelations) return;
    initialExpandSeededRef.current = true;
    expandAllDirectRelations();
    // Runs once, as soon as the freshly-seeded root subject's own relation
    // counts have loaded; expandAllDirectRelations/selectedSubjectId aren't
    // meant to re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFreshVisit, hasEligibleDirectRelations]);

  // An excluded-relations Set that would serialize to an empty `relation`
  // array is indistinguishable from the param being absent entirely (see
  // NO_EXCLUDED_RELATIONS above) -- write the sentinel instead whenever
  // that's the actual, deliberate result, so it doesn't get read back as
  // "untouched" and fall through to DEFAULT_EXCLUDED_RELATIONS.
  const relationParamValue = (excluded: Set<string>) => (excluded.size > 0 ? [...excluded] : [NO_EXCLUDED_RELATIONS]);
  const toggleRelation = (type: string) => {
    const next = new Set(excludedRelations);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    updateParams({ relation: relationParamValue(next) });
  };
  const toggleAllRelations = (show: boolean) => updateParams({ relation: show ? relationParamValue(new Set()) : relationTypesPresent });
  // Toggles every relation type in one group at once (e.g. a single
  // "all family relations" switch above the ~40 individual family
  // toggles), independent of the panel-wide "all relations" switch.
  const toggleGroupRelations = (group: RelationGroup, show: boolean) => {
    const groupTypes = relationTypesPresent.filter(type => relationGroup(type) === group);
    const next = new Set(excludedRelations);
    groupTypes.forEach(type => (show ? next.delete(type) : next.add(type)));
    updateParams({ relation: relationParamValue(next) });
  };
  const toggleCompanionTitle = () => updateParams({ showCompanionTitle: showCompanionTitle ? null : '1' });
  const toggleKind = (kind: string) => {
    const next = new Set(includedKinds);
    const turningOff = next.has(kind);
    if (turningOff) next.delete(kind);
    else next.add(kind);
    // Keep the relation toggles for this kind's group (e.g. Battle ->
    // "battles") in sync: turning the kind off also excludes its
    // relation type(s), since there's nothing left for them to connect
    // to, and turning it back on restores them -- without ever removing
    // the toggle itself from the panel (see ALL_RELATION_TYPES above).
    const group = KIND_TO_RELATION_GROUP[kind];
    const groupTypes = group ? relationTypesPresent.filter(type => relationGroup(type) === group) : [];
    const nextExcluded = new Set(excludedRelations);
    groupTypes.forEach(type => (turningOff ? nextExcluded.add(type) : nextExcluded.delete(type)));
    // Once `next` matches the default kind set again, clear the param
    // instead of spelling it out -- an absent `kind` param is the canonical
    // URL for whatever "default" means here (see `defaultKinds` above), not
    // always "every kind".
    const isDefault = next.size === defaultKinds.size && [...next].every(k => defaultKinds.has(k));
    updateParams({ kind: isDefault ? [] : [...next], relation: relationParamValue(nextExcluded) });
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Fullscreen only: search gets its own toggle/overlay, separate from the
  // filter overlay, since it's a different kind of action (finding a
  // person to focus on vs. adjusting what's shown).
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Workspace shell (showSearch only): the collapsible panel/bottom-sheet
  // starts open so first paint matches what used to be always-visible, and
  // the site-nav/settings menu that replaces NavBar/Footer on this route.
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);
  const navLinks = useMemo(() => getAllNavLinks(language), [language]);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  // Header bar height (p-3 + text line) the canvas sits below in fullscreen.
  const FULLSCREEN_HEADER_HEIGHT = 56;
  const [fullscreenSize, setFullscreenSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!isFullscreen) return;
    const updateSize = () => setFullscreenSize({ width: window.innerWidth, height: window.innerHeight - FULLSCREEN_HEADER_HEIGHT });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isFullscreen]);

  // The workspace shell's canvas always fills the whole viewport, with the
  // panel floating on top of it (see the showSearch return below) rather
  // than sharing space via flex -- same reasoning as fullscreenSize above:
  // GraphSurface/ForceGraph2D only measures its box once at mount and never
  // re-observes, so it needs an explicit, reliably-nonzero size up front.
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!showSearch) return;
    const updateSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [showSearch]);

  // Show additions (docs/graph-layout-plan.md Q4/Q7): tracks which subjects
  // just became visible -- from a local expansion, a global filter, a
  // search-added root, or Show full graph alike, unlike the narrower
  // filter-only growth feedback this replaces -- and which already-visible
  // subjects they connect to, so the action can frame both together.
  // Membership is derived straight from graphData's own node ids rather
  // than a separate count, since a pure selection change never alters that
  // set (see the priority-ordered camera effects below, which is exactly
  // why "kept through selection-only changes" falls out for free here).
  const previousVisibleIdsRef = useRef<Set<string> | null>(null);
  const [showAdditions, setShowAdditions] = useState<{ added: string[]; connecting: string[] } | null>(null);
  useEffect(() => {
    if (!showSearch || !graphData) return;
    const currentIds = new Set(graphData.nodes.map(node => node.id));
    const previous = previousVisibleIdsRef.current;
    if (previous) {
      const added = [...currentIds].filter(id => !previous.has(id));
      const removed = [...previous].filter(id => !currentIds.has(id));
      if (added.length > 0) {
        const addedSet = new Set(added);
        const connecting = new Set<string>();
        for (const link of graphData.links) {
          const source = typeof link.source === 'string' ? link.source : link.source.id;
          const target = typeof link.target === 'string' ? link.target : link.target.id;
          if (addedSet.has(source) && previous.has(target)) connecting.add(target);
          if (addedSet.has(target) && previous.has(source)) connecting.add(source);
        }
        setShowAdditions({ added, connecting: [...connecting] });
      } else if (removed.length > 0) {
        // A collapse or narrower filter with no accompanying growth leaves
        // no subjects to show -- a stale target (from an earlier action)
        // would otherwise keep offering to frame subjects that may no
        // longer even be part of this exploration.
        setShowAdditions(null);
      }
      // Membership unchanged (a pure selection/deselection): keep whatever
      // target is already set, per "kept through selection-only changes".
    }
    previousVisibleIdsRef.current = currentIds;
  }, [showSearch, graphData]);
  const applyShowAdditions = useCallback(() => {
    if (!showAdditions) return;
    const targetIds = new Set([...showAdditions.added, ...showAdditions.connecting]);
    fgRef.current?.zoomToFit(400, 60, (node) => targetIds.has((node as GraphNodeFull).id));
    setShowAdditions(null);
  }, [showAdditions]);

  // Workspace camera (showSearch only; docs/graph-layout-plan.md Q2/Q6).
  // `panelRef` measures the floating panel/sheet's actual on-screen rect
  // (see the showSearch return below) so a selection hidden behind it
  // still counts as needing a reveal, exactly like one that's simply
  // off-screen -- see src/lib/graphCamera.ts for the shared geometry.
  const panelRef = useRef<HTMLDivElement>(null);
  const hasFramedRef = useRef(false);
  const pendingResetRef = useRef(false);
  const lastCameraSelectionRef = useRef<string | null>(null);

  // Initial load, a shared/refreshed URL, and Start over (which sets
  // pendingResetRef before navigating) all frame the camera the same way:
  // center and set a readable zoom on the selection, or fit the whole
  // exploration when nothing is selected. Ordinary selection changes during
  // otherwise-continued use are handled by the separate effect below
  // instead, which never touches zoom.
  useEffect(() => {
    if (!showSearch || !fgRef.current || !graphData) return;
    if (!(!hasFramedRef.current || pendingResetRef.current)) return;
    hasFramedRef.current = true;
    pendingResetRef.current = false;
    const node = selectedSlug ? graphData.nodes.find(n => n.slug === selectedSlug) : undefined;
    const timer = setTimeout(() => {
      if (node && node.x != null && node.y != null) {
        fgRef.current?.centerAt(node.x, node.y, 700);
        fgRef.current?.zoom(3, 700);
      } else {
        fgRef.current?.zoomToFit(400, 40);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [showSearch, graphData, selectedSlug]);

  // Ordinary selection changes (including browser Back/Forward, which never
  // sets pendingResetRef): pan only far enough to reveal the selection when
  // it's actually obscured by the panel or off-screen, at the current zoom.
  // Guarded on the *selection* actually changing (not just graphData, which
  // also changes on every expansion/filter) so those keep the camera
  // untouched, per "preserve the camera through ... expansion, visibility
  // changes, and Show full graph". hasFramedRef/pendingResetRef/panelRef
  // are refs, not reactive values, so reading them here doesn't need to
  // appear in the dependency array below.
  useEffect(() => {
    if (!showSearch || !fgRef.current || !graphData || !hasFramedRef.current || pendingResetRef.current) return;
    const current = selectedSlug ?? null;
    if (current === lastCameraSelectionRef.current) return;
    if (!current) { lastCameraSelectionRef.current = null; return; }
    const node = graphData.nodes.find(n => n.slug === current);
    if (!node || node.x == null || node.y == null) return; // wait for its data to arrive, then retry
    lastCameraSelectionRef.current = current;
    const point = fgRef.current.graph2ScreenCoords(node.x, node.y);
    const viewport = { x: 0, y: 0, width: viewportSize.width, height: viewportSize.height };
    const panelRect = panelRef.current?.getBoundingClientRect() ?? null;
    const area = usableRect(viewport, panelRect);
    if (isComfortablyVisible(point, area)) return;
    const zoom = fgRef.current.zoom();
    const target = centerTargetForReveal({ x: node.x, y: node.y }, area, viewport, zoom);
    fgRef.current.centerAt(target.x, target.y, 500);
  }, [showSearch, graphData, selectedSlug, viewportSize]);

  if (graphLoading && !graphData) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading graph...</div></div>;
  if (graphError) return <div className="flex items-center justify-center min-h-screen"><ErrorMessage title="Error loading graph" description={graphError.toString()} /></div>;

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const typeLabels: Record<string, string> = { person: t.people, title: t.titles, battle: t.battles.title, event: t.events };
  const kindColor = (kind: string) => kindFillColor(kind, isDark);
  const kindLabel = (kind: string) => typeLabels[kind] ?? kind;

  const resetGraphView = () => {
    if (showSearch) {
      // Start over reframes its reset graph like an initial load would,
      // rather than the ordinary minimal reveal-pan (see the camera
      // effects above) -- consumed the next time they run.
      pendingResetRef.current = true;
      updateParams({ selected: targetSlug, relation: [], kind: [], showCompanionTitle: null, subject: [subjectId('person', targetSlug)], expand: [], filter: [], full: null });
      return;
    }
    updateParams({ selected: null, focus: null, relation: [], kind: [], showCompanionTitle: null, person: null, ancestorsOf: [], descendantsOf: [] });
  };

  const explorationControls = showSearch && (
    <aside dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedNode ? (selectedPreview?.fullName ?? selectedNode.label) : t.graph.globalRelationships}</h2>
      {isSelectedPerson && selectedPreview && selectedPreview.titles.length > 0 && (
        <p className="text-sm text-amber-700 dark:text-amber-300">{selectedPreview.titles.map(title => title.name).join(' · ')}</p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedNode ? t.graph.selectedLabel : t.graph.globalRelationshipsHint}</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {selectedNode && <>
          {selectedPersonHasProfile && <Link href={profilePath(selectedNode.type, selectedNode.slug)}>{t.graph.viewProfile}</Link>}
          <button type="button" onClick={() => updateParams({ selected: null })}>{t.graph.deselectSubject}</button>
        </>}
        <button type="button" disabled={fullGraph} onClick={() => updateParams({ full: '1' })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 disabled:opacity-50 dark:text-gray-100">{t.graph.showFullGraph}</button>
        <button type="button" onClick={resetGraphView} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 dark:text-gray-100">{t.graph.startOver}</button>
      </div>
      <ExpansionControls
        isPerson={Boolean(selectedNode && (selectedNode.type ?? 'person') === 'person')}
        groupedRelations={groupedRelations}
        relationCounts={selectedRelationCounts}
        hasEligibleDirectRelations={hasEligibleDirectRelations}
        isActive={isExpansionActive}
        onToggle={toggleExpansion}
        onExpandAllDirectRelations={expandAllDirectRelations}
        relationLabel={relationLabel}
        g={t.graph}
      />
      {showAdditions && (
        <div role="status" className="mt-2 flex items-center gap-2">
          <button type="button" onClick={applyShowAdditions} className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300">
            {t.graph.showAdditions(showAdditions.added.length)}
          </button>
          <button type="button" onClick={() => setShowAdditions(null)} aria-label={t.graph.dismiss} className="rounded border border-amber-400 px-2 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </aside>
  );

  const filterPanel = (
    <>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={resetGraphView} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
          {t.graph.resetGraphView}
        </button>
      </div>

      {kindsUniverse.length > 1 && (
        <fieldset dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{t.graph.nodeKinds}</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {kindsUniverse.map(kind => {
              const active = includedKinds.has(kind);
              const color = kindColor(kind);
              const label = kindLabel(kind);
              return (
                <SlideSwitch key={kind} checked={active} onChange={() => toggleKind(kind)} label={label} color={color} ariaLabel={active ? t.graph.hideKind(label) : t.graph.showKind(label)} />
              );
            })}
          </div>
        </fieldset>
      )}

      <RelationFilterPanel types={relationTypesPresent} excludedRelations={excludedRelations} onToggle={toggleRelation} onToggleAll={toggleAllRelations} onToggleGroup={toggleGroupRelations} showCompanionTitle={showCompanionTitle} onToggleCompanionTitle={toggleCompanionTitle} relationLabel={relationLabel} language={language} />
    </>
  );

  // react-force-graph-2d measures its size once at mount from its immediate
  // parent's box and never re-observes -- fine for the inline view, whose
  // parent has a fixed height (h-[65vh]) from the very first layout. The
  // fullscreen view's parent only reaches its final full-viewport height a
  // frame after mount, so the graph would permanently lock in at 0x0.
  // Passing explicit width/height (kept in sync on resize) sidesteps that.
  const graphCanvas = (dimensions?: { width: number; height: number }) => visibleGraph && (
    <GraphSurface
      ref={fgRef}
      {...(showSearch
        ? { data: visibleGraph, isLoading: graphLoading && !graphData, loadError: graphError }
        : { url: fetchUrl, transform: () => visibleGraph })}
      width={dimensions?.width}
      height={dimensions?.height}
      highlightSlug={selectedSlug ?? undefined}
      linkLabel={linkTooltip}
      onNodeClick={(node) => updateParams({ selected: node.slug })}
      // The workspace never auto-fits on engine settle -- with every
      // position fixed and no live simulation (Phase two), "settle" is
      // immediate and carries no meaning worth reacting to; its own
      // initial/reset framing effect above (and the explicit Fit graph
      // button) are the only things that ever move its camera on their own.
      onEngineStop={showSearch ? undefined : () => fitToView()}
    />
  );

  const nodesLabelText = (t.graph.nodesLabels as Record<string, string>)[nodesLabel] ?? nodesLabel;
  const graphSummary = visibleGraph ? t.graph.graphSummary(visibleGraph.nodes.length, nodesLabelText, visibleGraph.links.length) : t.graph.noGraphData;

  // /graphs itself: a permanent, viewport-filling workspace rather than a
  // scrollable page -- AppChrome (src/components/common/AppChrome.tsx) omits
  // NavBar/Footer for this route, so the Menu below is the only way back to
  // the rest of the site. The embedded profile/battle graphs (showSearch
  // false) never reach this branch and keep their existing inline-card +
  // isFullscreen-toggle behavior untouched below.
  if (showSearch) {
    const menuButton = (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen(open => !open)}
          aria-pressed={menuOpen}
          aria-label={menuOpen ? t.graph.closeMenu : t.graph.openMenu}
          className="rounded border border-amber-400 px-2 py-1.5 text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {menuOpen && (
          <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`absolute top-full z-30 mt-1 min-w-[200px] rounded-lg border border-amber-400 bg-gray-50 p-3 shadow-lg dark:bg-gray-950 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
            <ul className="flex flex-col gap-1">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setMenuOpen(false)} className="block rounded px-2 py-1 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-800">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" onClick={() => setMenuOpen(false)} className="block rounded px-2 py-1 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-800">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/privacy" onClick={() => setMenuOpen(false)} className="block rounded px-2 py-1 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-800">
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-amber-400 pt-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </div>
    );

    const panelContent = (
      <div className="flex h-full flex-col overflow-y-auto p-3">
        <div className="mb-2 flex items-center gap-2">
          {menuButton}
          <p className="flex-1 truncate text-sm text-gray-600 dark:text-gray-300" aria-live="polite">{graphSummary}</p>
          <button type="button" onClick={() => setPanelExpanded(false)} aria-label={t.graph.closeSearch} className="rounded border border-amber-400 px-2 py-1.5 text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <GraphSearch nodes={graphData?.nodes} />
        {explorationControls}
        <div className="mt-3">
          <button type="button" onClick={() => setShowFilterPanel(show => !show)} aria-pressed={showFilterPanel} aria-label={showFilterPanel ? t.graph.closeFilters : t.graph.openFilters} className="flex items-center gap-2 rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            <FontAwesomeIcon icon={faFilter} />
            {t.graph.openFilters}
          </button>
        </div>
        {showFilterPanel && <div className="mt-3">{filterPanel}</div>}
        <div className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{t.graph.nodesInView}</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.graph.selectEntryHint}</p>
          <ul className="mt-2 space-y-1">
            {rankedViewNodes?.map(node => (
              <li key={node.id}>
                <button type="button" onClick={() => updateParams({ selected: node.slug })} className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:hover:bg-gray-800 ${node.slug === selectedSlug ? 'bg-amber-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'}`}>{node.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

    // Collapsed state: desktop shows just Menu/Search corner icons (decision
    // #10); phone shows the same two icons plus the selected subject's name
    // as a compact bar (decision #19) -- one shared element for both, with
    // the name span hidden via CSS on desktop rather than a second copy of
    // this bar, so there is exactly one Menu/Search button in the DOM
    // regardless of viewport (see GraphCanvas.test.tsx's bare getByRole
    // queries, which have no notion of breakpoints).
    const collapsedBar = (
      <div className="flex items-center gap-2 p-2">
        {menuButton}
        <button type="button" onClick={() => setPanelExpanded(true)} aria-label={t.graph.openSearch} className="rounded border border-amber-400 px-2 py-1.5 text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <span className="truncate text-sm text-gray-700 lg:hidden dark:text-gray-200">{selectedNode ? selectedNode.label : ''}</span>
      </div>
    );

    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="fixed inset-0 z-0 bg-gray-50 dark:bg-gray-900" role="region" aria-label={t.graph.interactiveGraph}>
          <button
            type="button"
            onClick={() => fitToView(true)}
            aria-label={t.graph.fitGraph}
            className={`absolute top-2 z-10 rounded border border-amber-400 bg-gray-50/90 px-2 py-1.5 text-gray-800 backdrop-blur hover:bg-amber-50 dark:bg-gray-900/90 dark:text-gray-100 dark:hover:bg-gray-800 ${language === 'ar' ? 'left-2' : 'right-2'}`}
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
          {graphCanvas(viewportSize)}
        </div>
        <div
          ref={panelRef}
          className={panelExpanded
            ? 'fixed inset-x-0 bottom-0 z-[60] max-h-[75dvh] overflow-hidden rounded-t-lg border-t border-amber-400 bg-white shadow-lg lg:inset-y-0 lg:bottom-auto lg:start-0 lg:end-auto lg:h-full lg:max-h-none lg:w-80 lg:rounded-none lg:border-t-0 lg:border-e lg:shadow-none dark:border-gray-700 dark:bg-gray-800'
            : 'fixed inset-x-0 bottom-0 z-[60] rounded-t-lg border-t border-amber-400 bg-white shadow-lg lg:inset-auto lg:top-3 lg:start-3 lg:rounded-lg lg:border dark:border-gray-700 dark:bg-gray-800'
          }
        >
          {panelExpanded ? panelContent : collapsedBar}
        </div>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gray-50/90 p-3 backdrop-blur dark:bg-gray-900/90">
          <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
            {graphSummary}
          </p>
          <div className="flex items-center gap-2">
            {showSearch && (
              <button type="button" onClick={() => setShowSearchPanel(show => !show)} aria-pressed={showSearchPanel} aria-label={showSearchPanel ? t.graph.closeSearch : t.graph.openSearch} className="flex items-center gap-2 rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                {t.graph.openSearch}
              </button>
            )}
            <button type="button" onClick={() => setShowFilterPanel(show => !show)} aria-pressed={showFilterPanel} aria-label={showFilterPanel ? t.graph.closeFilters : t.graph.openFilters} className="flex items-center gap-2 rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
              <FontAwesomeIcon icon={faFilter} />
              {t.graph.openFilters}
            </button>
            <button type="button" onClick={() => setIsFullscreen(false)} aria-label={t.graph.closeFullscreen} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
              <FontAwesomeIcon icon={faCompress} />
            </button>
          </div>
        </div>
        {showSearchPanel && (
          <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="absolute top-14 inset-x-3 z-20 max-h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <GraphSearch nodes={graphData?.nodes} />
            {explorationControls}
          </div>
        )}
        {showFilterPanel && (
          <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`absolute top-14 z-20 max-h-[70vh] w-80 overflow-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${language === 'ar' ? 'left-3' : 'right-3'}`}>
            {filterPanel}
          </div>
        )}
        <div style={{ paddingTop: FULLSCREEN_HEADER_HEIGHT }}>
          {graphCanvas(fullscreenSize)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showSearch && <GraphSearch nodes={graphData?.nodes} />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3" aria-label={t.graph.graphControls}>
        <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {graphSummary}
          {focusSlug ? ` · ${t.graph.focusedNeighbourhood}` : ''}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowFilterPanel(show => !show)} aria-pressed={showFilterPanel} aria-label={showFilterPanel ? t.graph.closeFilters : t.graph.openFilters} className="flex items-center gap-2 rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            <FontAwesomeIcon icon={faFilter} />
            {t.graph.openFilters}
          </button>
        </div>
      </div>

      {showFilterPanel && filterPanel}

      {explorationControls}

      {selectedNode && !showSearch && (
        <aside dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-gray-800" aria-live="polite">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t.graph.selectedLabel} {kindLabel(selectedNode.type ?? 'person')}</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedNode.label}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300" href={profilePath(selectedNode.type, selectedNode.slug)}>{t.graph.viewProfile}</Link>
            {!showSearch && (
              <button
                type="button"
                onClick={() => updateParams({ focus: selectedNode.slug, person: null, ancestorsOf: [], descendantsOf: [] })}
                className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                {t.graph.exploreNeighbours}
              </button>
            )}
          </div>

        </aside>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="relative h-[65vh] min-h-[32rem] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" role="region" aria-label={t.graph.interactiveGraph}>
          <button type="button" onClick={() => setIsFullscreen(true)} aria-label={t.graph.fullscreen} className={`absolute top-2 z-10 rounded border border-amber-400 bg-gray-50/90 px-2 py-1.5 text-gray-800 backdrop-blur hover:bg-amber-50 dark:bg-gray-900/90 dark:text-gray-100 dark:hover:bg-gray-800 ${language === 'ar' ? 'left-2' : 'right-2'}`}>
            <FontAwesomeIcon icon={faExpand} />
          </button>
          {graphCanvas()}
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{t.graph.nodesInView}</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t.graph.selectEntryHint}</p>
          <ul className="mt-2 max-h-[55vh] space-y-1 overflow-auto">
            {rankedViewNodes?.map(node => <li key={node.id}><button type="button" onClick={() => updateParams({ selected: node.slug })} className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:hover:bg-gray-800 ${node.slug === selectedSlug ? 'bg-amber-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'}`}>{node.label}</button></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
