'use client';

import React, { useCallback, useEffect, useMemo, useRef, RefObject } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { GraphData, GraphNodeFull, GraphLink } from '@/types/graph';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import GraphSearch from './GraphSearch';
import ErrorMessage from '@/components/common/ErrorMessage';
import { useLanguage } from '@/components/language/LanguageContext';

interface GraphCanvasProps {
  url?: string;
  targetSlug?: string;
  showSearch?: boolean;
}

const relationName = (value: string) => value.toLowerCase().replaceAll('_', ' ');

export default function GraphCanvas({ url = '/api/graph', targetSlug = 'prophet-muhammad', showSearch = true }: GraphCanvasProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams?.get('selected') ?? null;
  const focusSlug = searchParams?.get('focus') ?? null;
  const activeRelations = useMemo(() => new Set(searchParams?.getAll('relation') ?? []), [searchParams]);
  const searchedSlugs = useMemo(() => new Set([...(searchParams?.getAll('person') ?? []), ...(searchParams?.getAll('ancestorsOf') ?? [])]), [searchParams]);

  const fetchUrl = useMemo(() => {
    try {
      const base = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const incoming = new URLSearchParams(searchParams?.toString() || '');
      // These are client view options, not graph-query options.
      ['selected', 'relation'].forEach(key => incoming.delete(key));
      for (const [key, value] of incoming.entries()) base.searchParams.append(key, value);
      return base.toString();
    } catch {
      return url;
    }
  }, [url, searchParams]);

  const { data: graphData, error: graphError, isLoading: graphLoading } = useSWR<GraphData>(fetchUrl, fetcher);
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>;
  const selectedNode = graphData?.nodes.find(node => node.slug === selectedSlug);
  const relationTypes = useMemo(() => [...new Set(graphData?.links.map(link => link.label) ?? [])].sort(), [graphData]);
  const visibleGraph = useMemo(() => {
    if (!graphData || activeRelations.size === 0) return graphData;
    const nodesById = new Map(graphData.nodes.map(node => [node.id, node]));
    const slugOf = (endpoint: string | GraphNodeFull) => (typeof endpoint === 'string' ? nodesById.get(endpoint)?.slug : endpoint.slug);
    // A relation-labeled edge is only kept when it directly touches one of the
    // searched people. Without this, an edge with a matching label anywhere in
    // the fetched 1-3 hop neighborhood (e.g. an unrelated person's daughter)
    // would pass the label check even though it isn't directly connected to
    // the person being searched.
    const isDirect = (link: GraphLink) => searchedSlugs.size === 0 || searchedSlugs.has(slugOf(link.source) ?? '') || searchedSlugs.has(slugOf(link.target) ?? '');
    const links = graphData.links.filter(link => activeRelations.has(link.label) && isDirect(link));
    const linkedIds = new Set(links.flatMap(link => [typeof link.source === 'string' ? link.source : link.source.id, typeof link.target === 'string' ? link.target : link.target.id]));
    if (selectedNode) linkedIds.add(selectedNode.id);
    return { nodes: graphData.nodes.filter(node => linkedIds.has(node.id)), links };
  }, [graphData, activeRelations, selectedNode, searchedSlugs]);

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

  const updateParams = useCallback((changes: Record<string, string | null | string[]>) => {
    const params = new URLSearchParams(searchParams?.toString());
    Object.entries(changes).forEach(([key, value]) => {
      params.delete(key);
      if (Array.isArray(value)) value.forEach(item => params.append(key, item));
      else if (value) params.set(key, value);
    });
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ''}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const toggleRelation = (relation: string) => {
    const next = new Set(activeRelations);
    if (next.has(relation)) next.delete(relation);
    else next.add(relation);
    updateParams({ relation: [...next] });
  };

  const getGraphTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return { background: isDark ? '#1f2937' : '#f9fafb', node: { background: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(241, 242, 180, 0.8)', text: isDark ? '#f3f4f6' : '#374151' }, link: isDark ? '#4b5563' : '#d1d5db' };
  };

  if (graphLoading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading graph...</div></div>;
  if (graphError) return <div className="flex items-center justify-center min-h-screen"><ErrorMessage title="Error loading graph" description={graphError.toString()} /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {showSearch && <GraphSearch />}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3" aria-label="Graph controls">
        <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          {visibleGraph ? `${visibleGraph.nodes.length} people · ${visibleGraph.links.length} relationships` : 'No graph data available'}
          {focusSlug ? ' · focused neighbourhood' : ''}
        </p>
        <button type="button" onClick={() => updateParams({ selected: null, focus: null, relation: [], person: null, ancestorsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800">
          Reset graph view
        </button>
      </div>

      {relationTypes.length > 0 && (
        <fieldset className="mb-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <legend className="px-1 text-sm font-medium text-gray-800 dark:text-gray-100">Relationship types</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {relationTypes.map(type => <label key={type} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-200"><input type="checkbox" checked={activeRelations.size === 0 || activeRelations.has(type)} onChange={() => toggleRelation(type)} aria-label={`Show ${relationName(type)} relationships`} />{relationName(type)}</label>)}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Select one or more types to filter links. Clear all selections to show every relationship.</p>
        </fieldset>
      )}

      {selectedNode && (
        <aside className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-gray-800" aria-live="polite">
          <p className="text-sm text-gray-600 dark:text-gray-300">Selected person</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedNode.label}</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link className="rounded bg-amber-400 px-3 py-1.5 text-sm text-gray-950 hover:bg-amber-300" href={`/people/${selectedNode.slug}`}>View profile</Link>
            <button type="button" onClick={() => updateParams({ focus: selectedNode.slug, person: null, ancestorsOf: [] })} className="rounded border border-amber-400 px-3 py-1.5 text-sm text-gray-800 hover:bg-amber-100 dark:text-gray-100 dark:hover:bg-gray-700">Explore neighbours</button>
          </div>
        </aside>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="h-[65vh] min-h-[32rem] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700" role="region" aria-label="Interactive relationship graph">
          {visibleGraph && <ForceGraph2D ref={fgRef} graphData={visibleGraph} nodeLabel="label" nodeAutoColorBy="group" linkLabel="label" backgroundColor={getGraphTheme().background} linkColor={() => getGraphTheme().link} linkWidth={1.5} linkDirectionalArrowLength={3.5} linkDirectionalArrowRelPos={0.9} onNodeClick={(node) => updateParams({ selected: (node as GraphNodeFull).slug })} nodeCanvasObject={(node, ctx, globalScale) => {
            const label = (node as GraphNodeFull).label; const fontSize = 12 / globalScale; ctx.font = `${fontSize}px Sans-Serif`; const textWidth = ctx.measureText(label).width; const dimensions = [textWidth, fontSize].map(value => value + fontSize) as [number, number]; const theme = getGraphTheme();
            ctx.fillStyle = (node as GraphNodeFull).slug === selectedSlug ? '#fbbf24' : theme.node.background; ctx.beginPath(); ctx.arc(node.x!, node.y!, Math.max(...dimensions) / 2, 0, 2 * Math.PI); ctx.fill(); ctx.closePath(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = theme.node.text; ctx.fillText(label, node.x!, node.y!); (node as GraphNodeFull).__bckgDimensions = dimensions;
          }} nodePointerAreaPaint={(node, color, ctx) => { const d = (node as GraphNodeFull).__bckgDimensions; if (d) { ctx.fillStyle = color; ctx.fillRect(node.x! - d[0] / 2, node.y! - d[1] / 2, d[0], d[1]); } }} />}
        </div>
        <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">People in view</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use these keyboard-accessible controls to select a person.</p>
          <ul className="mt-2 max-h-[55vh] space-y-1 overflow-auto">
            {visibleGraph?.nodes.map(node => <li key={node.id}><button type="button" onClick={() => updateParams({ selected: node.slug })} className={`w-full rounded px-2 py-1 text-left text-sm hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:hover:bg-gray-800 ${node.slug === selectedSlug ? 'bg-amber-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'}`}>{node.label}</button></li>)}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Select a node to inspect it, then open its profile or load its immediate neighbours. Graph controls and selection are saved in this page’s URL.</p>
      {language === 'ar' && <span className="sr-only">يمكن استخدام قائمة الأشخاص مع لوحة المفاتيح لاختيار شخصية.</span>}
    </div>
  );
}
