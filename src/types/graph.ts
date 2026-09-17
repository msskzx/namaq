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
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  value: number;
  // Present on roster links: the participant's battle outcome(s), e.g.
  // ["INJURED"] or ["MARTYRED"], or ["ABSENT_EXCUSED"] on an absence.
  status?: string[];
  // What the person did there, in the source's own wording. Shown when the
  // relation is selected, which the graph cannot do yet (ADR 0013).
  summary?: string;
}

export interface GraphData {
  nodes: GraphNodeFull[];
  links: GraphLink[];
}