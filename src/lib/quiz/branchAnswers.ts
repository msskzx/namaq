// docs/quiz-ayah-branches.md
import type { Branch } from '@/lib/quran/branches';
import { normalizeWord } from '@/lib/quran/normalize';
import { shuffle, type Random } from './random';

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

/** How many of the typed words, from the start, are right for these node words. */
export function rightWords(given: string, words: string[]): number {
  const typed = given.trim().split(/\s+/).filter(Boolean);
  for (let count = typed.length; count > 0; count--) {
    if (matchedWords(typed.slice(0, count).join(' '), words)) return count;
  }
  return 0;
}

export function leadingWords(given: string, words: string[]): number {
  const typed = given.trim().split(/\s+/).filter(Boolean);
  return matchedWords(typed.slice(0, rightWords(given, words)).join(' '), words);
}

export const spoken = (words: string[]) => words.filter(word => letters(word) !== '');

const nodeCorrect = (given: string, node: Branch) => {
  const words = spoken(node.words);
  return node.children.length === 0 ? matchedWords(given, words) >= Math.min(LEAF_WORDS, words.length) : matchedWords(given, words) === words.length;
};

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

export function askedNodes(tree: Branch, count: number, random: Random): number[] {
  const leaves = branchNodes(tree).flatMap((node, index) => node.children.length === 0 ? [index] : []);
  return shuffle(leaves, random).slice(0, count).sort((a, b) => a - b);
}

export const givenAnswer = (node: Branch) => node.words.join(' ');

export type TreeAnswerMatch = { node: Branch; correct: boolean };

export function matchTreeAnswers(tree: Branch, given: string[], fixed: ReadonlySet<number> = new Set()): (TreeAnswerMatch | null)[] {
  const nodes = branchNodes(tree);
  const indices = new Map(nodes.map((node, index) => [node, index]));
  const graded = new Map<number, { correct: boolean; words: number }>();
  const grade = (index: number, node: Branch) => {
    const key = index * nodes.length + indices.get(node)!;
    if (!graded.has(key)) graded.set(key, { correct: nodeCorrect(given[index] ?? '', node), words: leadingWords(given[index] ?? '', spoken(node.words)) });
    return graded.get(key)!;
  };
  type Paired = { result: Map<number, TreeAnswerMatch>; correct: number; words: number } | null;
  const paired = new Map<string, Paired>();
  const pair = (slots: Branch[], expected: Branch[]): Paired => {
    const key = `${slots.map(slot => indices.get(slot)).join(',')}|${expected.map(node => indices.get(node)).join(',')}`;
    if (paired.has(key)) return paired.get(key)!;
    const assignments = new Map<number, Paired>();
    const assign = (at: number, used: number): Paired => {
      if (at === slots.length) return { result: new Map(), correct: 0, words: 0 };
      if (assignments.has(used)) return assignments.get(used)!;
      const slot = slots[at];
      const index = indices.get(slot)!;
      let best: Paired = null;
      expected.forEach((answer, position) => {
        if ((used & (1 << position)) || slot.children.length !== answer.children.length || (fixed.has(index) && answer !== slot)) return;
        const children = pair(slot.children, answer.children);
        if (!children) return;
        const rest = assign(at + 1, used | (1 << position));
        if (!rest) return;
        const own = grade(index, answer);
        const correct = Number(own.correct) + children.correct + rest.correct;
        const words = own.words + children.words + rest.words;
        if (!best || correct > best.correct || (correct === best.correct && words > best.words)) {
          best = { result: new Map([[index, { node: answer, correct: own.correct }], ...children.result, ...rest.result]), correct, words };
        }
      });
      assignments.set(used, best);
      return best;
    };
    const best = assign(0, 0);
    paired.set(key, best);
    return best;
  };
  const matched = pair(tree.children, tree.children);
  return nodes.map((_, index) => matched?.result.get(index) ?? null);
}
