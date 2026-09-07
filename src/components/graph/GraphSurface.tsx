'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ForceGraph2D, { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { forceCollide } from 'd3-force';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { GraphData, GraphNodeFull, GraphLink } from '@/types/graph';
import { edgeColor, PARTICIPATION_STATUS_COLOR } from '@/lib/relationship/status';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const KIND_COLOR = {
  person: { light: 'rgba(241, 242, 180, 0.8)', dark: 'rgba(55, 65, 81, 0.8)' },
  title: { light: 'rgba(199, 210, 254, 0.9)', dark: 'rgba(79, 70, 229, 0.85)' },
  battle: { light: 'rgba(253, 230, 138, 0.9)', dark: 'rgba(180, 83, 9, 0.85)' },
  event: { light: 'rgba(153, 246, 228, 0.9)', dark: 'rgba(13, 148, 136, 0.85)' },
} as const;
export function kindFillColor(kind: string, isDark: boolean): string {
  return KIND_COLOR[kind as keyof typeof KIND_COLOR]?.[isDark ? 'dark' : 'light'] ?? KIND_COLOR.person[isDark ? 'dark' : 'light'];
}

const HIGHLIGHT_COLOR = '#fbbf24';
const NODE_BASE_FONT_SIZE = 12;

let measureContext: CanvasRenderingContext2D | null = null;
function nodeRadius(node: GraphNodeFull): number {
  if (!measureContext) measureContext = document.createElement('canvas').getContext('2d');
  if (!measureContext) return NODE_BASE_FONT_SIZE;
  measureContext.font = `${NODE_BASE_FONT_SIZE}px Sans-Serif`;
  const textWidth = measureContext.measureText(node.label).width;
  return Math.max(textWidth + NODE_BASE_FONT_SIZE, NODE_BASE_FONT_SIZE * 2) / 2;
}

interface GraphSurfaceProps {
  url: string;
  width?: number;
  height?: number;
  background?: string;
  highlightSlug?: string;
  transform?: (data: GraphData) => GraphData;
  linkLabel?: (link: GraphLink) => string;
  onNodeClick: (node: GraphNodeFull) => void;
  onEngineStop?: () => void;
}

export type GraphSurfaceMethods = ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>;
type Methods = GraphSurfaceMethods;

// The shared rendering core every graph view builds on: fetches `url`,
// draws nodes/edges with the same theme and physics everywhere, and colors
// an edge by its recorded status (see edgeColor) instead of relation type
// whenever it has one -- e.g. a battle's PARTICIPATED_IN edges show the
// participant's outcome, no matter which page renders them.
const GraphSurface = forwardRef<Methods, GraphSurfaceProps>(function GraphSurface(
  { url, width, height, background, highlightSlug, transform, linkLabel, onNodeClick, onEngineStop },
  ref
) {
  const { language } = useLanguage();
  const t = translations[language];
  // Graph structure only changes via pipeline scripts, never live user
  // action, so there's nothing to gain from the default revalidate-on-focus
  // behavior -- and it actively hurts here: every refetch hands
  // ForceGraph2D a new graphData reference, which restarts its
  // cooldown/engine and snaps the camera back to fitToView.
  const { data, error, isLoading } = useSWR<GraphData>(url, fetcher, { revalidateOnFocus: false });
  const graphData = data && transform ? transform(data) : data;
  const localRef = useRef<Methods | undefined>(undefined);
  useImperativeHandle(ref, () => localRef.current as Methods, [graphData]);

  useEffect(() => {
    if (!localRef.current) return;
    localRef.current.d3Force('collide', forceCollide<GraphNodeFull>(nodeRadius));
  }, [graphData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage title={t.graph.loadError} />;
  if (!graphData) return null;

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const kindColor = (kind: string) => kindFillColor(kind, isDark);
  const textColor = isDark ? '#f3f4f6' : '#374151';
  const statuses = [...new Set(graphData.links.flatMap((link) => link.status ?? []))].filter((status) => status in PARTICIPATION_STATUS_COLOR);

  return (
    <div className="relative h-full w-full">
      <ForceGraph2D
        ref={localRef}
        width={width}
        height={height}
        graphData={graphData}
        nodeLabel="label"
        linkLabel={linkLabel ? (link) => linkLabel!(link as unknown as GraphLink) : undefined}
        backgroundColor={background ?? (isDark ? '#1f2937' : '#f9fafb')}
        linkColor={(link) => edgeColor(link as unknown as GraphLink)}
        linkWidth={1.5}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={0.9}
        cooldownTicks={100}
        onEngineStop={onEngineStop}
        onNodeClick={(node) => onNodeClick(node as GraphNodeFull)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const n = node as GraphNodeFull;
          const fontSize = Math.min(12 / globalScale, NODE_BASE_FONT_SIZE);
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(n.label).width;
          const dimensions: [number, number] = [textWidth + fontSize, fontSize * 2];
          n.__bckgDimensions = dimensions;

          ctx.fillStyle = n.slug === highlightSlug ? HIGHLIGHT_COLOR : kindColor(n.type ?? 'person');
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, Math.max(...dimensions) / 2, 0, 2 * Math.PI);
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = n.slug === highlightSlug ? '#1f2937' : textColor;
          ctx.fillText(n.label, node.x!, node.y!);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const d = (node as GraphNodeFull).__bckgDimensions;
          if (!d) return;
          ctx.fillStyle = color;
          ctx.fillRect(node.x! - d[0] / 2, node.y! - d[1] / 2, d[0], d[1]);
        }}
      />
      {statuses.length > 0 && (
        <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-2 rounded bg-gray-50/90 px-2 py-1 backdrop-blur dark:bg-gray-900/90">
          {statuses.map((status) => (
            <span key={status} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PARTICIPATION_STATUS_COLOR[status] }} />
              {(t.battles.participationStatus as Record<string, string>)[status] ?? status}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

export default GraphSurface;
