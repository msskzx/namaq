import { tafsirRuns } from '../quran/tafsirSadi';
import { normalizeWord } from '../quran/normalize';

export function stem(word: string): string {
  let bare = normalizeWord(word).replace(/[^ء-ي]/g, '');
  bare = bare.replace(/^[وف]/, '');
  bare = bare.replace(/^(?:بال|كال|لل|ال)/, '');
  return bare.length >= 3 ? bare : '';
}

export const stems = (text: string | readonly string[]) =>
  new Set((typeof text === 'string' ? text.split(/\s+/) : text).map(stem).filter(Boolean));

export const quotesOf = (text: string) => tafsirRuns(text).filter(run => run.quran).map(run => run.text.slice(1, -1));

export function hideQuotes(text: string, hidden: readonly number[]): string {
  let at = -1;
  return tafsirRuns(text).map(run => (run.quran ? (hidden.includes(++at) ? '«…»' : run.text) : run.text)).join('');
}
