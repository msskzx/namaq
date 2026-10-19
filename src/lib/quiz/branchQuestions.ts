// docs/quiz-ayah-branches.md
import { branch, keys, PIECE_MAX, pieces, sharedOpenings, shown, variants, type BranchAyah } from '@/lib/quran/branches';
import { inJuzRange, type JuzRange } from '@/lib/quran/juz';
import { normalizeWord } from '@/lib/quran/normalize';
import { matchedWords, spelled } from './branchAnswers';

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
  evidence: { claimKeys: string[] };
}

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null): BranchQuestion[] {
  const ayat = range ? all.filter((ayah) => inJuzRange(ayah.key, range)) : all;
  const byKey = new Map(ayat.map((ayah) => [ayah.key, ayah]));
  const ask = (original: BranchAyah[], id: string): BranchQuestion[] => {
    const sub = shown(original);
    const subByKey = new Map(sub.map((ayah) => [ayah.key, ayah]));
    const tree = branch(sub);
    const firsts = tree.children.map((child) => child.words[0]);
    const distinct = firsts.every((word, i) => firsts.every((other, j) => i === j || !matchedWords(spelled(other), [word])));
    if (!distinct || tree.children.length < 2 || tree.ayat.length > 0) return [];
    const phrase = tree.words.map(normalizeWord).join(' ');
    const forms = variants(original).map((variant) => [variant.word, ...tree.words.slice(1)].join(' '));
    const opening = (forms.length > 0 ? forms : [tree.words.join(' ')]).map((form) => `«${form}»`).join(' أو ');
    return [{
      key: `${BRANCH_FAMILY}:${phrase}`,
      family: BRANCH_FAMILY,
      promptArabic: `تفترق الآيات التي تبدأ بـ ${opening} إلى ${COUNTS[tree.children.length]}. اكتب ما يلي هذه العبارة في كل فرع.`,
      phrase: id,
      choices: [],
      correctAnswer: phrase,
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
  return pieces(sharedOpenings(ayat)).flatMap((piece) => {
    const original = piece.keys.map((key) => byKey.get(key) as BranchAyah);
    if (piece.count <= PIECE_MAX) return ask(original, piece.id);
    return variants(original)
      .filter((variant) => variant.keys.length >= 2 && variant.keys.length <= PIECE_MAX)
      .flatMap((variant) => ask(variant.keys.map((key) => byKey.get(key) as BranchAyah), variant.id as string));
  });
}
