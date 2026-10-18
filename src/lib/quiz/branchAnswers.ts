// docs/quiz-ayah-branches.md
import { normalizeWord } from '@/lib/quran/normalize';

const DAGGER = 'ٰ';
const HAMZA = /[ءئؤٕٔ]/;
const SEATS = 'ويى';

const letters = (text: string) => normalizeWord(text.replace(/آ/g, 'ءا').replace(/[ئؤ]/g, 'ء')).replace(/[^ء-ي]/g, '');

function pattern(word: string): string {
  const pieces: string[] = [];
  let previous = '';
  for (const char of word.replace(/آ/g, 'ءا')) {
    if (char === DAGGER) {
      if (SEATS.includes(previous)) pieces[pieces.length - 1] += '?';
      pieces.push('ا?');
    } else if (HAMZA.test(char)) {
      pieces.push('ء?');
    } else {
      const letter = letters(char);
      if (letter) pieces.push(letter);
    }
    previous = char;
  }
  return pieces.join('');
}

export const spelled = (word: string) => letters(word.replace(new RegExp(`[${SEATS}]?${DAGGER}`, 'g'), 'ا'));

export function matchedWords(given: string, words: string[]): number {
  const typed = letters(given.replace(/\s+/g, ''));
  if (!typed) return 0;
  let prefix = '';
  for (let i = 0; i < words.length; i++) {
    prefix += pattern(words[i]);
    if (new RegExp(`^${prefix}$`).test(typed)) return i + 1;
  }
  return 0;
}

export type BranchMatch = { branch: number; words: number };

function orders(n: number): number[][] {
  if (n === 0) return [[]];
  return orders(n - 1).flatMap((rest) => Array.from({ length: n }, (_, i) => [...rest.slice(0, i), n - 1, ...rest.slice(i)]));
}

export function matchBranches(given: string[], branches: string[][][]): (BranchMatch | null)[] {
  const found = given.map((answer) => branches.map((continuations) => Math.max(0, ...continuations.map((words) => matchedWords(answer, words)))));
  let best: (BranchMatch | null)[] = given.map(() => null);
  let most = 0;
  for (const order of orders(branches.length)) {
    const picked = given.map((_, i) => (order[i] !== undefined && found[i][order[i]] ? { branch: order[i], words: found[i][order[i]] } : null));
    const count = picked.filter(Boolean).length;
    if (count > most) {
      best = picked;
      most = count;
    }
  }
  return best;
}
