import type { Metadata } from 'next';
import { surahList } from '@/lib/quran/surahList';
import SurahIndex from './SurahIndex';
import { garamond } from './font';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: القراءة',
};

export default async function QuranReadIndexPage() {
  return <SurahIndex surahs={await surahList()} fontClass={garamond.variable} />;
}
