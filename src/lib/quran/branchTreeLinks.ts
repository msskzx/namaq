// Subtree buttons on /quran/branches: the link each node opens, and how the page reads ?o= and ?at= back.
import { branchesHref, keys, searchKey, type Branch } from './branches';
import type { JuzRange } from './juz';
import type { PhraseGroup } from './phraseTrees';
import { keySet } from './subtrees';

const memberCount = (group: PhraseGroup) => new Set(group.occurrences.map(occurrence => occurrence.key)).size;

/** The tree ?o= asks for: its exact id, else the tree with the most ayat that opens with it (a leading و/ف may be dropped). */
export function resolveTree<T extends PhraseGroup>(requestedId: string, trees: T[], phrases: () => T[]): T | undefined {
  if (!requestedId) return undefined;
  const candidates = trees.some(tree => tree.id === requestedId) ? trees : [...trees, ...phrases()];
  const requestedKey = searchKey(requestedId);
  const withoutConjunction = /^[وف]/.test(requestedKey) ? requestedKey.slice(1) : requestedKey;
  return candidates.find(tree => tree.id === requestedId) ?? candidates
    .filter(tree => tree.id.startsWith(`${requestedKey} `) || tree.id === withoutConjunction || tree.id.startsWith(`${withoutConjunction} `))
    .sort((a, b) => memberCount(b) - memberCount(a))[0];
}

/** ?at= values (key:start) narrow a tree to those occurrences. */
export const parseOccurrences = (value: string | null | undefined) => value?.split(',').filter(entry => /^\d+:\d+:\d+$/.test(entry)) ?? [];

export function scopeTree<T extends PhraseGroup>(tree: T | undefined, occurrences: string[]): T | undefined {
  return tree && occurrences.length ? { ...tree, occurrences: tree.occurrences.filter(occurrence => occurrences.includes(`${occurrence.key}:${occurrence.start}`)) } : tree;
}

const at = (group: PhraseGroup, wanted?: Set<string>) => {
  const seen = new Set<string>();
  return group.occurrences.flatMap(occurrence => {
    if (seen.has(occurrence.key) || (wanted && !wanted.has(occurrence.key))) return [];
    seen.add(occurrence.key);
    return [`${occurrence.key}:${occurrence.start}`];
  });
};

/**
 * The subtree button's link for every inner node of `tree` (drawn from `group`), keyed by the node's ayat.
 * A node with a subtree id (`ids`, by keySet, full Quran only) opens it; else a node whose own words form
 * a tree of their own (`own`, from phraseSubtreeTargets) opens that tree; any other node opens the same
 * tree narrowed (?at=) to the node's ayat, so the link always finds them.
 */
export function subtreeLinks(group: PhraseGroup, tree: Branch, juz?: JuzRange, own: Record<string, PhraseGroup> = {}, context = false, ids: Record<string, string> = {}): Record<string, string> {
  const links: Record<string, string> = {};
  const visit = (node: Branch, root: boolean) => {
    if (!root && node.children.length > 0) {
      const nodeKeys = keys(node).join(' ');
      const id = ids[keySet(keys(node))];
      const target = own[nodeKeys];
      links[nodeKeys] = id
        ? branchesHref(id, juz, { context })
        : target
        ? branchesHref(target.id, juz, { occurrences: at(target), context })
        : branchesHref(group.id, juz, { occurrences: at(group, new Set(keys(node))), context });
    }
    node.children.forEach(child => visit(child, false));
  };
  visit(tree, true);
  return links;
}
