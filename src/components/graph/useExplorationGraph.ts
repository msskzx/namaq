'use client';

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { GraphData, GraphNodeFull } from '@/types/graph';
import { buildExploration, ExplorationCap, ExplorationInput, ExplorationResult } from '@/lib/relationship/exploration';
import { flattenLineageExpansions } from '@/lib/relationship/lineageExpansion';
import { buildRouteFetchParams, RouteFetchParams } from '@/lib/relationship/urlState';
import { mapExplorationToGraphData } from '@/lib/relationship/renderExploration';
import { RelationType, StoredEdge, SubjectId } from '@/lib/relationship/types';

function buildFetchUrl(baseUrl: string, kindParams: string[], routeParams: RouteFetchParams): string {
  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  kindParams.forEach((kind) => url.searchParams.append('kind', kind));
  routeParams.ancestorsOf.forEach((slug) => url.searchParams.append('ancestorsOf', slug));
  routeParams.ancestorsOfBothParents.forEach((slug) => url.searchParams.append('ancestorsOfBothParents', slug));
  routeParams.descendantsOf.forEach((slug) => url.searchParams.append('descendantsOf', slug));
  routeParams.relationSubjects.forEach((subject) => url.searchParams.append('relationSubjects', subject));
  routeParams.relationTypes.forEach((type) => url.searchParams.append('relationTypes', type));
  return url.toString();
}

function isFetchNeeded(routeParams: RouteFetchParams): boolean {
  return (
    routeParams.ancestorsOf.length > 0 ||
    routeParams.ancestorsOfBothParents.length > 0 ||
    routeParams.descendantsOf.length > 0 ||
    routeParams.relationSubjects.length > 0
  );
}

interface RawExploration {
  exploration: ExplorationResult;
  nodesById: Map<SubjectId, GraphNodeFull>;
  edges: StoredEdge[];
}

async function runExploration(baseUrl: string, kindParams: string[], input: ExplorationInput, fullGraph: boolean): Promise<RawExploration> {
  const nodesById = new Map<SubjectId, GraphNodeFull>();
  const edges: StoredEdge[] = [];
  const edgeKeys = new Set<string>();
  const fetchedSubjects = new Set<SubjectId>();

  const mergeGraphData = (data: GraphData) => {
    for (const node of data.nodes) {
      if (kindParams.length > 0 && !kindParams.includes(node.type ?? 'person')) continue;
      if (!nodesById.has(node.id)) nodesById.set(node.id, node);
    }
    for (const link of data.links) {
      const source = typeof link.source === 'string' ? link.source : link.source.id;
      const target = typeof link.target === 'string' ? link.target : link.target.id;
      if (!nodesById.has(source) || !nodesById.has(target)) continue;
      const key = `${source}|${target}|${link.label}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ source, target, type: link.label as RelationType, status: link.status });
    }
  };

  const runRound = async (routeParams: RouteFetchParams) => {
    if (!isFetchNeeded(routeParams)) return;
    const data: GraphData = await fetcher(buildFetchUrl(baseUrl, kindParams, routeParams));
    mergeGraphData(data);
    routeParams.relationSubjects.forEach((subject) => fetchedSubjects.add(subject));
  };

  await runRound(buildRouteFetchParams(input.roots, input.expansions));

  const roots = [...input.roots];
  if (fullGraph) {
    const data: GraphData = await fetcher(buildFetchUrl(baseUrl, kindParams, buildRouteFetchParams([], [])));
    mergeGraphData(data);
    roots.push(...data.nodes.map(node => node.id));
    data.nodes.forEach(node => fetchedSubjects.add(node.id));
  }

  // Fetches until the exploration stops growing rather than stopping after a
  // set number of rounds: the per-relation caps bound how far a filter can
  // reach, so closure is reachable and a truncated graph never looks complete.
  let exploration = buildExploration({ ...input, roots, expansions: flattenLineageExpansions(edges, input.expansions) }, edges);
  for (;;) {
    const newSubjects = Array.from(exploration.visible.keys()).filter((subject) => !fetchedSubjects.has(subject));
    if (newSubjects.length === 0) break;
    const fetchedBefore = fetchedSubjects.size;
    await runRound(buildRouteFetchParams(newSubjects, []));
    if (fetchedSubjects.size === fetchedBefore) break;
    exploration = buildExploration({ ...input, roots, expansions: flattenLineageExpansions(edges, input.expansions) }, edges);
  }

  return { exploration, nodesById, edges };
}

export interface UseExplorationGraphOptions {
  enabled: boolean;
  baseUrl: string;
  kindParams: string[];
  input: ExplorationInput;
  selectedSlug: string | null;
  fullGraph?: boolean;
}

export interface UseExplorationGraphResult {
  data: GraphData | undefined;
  edges: StoredEdge[] | undefined;
  isLoading: boolean;
  error: unknown;
  visibleCount: number | undefined;
  caps: ExplorationCap[] | undefined;
  retry: () => void;
}

export function useExplorationGraph({ enabled, baseUrl, kindParams, input, selectedSlug, fullGraph = false }: UseExplorationGraphOptions): UseExplorationGraphResult {
  const key = enabled ? JSON.stringify({ baseUrl, kindParams, input, fullGraph }) : null;
  const { data: raw, error, isLoading, isValidating, mutate } = useSWR<RawExploration>(
    key,
    () => runExploration(baseUrl, kindParams, input, fullGraph),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  const data = useMemo(() => {
    if (!raw) return undefined;
    const selectedNode = selectedSlug ? Array.from(raw.nodesById.values()).find((node) => node.slug === selectedSlug) : undefined;
    return mapExplorationToGraphData(raw.exploration, raw.nodesById, selectedNode?.id ?? null);
  }, [raw, selectedSlug]);

  const retry = useCallback(() => { void mutate(); }, [mutate]);

  return {
    data,
    edges: raw?.edges,
    isLoading,
    error,
    visibleCount: raw?.exploration.visible.size,
    // Withheld while a fetch is in flight: with keepPreviousData the previous
    // exploration's caps are still here, and persisting those would write back
    // history the new state just cleared.
    caps: isValidating ? undefined : raw?.exploration.caps,
    retry,
  };
}
