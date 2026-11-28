import { num } from '../quran/arabicNumber';
import type { Branch } from '../quran/branches';
import { branchNodes, LEAF_WORDS, matchTreeAnswers, rightWords, spoken, typedMarks, withoutRepeat, wordsBefore } from './branchAnswers';
import { givenNodes, isAsked, type ScoredQuestion } from './score';

export type Correction = { index: number; number: number; node: Branch; typed: string; correct: boolean; right: number; marks: boolean[]; needed: number };

export function corrections(question: ScoredQuestion, typed: string[], matches: ReturnType<typeof matchTreeAnswers>): Correction[] {
  const nodes = branchNodes(question.tree!);
  const before = wordsBefore(question.tree!);
  return nodes.flatMap((node, index) => isAsked(question, index) ? [index] : []).map((index, at) => {
    const answer = matches[index]?.node ?? nodes[index];
    const words = spoken(answer.words);
    const text = withoutRepeat(typed[index] ?? '', words, before.get(answer) ?? []);
    return { index, number: at + 1, node: answer, typed: text, correct: Boolean(matches[index]?.correct), right: rightWords(text, words), marks: typedMarks(text, words), needed: answer.children.length === 0 ? Math.min(LEAF_WORDS, words.length) : words.length };
  });
}

export function gradedTree(question: ScoredQuestion, typed: string[]) {
  const tree = question.tree!;
  const matches = matchTreeAnswers(tree, typed, givenNodes(question));
  let slot = 0;
  const align = (node: Branch): Branch => ({ ...(matches[slot++]?.node ?? node), children: node.children.map(align) });
  return { matches, tree: { ...tree, children: tree.children.map(align) }, rows: corrections(question, typed, matches) };
}

export const correctionOf = (rows: Correction[], key: string) =>
  rows.find(row => row.node.children.length === 0 && row.node.ayat.includes(key));

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

export function neededCut(words: string[], needed: number) {
  let seen = 0;
  return words.findIndex(word => spoken([word]).length > 0 && ++seen === needed) + 1;
}

