// What the four ayah quizzes (ayahQuizzes.ts) and their build (scripts/quran/buildAyahQuizzes.ts) both read from a book's
// text: the words a quote or an ayah is made of, compared without marks, «ال» or a joined و / ف / ب / ل / ك.
import { tafsirRuns } from '../quran/tafsirSadi';
import { normalizeWord } from '../quran/normalize';

/** A word as the build compares it: no marks, no joined و / ف / ب / ل / ك, no «ال»; '' for a word too short to say anything. */
export function stem(word: string): string {
  let bare = normalizeWord(word).replace(/[^ء-ي]/g, '');
  bare = bare.replace(/^[وف]/, '');
  bare = bare.replace(/^(?:بال|كال|لل|ال)/, '');
  return bare.length >= 3 ? bare : '';
}

export const stems = (text: string | readonly string[]) =>
  new Set((typeof text === 'string' ? text.split(/\s+/) : text).map(stem).filter(Boolean));

/** A tafsir passage's quotes (﴿…﴾), in order, each as its own words. */
export const quotesOf = (text: string) => tafsirRuns(text).filter(run => run.quran).map(run => run.text.slice(1, -1));

/**
 * The passage with the quotes at `hidden` (counted among its quotes from 0) written «…», so the ayah it explains is not given
 * away; the other quotes stay ﴿…﴾ and are drawn in the mushaf's font.
 */
export function hideQuotes(text: string, hidden: readonly number[]): string {
  let at = -1;
  return tafsirRuns(text).map(run => (run.quran ? (hidden.includes(++at) ? '«…»' : run.text) : run.text)).join('');
}
