// How a checked tree answer is shown: one row per asked node, graded against the node it matched.
// The website (src/app/quizzes/BranchAnswers.tsx) and the phone app draw the same rows.
import { num } from '../quran/arabicNumber';
import type { Branch } from '../quran/branches';
import { branchNodes, LEAF_WORDS, matchTreeAnswers, rightWords, spoken } from './branchAnswers';
import { givenNodes, isAsked, type ScoredQuestion } from './score';

export type Correction = { index: number; number: number; node: Branch; typed: string; correct: boolean; right: number; needed: number };

/** One row per asked node: what was typed, word by word, against the node it was graded with. */
export function corrections(question: ScoredQuestion, typed: string[], matches: ReturnType<typeof matchTreeAnswers>): Correction[] {
  const nodes = branchNodes(question.tree!);
  return nodes.flatMap((node, index) => isAsked(question, index) ? [index] : []).map((index, at) => {
    const answer = matches[index]?.node ?? nodes[index];
    const words = spoken(answer.words);
    const text = typed[index]?.trim() ?? '';
    return { index, number: at + 1, node: answer, typed: text, correct: Boolean(matches[index]?.correct), right: rightWords(text, words), needed: answer.children.length === 0 ? Math.min(LEAF_WORDS, words.length) : words.length };
  });
}

/**
 * The tree as it should have been typed: same-shaped branches may be typed in any order, so each slot
 * shows the node its answer was graded against.
 */
export function gradedTree(question: ScoredQuestion, typed: string[]) {
  const tree = question.tree!;
  const matches = matchTreeAnswers(tree, typed, givenNodes(question));
  let slot = 0;
  const align = (node: Branch): Branch => ({ ...(matches[slot++]?.node ?? node), children: node.children.map(align) });
  return { matches, tree: { ...tree, children: tree.children.map(align) }, rows: corrections(question, typed, matches) };
}

const ORDINALS = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة'];
const ordinal = (n: number, ar: boolean) => ar ? (ORDINALS[n - 1] ?? num(n)) : String(n);

export function verdict(row: Correction, ar: boolean) {
  if (row.correct) return ar ? 'صحيح' : 'Correct';
  if (!row.typed) return ar ? 'بدون إجابة' : 'No answer';
  if (row.right < row.typed.split(/\s+/).length) return ar ? `خطأ في الكلمة ${ordinal(row.right + 1, ar)}` : `Wrong at word ${row.right + 1}`;
  return row.needed === 1 || row.node.children.length > 0
    ? (ar ? 'ناقص: اكتب كل كلماتها' : 'Incomplete: type all its words')
    : (ar ? `ناقص: اكتب كلماته الـ${num(row.needed)} الأولى` : `Incomplete: type its first ${row.needed} words`);
}

/** How many of a node's words, counting spoken words only, are enough to type: the ones to underline. */
export function neededCut(words: string[], needed: number) {
  let seen = 0;
  return words.findIndex(word => spoken([word]).length > 0 && ++seen === needed) + 1;
}
