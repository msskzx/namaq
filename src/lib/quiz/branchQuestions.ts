// docs/quiz-ayah-branches.md
import { keys, PIECE_MAX, type Branch, type BranchAyah, type Variant } from '@/lib/quran/branches';
import { inJuzRange, type JuzRange } from '@/lib/quran/juz';
import { buildTreeGroups, phrasePresentation, type TreeGroup } from '@/lib/quran/phraseTrees';

export const BRANCH_FAMILY = 'AYAH_BRANCH';
const COUNTS: Record<number, string> = { 2: 'فرعين', 3: 'ثلاثة فروع', 4: 'أربعة فروع', 5: 'خمسة فروع', 6: 'ستة فروع' };

export type BranchAnswer = { words: string[]; ayat: { key: string; page: number; words: string[] }[] };

export interface BranchQuestion {
  key: string;
  family: typeof BRANCH_FAMILY;
  promptArabic: string;
  phrase: string;
  choices: [];
  correctAnswer: string;
  branches: BranchAnswer[];
  tree: Branch;
  variants: Variant[];
  evidence: { claimKeys: string[] };
}

const nextClass = (ayah: BranchAyah, at: number) => at >= ayah.words.length ? '۝' : `${ayah.roots?.[at] ?? ''}:${ayah.words[at].replace(/[\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, '')}`;

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null, supplied?: TreeGroup[]): BranchQuestion[] {
  const ayat = range ? all.filter(entry => inJuzRange(entry.key, range)) : all;
  const byKey = new Map(ayat.map(entry => [entry.key, entry]));
  const trees = range || !supplied ? buildTreeGroups(ayat) : supplied;
  return trees.filter(group => !group.family && new Set(group.occurrences.map(occurrence => occurrence.key)).size >= 5 && new Set(group.occurrences.map(occurrence => occurrence.key)).size <= PIECE_MAX && new Set(group.occurrences.map(occurrence => nextClass(byKey.get(occurrence.key)!, occurrence.end))).size >= 2).flatMap(group => {
    const presentation = phrasePresentation(group, ayat, true, !range);
    const tree = presentation.tree;
    const memberKeys = [...new Set(group.occurrences.map(occurrence => occurrence.key))];
    if (!tree.words.length || tree.children.length < 2 || tree.children.length > PIECE_MAX || tree.ayat.length > 0 || memberKeys.length > PIECE_MAX) return [];
    const opening = `«${tree.words.join(' ')}»`;
    return [{
      key: `${BRANCH_FAMILY}:${group.id}`,
      family: BRANCH_FAMILY,
      promptArabic: `تتفرع شجرة العبارة ${opening} إلى ${COUNTS[tree.children.length]}. أكمل الأطراف الفارغة، وتكفي من كل طرف كلمتاه الأوليان.`,
      phrase: group.id,
      choices: [],
      correctAnswer: tree.words.join(' '),
      tree,
      variants: [],
      branches: tree.children.map(child => ({
        words: child.words,
        ayat: keys(child).map(key => {
          const entry = byKey.get(key)!;
          return { key, page: entry.page, words: entry.words.slice((presentation.offsets[key] ?? 0) + tree.words.length) };
        }),
      })),
      evidence: { claimKeys: [] },
    }];
  });
}
