'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import GraphSurface, { type GraphSurfaceMethods } from '@/components/graph/LazyGraphSurface';
import { useExplorationGraph } from '@/components/graph/useExplorationGraph';
import { parseExplorationInput } from '@/lib/relationship/urlState';
import { filterVisibleGraph } from '@/lib/graphFilter';
import { useLanguage } from '../language/LanguageContext';
import { PROPHET_GRAPH_HREF } from './homeLinks';
import styles from './Home.module.css';

const params = new URLSearchParams(PROPHET_GRAPH_HREF.split('?')[1]);
const input = parseExplorationInput({
  subjects: params.getAll('subject'), expands: params.getAll('expand'), filters: params.getAll('filter'),
  caps: params.getAll('cap'), removed: params.getAll('removed'),
  statuses: params.has('status') ? params.getAll('status') : undefined,
}, 'prophet-muhammad');
const kinds = params.getAll('kind');
const personSearchSlugs = new Set<string>();

export default function HeroGraphPreview() {
  const ar = useLanguage().language === 'ar';
  const [selectedSlug, setSelectedSlug] = useState<string | null>(params.get('selected'));
  const { data, error, isLoading } = useExplorationGraph({ enabled: true, baseUrl: '/api/graph', kindParams: kinds, input, selectedSlug });
  const selected = data?.nodes.find(node => node.slug === selectedSlug);
  const shown = useMemo(() => data ? filterVisibleGraph(data, { showCompanionTitle: false, personSearchSlugs, selectedNodeId: selected?.id }) : undefined, [data, selected?.id]);
  const container = useRef<HTMLDivElement>(null);
  const graph = useRef<GraphSurfaceMethods | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className={styles.familyCanvas} role="region" aria-label={ar ? 'مثال شبكة العلاقات' : 'Relationship graph example'}>
      {size && <GraphSurface ref={graph} data={shown} isLoading={isLoading} loadError={error} width={size.width} height={size.height} background="transparent" highlightSlug={selectedSlug ?? undefined} onNodeClick={node => setSelectedSlug(node.slug)} onEngineStop={() => graph.current?.zoomToFit(400, 32)} />}
    </div>
  );
}
