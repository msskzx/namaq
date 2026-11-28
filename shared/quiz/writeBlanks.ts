import { LEAF_WORDS, spoken } from './branchAnswers';

export type WriteBlank = { id: number; words: string[]; write: number };

export function writeBlank(id: number, words: string[], whole = false): WriteBlank {
  const said = spoken(words);
  return { id, words: said, write: whole ? said.length : Math.min(LEAF_WORDS, said.length) };
}

export function blankBoxes(blanks: WriteBlank[]) {
  const words: string[] = [];
  const first: number[] = [];
  for (const blank of blanks) {
    first.push(words.length);
    words.push(...blank.words.slice(0, blank.write));
  }
  return { words, asked: words.map((_, at) => at), first };
}

export function blankText(blank: WriteBlank, first: number, typed: Record<number, string>): string {
  const words = Array.from({ length: blank.write }, (_, at) => (typed[first + at] ?? '').trim());
  const gap = words.indexOf('');
  return (gap < 0 ? words : words.slice(0, gap)).join(' ');
}

export function boxesOf(blanks: WriteBlank[], first: number[], texts: string[]): Record<number, string> {
  const typed: Record<number, string> = {};
  blanks.forEach((blank, index) => {
    const words = (texts[index] ?? '').trim().split(/\s+/).filter(Boolean);
    words.slice(0, blank.write).forEach((word, at) => { typed[first[index] + at] = word; });
  });
  return typed;
}
