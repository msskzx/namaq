import type { Metadata } from 'next';
import { surahList } from '@/lib/quran/surahList';
import SurahIndex from '../SurahIndex';
import { garamond } from '../font';
import ReciteShortcuts from './ReciteShortcuts';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'القرآن: التسميع',
};

/** Where recite mode starts: continue, review the forgotten ayat, or pick a surah, juz' or ayah. */
export default async function RecitePage() {
  return <SurahIndex surahs={await surahList()} fontClass={garamond.variable} recite><ReciteShortcuts /></SurahIndex>;
}
