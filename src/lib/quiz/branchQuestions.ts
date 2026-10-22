// docs/quiz-ayah-branches.md
import { branch, keys, PIECE_MAX, pieces, sharedOpenings, shown, variants, type Branch, type BranchAyah, type Variant } from '@/lib/quran/branches';
import { inJuzRange, type JuzRange } from '@/lib/quran/juz';
import { normalizeWord } from '@/lib/quran/normalize';

export const BRANCH_FAMILY = 'AYAH_BRANCH';
const COUNTS: Record<number, string> = { 2: 'فرعين', 3: 'ثلاثة فروع', 4: 'أربعة فروع', 5: 'خمسة فروع', 6: 'ستة فروع' };

export type BranchAnswer = { words: string[]; ayat: { key: string; page: number; words: string[] }[] };

export interface BranchQuestion {
  key: string;
  family: typeof BRANCH_FAMILY;
  promptArabic: string;
  phrase: string;
  partition?: string;
  choices: [];
  correctAnswer: string;
  branches: BranchAnswer[];
  tree: Branch;
  variants: Variant[];
  evidence: { claimKeys: string[] };
}

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null): BranchQuestion[] {
  const ayat = range ? all.filter((ayah) => inJuzRange(ayah.key, range)) : all;
  const byKey = new Map(ayat.map((ayah) => [ayah.key, ayah]));
  const ask = (original: BranchAyah[], id: string, partition?: string): BranchQuestion[] => {
    const sub = shown(original);
    const subByKey = new Map(sub.map((ayah) => [ayah.key, ayah]));
    const tree = branch(original);
    if (tree.children.length < 2 || tree.ayat.length > 0) return [];
    const phrase = tree.words.map(normalizeWord).join(' ');
    const forms = variants(original).map((variant) => [variant.word, ...tree.words.slice(1)].join(' '));
    const opening = (forms.length > 0 ? forms : [tree.words.join(' ')]).map((form) => `«${form}»`).join(' أو ');
    return [{
      key: `${BRANCH_FAMILY}:${id}${partition ? `:${partition}` : ''}`,
      family: BRANCH_FAMILY,
      promptArabic: `تفترق الآيات التي تبدأ بـ ${opening} إلى ${COUNTS[tree.children.length]}. أكمل جميع عقد الشجرة بعد هذه العبارة، وفي نهاية كل فرع تكفي كلمتاه الأوليان.`,
      phrase: id,
      ...(partition && { partition }),
      choices: [],
      correctAnswer: phrase,
      tree,
      variants: variants(original),
      branches: tree.children.map((child) => ({
        words: child.words,
        ayat: keys(child).map((key) => {
          const ayah = subByKey.get(key) as BranchAyah;
          return { key, page: ayah.page, words: ayah.words.slice(tree.words.length) };
        }),
      })),
      evidence: { claimKeys: [] },
    }];
  };
  return pieces(sharedOpenings(ayat))
    .filter((piece) => piece.count <= PIECE_MAX)
    .flatMap((piece) => ask(piece.keys.map((key) => byKey.get(key) as BranchAyah), piece.id, piece.partition));
}
