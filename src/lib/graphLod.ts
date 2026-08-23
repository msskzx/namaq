/**
 * Rank -> tier -> size bucketing for the unified graph's level-of-detail:
 * a small number of discrete tiers (not a continuous scale) so zooming out
 * thins detail the way a map does — village, then city, then capital —
 * rather than every node shrinking by the same fraction. Percentile-based
 * over `rank` (1 = most prominent) so tier boundaries scale with however
 * many nodes are actually ranked, instead of a fixed rank cutoff that would
 * mean something different on a 100-node graph than a 2,000-node one.
 *
 * Used both by the offline layout script (scripts/graph/computeGraphLayout.ts,
 * for collision radius) and the sigma.js renderer (for node size and, later,
 * camera-ratio-gated visibility).
 */

export const GRAPH_LOD_TIER_COUNT = 4; // 0 = most prominent ("capital"), 3 = least ("village")

const TIER_RADII = [22, 16, 11, 7]; // px, index 0 = most prominent tier

export function rankToTier(rank: number, totalNodes: number, tierCount: number = GRAPH_LOD_TIER_COUNT): number {
  if (totalNodes <= 0 || tierCount <= 0) return 0;
  const percentile = (rank - 1) / totalNodes; // 0 = most prominent, approaching 1 = least
  const tier = Math.floor(percentile * tierCount);
  return Math.min(tierCount - 1, Math.max(0, tier));
}

export function tierToRadius(tier: number): number {
  const index = Math.min(Math.max(tier, 0), TIER_RADII.length - 1);
  return TIER_RADII[index];
}
