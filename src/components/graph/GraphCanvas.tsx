'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, RefObject } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { forceCollide } from 'd3-force';
import { GraphData, GraphNode, GraphNodeFull, GraphLink } from '@/types/graph';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';
import GraphSearch from './GraphSearch';
import SlideSwitch from './SlideSwitch';
import RelationFilterPanel from './RelationFilterPanel';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { relationColor, sortRelationTypes, governingRelationType, relationGroup, RELATION_ORDER, KIND_TO_RELATION_GROUP, RelationGroup } from '@/lib/relations';
import { profilePath } from '@/lib/nodeProfile';

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

// The full universe of relation types the graph API can ever return,
// regardless of what's actually present in the current (possibly
// kind-narrowed) fetch -- same rationale as ALL_KINDS above. Once `kind` is
// narrowed to e.g. `person`, the response contains no Title/Battle/Event
// nodes, so their relation types (HOLDS_TITLE, PARTICIPATED_IN, ...) never
// appear in that fetch; deriving the toggle/group set from it would make
// those categories vanish entirely instead of just having nothing to show,
// and re-including that kind wouldn't bring their filters back.
const ALL_RELATION_TYPES = sortRelationTypes(RELATION_ORDER.filter(type => governingRelationType(type) === type));

// The Title node every companion holds (see
// scripts/people/syncCompanionRelations.ts's COMPANION_TITLE_SLUG) -- one
// node with an edge to all ~250+ companions, far denser than any other
// title, so it's filterable independently of the Titles relation type.
const COMPANION_TITLE_SLUG = 'companion';

// A fixed reference font size the collision force below can use for a
// stable world-space radius per node, independent of camera zoom.
// nodeCanvasObject grows its own font size as the camera zooms out so
// labels stay readable, but caps it at this same value — without that cap,
// a graph zoomed far out to fit hundreds of nodes (see GraphCanvas usage in
// /graphs) would render every node far larger than the radius the
// collision force actually kept clear, so nodes would visually overlap
// even though their true positions don't.
let measureContext: CanvasRenderingContext2D | null = null;
const NODE_BASE_FONT_SIZE = 12;
function nodeRadius(node: GraphNodeFull): number {
  if (!measureContext) measureContext = document.createElement('canvas').getContext('2d');
  if (!measureContext) return NODE_BASE_FONT_SIZE;
  measureContext.font = `${NODE_BASE_FONT_SIZE}px Sans-Serif`;
  const textWidth = measureContext.measureText(node.label).width;
  return Math.max(textWidth + NODE_BASE_FONT_SIZE, NODE_BASE_FONT_SIZE * 2) / 2;
}

export default function GraphCanvas({ url = '/api/graph', targetSlug = 'prophet-muhammad', showSearch = true, initialParams, nodesLabel = 'people' }: GraphCanvasProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams?.get('selected') ?? null;
  const focusSlug = searchParams?.get('focus') ?? null;
  // Relation types are stored as the set of EXCLUDED (hidden) values --
  // each toggle acts independently, and hiding one never implicitly hides
  // another. Kinds work the opposite way: `kind` is a server-side whitelist
  // (see /api/graph's `kind` param), so an empty set here means "the server
  // wasn't asked to narrow anything" (= every kind), and a non-empty set is
  // exactly what's INCLUDED, not excluded.
  const excludedRelations = useMemo(() => new Set(searchParams?.getAll('relation') ?? []), [searchParams]);
  const includedKinds = useMemo(() => new Set(searchParams?.getAll('kind') ?? []), [searchParams]);
  // The "Companion" title node (see COMPANION_TITLE_SLUG below) connects to
  // every companion in the dataset, so it dwarfs every other title's node
  // degree and crowds out the rest of the Titles view -- hidden by default,
  // opt-in via `showCompanionTitle=1` rather than an excluded-by-default
  // entry in `relation`, since this hides a specific NODE, not a relation
  // type.
  const showCompanionTitle = searchParams?.get('showCompanionTitle') === '1';
  const searchedSlugs = useMemo(() => new Set([...(searchParams?.getAll('person') ?? []), ...(searchParams?.getAll('ancestorsOf') ?? []), ...(searchParams?.getAll('descendantsOf') ?? [])]), [searchParams]);

  const fetchUrl = useMemo(() => {
    try {
      const base = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const incoming = new URLSearchParams(searchParams?.toString() || '');
      // `selected` and `relation` are client view options with no server
      // meaning. `kind` is the opposite: it's a real query param the API
      // reads to decide which node kinds to return, so it's deliberately
      // forwarded rather than stripped.
      ['selected', 'relation', 'showCompanionTitle'].forEach(key => incoming.delete(key));
      for (const [key, value] of incoming.entries()) base.searchParams.append(key, value);
      return base.toString();
    } catch {
      return url;
    }
  }, [url, searchParams]);

  // Graph structure only changes via pipeline scripts, never live user
  // action, so there's nothing to gain from the default revalidate-on-focus
  // behavior — and it actively hurts here: every refetch hands ForceGraph2D
  // a new graphData reference, which restarts its cooldown/engine and
  // snaps the camera back to fitToView, discarding wherever the user had
  // panned/zoomed to just from switching tabs and back.
  const { data: graphData, error: graphError, isLoading: graphLoading } = useSWR<GraphData>(fetchUrl, fetcher, { revalidateOnFocus: false });
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>;
  const selectedNode = graphData?.nodes.find(node => node.slug === selectedSlug);
  const relationLabel = useCallback((type: string) => (t.relationTypes as Record<string, string>)[type] ?? relationName(type), [t]);
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
  const visibleGraph = useMemo(() => {
    if (!graphData || !anyFilterActive) return graphData;
    const nodesById = new Map(graphData.nodes.map(node => [node.id, node]));
    const slugOf = (endpoint: string | GraphNodeFull) => (typeof endpoint === 'string' ? nodesById.get(endpoint)?.slug : endpoint.slug);
    const endpointId = (endpoint: string | GraphNodeFull) => (typeof endpoint === 'string' ? endpoint : endpoint.id);
    // A relation-labeled edge is only kept when it directly touches one of the
    // searched people. Without this, an edge with a matching label anywhere in
    // the fetched 1-3 hop neighborhood (e.g. an unrelated person's daughter)
    // would pass the label check even though it isn't directly connected to
    // the person being searched.
    const isDirect = (link: GraphLink) => searchedSlugs.size === 0 || searchedSlugs.has(slugOf(link.source) ?? '') || searchedSlugs.has(slugOf(link.target) ?? '');
    // The Companion title node connects to every companion, so hiding it
    // (the default) means dropping any edge that touches it -- not just
    // omitting the node itself, which would otherwise leave dangling
    // links pointing at a node no longer in the graph.
    const isCompanionTitleNode = (endpoint: string | GraphNodeFull) => {
      const node = typeof endpoint === 'string' ? nodesById.get(endpoint) : endpoint;
      return node?.type === 'title' && node?.slug === COMPANION_TITLE_SLUG;
    };
    const isCompanionTitleLink = (link: GraphLink) => isCompanionTitleNode(link.source) || isCompanionTitleNode(link.target);
    // Node kinds are filtered server-side (see /api/graph's `kind` param) --
    // graphData already contains only the requested kinds, so there's
    // nothing left to filter out here.
    // Once the unfiltered view has run one simulation pass, d3-force
    // mutates each link's source/target from a plain string id into a
    // direct reference to the node object it resolved -- in place, on the
    // very same link objects graphData.links holds (they're never cloned).
    // A filtered view built afterwards from those links would inherit
    // stale references into the *unfiltered* node array, which the current
    // (filtered, possibly node-cloned) simulation doesn't recognize, so the
    // link fails to attach to anything -- the exact "weirdly connected,
    // missing relations" symptom that only shows up switching filters via
    // the UI, not on a fresh navigation where links haven't been touched
    // yet. Converting back to a plain string id forces d3-force to
    // re-resolve it against whichever node array is current.
    // A link is kept only when its governing type (see
    // governingRelationType -- ACCOMPANIED_BY resolves to COMPANION_OF)
    // isn't manually excluded, so toggling the single Companion switch
    // hides both edge directions together. It's also dropped when it
    // touches the Companion title node and that node is hidden.
    const links = graphData.links
      .filter(link => !excludedRelations.has(governingRelationType(link.label)) && isDirect(link) && (showCompanionTitle || !isCompanionTitleLink(link)))
      .map(link => ({ ...link, source: endpointId(link.source), target: endpointId(link.target) }));
    const linkedIds = new Set(links.flatMap(link => [link.source as string, link.target as string]));
    if (selectedNode) linkedIds.add(selectedNode.id);
    // Nodes pinned (fx/fy) at a precomputed full-graph position stay frozen
    // there under filtering too, so a filtered subgraph -- which should
    // reorganize freely like every unpinned graph view does -- instead
    // renders its edges crossing between stale, unrelated positions. Drop
    // the pin (keep x/y as just a starting point) once a filter is active.
    const nodes = graphData.nodes
      .filter(node => linkedIds.has(node.id))
      .map(node => (node.fx != null || node.fy != null) ? { ...node, fx: undefined, fy: undefined } : node);
    return { nodes, links };
  }, [graphData, anyFilterActive, excludedRelations, showCompanionTitle, selectedNode, searchedSlugs]);
  // Every edge is directional (e.g. FATHER points child -> parent), but a
  // bare relation-name tooltip can't tell you which end is which. Naming
  // both endpoints removes the ambiguity; the arrow glyph is flipped and
  // the endpoints swapped in Arabic so it still reads source-to-target in
  // natural (right-to-left) reading order, matching the LTR
  // source-to-target order for English.
  const visibleNodesById = useMemo(() => new Map((visibleGraph?.nodes ?? []).map(node => [node.id, node])), [visibleGraph]);
  const linkTooltip = useCallback((link: GraphLink) => {
    const resolve = (endpoint: string | GraphNode) => (typeof endpoint === 'string' ? visibleNodesById.get(endpoint) : endpoint);
    const sourceLabel = resolve(link.source)?.label ?? '';
    const targetLabel = resolve(link.target)?.label ?? '';
    const relation = relationLabel(link.label);
    return language === 'ar' ? `${targetLabel} <- ${relation} - ${sourceLabel}` : `${sourceLabel} - ${relation} -> ${targetLabel}`;
  }, [visibleNodesById, relationLabel, language]);
  // Sorted by nasab-graph prominence for the side list only; the canvas
  // itself renders visibleGraph.nodes directly, since force-layout doesn't
  // care about array order. Title nodes (no nasabRank) sort after every
  // ranked person, alongside any person who hasn't been ranked yet.
  const rankedViewNodes = useMemo(() => {
    if (!visibleGraph) return undefined;
    return [...visibleGraph.nodes].sort((a, b) =>
      (a.nasabRank ?? Number.MAX_SAFE_INTEGER) - (b.nasabRank ?? Number.MAX_SAFE_INTEGER) ||
      a.label.localeCompare(b.label)
    );
  }, [visibleGraph]);

  useEffect(() => {
    if (!fgRef.current || !graphData) return;
    const nodeToFocus = graphData.nodes.find(node => node.slug === selectedSlug || node.slug === focusSlug || node.slug === targetSlug);
    if (!nodeToFocus) return;
    const timer = setTimeout(() => {
      fgRef.current?.centerAt(nodeToFocus.x || 0, nodeToFocus.y || 0, 700);
      fgRef.current?.zoom(3, 700);
    }, 300);
    return () => clearTimeout(timer);
  }, [graphData, selectedSlug, focusSlug, targetSlug]);
  // react-force-graph-2d doesn't register a collision force by default, so
  // nodes are free to settle on top of each other regardless of their
  // starting position (including nodes seeded from a precomputed,
  // collision-free layoutX/layoutY). forceCollide is re-applied whenever the
  // visible node set changes; its radius accessor is called per node, so it
  // stays correct without needing to be recreated on every simulation tick.
  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.d3Force('collide', forceCollide<GraphNodeFull>(nodeRadius));
  }, [visibleGraph]);
  // Nodes carrying a precomputed layout position (from graphRank/clusterId's
  // companion layoutX/layoutY) can be spread far from the origin, so without
  // an explicit fit the initial camera can miss the graph entirely. Only
  // runs when nothing above is already going to center on a specific node.
  const hasFocusTarget = Boolean(selectedSlug || focusSlug || graphData?.nodes.some(node => node.slug === targetSlug));
  // Nodes with no PostgreSQL row (e.g. deep lineage-only ancestors) have no
  // pinned position and are free-simulated, which for a long ancestry chain
  // can drift them far from the rest of the graph. Fitting to every node
  // would zoom out to include that drift and shrink the graph people
  // actually came to look at, so when any node has a computed graphRank,
  // fit to just those; otherwise (a graph with no rank data at all) fit to
  // everything as before.
  const fitToView = useCallback(() => {
    if (hasFocusTarget || !fgRef.current) return;
    const hasRankedNodes = graphData?.nodes.some(node => node.graphRank != null) ?? false;
    fgRef.current.zoomToFit(400, 40, hasRankedNodes ? (node) => (node as GraphNodeFull).graphRank != null : undefined);
  }, [hasFocusTarget, graphData]);

  const updateParams = useCallback((changes: Record<string, string | null | string[]>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(changes).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) value.forEach(item => params.append(key, item));
      else if (value) params.set(key, value);
    });
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current || !initialParams || !searchParams) return;
    const missing = Object.entries(initialParams).filter(([key]) => !searchParams.has(key));
    if (missing.length === 0) return;
    seededRef.current = true;
    updateParams(Object.fromEntries(missing));
    // Only seed once on mount; initialParams/updateParams identity isn't
    // meant to re-trigger this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const toggleRelation = (type: string) => {
    const next = new Set(excludedRelations);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    updateParams({ relation: [...next] });
  };
  const toggleAllRelations = (show: boolean) => updateParams({ relation: show ? [] : relationTypesPresent });
  // Toggles every relation type in one group at once (e.g. a single
  // "all family relations" switch above the ~40 individual family
  // toggles), independent of the panel-wide "all relations" switch.
  const toggleGroupRelations = (group: RelationGroup, show: boolean) => {
    const groupTypes = relationTypesPresent.filter(type => relationGroup(type) === group);
    const next = new Set(excludedRelations);
    groupTypes.forEach(type => (show ? next.delete(type) : next.add(type)));
    updateParams({ relation: [...next] });
  };
  const toggleCompanionTitle = () => updateParams({ showCompanionTitle: showCompanionTitle ? null : '1' });
  const toggleKind = (kind: string) => {
    // An empty `includedKinds` means "every kind" -- narrowing for the
    // first time starts from the full universe, not an empty set, or
    // toggling one kind off would (wrongly) leave only that kind excluded
    // while claiming every other kind is now explicitly included.
    const base = includedKinds.size > 0 ? includedKinds : new Set<string>(ALL_KINDS);
    const next = new Set(base);
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
    // Once every kind is included again, clear the param instead of
    // spelling out all four -- `/graphs` (no kind param) is the canonical
    // "show everything" URL.
    updateParams({ kind: next.size >= ALL_KINDS.length ? [] : [...next], relation: [...nextExcluded] });
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

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

  const getGraphTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      background: isDark ? '#1f2937' : '#f9fafb',
      // Non-person node kinds get a distinct fill from person nodes so a
      // bipartite graph (titles/people, battles/people) reads as two kinds
      // of node at a glance.
      node: {
        person: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(241, 242, 180, 0.8)',
        title: isDark ? 'rgba(79, 70, 229, 0.85)' : 'rgba(199, 210, 254, 0.9)',
        battle: isDark ? 'rgba(180, 83, 9, 0.85)' : 'rgba(253, 230, 138, 0.9)',
        event: isDark ? 'rgba(13, 148, 136, 0.85)' : 'rgba(153, 246, 228, 0.9)',
        text: isDark ? '#f3f4f6' : '#374151',
      },
      link: isDark ? '#4b5563' : '#d1d5db',
    };
  };

  if (graphLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading graph...</div></div>;
  if (graphError) return <div className="flex items-center justify-center min-h-screen"><ErrorMessage title="Error loading graph" description={graphError.toString()} /></div>;

  const theme = getGraphTheme();
  const typeLabels: Record<string, string> = { person: t.people, title: t.titles, battle: t.battles.title, event: t.events };
  const kindColor = (kind: string) => theme.node[(kind as keyof typeof theme.node)] ?? theme.node.person;
  const kindLabel = (kind: string) => typeLabels[kind] ?? kind;
  const nodeFillColor = (node: GraphNodeFull) => node.slug === selectedSlug ? '#fbbf24' : kindColor(node.type ?? 'person');

  const filterPanel = (
    <>
      {kindsUniverse.length > 1 && (
        <fieldset dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{t.graph.nodeKinds}</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {kindsUniverse.map(kind => {
              const active = includedKinds.size === 0 || includedKinds.has(kind);
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
    <ForceGraph2D ref={fgRef} width={dimensions?.width} height={dimensions?.height} graphData={visibleGraph} nodeLabel="label" nodeAutoColorBy="group" linkLabel={(link) => linkTooltip(link as unknown as GraphLink)} backgroundColor={theme.background} linkColor={(link) => relationColor((link as unknown as GraphLink).label)} linkWidth={1.5} linkDirectionalArrowLength={3.5} linkDirectionalArrowRelPos={0.9} onNodeClick={(node) => updateParams({ selected: (node as GraphNodeFull).slug })} cooldownTicks={100} onEngineStop={fitToView} nodeCanvasObject={(node, ctx, globalScale) => {
      const label = (node as GraphNodeFull).label; const fontSize = Math.min(12 / globalScale, NODE_BASE_FONT_SIZE); ctx.font = `${fontSize}px Sans-Serif`; const textWidth = ctx.measureText(label).width; const dimensions = [textWidth, fontSize].map(value => value + fontSize) as [number, number];
      ctx.fillStyle = nodeFillColor(node as GraphNodeFull); ctx.beginPath(); ctx.arc(node.x!, node.y!, Math.max(...dimensions) / 2, 0, 2 * Math.PI); ctx.fill(); ctx.closePath(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme.node.text; ctx.fillText(label, node.x!, node.y!); (node as GraphNodeFull).__bckgDimensions = dimensions;
    }} nodePointerAreaPaint={(node, color, ctx) => { const d = (node as GraphNodeFull).__bckgDimensions; if (d) { ctx.fillStyle = color; ctx.fillRect(node.x! - d[0] / 2, node.y! - d[1] / 2, d[0], d[1]); } }} />
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gray-50/90 p-3 backdrop-blur dark:bg-gray-900/90">
          <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
            {visibleGraph ? `${visibleGraph.nodes.length} ${nodesLabel} · ${visibleGraph.links.length} relationships` : 'No graph data available'}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowFilterPanel(show => !show)} aria-pressed={showFilterPanel} aria-label={showFilterPanel ? t.graph.closeFilters : t.graph.openFilters} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
              {t.graph.openFilters}
            </button>
            <button type="button" onClick={() => setIsFullscreen(false)} aria-label={t.graph.closeFullscreen} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
              <FontAwesomeIcon icon={faCompress} />
            </button>
          </div>
        </div>
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3" aria-label="Graph controls">
        <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {visibleGraph ? `${visibleGraph.nodes.length} ${nodesLabel} · ${visibleGraph.links.length} relationships` : 'No graph data available'}
          {focusSlug ? ' · focused neighbourhood' : ''}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowFilterPanel(show => !show)} aria-pressed={showFilterPanel} aria-label={showFilterPanel ? t.graph.closeFilters : t.graph.openFilters} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            {t.graph.openFilters}
          </button>
          <button type="button" onClick={() => updateParams({ selected: null, focus: null, relation: [], kind: [], showCompanionTitle: null, person: null, ancestorsOf: [], descendantsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            Reset graph view
          </button>
        </div>
      </div>

      {showFilterPanel && filterPanel}

      {selectedNode && (
        <aside className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-gray-800" aria-live="polite">
          <p className="text-sm text-gray-600 dark:text-gray-300">Selected {kindLabel(selectedNode.type ?? 'person')}</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedNode.label}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300" href={profilePath(selectedNode.type, selectedNode.slug)}>View profile</Link>
            <button type="button" onClick={() => updateParams({ focus: selectedNode.slug, person: null, ancestorsOf: [], descendantsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-700">Explore neighbours</button>
          </div>
        </aside>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="relative h-[65vh] min-h-[32rem] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" role="region" aria-label="Interactive relationship graph">
          <button type="button" onClick={() => setIsFullscreen(true)} aria-label={t.graph.fullscreen} className={`absolute top-2 z-10 rounded border border-amber-400 bg-gray-50/90 px-2 py-1.5 text-gray-800 backdrop-blur hover:bg-amber-50 dark:bg-gray-900/90 dark:text-gray-100 dark:hover:bg-gray-800 ${language === 'ar' ? 'left-2' : 'right-2'}`}>
            <FontAwesomeIcon icon={faExpand} />
          </button>
          {graphCanvas()}
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{nodesLabel} in view</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use these keyboard-accessible controls to select an entry.</p>
          <ul className="mt-2 max-h-[55vh] space-y-1 overflow-auto">
            {rankedViewNodes?.map(node => <li key={node.id}><button type="button" onClick={() => updateParams({ selected: node.slug })} className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:hover:bg-gray-800 ${node.slug === selectedSlug ? 'bg-amber-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'}`}>{node.label}</button></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
