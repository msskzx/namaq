import { bareHadith, type AppIsnad } from './hadith';

/**
 * An isnad as a metro line (owner 2026-11-24, sketch hadith-design/sketch3): a station for each narrator, the collector
 * on top, each route from him a line of its own colour; where routes meet at one narrator they run on as one line.
 * Where the isnad has tabaqat (Ibn Hajar's, in Taqrib al-Tahdhib), each tabaqa is one level and its people stand on it
 * side by side; without them each narrator is a level of his own. The line carries the narrators and the words they
 * narrated with only: what a narrator tells is the hadith's text (owner 2026-11-24), never the line.
 */
export interface MetroStation {
  id: string;
  label: string;
  /** Its column from the right, 0 first. */
  col: number;
  /** How far across it stands, 0 the right edge and 1 the left, as far apart as the website's layout sets them. */
  across: number;
  /** Its level from the top, 0 the collector's. */
  level: number;
  /** The route it is on, 0 for the first; a station on more than one route is on the first's line. */
  route: number;
  kind: 'collector' | 'companion' | 'narrator';
}

export interface MetroLeg {
  /** The station of the one who heard (above). */
  from: string;
  /** The station of the one he heard from. */
  to: string;
  route: number;
  /**
   * The word he narrated with, once when every route over the leg says it (owner 2026-11-24: «عَنْ» and «عَنِ» are one
   * word); where routes say different words, one for each, and the leg is drawn as their lines side by side.
   */
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

/** A word with its vowels set aside, so «عَنْ» and «عَنِ» (one word, the second voweled for the next) count as one. */
const bare = (word: string) => bareHadith(word).trim();

export function isnadMetro(isnad: AppIsnad): Metro {
  const top = Math.min(...isnad.nodes.map(node => node.y));
  const collector = isnad.nodes.find(node => node.y === top)!;
  const ys = isnad.rows.length ? isnad.rows.map(row => row.y) : [...new Set(isnad.nodes.map(node => node.y))];
  ys.sort((a, b) => a - b);
  const xs = [...new Set(isnad.nodes.map(node => node.x))].sort((a, b) => a - b);
  const rowOf = new Map(isnad.rows.map(row => [row.y, row]));

  // Each route is followed from the collector's narrator down: the people each one reaches.
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
  // The edges come route by route, each route from its edge to the collector: an edge's route is the one it is listed under.
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

/** A plain chain (one line, no ح) as an isnad: the collector, then each narrator under the one who narrated from him. */
export function chainIsnad(collector: string, chain: { name: string; mode: string }[]): AppIsnad {
  const nodes = [{ id: 'c', label: collector, x: 0, y: 0 }, ...chain.map((link, i) => ({ id: `n${i}`, label: link.name, x: 0, y: i + 1 }))];
  const edges = chain.map((link, i) => ({ from: `n${i}`, to: i === 0 ? 'c' : `n${i - 1}`, label: link.mode }));
  return { nodes, edges, rows: [], width: 0, height: 0 };
}

/** The order to read the stations in: level by level, right to left. */
export const metroOrder = (metro: Metro) => [...metro.stations].sort((a, b) => a.level - b.level || a.col - b.col).map(station => station.label);

/** A plain chain's last narrator, the one the words come from, with the word he narrated with. */
export function lastNarrator(isnad: AppIsnad): { name: string; mode: string } | undefined {
  const heard = new Set(isnad.edges.map(edge => edge.to));
  const last = isnad.nodes.find(node => !heard.has(node.id));
  const edge = last && isnad.edges.find(each => each.from === last.id);
  return last && edge ? { name: last.label, mode: edge.label } : undefined;
}
