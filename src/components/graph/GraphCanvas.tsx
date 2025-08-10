'use client';

import { useEffect, useCallback, useRef, RefObject } from 'react';
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import ForceGraph2D from 'react-force-graph-2d';
import { GraphNodeFull, GraphLink, GraphData } from '@/types/graph';
import useSWR from 'swr';

interface GraphCanvasProps {
  url: string;
  targetSlug?: string;
}

import { fetcher } from '@/lib/swr';

export default function GraphCanvas({ url, targetSlug = 'prophet-muhammad' }: GraphCanvasProps) {
  const { language } = useLanguage();
  const router = useRouter();

  const { data: graphData, error: graphError, isLoading: graphLoading } = useSWR<GraphData>(url, fetcher);
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>;

  useEffect(() => {
    if (fgRef.current && graphData) {
      const targetNode = graphData.nodes.find(n => n.slug === targetSlug);

      if (targetNode) {
        const timer = setTimeout(() => {
          fgRef.current!.centerAt(targetNode.x! || 0, targetNode.y! || 0, 1000); // Pan to node over 1000ms
          fgRef.current!.zoom(9, 1000); // Optional: zoom in
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [graphData, targetSlug]);

  // Get the current theme for the graph
  const getGraphTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      background: isDark ? '#1f2937' : '#f9fafb',
      node: {
        background: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(241, 242, 180, 0.8)',
        text: isDark ? '#f3f4f6' : '#374151',
      },
      link: isDark ? '#4b5563' : '#d1d5db',
    };
  };

  // Handle node click
  const handleNodeClick = useCallback((node: GraphNodeFull) => {
    router.push(`/people/${node.slug}`);
  }, [router]);

  if (graphLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading graph...</div>
      </div>
    );
  }

  if (graphError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{graphError}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {graphData ? (
          <ForceGraph2D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="label"
            nodeAutoColorBy="group"
            linkLabel="label"
            backgroundColor={getGraphTheme().background}
            linkColor={() => getGraphTheme().link}
            linkWidth={1.5}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={0.9}
            linkDirectionalParticleColor={() => getGraphTheme().link}
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as GraphNodeFull).label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize);
              const theme = getGraphTheme();

              // Draw node background
              ctx.fillStyle = theme.node.background;
              ctx.beginPath();
              ctx.arc(
                node.x!,
                node.y!,
                Math.max(bckgDimensions[0], bckgDimensions[1]) / 2,
                0,
                2 * Math.PI
              );
              ctx.fill();
              ctx.closePath();

              // Draw node text
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = theme.node.text;
              ctx.fillText(label, node.x!, node.y!);

              (node as GraphNodeFull).__bckgDimensions = bckgDimensions as [number, number];
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              const bckgDimensions = (node as GraphNodeFull).__bckgDimensions;
              if (bckgDimensions) {
                ctx.fillRect(
                  node.x! - bckgDimensions[0] / 2,
                  node.y! - bckgDimensions[1] / 2,
                  bckgDimensions[0],
                  bckgDimensions[1]
                );
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-900 dark:text-gray-100">
            <div>{language === 'ar' ? 'لا توجد بيانات متاحة' : 'No graph data available'}</div>
          </div>
        )}
      </div>
    </div>
  );
}