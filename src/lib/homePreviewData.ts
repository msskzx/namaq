import treeData from '@/app/quran/branches/trees.json';
import { branchesHref, type BranchAyah } from '@/lib/quran/branches';
import { phrasePresentation, phraseSubtreeTargets, type TreeGroup } from '@/lib/quran/phraseTrees';

export async function getHomePreviews(randomExcept?: string, random = Math.random) {
  const source = treeData as { ayat: BranchAyah[]; trees: TreeGroup[] };
  const candidates = randomExcept === undefined ? [] : source.trees.filter(tree => {
    const count = new Set(tree.occurrences.map(occurrence => occurrence.key)).size;
    return !tree.family && tree.id !== randomExcept && count >= 2 && count <= 8;
  });
  const group = randomExcept === undefined ? source.trees.find(tree => tree.id === 'ان المتقين في')! : candidates[Math.floor(random() * candidates.length)];
  const presentation = phrasePresentation(group, source.ayat);
  const subtreeLinks = Object.fromEntries(Object.entries(phraseSubtreeTargets(presentation.tree, source.trees, source.ayat)).map(([node, target]) => [
    node,
    branchesHref(target.id, undefined, { occurrences: target.occurrences.map(occurrence => `${occurrence.key}:${occurrence.start}`) }),
  ]));
  const names: Record<number, string> = { 15: 'الحجر', 44: 'الدخان', 51: 'الذاريات', 52: 'الطور', 54: 'القمر', 77: 'المرسلات' };
  return { branches: { id: group.id, count: new Set(group.occurrences.map(occurrence => occurrence.key)).size, names, ...presentation, subtreeLinks } };
}

export type HomePreviews = Awaited<ReturnType<typeof getHomePreviews>>;
