import treeData from '@/app/quran/branches/trees.json';
import { branch, startingWith, type BranchAyah } from '@/lib/quran/branches';

export async function getHomePreviews() {
  const examples = new Set(['15:45', '51:15', '52:17']);
  const group = startingWith(treeData.ayat as BranchAyah[], 'ان المتقين').filter(ayah => examples.has(ayah.key));
  return { branches: { tree: branch(group) } };
}

export type HomePreviews = Awaited<ReturnType<typeof getHomePreviews>>;
