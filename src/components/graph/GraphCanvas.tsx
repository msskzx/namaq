'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, RefObject } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { forceCollide } from 'd3-force';
import { GraphData, GraphNodeFull, GraphLink } from '@/types/graph';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import GraphSearch from './GraphSearch';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { relationColor, sortRelationTypes } from '@/lib/relations';

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
  // Both stored as the set of EXCLUDED (hidden) values so each toggle acts
  // independently -- default (nothing excluded) shows everything, and
  // hiding one relation/kind never implicitly hides any other.
  const excludedRelations = useMemo(() => new Set(searchParams?.getAll('relation') ?? []), [searchParams]);
  const excludedKinds = useMemo(() => new Set(searchParams?.getAll('kind') ?? []), [searchParams]);
  const searchedSlugs = useMemo(() => new Set([...(searchParams?.getAll('person') ?? []), ...(searchParams?.getAll('ancestorsOf') ?? [])]), [searchParams]);

  const fetchUrl = useMemo(() => {
    try {
      const base = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const incoming = new URLSearchParams(searchParams?.toString() || '');
      // These are client view options, not graph-query options.
      ['selected', 'relation', 'kind'].forEach(key => incoming.delete(key));
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
  // Raw relation types present in the fetched graph, one toggle per type
  // (not grouped into families) so e.g. father and son can be shown/hidden
  // independently.
  const relationTypesPresent = useMemo(() => sortRelationTypes([...new Set(graphData?.links.map(link => link.label) ?? [])]), [graphData]);
  // Node kinds present in the fetched graph (person/title/battle/event).
  const kindsPresent = useMemo(() => [...new Set(graphData?.nodes.map(node => node.type ?? 'person') ?? [])], [graphData]);
  const isBipartite = kindsPresent.length > 1;
  const anyFilterActive = excludedRelations.size > 0 || excludedKinds.size > 0;
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
    const kindAllowed = (id: string) => !excludedKinds.has(nodesById.get(id)?.type ?? 'person');
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
    const links = graphData.links
      .filter(link => {
        const sourceId = endpointId(link.source);
        const targetId = endpointId(link.target);
        return !excludedRelations.has(link.label) && isDirect(link) && kindAllowed(sourceId) && kindAllowed(targetId);
      })
      .map(link => ({ ...link, source: endpointId(link.source), target: endpointId(link.target) }));
    const linkedIds = new Set(links.flatMap(link => [link.source as string, link.target as string]));
    if (selectedNode && kindAllowed(selectedNode.id)) linkedIds.add(selectedNode.id);
    // Nodes pinned (fx/fy) at a precomputed full-graph position stay frozen
    // there under filtering too, so a filtered subgraph -- which should
    // reorganize freely like every unpinned graph view does -- instead
    // renders its edges crossing between stale, unrelated positions. Drop
    // the pin (keep x/y as just a starting point) once a filter is active.
    const nodes = graphData.nodes
      .filter(node => linkedIds.has(node.id))
      .map(node => (node.fx != null || node.fy != null) ? { ...node, fx: undefined, fy: undefined } : node);
    return { nodes, links };
  }, [graphData, anyFilterActive, excludedRelations, excludedKinds, selectedNode, searchedSlugs]);
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
  const toggleKind = (kind: string) => {
    const next = new Set(excludedKinds);
    if (next.has(kind)) next.delete(kind);
    else next.add(kind);
    updateParams({ kind: [...next] });
  };
  const toggleAllKinds = (show: boolean) => updateParams({ kind: show ? [] : kindsPresent });

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
  useEffect(() => { if (!isFullscreen) setShowFilterPanel(false); }, [isFullscreen]);

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
  const profilePaths: Record<string, string> = { title: '/titles', battle: '/battles', event: '/events' };
  const kindColor = (kind: string) => theme.node[(kind as keyof typeof theme.node)] ?? theme.node.person;
  const kindLabel = (kind: string) => typeLabels[kind] ?? kind;
  const nodeFillColor = (node: GraphNodeFull) => node.slug === selectedSlug ? '#fbbf24' : kindColor(node.type ?? 'person');

  const filterPanel = (
    <>
      {relationTypesPresent.length > 0 && (
        <fieldset dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{t.graph.relationshipTypes}</legend>
          <div className="mb-2 flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={excludedRelations.size === 0} onChange={(event) => toggleAllRelations(event.target.checked)} />
              {t.graph.allRelations}
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {relationTypesPresent.map(type => {
              const active = !excludedRelations.has(type);
              const color = relationColor(type);
              const label = relationLabel(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleRelation(type)}
                  aria-pressed={active}
                  aria-label={`${active ? 'Hide' : 'Show'} ${label} relationships`}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-opacity ${active ? '' : 'opacity-50 hover:opacity-80'}`}
                  style={{ borderColor: color, backgroundColor: active ? `${color}26` : 'transparent', color }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {isBipartite && (
        <fieldset dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">{t.graph.nodeKinds}</legend>
          <div className="mb-2 flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
              <input type="checkbox" checked={excludedKinds.size === 0} onChange={(event) => toggleAllKinds(event.target.checked)} />
              {t.graph.allKinds}
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {kindsPresent.map(kind => {
              const active = !excludedKinds.has(kind);
              const color = kindColor(kind);
              const label = kindLabel(kind);
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => toggleKind(kind)}
                  aria-pressed={active}
                  aria-label={`${active ? 'Hide' : 'Show'} ${label}`}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-opacity ${active ? '' : 'opacity-50 hover:opacity-80'}`}
                  style={{ borderColor: color, backgroundColor: active ? `${color}` : 'transparent' }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full border border-gray-400" style={{ backgroundColor: color }} />
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
    </>
  );

  // react-force-graph-2d measures its size once at mount from its immediate
  // parent's box and never re-observes -- fine for the inline view, whose
  // parent has a fixed height (h-[65vh]) from the very first layout. The
  // fullscreen view's parent only reaches its final full-viewport height a
  // frame after mount, so the graph would permanently lock in at 0x0.
  // Passing explicit width/height (kept in sync on resize) sidesteps that.
  const graphCanvas = (dimensions?: { width: number; height: number }) => visibleGraph && (
    <ForceGraph2D ref={fgRef} width={dimensions?.width} height={dimensions?.height} graphData={visibleGraph} nodeLabel="label" nodeAutoColorBy="group" linkLabel={(link) => relationLabel((link as unknown as GraphLink).label)} backgroundColor={theme.background} linkColor={(link) => relationColor((link as unknown as GraphLink).label)} linkWidth={1.5} linkDirectionalArrowLength={3.5} linkDirectionalArrowRelPos={0.9} onNodeClick={(node) => updateParams({ selected: (node as GraphNodeFull).slug })} cooldownTicks={100} onEngineStop={fitToView} nodeCanvasObject={(node, ctx, globalScale) => {
      const label = (node as GraphNodeFull).label; const fontSize = Math.min(12 / globalScale, NODE_BASE_FONT_SIZE); ctx.font = `${fontSize}px Sans-Serif`; const textWidth = ctx.measureText(label).width; const dimensions = [textWidth, fontSize].map(value => value + fontSize) as [number, number];
      ctx.fillStyle = nodeFillColor(node as GraphNodeFull); ctx.beginPath(); ctx.arc(node.x!, node.y!, Math.max(...dimensions) / 2, 0, 2 * Math.PI); ctx.fill(); ctx.closePath(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme.node.text; ctx.fillText(label, node.x!, node.y!); (node as GraphNodeFull).__bckgDimensions = dimensions;
    }} nodePointerAreaPaint={(node, color, ctx) => { const d = (node as GraphNodeFull).__bckgDimensions; if (d) { ctx.fillStyle = color; ctx.fillRect(node.x! - d[0] / 2, node.y! - d[1] / 2, d[0], d[1]); } }} />
  );

  const kindLegend = isBipartite && (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
      {kindsPresent.map(type => (
        <span key={type} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: kindColor(type) }} />
          {kindLabel(type)}
        </span>
      ))}
    </div>
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
              ✕
            </button>
          </div>
        </div>
        {showFilterPanel && (
          <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`absolute top-14 z-20 max-h-[70vh] w-80 overflow-auto rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800 ${language === 'ar' ? 'left-3' : 'right-3'}`}>
            {kindLegend}
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
      {showSearch && <GraphSearch />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3" aria-label="Graph controls">
        <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {visibleGraph ? `${visibleGraph.nodes.length} ${nodesLabel} · ${visibleGraph.links.length} relationships` : 'No graph data available'}
          {focusSlug ? ' · focused neighbourhood' : ''}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsFullscreen(true)} aria-label={t.graph.fullscreen} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            {t.graph.fullscreen}
          </button>
          <button type="button" onClick={() => updateParams({ selected: null, focus: null, relation: [], kind: [], person: null, ancestorsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
            Reset graph view
          </button>
        </div>
      </div>

      {kindLegend}
      {filterPanel}

      {selectedNode && (
        <aside className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-gray-800" aria-live="polite">
          <p className="text-sm text-gray-600 dark:text-gray-300">Selected person</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedNode.label}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300" href={`${selectedNode.type ? profilePaths[selectedNode.type] ?? '/people' : '/people'}/${selectedNode.slug}`}>View profile</Link>
            <button type="button" onClick={() => updateParams({ focus: selectedNode.slug, person: null, ancestorsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-700">Explore neighbours</button>
          </div>
        </aside>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="h-[65vh] min-h-[32rem] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" role="region" aria-label="Interactive relationship graph">
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
