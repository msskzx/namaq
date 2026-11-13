import generated from '@shared/data/quran/words.json';
import type { WordsData } from '@shared/quran/words';

/** The Quran's word counts (shared/quran/words.ts): counts about the text, the same for every reader, never about the reader. */
export const words = generated as unknown as WordsData;

/** An ayah's shown words as the corpus counts them: without the ayah-number and ۞ marks. */
export const corpusText = (shown: string[]) => shown.filter(word => !word.startsWith('﴿') && word !== '۞');
