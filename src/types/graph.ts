export interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
  // Which profile route this node's slug resolves under. Defaults to
  // 'person' when omitted, so existing person-only graphs need no changes.
  type?: string;
  // Prominence rank (1 = most prominent) over the unified
  // Person+Battle+Title+Event graph, computed by
  // scripts/graph/computeGraphLayout.ts and read back from Neo4j. Present on
  // any node kind once computed; null if not yet computed.
  graphRank?: number | null;
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