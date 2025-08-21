'use client';

import React, { useCallback, useEffect, useMemo, useRef, RefObject } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function GraphCanvas({ url = '/api/graph', targetSlug = 'prophet-muhammad', showSearch = true }: GraphCanvasProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build the fetch URL by forwarding current page search parameters
  const fetchUrl = useMemo(() => {
    try {
      const base = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      const incoming = new URLSearchParams(searchParams?.toString() || '');

      // Merge: append incoming params that aren't already present on base
      // Allow multi-valued params like ancestorsOf to pass through
      for (const k of incoming.keys()) {
        // If base already has at least one value for k, skip adding duplicates
        if (!base.searchParams.has(k)) {
          // Append all values for this key from incoming
          const allVals = incoming.getAll(k);
          allVals.forEach(val => base.searchParams.append(k, val));
        }
      }
      return base.toString();
    } catch {
      return url; // Fallback: use provided url as-is
    }
  }, [url, searchParams]);

  const { data: graphData, error: graphError, isLoading: graphLoading } = useSWR<GraphData>(fetchUrl, fetcher);
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNodeFull>, LinkObject<GraphNodeFull, GraphLink>>>;

  useEffect(() => {
    if (fgRef.current && graphData) {
      const targetNode = graphData.nodes.find(n => n.slug === targetSlug);

      if (targetNode) {
        const timer = setTimeout(() => {
          fgRef.current!.centerAt(targetNode.x! || 0, targetNode.y! || 0, 1000); // Pan to node over 1000ms
          fgRef.current!.zoom(4, 1000); // Optional: zoom in
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
        <ErrorMessage title="Error loading graph" description={graphError.toString()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showSearch && (
        <div className="mb-">
          <GraphSearch />
        </div>
      )}
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