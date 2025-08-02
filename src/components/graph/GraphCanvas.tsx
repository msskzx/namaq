'use client';

import { useEffect, useState, useCallback, useRef, RefObject } from 'react';
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import ForceGraph2D from 'react-force-graph-2d';

interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number
  fy?: number;
  __bckgDimensions?: [number, number];
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  value: number;
}

interface GraphCanvasProps {
    url: string;
}

export default function GraphCanvas({ url }: GraphCanvasProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>>(null) as RefObject<ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>>;

  // Fetch graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch graph data');
        }
        const data = await response.json();
        setGraphData(data);
      } catch (err) {
        console.error('Error fetching graph data:', err);
        setError('Failed to load graph data');
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [url]);

  useEffect(() => {
    if (fgRef.current && graphData) {
      const targetSlug = 'prophet-muhammad'; // 👈 Your target slug
      const targetNode = graphData.nodes.find(n => n.slug === targetSlug);
  
      if (targetNode) {
        const timer = setTimeout(() => {
          fgRef.current!.centerAt(targetNode.x! || 0, targetNode.y! || 0, 1000); // Pan to node over 1000ms
          fgRef.current!.zoom(9, 1000); // Optional: zoom in
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [graphData]);

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
  const handleNodeClick = useCallback((node: GraphNode) => {
    router.push(`/people/${node.slug}`);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading graph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
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
              const label = (node as GraphNode).label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize) ;
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

              (node as GraphNode).__bckgDimensions = bckgDimensions as [number, number];
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.fillStyle = color;
              const bckgDimensions = (node as GraphNode).__bckgDimensions;
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