'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import GraphSurface, { GraphSurfaceMethods } from '@/components/graph/GraphSurface';

const PROPHET_SLUG = 'prophet-muhammad';

// The Prophet has ~250 companions, all one hop away via COMPANION_OF --
// far more than this small preview canvas can show alongside his actual
// family relations, so the API is asked to drop those relations (and
// their now-unreached companion nodes) before the response ever reaches
// the browser. The full graph at /graphs still has them.
const GRAPH_URL = `/api/graph?focus=${PROPHET_SLUG}&excludeRelation=COMPANION_OF&excludeRelation=ACCOMPANIED_BY`;

export default function HeroGraphPreview() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<GraphSurfaceMethods | null>(null);
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
      {size && (
        <GraphSurface
          ref={fgRef}
          url={GRAPH_URL}
          width={size.width}
          height={size.height}
          background="transparent"
          highlightSlug={PROPHET_SLUG}
          onNodeClick={(node) => router.push(`/people/${node.slug}`)}
          onEngineStop={() => fgRef.current?.zoomToFit(400, 24)}
        />
      )}
    </div>
  );
}
