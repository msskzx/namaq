/**
 * PageRank over an undirected graph of opaque string keys.
 *
 * Nothing here is domain-specific and nothing does I/O: graphRank.ts supplies
 * `type:slug` keys and turns the ranking back into subjects, and
 * scripts/graph/computeGraphLayout.ts is what persists it.
 */

export interface RankedKey {
  key: string;
  rank: number;
  score: number;
}

/** A pluggable centrality algorithm: adjacency + key list in, a raw score per key out. */
export type CentralityAlgorithm = (
  adjacency: Map<string, Set<string>>,
  keys: string[]
) => Map<string, number>;

const DAMPING_FACTOR = 0.85;
const MAX_ITERATIONS = 100;
const CONVERGENCE_THRESHOLD = 1e-10;

/**
 * Standard PageRank via power iteration over an undirected graph (out-degree
 * equals adjacency size for every node). Isolated nodes are treated as
 * dangling: their rank mass is redistributed uniformly across every node
 * each iteration, rather than vanishing.
 */
export function computePageRank(adjacency: Map<string, Set<string>>, keys: string[]): Map<string, number> {
  const n = keys.length;
  if (n === 0) return new Map();

  let ranks = new Map(keys.map((key) => [key, 1 / n]));

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let danglingMass = 0;
    for (const key of keys) {
      if ((adjacency.get(key)?.size ?? 0) === 0) danglingMass += ranks.get(key)!;
    }

    const baseRank = (1 - DAMPING_FACTOR) / n + (DAMPING_FACTOR * danglingMass) / n;
    const nextRanks = new Map(keys.map((key) => [key, baseRank]));

    for (const key of keys) {
      const neighbors = adjacency.get(key);
      if (!neighbors || neighbors.size === 0) continue;
      const contribution = (DAMPING_FACTOR * ranks.get(key)!) / neighbors.size;
      for (const neighbor of neighbors) {
        nextRanks.set(neighbor, nextRanks.get(neighbor)! + contribution);
      }
    }

    let delta = 0;
    for (const key of keys) delta += Math.abs(nextRanks.get(key)! - ranks.get(key)!);

    ranks = nextRanks;
    if (delta < CONVERGENCE_THRESHOLD) break;
  }

  return ranks;
}

/** Sorts keys by descending score into a contiguous 1..N ranking, tie-broken by key for determinism. */
export function rankByScore(scores: Map<string, number>, keys: string[]): RankedKey[] {
  const sorted = [...keys].sort((a, b) => {
    const scoreDiff = (scores.get(b) ?? 0) - (scores.get(a) ?? 0);
    return scoreDiff !== 0 ? scoreDiff : a.localeCompare(b);
  });

  return sorted.map((key, index) => ({
    key,
    rank: index + 1,
    score: scores.get(key) ?? 0,
  }));
}
