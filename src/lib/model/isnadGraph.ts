// docs/plans/hadith-on-profiles.md
// docs/plans/hadith-chain-rows.md
import type { ChainView, ReportView } from './hadithView';
import { nameKey, TABAQA } from './tabaqa';

export interface IsnadNode {
  id: string;
  label: string;
  agent?: string;
  tabaqa?: number;
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

export interface IsnadRow {
  kind: 'collector' | 'tabaqa' | 'unranked';
  tabaqa?: number;
  y: number;
}

export interface IsnadLayout {
  nodes: PlacedNode[];
  edges: IsnadEdge[];
  rows: IsnadRow[];
  width: number;
  height: number;
}

export const NODE_W = 200;
export const NODE_H = 56;
export const LABEL_W = 110;
const GAP_X = 80;
const ROW = 96;

export function isnadGraph(report: ReportView, collector: string, unit?: string): IsnadGraph {
  const placed = unit ? TABAQA[unit] : undefined;
  const nodes = new Map<string, IsnadNode>([['collector', { id: 'collector', label: collector }]]);
  const edges = new Map<string, IsnadEdge>();
  const link = (edge: IsnadEdge) => edges.set(`${edge.from}>${edge.to}>${edge.label}`, edge);
  const walk = (chain: ChainView, hearer: string, path: string) => {
    let last = hearer;
    chain.links.forEach((item, i) => {
      const known = item.gap ? undefined : placed?.narrators[nameKey(item.narrator)];
      const head = !chain.branches?.length && i === chain.links.length - 1 && !item.gap;
      const id = known ? `p:${known.person}` : head ? 'origin' : `${path}.${i}`;
      if (!nodes.has(id)) {
        nodes.set(
          id,
          item.gap
            ? { id, label: '…' }
            : { id, label: item.narrator, agent: item.agent, tabaqa: known?.tabaqa },
        );
      }
      link({ from: id, to: last, label: item.gap ? '' : item.mode });
      last = id;
    });
    chain.branches?.forEach((branch, i) => walk(branch, last, `${path}b${i}`));
  };
  if (report.chain) walk(report.chain, 'collector', 'n');
  let hearer = placed?.tail ? `p:${placed.tail.after}` : '';
  for (const item of nodes.has(hearer) ? (placed?.tail?.links ?? []) : []) {
    const id = `p:${item.person}`;
    nodes.set(id, { id, label: item.label, tabaqa: item.tabaqa });
    link({ from: id, to: hearer, label: item.mode });
    hearer = id;
  }
  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

export function layoutIsnad(graph: IsnadGraph): IsnadLayout {
  const ranked = graph.nodes.some((n) => n.tabaqa !== undefined);
  const tabaqat = [...new Set(graph.nodes.map((n) => n.tabaqa).filter((t) => t !== undefined))].sort(
    (a, b) => b! - a!,
  );
  const unranked = ranked && graph.nodes.some((n) => n.id !== 'collector' && n.tabaqa === undefined);
  const ranks = new Map<string, number>();
  const rankOf = (id: string): number => {
    const known = ranks.get(id);
    if (known !== undefined) return known;
    const node = graph.nodes.find((n) => n.id === id)!;
    const told = graph.edges.filter((e) => e.from === id).map((e) => rankOf(e.to) + 1);
    const rank = !ranked
      ? Math.max(0, ...told)
      : id === 'collector'
        ? 0
        : node.tabaqa === undefined
          ? tabaqat.length + 1
          : tabaqat.indexOf(node.tabaqa) + 1;
    ranks.set(id, rank);
    return rank;
  };
  const rows: IsnadNode[][] = [];
  for (const node of graph.nodes) (rows[rankOf(node.id)] ??= []).push(node);
  const step = NODE_W + GAP_X;
  const xs = new Map<string, number>();
  if (ranked) {
    const hearers = (id: string) => graph.edges.filter((e) => e.from === id).map((e) => e.to);
    const mean = (ids: string[]) => ids.reduce((sum, h) => sum + xs.get(h)!, 0) / ids.length;
    const place = (items: [string, number][]) => {
      let edge = -Infinity;
      for (const [id, want] of [...items].sort((a, b) => a[1] - b[1])) {
        edge = Math.max(want, edge + step);
        xs.set(id, edge);
      }
    };
    xs.set('collector', 0);
    rows.slice(1).forEach((row, i) => {
      const rank = i + 1;
      const above = (id: string) => hearers(id).filter((h) => ranks.get(h)! < rank);
      const level = row.filter((n) => above(n.id).length > 0);
      place(level.map((n): [string, number] => [n.id, mean(above(n.id))]));
      const beside = row.filter((n) => !xs.has(n.id));
      const next = (n: IsnadNode) => {
        const same = hearers(n.id).filter((h) => xs.has(h));
        return same.length ? mean(same) + step : 0;
      };
      place([
        ...level.map((n): [string, number] => [n.id, xs.get(n.id)!]),
        ...beside.map((n): [string, number] => [n.id, next(n)]),
      ]);
    });
    const below = graph.edges.filter((e) => e.to === 'collector').map((e) => e.from);
    if (below.length) xs.set('collector', mean(below));
  }
  const shift = ranked ? Math.min(...xs.values()) : 0;
  const content = ranked
    ? Math.max(...xs.values()) - shift + NODE_W
    : Math.max(...rows.map((row) => row?.length ?? 0)) * (NODE_W + GAP_X);
  const nodes = rows.flatMap((row, rank) =>
    (row ?? []).map((node, i) => ({
      ...node,
      rank,
      x: ranked
        ? xs.get(node.id)! - shift
        : content / 2 + (i - (row.length - 1) / 2) * (NODE_W + GAP_X) - NODE_W / 2,
      y: rank * ROW,
    })),
  );
  const labels: IsnadRow[] = !ranked
    ? []
    : [
        { kind: 'collector', y: 0 },
        ...tabaqat.map((tabaqa, i) => ({ kind: 'tabaqa' as const, tabaqa, y: (i + 1) * ROW })),
        ...(unranked ? [{ kind: 'unranked' as const, y: (tabaqat.length + 1) * ROW }] : []),
      ];
  return {
    nodes,
    edges: graph.edges,
    rows: labels,
    width: content + (ranked ? LABEL_W : 0),
    height: (rows.length - 1) * ROW + NODE_H,
  };
}
