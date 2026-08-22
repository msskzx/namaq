/**
 * Pure graph-ranking logic for the nasab/family graph pulled from Neo4j.
 *
 * This module has no I/O: callers (scripts/people/computeNasabRanks.ts) fetch
 * nodes/edges from Neo4j and write the result back to PostgreSQL. Keeping the
 * math here pure makes it unit-testable with plain fixtures.
 */

export interface FamilyGraphEdge {
  sourceSlug: string;
  targetSlug: string;
  type: string;
}

export interface PersonRank {
  slug: string;
  rank: number;
  score: number;
}

/** A pluggable centrality algorithm: adjacency + node list in, a raw score per node out. */
export type CentralityAlgorithm = (
  adjacency: Map<string, Set<string>>,
  nodeSlugs: string[]
) => Map<string, number>;

const DEFAULT_PROPHET_SLUG = 'prophet-muhammad';
const DAMPING_FACTOR = 0.85;
const MAX_ITERATIONS = 100;
const CONVERGENCE_THRESHOLD = 1e-10;

/**
 * Builds an undirected adjacency list from every edge, regardless of
 * relationship type. Adjacency is Set-based (neighbor slugs, not a
 * multigraph), so reciprocal pairs the seed data stores as two edges (e.g.
 * FATHER one way, SON the other) collapse into a single connection instead
 * of being double-counted. Every node in `nodeSlugs` gets an entry, even an
 * empty one, so isolated people never break downstream steps.
 */
export function buildFamilyGraph(nodeSlugs: string[], edges: FamilyGraphEdge[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  for (const slug of nodeSlugs) adjacency.set(slug, new Set());

  for (const { sourceSlug, targetSlug } of edges) {
    if (sourceSlug === targetSlug) continue;
    if (!adjacency.has(sourceSlug) || !adjacency.has(targetSlug)) continue;
    adjacency.get(sourceSlug)!.add(targetSlug);
    adjacency.get(targetSlug)!.add(sourceSlug);
  }

  return adjacency;
}

/**
 * Standard PageRank via power iteration over an undirected graph (out-degree
 * equals adjacency size for every node). Isolated nodes are treated as
 * dangling: their rank mass is redistributed uniformly across every node
 * each iteration, rather than vanishing.
 */
export function computePageRank(adjacency: Map<string, Set<string>>, nodeSlugs: string[]): Map<string, number> {
  const n = nodeSlugs.length;
  if (n === 0) return new Map();

  let ranks = new Map(nodeSlugs.map((slug) => [slug, 1 / n]));

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let danglingMass = 0;
    for (const slug of nodeSlugs) {
      if ((adjacency.get(slug)?.size ?? 0) === 0) danglingMass += ranks.get(slug)!;
    }

    const baseRank = (1 - DAMPING_FACTOR) / n + (DAMPING_FACTOR * danglingMass) / n;
    const nextRanks = new Map(nodeSlugs.map((slug) => [slug, baseRank]));

    for (const slug of nodeSlugs) {
      const neighbors = adjacency.get(slug);
      if (!neighbors || neighbors.size === 0) continue;
      const contribution = (DAMPING_FACTOR * ranks.get(slug)!) / neighbors.size;
      for (const neighbor of neighbors) {
        nextRanks.set(neighbor, nextRanks.get(neighbor)! + contribution);
      }
    }

    let delta = 0;
    for (const slug of nodeSlugs) delta += Math.abs(nextRanks.get(slug)! - ranks.get(slug)!);

    ranks = nextRanks;
    if (delta < CONVERGENCE_THRESHOLD) break;
  }

  return ranks;
}

/** Sorts nodes by descending score into a contiguous 1..N ranking, tie-broken by slug for determinism. */
export function rankByScore(scores: Map<string, number>, nodeSlugs: string[]): PersonRank[] {
  const sorted = [...nodeSlugs].sort((a, b) => {
    const scoreDiff = (scores.get(b) ?? 0) - (scores.get(a) ?? 0);
    return scoreDiff !== 0 ? scoreDiff : a.localeCompare(b);
  });

  return sorted.map((slug, index) => ({
    slug,
    rank: index + 1,
    score: scores.get(slug) ?? 0,
  }));
}

/**
 * The Prophet-is-rank-1 guarantee: an unconditional post-processing step
 * applied to an already-sorted ranking, independent of whichever algorithm
 * produced it. Moves the Prophet's entry to rank 1 and renumbers everyone
 * else 2..N, preserving their relative order. Throws if he's missing from
 * the input — that's a data-integrity failure, never a silent no-op.
 */
export function applyProphetOverride(
  ranked: PersonRank[],
  prophetSlug: string = DEFAULT_PROPHET_SLUG
): PersonRank[] {
  const prophetIndex = ranked.findIndex((entry) => entry.slug === prophetSlug);
  if (prophetIndex === -1) {
    throw new Error(`applyProphetOverride: "${prophetSlug}" was not found in the ranked list.`);
  }

  const prophet = ranked[prophetIndex];
  const rest = ranked.filter((_, index) => index !== prophetIndex);

  return [prophet, ...rest].map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/**
 * Runs the full pipeline and returns both the algorithm's raw ranking and
 * the final ranking after the Prophet override, so callers can report (and
 * test) what the graph naturally produces versus what gets persisted.
 */
export function computeNasabRanks(
  nodeSlugs: string[],
  edges: FamilyGraphEdge[],
  algorithm: CentralityAlgorithm = computePageRank,
  prophetSlug: string = DEFAULT_PROPHET_SLUG
): { raw: PersonRank[]; final: PersonRank[] } {
  const adjacency = buildFamilyGraph(nodeSlugs, edges);
  const scores = algorithm(adjacency, nodeSlugs);
  const raw = rankByScore(scores, nodeSlugs);
  const final = applyProphetOverride(raw, prophetSlug);
  return { raw, final };
}
