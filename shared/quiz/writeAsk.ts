// A recited ayah asked in a party (owner, 2026-11-17): the pen is on for everyone with the host's pen rule, and the party
// grades the words written (quiz/score.ts questionPoints). The words are the ayah's own on its Madina page (every page ends
// where an ayah ends), so they line up with the page each player writes on.
import { MUSHAF } from '../data/quran/mushaf';
import { ayahWordsOf, type AyahWords } from '../quran/quranText/ayahWords';
import { penTargets, shownCut, type PageAsk, type PenRule } from '../quran/writeAyah';
import type { WriteAsk } from './score';

let words: AyahWords | undefined;

/** The words the pen asks of a recited question's ayah: what the rule asks, past the words the question shows. */
export function writeAsk(key: string, ask: PageAsk, rule: PenRule): Required<WriteAsk> | null {
  const all = (words ??= ayahWordsOf(MUSHAF))[key];
  if (!all?.length || !ask.recite) return null;
  const cut = shownCut(key, [...all], ask.shows);
  return { words: [...all], asked: penTargets([...all], rule).filter(at => at >= cut) };
}
