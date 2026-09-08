import { GraphData, GraphLink, GraphNode, GraphNodeFull } from '@/types/graph';

// The Title node every companion holds (see
// scripts/people/syncCompanionRelations.ts's COMPANION_TITLE_SLUG) -- one
// node with an edge to all ~250+ companions, far denser than any other
// title, so it's filterable independently of the Titles relation type.
export const COMPANION_TITLE_SLUG = 'companion';

export interface VisibleGraphOptions {
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

// Keep person searches to one hop and optionally hide the Companion title.
// Preserve a selected node even when no surviving edge touches it.
export function filterVisibleGraph(graphData: GraphData, options: VisibleGraphOptions): GraphData {
  const { showCompanionTitle, personSearchSlugs, selectedNodeId } = options;
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
    .filter(link => isDirect(link) && (showCompanionTitle || !isCompanionTitleLink(link)))
    .map(link => ({ ...link, source: endpointId(link.source), target: endpointId(link.target) }));
  const linkedIds = new Set(links.flatMap(link => [link.source as string, link.target as string]));
  if (selectedNodeId) linkedIds.add(selectedNodeId);
  // Every subject has a fixed, precomputed global position (see
  // docs/adr/0005-use-a-precomputed-global-graph-map.md) that must survive
  // filtering unchanged -- a node hidden and later revealed by toggling a
  // filter back on has to reappear exactly where it was, not wherever a
  // fresh live simulation happens to settle it.
  const nodes = graphData.nodes.filter(node => linkedIds.has(node.id));
  return { nodes, links };
}
