export interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
  // Which profile route this node's slug resolves under. Defaults to
  // 'person' when omitted, so existing person-only graphs need no changes.
  type?: 'person' | 'title';
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
}

export interface GraphData {
  nodes: GraphNodeFull[];
  links: GraphLink[];
}