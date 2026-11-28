import itqan from '../data/quran/itqanBalagha';
import { balaghaNote, withoutOpeningQuote, type AyahNote } from './ayahNotes';
import { itqanAt } from './itqanBalagha';
import { irabWordsAt } from './irabData';
import { qiraatOf } from './qiraatData';
import type { WordDifference } from './qiraat';
import { tafsirSadiOf } from './tafsirSadiData';
import { corpusWords } from './words';
import { irabSources, itqanSource, qiraatSources, sadiSource } from '../quiz/bookSources';
import type { QuizSource } from '../quiz/sources';

export type NoteBody = { key: string; sources: QuizSource[] } & ({ text: string; heading?: string } | { word: number; shown: string; role: string; morph: string } | { readings: WordDifference[] });

export function noteBody(kind: AyahNote, key: string, day: number, words: readonly string[]): NoteBody | null {
  if (kind === 'tafsir') { const passage = tafsirSadiOf(key); return passage ? { key, text: withoutOpeningQuote(passage.text), sources: [sadiSource(passage)] } : null; }
  if (kind === 'balagha') {
    const paragraphs = itqanAt(itqan, key);
    const found = balaghaNote(paragraphs);
    const paragraph = paragraphs.find(each => each.places === 1);
    return found && paragraph ? { key, ...found, sources: [itqanSource(paragraph)] } : null;
  }
  if (kind === 'irab') {
    if (!words.length) return null;
    const lines = irabWordsAt(key);
    const order = words.map((_, i) => (i + day) % words.length);
    const hasRole = (i: number) => corpusWords(key, i).some(c => lines[c]?.role);
    const particle = (i: number) => corpusWords(key, i).every(c => lines[c]?.morph.startsWith('حرف'));
    const word = order.find(i => hasRole(i) && !particle(i)) ?? order.find(hasRole);
    if (word === undefined) return null;
    return { key, sources: irabSources(key), word, shown: words[word], role: corpusWords(key, word).map(c => lines[c]?.role).filter(Boolean).join('، '), morph: corpusWords(key, word).map(c => lines[c]?.morph).filter(Boolean).join(' · ') };
  }
  return { key, sources: qiraatSources(key), readings: qiraatOf(key) };
}
