export interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
  // Either the raw Neo4j node label (e.g. "Person", "Battle", set by
  // /api/graph from node.labels) or a lowercase profile-route hint like
  // 'person' | 'title' (set explicitly by /api/graph/titles). Optional
  // because it was never populated back when :Person was the only label.
  type?: string;
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