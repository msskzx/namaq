// docs/plans/hadith-on-profiles.md
import type { ChainView, ReportView } from './hadithView';

export interface IsnadNode {
  id: string;
  label: string;
  agent?: string;
}

export interface IsnadEdge {
  from: string;
  to: string;
  label: string;
}

export interface IsnadGraph {
  nodes: IsnadNode[];
  edges: IsnadEdge[];
}

export type PlacedNode = IsnadNode & { rank: number; x: number; y: number };

export interface IsnadLayout {
  nodes: PlacedNode[];
  edges: IsnadEdge[];
  width: number;
  height: number;
}

export const NODE_W = 200;
export const NODE_H = 56;
const GAP_X = 24;
const ROW = 96;

export function isnadGraph(report: ReportView, collector: string): IsnadGraph {
  const nodes = new Map<string, IsnadNode>([['collector', { id: 'collector', label: collector }]]);
  const edges: IsnadEdge[] = [];
  const walk = (chain: ChainView, hearer: string, path: string) => {
    let last = hearer;
    chain.links.forEach((link, i) => {
      const head = !chain.branches?.length && i === chain.links.length - 1 && !link.gap;
      const id = head ? 'origin' : `${path}.${i}`;
      if (!nodes.has(id)) {
        nodes.set(id, link.gap ? { id, label: '…' } : { id, label: link.narrator, agent: link.agent });
      }
      edges.push({ from: id, to: last, label: link.gap ? '' : link.mode });
      last = id;
    });
    chain.branches?.forEach((branch, i) => walk(branch, last, `${path}b${i}`));
  };
  if (report.chain) walk(report.chain, 'collector', 'n');
  return { nodes: [...nodes.values()], edges };
}

export function layoutIsnad(graph: IsnadGraph): IsnadLayout {
  const ranks = new Map<string, number>();
  const rankOf = (id: string): number => {
    const known = ranks.get(id);
    if (known !== undefined) return known;
    const told = graph.edges.filter((e) => e.from === id).map((e) => rankOf(e.to) + 1);
    const rank = Math.max(0, ...told);
    ranks.set(id, rank);
    return rank;
  };
  const rows: IsnadNode[][] = [];
  for (const node of graph.nodes) (rows[rankOf(node.id)] ??= []).push(node);
  const width = Math.max(...rows.map((row) => row?.length ?? 0)) * (NODE_W + GAP_X);
  const nodes = rows.flatMap((row, rank) =>
    (row ?? []).map((node, i) => ({
      ...node,
      rank,
      x: width / 2 + (i - (row.length - 1) / 2) * (NODE_W + GAP_X) - NODE_W / 2,
      y: rank * ROW,
    })),
  );
  return { nodes, edges: graph.edges, width, height: (rows.length - 1) * ROW + NODE_H };
}
