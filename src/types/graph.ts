export interface GraphNode {
  id: string;
  label: string;
  slug: string;
  group: number;
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