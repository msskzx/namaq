import { MUSHAF } from '../data/quran/mushaf';
import { ayahWordsOf, type AyahWords } from '../quran/quranText/ayahWords';
import { penTargets, shownCut, type PageAsk, type PenRule } from '../quran/writeAyah';
import type { WriteAsk } from './score';

let words: AyahWords | undefined;

export function writeAsk(key: string, ask: PageAsk, rule: PenRule): Required<WriteAsk> | null {
  const all = (words ??= ayahWordsOf(MUSHAF))[key];
  if (!all?.length || !ask.recite) return null;
  const cut = shownCut(key, [...all], ask.shows);
  return { words: [...all], asked: penTargets([...all], rule).filter(at => at >= cut) };
}
