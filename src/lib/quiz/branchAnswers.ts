// docs/quiz-ayah-branches.md
import { normalizeWord } from '@/lib/quran/normalize';

const FORMS = [
  (word: string) => word,
  (word: string) => word.replace(/ا/g, ''),
  (word: string) => word.replace(/[اويءؤئ]/g, ''),
];

const letters = (token: string) => normalizeWord(token).replace(/[^ء-ي]/g, '');

export type BranchMatch = { branch: number; words: number };

function match(given: string, words: string[]): { level: number; words: number } | null {
  const tokens = given.split(/\s+/).map(letters).filter(Boolean);
  for (let level = 0; level < FORMS.length; level++) {
    const typed = tokens.map(FORMS[level]).join('');
    if (!typed) continue;
    let prefix = '';
    for (let i = 0; i < words.length && typed.startsWith(prefix); i++) {
      prefix += FORMS[level](letters(words[i]));
      if (prefix === typed) return { level, words: i + 1 };
    }
  }
  return null;
}

function orders(n: number): number[][] {
  if (n === 0) return [[]];
  return orders(n - 1).flatMap((rest) => Array.from({ length: n }, (_, i) => [...rest.slice(0, i), n - 1, ...rest.slice(i)]));
}

export function matchBranches(given: string[], branches: string[][]): (BranchMatch | null)[] {
  const found = given.map((answer) => branches.map((words) => match(answer, words)));
  let best: (BranchMatch | null)[] = given.map(() => null);
  let bestScore = [0, 0];
  for (const order of orders(branches.length)) {
    const picked = given.map((_, i) => (order[i] === undefined ? null : found[i][order[i]]));
    const score = [picked.filter(Boolean).length, picked.reduce((sum, hit) => sum + (hit ? FORMS.length - hit.level : 0), 0)];
    if (score[0] > bestScore[0] || (score[0] === bestScore[0] && score[1] > bestScore[1])) {
      best = picked.map((hit, i) => (hit ? { branch: order[i], words: hit.words } : null));
      bestScore = score;
    }
  }
  return best;
}
