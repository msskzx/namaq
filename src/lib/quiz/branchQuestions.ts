// docs/quiz-ayah-branches.md
import { keys, type Branch, type BranchAyah, type Variant } from '@/lib/quran/branches';
import { inJuzRange, type JuzRange } from '@/lib/quran/juz';
import { buildTreeGroups, createPhrasePresenter, type TreeGroup } from '@/lib/quran/phraseTrees';

export const BRANCH_FAMILY = 'AYAH_BRANCH';
const MAX_BRANCHES = 10;
const COUNTS: Record<number, string> = { 2: 'فرعين', 3: 'ثلاثة فروع', 4: 'أربعة فروع', 5: 'خمسة فروع', 6: 'ستة فروع', 7: 'سبعة فروع', 8: 'ثمانية فروع', 9: 'تسعة فروع', 10: 'عشرة فروع' };

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
  prefixes: Variant[];
  evidence: { claimKeys: string[] };
}

const nextClass = (ayah: BranchAyah, at: number) => at >= ayah.words.length ? '۝' : `${ayah.roots?.[at] ?? ''}:${ayah.words[at].replace(/[\u064B-\u065F\u0670\u06D6-\u06EDـ]/g, '')}`;

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null, supplied?: TreeGroup[]): BranchQuestion[] {
  const ayat = range ? all.filter(entry => inJuzRange(entry.key, range)) : all;
  const byKey = new Map(ayat.map(entry => [entry.key, entry]));
  const trees = range || !supplied ? buildTreeGroups(ayat) : supplied;
  const present = createPhrasePresenter(ayat, true, !range);
  return trees.filter(group => !group.family && new Set(group.occurrences.map(occurrence => occurrence.key)).size >= 2 && new Set(group.occurrences.map(occurrence => occurrence.key)).size <= MAX_BRANCHES && new Set(group.occurrences.map(occurrence => nextClass(byKey.get(occurrence.key)!, occurrence.end))).size >= 2).flatMap(group => {
    const presentation = present(group);
    const tree = presentation.tree;
    const memberKeys = [...new Set(group.occurrences.map(occurrence => occurrence.key))];
    if (!tree.words.length || tree.children.length < 2 || tree.children.length > MAX_BRANCHES || tree.ayat.length > 0 || memberKeys.length > MAX_BRANCHES) return [];
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
      prefixes: presentation.prefixes.filter(prefix => prefix.word),
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
