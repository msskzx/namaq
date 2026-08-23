export interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
  // Which profile route this node's slug resolves under. Defaults to
  // 'person' when omitted, so existing person-only graphs need no changes.
  type?: string;
  // Nasab-graph prominence rank (1 = most prominent), read from the
  // person's PostgreSQL profile. Undefined/null for title nodes and for
  // people without a computed rank yet.
  nasabRank?: number | null;
  // Cross-type prominence rank (1 = most prominent) over the unified
  // Person+Battle+Title+Event graph, from scripts/graph/computeGraphLayout.ts.
  // Present on any node type once computed; null if not yet computed.
  graphRank?: number | null;
  // Louvain community id from the same unified-graph computation, for
  // zoom-out cluster collapse.
  clusterId?: number | null;
}

export interface GraphNodeFull extends GraphNode {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number
  fy?: number;
  __bckgDimensions?: [number, number];
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  value: number;
  // Present on PARTICIPATED_IN links: the participant's battle outcome(s),
  // e.g. ["INJURED"] or ["MARTYRED"].
  status?: string[];
}

export interface GraphData {
  nodes: GraphNodeFull[];
  links: GraphLink[];
}