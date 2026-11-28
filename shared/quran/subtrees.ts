import { keys, type Branch, type BranchAyah } from './branches';
import { normalizeWord } from './normalize';
import { createPhrasePresenter, type TreeGroup } from './phraseTrees';

export type Subtree = { id: string; text: string; parent: string; keys: string[] };
export type SubtreeGroup = TreeGroup & { parent: string };

const isEnd = (word: string) => word === '۝' || word.startsWith('﴿');
const wordId = (word: string) => isEnd(word) ? '۝' : normalizeWord(word.normalize('NFC')).replace(/[ؤئء]/g, 'ا');
const compareKeys = (a: string, b: string) => {
  const [as, aa] = a.split(':').map(Number);
  const [bs, ba] = b.split(':').map(Number);
  return as - bs || aa - ba;
};
export const keySet = (ayahKeys: string[]) => [...new Set(ayahKeys)].sort(compareKeys).join(' ');

export function buildSubtrees(trees: TreeGroup[], ayat: BranchAyah[]): { trees: TreeGroup[]; subtrees: Subtree[] } {
  const present = createPhrasePresenter(ayat);
  const found = new Map<string, { phrase: string; text: string; parent: string; keys: string[]; parents: string[] }>();
  for (const group of trees) {
    const { tree, offsets } = present(group);
    const first = group.occurrences[0];
    const opening = group.text.split(' ')[0];
    const mixed = offsets[first.key] !== first.start;
    const visit = (node: Branch, path: string[], root: boolean) => {
      const words = root && mixed ? [opening, ...node.words] : root && !group.family && node.words.length ? [opening, ...node.words.slice(1)] : [...path, ...node.words];
      if (!root && node.children.length > 0) {
        const phrase = words.map(wordId).join(' ');
        const set = keySet(keys(node));
        const same = found.get(`${phrase}\u0000${set}`);
        if (same) same.parents.push(group.id);
        else found.set(`${phrase}\u0000${set}`, { phrase, text: words.join(' '), parent: group.id, keys: set.split(' '), parents: [group.id] });
      }
      node.children.forEach(child => visit(child, words, false));
    };
    visit(tree, [], true);
  }
  const taken = new Map<string, number>();
  trees.forEach(tree => taken.set(tree.id, 2));
  found.forEach(entry => taken.set(entry.phrase, (taken.get(entry.phrase) ?? 0) + 1));
  const entries = [...found.values()];
  const ids = entries.map(entry => {
    if (taken.get(entry.phrase) === 1) return entry.phrase;
    const others = entries.filter(other => other !== entry && other.phrase === entry.phrase);
    const own = entry.keys.find(key => others.every(other => !other.keys.includes(key)));
    return `${entry.phrase}~${own ?? entry.keys.join(',')}`;
  });
  const byParent = new Map<string, string[]>();
  entries.forEach((entry, i) => entry.parents.forEach(parent => byParent.set(parent, [...(byParent.get(parent) ?? []), ids[i]])));
  return {
    trees: trees.map(tree => byParent.has(tree.id) ? { ...tree, subtrees: byParent.get(tree.id) } : tree),
    subtrees: entries.map((entry, i) => ({ id: ids[i], text: entry.text, parent: entry.parent, keys: entry.keys })),
  };
}

export function subtreeIndex(trees: TreeGroup[], subtrees: Subtree[]) {
  const treeById = new Map(trees.map(tree => [tree.id, tree]));
  const groups: SubtreeGroup[] = subtrees.map(subtree => {
    const wanted = new Set(subtree.keys);
    const seen = new Set<string>();
    const occurrences = treeById.get(subtree.parent)!.occurrences.filter(occurrence => wanted.has(occurrence.key) && !seen.has(occurrence.key) && !!seen.add(occurrence.key));
    return { id: subtree.id, text: subtree.text, parent: subtree.parent, occurrences };
  });
  const byId = new Map(groups.map(group => [group.id, group]));
  const idsByTree = new Map<string, Record<string, string>>();
  const idsFor = (group: { id: string; parent?: string }) => {
    const treeId = group.parent ?? group.id;
    if (!idsByTree.has(treeId)) idsByTree.set(treeId, Object.fromEntries((treeById.get(treeId)?.subtrees ?? []).map(id => [keySet(byId.get(id)!.occurrences.map(occurrence => occurrence.key)), id])));
    return idsByTree.get(treeId)!;
  };
  return { groups, byId, idsFor };
}
