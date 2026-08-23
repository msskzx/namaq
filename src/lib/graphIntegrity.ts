/**
 * Pure data-integrity checks for the unified graph: nodes with no
 * relationship at all, and nodes that look like the same real-world entity
 * duplicated under a different slug (same display name, different node).
 * No I/O: callers (graphIntegrity.live.test.ts) fetch nodes/edges from
 * Neo4j and report the result.
 */

import { GraphRankEdge, GraphRankNode, graphNodeKey } from './graphRank';

export function findIsolatedNodes(nodes: GraphRankNode[], edges: GraphRankEdge[]): GraphRankNode[] {
  const connected = new Set<string>();
  for (const { source, target } of edges) {
    connected.add(graphNodeKey(source));
    connected.add(graphNodeKey(target));
  }
  return nodes.filter((node) => !connected.has(graphNodeKey(node)));
}

export interface LabeledGraphNode extends GraphRankNode {
  label: string;
}

export interface DuplicateNodeGroup {
  /** The normalized label shared by every node in the group. */
  label: string;
  nodes: LabeledGraphNode[];
}

// Arabic diacritics (tashkeel, U+064B-U+065F) and the superscript alef
// (U+0670) carry no distinguishing meaning for a person's name as typically
// entered in seed data (present on some records, absent on others of the
// exact same name), so two labels differing only in these would otherwise
// read as different real-world entities when they're the same one.
const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;

export function normalizeGraphLabel(label: string): string {
  return label
    .normalize('NFKD')
    .replace(ARABIC_DIACRITICS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Groups nodes of the same type sharing a normalized label. Different types
 * are never grouped together (e.g. a Battle and its corresponding Event
 * legitimately share a name -- see route.ts's PART_OF relationship -- and
 * are not a duplicate-node bug).
 */
export function findDuplicateLabelGroups(nodes: LabeledGraphNode[]): DuplicateNodeGroup[] {
  const groups = new Map<string, LabeledGraphNode[]>();
  for (const node of nodes) {
    const key = `${node.type}:${normalizeGraphLabel(node.label)}`;
    groups.set(key, [...(groups.get(key) ?? []), node]);
  }

  return [...groups.values()]
    .filter((group) => group.length > 1)
    .map((group) => ({ label: group[0].label, nodes: group }));
}
