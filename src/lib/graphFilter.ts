import { GraphData, GraphLink, GraphNode, GraphNodeFull } from '@/types/graph';
import { governingRelationType } from './relations';

// The Title node every companion holds (see
// scripts/people/syncCompanionRelations.ts's COMPANION_TITLE_SLUG) -- one
// node with an edge to all ~250+ companions, far denser than any other
// title, so it's filterable independently of the Titles relation type.
export const COMPANION_TITLE_SLUG = 'companion';

export interface VisibleGraphOptions {
  excludedRelations: Set<string>;
  showCompanionTitle: boolean;
  // Slugs from a 1-hop `person` neighborhood search (see route.ts's
  // `persons` query). Edges must directly touch one of these to survive --
  // empty for every other fetch mode (default/ancestorsOf/descendantsOf/
  // battle/focus), where every edge the API returned already belongs to
  // the requested graph (e.g. an ancestorsOf chain walks an unbounded
  // number of hops) and must NOT be pruned down to a single hop.
  personSearchSlugs: Set<string>;
  selectedNodeId?: string;
}

// Mirrors GraphCanvas's `visibleGraph` computation: drops edges that are
// manually excluded, don't directly touch a `person`-searched slug (when
// that mode is active), or touch the hidden Companion title node -- then
// drops any node no remaining edge touches (except the explicitly selected
// one, which stays visible regardless).
export function filterVisibleGraph(graphData: GraphData, options: VisibleGraphOptions): GraphData {
  const { excludedRelations, showCompanionTitle, personSearchSlugs, selectedNodeId } = options;
  const nodesById = new Map<string, GraphNodeFull>(graphData.nodes.map(node => [node.id, node]));
  const slugOf = (endpoint: string | GraphNode) => (typeof endpoint === 'string' ? nodesById.get(endpoint)?.slug : endpoint.slug);
  const endpointId = (endpoint: string | GraphNode) => (typeof endpoint === 'string' ? endpoint : endpoint.id);

  const isDirect = (link: GraphLink) => personSearchSlugs.size === 0 || personSearchSlugs.has(slugOf(link.source) ?? '') || personSearchSlugs.has(slugOf(link.target) ?? '');
  const isCompanionTitleNode = (endpoint: string | GraphNode) => {
    const node = typeof endpoint === 'string' ? nodesById.get(endpoint) : endpoint;
    return node?.type === 'title' && node?.slug === COMPANION_TITLE_SLUG;
  };
  const isCompanionTitleLink = (link: GraphLink) => isCompanionTitleNode(link.source) || isCompanionTitleNode(link.target);

  const links = graphData.links
    .filter(link => !excludedRelations.has(governingRelationType(link.label)) && isDirect(link) && (showCompanionTitle || !isCompanionTitleLink(link)))
    .map(link => ({ ...link, source: endpointId(link.source), target: endpointId(link.target) }));
  const linkedIds = new Set(links.flatMap(link => [link.source as string, link.target as string]));
  if (selectedNodeId) linkedIds.add(selectedNodeId);
  // Nodes pinned (fx/fy) at a precomputed full-graph position stay frozen
  // there under filtering too, so a filtered subgraph -- which should
  // reorganize freely like every unpinned graph view does -- instead
  // renders its edges crossing between stale, unrelated positions. Drop
  // the pin (keep x/y as just a starting position) once a filter is active.
  const nodes = graphData.nodes
    .filter(node => linkedIds.has(node.id))
    .map(node => (node.fx != null || node.fy != null) ? { ...node, fx: undefined, fy: undefined } : node);
  return { nodes, links };
}
