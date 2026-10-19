// docs/quiz-ayah-branches.md
import type { Branch } from '@/lib/quran/branches';
import { normalizeWord } from '@/lib/quran/normalize';

const DAGGER = 'ٰ';
const HAMZA = /[ءئؤٕٔ]/;
const SEATS = 'ويى';
const SMALL: Record<string, string> = { 'ۥ': 'و?', 'ۦ': 'ي?', 'ۧ': 'ي?' };

const letters = (text: string) => normalizeWord(text.replace(/آ/g, 'ءا').replace(/[ئؤ]/g, 'ء')).replace(/[^ء-ي]/g, '');

function pattern(word: string): string {
  const pieces: string[] = [];
  let previous = '';
  for (const char of word.replace(/آ/g, 'ءا')) {
    if (char === DAGGER) {
      if (SEATS.includes(previous)) pieces[pieces.length - 1] += '?';
      pieces.push('ا?');
    } else if (HAMZA.test(char)) {
      pieces.push(char === 'ئ' ? '[ءاي]?' : char === 'ؤ' ? '[ءاو]?' : '[ءا]?');
    } else if (SMALL[char]) {
      pieces.push(SMALL[char]);
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

export const LEAF_WORDS = 2;

export function leadingWords(given: string, words: string[]): number {
  const typed = given.trim().split(/\s+/);
  for (let count = typed.length; count > 0; count--) {
    const matched = matchedWords(typed.slice(0, count).join(' '), words);
    if (matched) return matched;
  }
  return 0;
}

const nodeCorrect = (given: string, node: Branch) => node.children.length === 0
  ? leadingWords(given, node.words) >= Math.min(LEAF_WORDS, node.words.length)
  : matchedWords(given, node.words) === node.words.length;

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

export const branchNodes = (tree: Branch): Branch[] => tree.children.flatMap((child) => [child, ...branchNodes(child)]);

export type TreeAnswerMatch = { node: Branch; correct: boolean };

export function matchTreeAnswers(tree: Branch, given: string[]): (TreeAnswerMatch | null)[] {
  const nodes = branchNodes(tree);
  const indices = new Map(nodes.map((node, index) => [node, index]));
  const pair = (slots: Branch[], expected: Branch[]): Map<number, TreeAnswerMatch> | null => {
    let best: Map<number, TreeAnswerMatch> | null = null;
    let score = [-1, -1];
    for (const order of orders(expected.length)) {
      const result = new Map<number, TreeAnswerMatch>();
      let possible = true;
      slots.forEach((slot, at) => {
        const answer = expected[order[at]];
        if (slot.children.length !== answer.children.length) {
          possible = false;
          return;
        }
        const index = indices.get(slot)!;
        result.set(index, { node: answer, correct: nodeCorrect(given[index] ?? '', answer) });
        const children = pair(slot.children, answer.children);
        if (!children) possible = false;
        children?.forEach((value, key) => result.set(key, value));
      });
      const hits = [...result.entries()];
      const correct = hits.filter(([, hit]) => hit.correct).length;
      const words = hits.reduce((sum, [index, hit]) => sum + leadingWords(given[index] ?? '', hit.node.words), 0);
      if (possible && (correct > score[0] || (correct === score[0] && words > score[1]))) {
        best = result;
        score = [correct, words];
      }
    }
    return best;
  };
  const matched = pair(tree.children, tree.children);
  return nodes.map((_, index) => matched?.get(index) ?? null);
}
