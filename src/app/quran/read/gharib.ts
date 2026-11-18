import gharib from '@shared/data/quran/gharib';
import mufradat from '@shared/data/quran/mufradat';
import { gharibAt, gharibOfWord, mufradatOf, type GharibAt, type MufradatEntry } from '@shared/quran/gharib';
import { ayahMushafWords } from './irab';

/**
 * What the reader's meaning sheet shows for a pressed word (AyahPreviewSheet.tsx): the ayah's words and the pressed one,
 * Ibn Qutaybah's entries on the ayah with those on the word first, and al-Raghib's article on its root. The app's sheet
 * reads the same books on the phone (mobile/src/components/GharibSheet.tsx).
 */
export type GharibAyah = { words: string[]; word: number; gharib: GharibAt[]; mufradat: MufradatEntry | null };

export async function gharibAyah(key: string, page?: number, n?: number): Promise<GharibAyah> {
  const { words, word } = await ayahMushafWords(key, page, n);
  const all = gharibAt(gharib, key);
  const own = gharibOfWord(all, word);
  const article = mufradatOf(mufradat, key, word);
  return { words, word, gharib: [...own, ...all.filter(entry => !own.includes(entry))], mufradat: article ? [...article] as MufradatEntry : null };
}
