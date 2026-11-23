// The home feed's tajwid card (release-1 plan 2026-11-23: every interest gets a card): one rule of Tuhfat al-Atfal a card,
// its verses whole, and the letters the poem names for it where it names them (questions.ts, checked against the text).
// The introduction and the closing teach no rule and are left out.
import { LAM_RULES, MEEM_RULES, NOON_RULES, verses } from './questions';
import { numberVerses, type NumberedVerse, type Poem } from './poem';
import poemData from './tuhfat-al-atfal.json';

/** [first verse, last verse]: the verses that state one rule, as the poem runs on from one to the next. */
const RUNS: [number, number][] = [
  [6, 8], [9, 11], [12, 12], [13, 13], [14, 16], [17, 17], [18, 20], [21, 21], [22, 23], [24, 25], [26, 28], [29, 29],
  [30, 34], [35, 37], [38, 41], [42, 44], [45, 47], [48, 52], [53, 57],
];

export type TuhfaPassage = { id: string; chapter: string; verses: NumberedVerse[]; letters?: string };

const CHAPTERS = numberVerses(poemData as Poem);
const RULES = [...NOON_RULES, ...MEEM_RULES, ...LAM_RULES];

export const TUHFA_PASSAGES: TuhfaPassage[] = RUNS.map(([first, last]) => {
  const run = verses.slice(first - 1, last);
  const rule = RULES.find(each => each.verse >= first && each.verse <= last);
  return {
    id: String(first),
    chapter: CHAPTERS.find(chapter => chapter.verses.some(verse => verse.number === first))!.title,
    verses: run,
    ...(rule && { letters: rule.letters }),
  };
});

export const tuhfaPassage = (id: string) => TUHFA_PASSAGES.find(passage => passage.id === id);
