import treeData from '@/app/quran/branches/trees.json';
import type { BranchAyah } from '@/lib/quran/branches';
import { subtreeLinks as linksFor } from '@/lib/quran/branchTreeLinks';
import { phrasePresentation, phraseSubtreeTargets, type TreeGroup } from '@/lib/quran/phraseTrees';
import { subtreeIndex, type Subtree } from '@/lib/quran/subtrees';

const source = treeData as { ayat: BranchAyah[]; trees: TreeGroup[]; subtrees: Subtree[] };
let index: ReturnType<typeof subtreeIndex> | undefined;

export async function getHomePreviews(randomExcept?: string, random = Math.random) {
  const candidates = randomExcept === undefined ? [] : source.trees.filter(tree => {
    const count = new Set(tree.occurrences.map(occurrence => occurrence.key)).size;
    return !tree.family && tree.id !== randomExcept && count >= 2 && count <= 8;
  });
  const group = randomExcept === undefined ? source.trees.find(tree => tree.id === 'ان المتقين في')! : candidates[Math.floor(random() * candidates.length)];
  const presentation = phrasePresentation(group, source.ayat);
  const subtreeLinks = linksFor(group, presentation.tree, undefined, phraseSubtreeTargets(presentation.tree, source.trees, source.ayat), false, (index ??= subtreeIndex(source.trees, source.subtrees)).idsFor(group));
  const names: Record<number, string> = { 15: 'الحجر', 44: 'الدخان', 51: 'الذاريات', 52: 'الطور', 54: 'القمر', 77: 'المرسلات' };
  return { branches: { id: group.id, count: new Set(group.occurrences.map(occurrence => occurrence.key)).size, names, ...presentation, subtreeLinks } };
}

export type HomePreviews = Awaited<ReturnType<typeof getHomePreviews>>;
