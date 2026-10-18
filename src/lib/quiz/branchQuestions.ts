// docs/quiz-ayah-branches.md
import { branch, sharedOpenings, type Branch, type BranchAyah } from '@/lib/quran/branches';
import { inJuzRange, type JuzRange } from '@/lib/quran/juz';
import { normalizeWord } from '@/lib/quran/normalize';
import { matchedWords, spelled } from './branchAnswers';

export const BRANCH_FAMILY = 'AYAH_BRANCH';
export const MAX_BRANCHES = 5;
const COUNTS: Record<number, string> = { 2: 'فرعين', 3: 'ثلاثة فروع', 4: 'أربعة فروع', 5: 'خمسة فروع' };

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

const keysUnder = (node: Branch): string[] => [...node.ayat, ...node.children.flatMap(keysUnder)];

export function branchQuestions(all: BranchAyah[], range: JuzRange | null = null): BranchQuestion[] {
  const ayat = range ? all.filter((ayah) => inJuzRange(ayah.key, range)) : all;
  const byKey = new Map(ayat.map((ayah) => [ayah.key, ayah]));
  const questions: BranchQuestion[] = [];
  const walk = (node: Branch, path: string[]) => {
    const words = [...path, ...node.words];
    const firsts = node.children.map((child) => child.words[0]);
    const distinct = firsts.every((word, i) => firsts.every((other, j) => i === j || !matchedWords(spelled(other), [word])));
    if (words.length > 0 && distinct && node.children.length >= 2 && node.children.length <= MAX_BRANCHES && node.ayat.length === 0) {
      const phrase = words.map(normalizeWord).join(' ');
      questions.push({
        key: `${BRANCH_FAMILY}:${phrase}`,
        family: BRANCH_FAMILY,
        promptArabic: `تفترق الآيات التي تبدأ بـ «${words.join(' ')}» إلى ${COUNTS[node.children.length]}. اكتب ما يلي هذه العبارة في كل فرع.`,
        phrase,
        choices: [],
        correctAnswer: phrase,
        branches: node.children.map((child) => ({
          words: child.words,
          ayat: keysUnder(child).map((key) => {
            const ayah = byKey.get(key) as BranchAyah;
            return { key, page: ayah.page, words: ayah.words.slice(words.length) };
          }),
        })),
        evidence: { claimKeys: [] },
      });
    }
    node.children.forEach((child) => walk(child, words));
  };
  sharedOpenings(ayat).forEach((group) => walk(branch(group), []));
  return questions;
}
