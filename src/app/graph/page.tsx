'use client';

import { useEffect, useState, useCallback, useRef, MutableRefObject } from 'react';
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import ForceGraph2D from 'react-force-graph-2d';
import translations from '@/components/translations';

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

export default function GraphPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    links: GraphLink[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fgRef = useRef<ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>>(null) as MutableRefObject<ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>>;

  // Fetch graph data
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/graph`);
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
  }, []);

  // Zoom to fit when graph data is loaded
  useEffect(() => {
    if (fgRef.current && graphData) {
      // Small delay to ensure the graph is rendered
      const timer = setTimeout(() => {
        fgRef.current?.zoomToFit(400, 100);
      }, 100);
      return () => clearTimeout(timer);
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {translations[language].familyRelations}
      </h1>

      <div className="w-full max-w-5xl mx-auto h-[70vh] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
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
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = (node as GraphNode).label;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
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