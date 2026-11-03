import { keys, type Branch } from './branches';

/** One ayah of a growing tree: the nodes from the root to where the ayah ends, and the first one not drawn yet. */
export type GrowthStep = { key: string; nodes: number[]; fresh: number };

const position = (key: string) => key.split(':').map(Number);

export function byMushaf(a: string, b: string) {
  const [x, y] = [position(a), position(b)];
  return x[0] - y[0] || x[1] - y[1];
}

/**
 * Grows a tree depth first, one ayah at a time in mushaf order: each ayah walks from the root to its end,
 * reusing the nodes earlier ayat drew and growing its own branch from where it splits off (`fresh`).
 * Nodes are numbered as BranchTree numbers them: the root is -1, then depth first.
 */
export function growthPlan(tree: Branch): GrowthStep[] {
  const index = new Map<Branch, number>();
  const visit = (node: Branch) => {
    index.set(node, index.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const holds = new Map<Branch, Set<string>>([...index.keys()].map(node => [node, new Set(keys(node))]));
  const drawn = new Set([-1]);
  return [...new Set(keys(tree))].sort(byMushaf).map(key => {
    const nodes = [-1];
    let node: Branch | undefined = tree;
    while ((node = node.children.find(child => holds.get(child)!.has(key)))) nodes.push(index.get(node)!);
    const fresh = nodes.findIndex(id => !drawn.has(id));
    nodes.forEach(id => drawn.add(id));
    return { key, nodes, fresh: fresh < 0 ? nodes.length : fresh };
  });
}
