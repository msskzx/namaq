import generated from '@shared/data/quran/words.json';
import type { WordsData } from '@shared/quran/words';

export const words = generated as unknown as WordsData;

export const corpusText = (shown: string[]) => shown.filter(word => !word.startsWith('﴿') && word !== '۞');
