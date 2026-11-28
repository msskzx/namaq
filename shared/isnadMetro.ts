import { bareHadith, type AppIsnad } from './hadith';

export interface MetroStation {
  id: string;
  label: string;
  col: number;
  across: number;
  level: number;
  route: number;
  kind: 'collector' | 'companion' | 'narrator';
}

export interface MetroLeg {
  from: string;
  to: string;
  route: number;
  words: { route: number; label: string }[];
}

export interface MetroLevel {
  tabaqa?: number;
  name?: string;
}

export interface Metro {
  stations: MetroStation[];
  legs: MetroLeg[];
  levels: MetroLevel[];
  cols: number;
  routes: number;
}

const bare = (word: string) => bareHadith(word).trim();

export function isnadMetro(isnad: AppIsnad): Metro {
  const top = Math.min(...isnad.nodes.map(node => node.y));
  const collector = isnad.nodes.find(node => node.y === top)!;
  const ys = isnad.rows.length ? isnad.rows.map(row => row.y) : [...new Set(isnad.nodes.map(node => node.y))];
  ys.sort((a, b) => a - b);
  const xs = [...new Set(isnad.nodes.map(node => node.x))].sort((a, b) => a - b);
  const rowOf = new Map(isnad.rows.map(row => [row.y, row]));

  const heardFrom = (id: string) => isnad.edges.filter(edge => edge.to === id).map(edge => edge.from);
  const starts = [...new Set(isnad.edges.filter(edge => edge.to === collector.id).map(edge => edge.from))];
  const routesOf = new Map<string, Set<number>>();
  starts.forEach((start, route) => {
    const seen = new Set<string>();
    const walk = [start];
    while (walk.length) {
      const id = walk.pop()!;
      if (seen.has(id)) continue;
      seen.add(id);
      if (!routesOf.has(id)) routesOf.set(id, new Set());
      routesOf.get(id)!.add(route);
      walk.push(...heardFrom(id));
    }
  });
  const routeOf = (id: string) => {
    const routes = routesOf.get(id);
    return routes && routes.size === 1 ? [...routes][0] : 0;
  };

  const stations: MetroStation[] = isnad.nodes.map(node => {
    const row = rowOf.get(node.y);
    return {
      id: node.id, label: node.label, col: xs.indexOf(node.x), across: xs.length > 1 ? (node.x - xs[0]) / (xs[xs.length - 1] - xs[0]) : 0, level: ys.indexOf(node.y), route: routeOf(node.id),
      kind: node.id === collector.id ? 'collector' : row?.kind === 'tabaqa' && row.tabaqa === 1 ? 'companion' : 'narrator',
    };
  });

  const legs: MetroLeg[] = [];
  let listed = -1;
  for (const edge of isnad.edges) {
    if (edge.to === collector.id) listed = starts.indexOf(edge.from);
    const known = legs.find(leg => leg.from === edge.to && leg.to === edge.from);
    if (known) {
      if (!known.words.some(word => bare(word.label) === bare(edge.label))) known.words.push({ route: Math.max(0, listed), label: edge.label });
      continue;
    }
    const hearer = routesOf.get(edge.to);
    const route = hearer && hearer.size === 1 ? routeOf(edge.to) : routeOf(edge.from);
    legs.push({ from: edge.to, to: edge.from, route, words: [{ route: hearer && hearer.size > 1 ? Math.max(0, listed) : route, label: edge.label }] });
  }

  const levels = ys.map(y => {
    const rank = rowOf.get(y);
    return rank?.kind === 'tabaqa' ? { tabaqa: rank.tabaqa, name: rank.name } : {};
  });
  return { stations, legs, levels, cols: xs.length, routes: Math.max(1, starts.length) };
}

export function chainIsnad(collector: string, chain: { name: string; mode: string }[]): AppIsnad {
  const nodes = [{ id: 'c', label: collector, x: 0, y: 0 }, ...chain.map((link, i) => ({ id: `n${i}`, label: link.name, x: 0, y: i + 1 }))];
  const edges = chain.map((link, i) => ({ from: `n${i}`, to: i === 0 ? 'c' : `n${i - 1}`, label: link.mode }));
  return { nodes, edges, rows: [], width: 0, height: 0 };
}

export const metroOrder = (metro: Metro) => [...metro.stations].sort((a, b) => a.level - b.level || a.col - b.col).map(station => station.label);

export function chainLinks(isnad: AppIsnad): { name: string; mode: string }[] {
  const top = Math.min(...isnad.nodes.map(node => node.y));
  const links: { name: string; mode: string }[] = [];
  for (let edge = isnad.edges.find(each => each.to === isnad.nodes.find(node => node.y === top)?.id); edge && links.length < isnad.edges.length; edge = isnad.edges.find(each => each.to === edge!.from)) {
    links.push({ name: isnad.nodes.find(node => node.id === edge!.from)!.label, mode: edge.label });
  }
  return links;
}
