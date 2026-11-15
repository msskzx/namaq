import data from '../data/quran/irab';
import surahs from '../data/quran/surahs.json';
import { irabWordsOf } from './irab';

const starts = surahs.reduce<number[]>((all, surah, i) => [...all, i ? all[i - 1] + surahs[i - 1].numberOfAyat : 0], []);

/** Every word's short i'rab line, built into the app; the website reads it on the server (src/app/api/quran/irab). */
export const irabWordsAt = (key: string) => irabWordsOf(data, starts, key);
export const irabSourceVersion = data.source;
