'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { GraphData, GraphLink, GraphNodeFull } from '@/types/graph';
import { relationColor } from '@/lib/relations';

const PROPHET_SLUG = 'prophet-muhammad';

const getGraphTheme = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return {
    node: isDark ? 'rgba(55, 65, 81, 0.9)' : 'rgba(241, 242, 180, 0.9)',
    text: isDark ? '#f3f4f6' : '#374151',
  };
};

export default function HeroGraphPreview() {
  const { data: graphData } = useSWR<GraphData>(`/api/graph?focus=${PROPHET_SLUG}`, fetcher);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900"
      role="region"
      aria-label="Preview of the relationships graph — click a person to view their profile"
    >
      {graphData && size && (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          width={size.width}
          height={size.height}
          backgroundColor="transparent"
          linkColor={(link) => relationColor((link as unknown as GraphLink).label)}
          linkWidth={1.5}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={0.9}
          cooldownTicks={100}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 24)}
          onNodeClick={(node) => router.push(`/people/${(node as GraphNodeFull).slug}`)}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const n = node as GraphNodeFull;
            const theme = getGraphTheme();
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(n.label).width;
            const padding = fontSize * 0.7;
            const radius = Math.max(textWidth, fontSize) / 2 + padding;
            n.__bckgDimensions = [radius * 2, radius * 2];

            ctx.fillStyle = n.slug === PROPHET_SLUG ? '#fbbf24' : theme.node;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
            ctx.fill();

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = n.slug === PROPHET_SLUG ? '#1f2937' : theme.text;
            ctx.fillText(n.label, node.x!, node.y!);
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const n = node as GraphNodeFull;
            const radius = n.__bckgDimensions?.[0] ? n.__bckgDimensions[0] / 2 : 6;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
            ctx.fill();
          }}
        />
      )}
    </div>
  );
}
