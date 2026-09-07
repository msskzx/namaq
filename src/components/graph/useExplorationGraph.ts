'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import { GraphData, GraphNodeFull } from '@/types/graph';
import { buildExploration, ExplorationInput, ExplorationResult } from '@/lib/relationship/exploration';
import { flattenLineageExpansions } from '@/lib/relationship/lineageExpansion';
import { buildRouteFetchParams, RouteFetchParams } from '@/lib/relationship/urlState';
import { mapExplorationToGraphData } from '@/lib/relationship/renderExploration';
import { RelationType, StoredEdge, SubjectId } from '@/lib/relationship/types';

const MAX_FILTER_FETCH_ROUNDS = 6;

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

async function runExploration(baseUrl: string, kindParams: string[], input: ExplorationInput): Promise<RawExploration> {
  const nodesById = new Map<SubjectId, GraphNodeFull>();
  const edges: StoredEdge[] = [];
  const edgeKeys = new Set<string>();
  const fetchedSubjects = new Set<SubjectId>();

  const mergeGraphData = (data: GraphData) => {
    for (const node of data.nodes) if (!nodesById.has(node.id)) nodesById.set(node.id, node);
    for (const link of data.links) {
      const source = typeof link.source === 'string' ? link.source : link.source.id;
      const target = typeof link.target === 'string' ? link.target : link.target.id;
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

  const flattenedExpansions = flattenLineageExpansions(edges, input.expansions);
  let exploration = buildExploration({ roots: input.roots, expansions: flattenedExpansions, globalFilters: [] }, edges);

  if (input.globalFilters.length > 0) {
    for (let round = 0; round < MAX_FILTER_FETCH_ROUNDS; round++) {
      exploration = buildExploration({ roots: input.roots, expansions: flattenedExpansions, globalFilters: input.globalFilters }, edges);
      const newSubjects = Array.from(exploration.visible.keys()).filter((subject) => !fetchedSubjects.has(subject));
      if (newSubjects.length === 0) break;
      await runRound(buildRouteFetchParams(newSubjects, []));
    }
    exploration = buildExploration({ roots: input.roots, expansions: flattenedExpansions, globalFilters: input.globalFilters }, edges);
  }

  return { exploration, nodesById, edges };
}

export interface UseExplorationGraphOptions {
  enabled: boolean;
  baseUrl: string;
  kindParams: string[];
  input: ExplorationInput;
  selectedSlug: string | null;
}

export interface UseExplorationGraphResult {
  data: GraphData | undefined;
  edges: StoredEdge[] | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useExplorationGraph({ enabled, baseUrl, kindParams, input, selectedSlug }: UseExplorationGraphOptions): UseExplorationGraphResult {
  const key = enabled ? JSON.stringify({ baseUrl, kindParams, input }) : null;
  const { data: raw, error, isLoading } = useSWR<RawExploration>(
    key,
    () => runExploration(baseUrl, kindParams, input),
    { revalidateOnFocus: false }
  );

  const data = useMemo(() => {
    if (!raw) return undefined;
    const selectedNode = selectedSlug ? Array.from(raw.nodesById.values()).find((node) => node.slug === selectedSlug) : undefined;
    return mapExplorationToGraphData(raw.exploration, raw.nodesById, selectedNode?.id ?? null);
  }, [raw, selectedSlug]);

  return { data, edges: raw?.edges, isLoading, error };
}
