import type { Metadata } from 'next';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import ThemesView from '../ThemesView';
import pairs from './data/index';
import { surahName } from '@shared/quran/surahNames';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مواضع متقابلة بين سورتين',
};

/** A surah's ayat as the Madina pages print them (the basmala stands above the first ayah, not in it). */
async function load(number: number) {
  const ayat = await loadReaderAyat();
  return ayat.filter(ayah => ayah.key.startsWith(`${number}:`)).map(ayah => ayah.words.join(' '));
}

export default async function QuranThemesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const key = `${query.a}-${query.b}`;
  const [x, y] = (key in pairs ? key : '16-43').split('-').map(Number);
  const [a, b] = await Promise.all([load(x), load(y)]);
  const name = surahName;
  return (
    <div className="max-w-5xl mx-auto p-4">
      <ThemesView a={{ number: x, name: name(x), ayat: a }} b={{ number: y, name: name(y), ayat: b }} themes={pairs[`${x}-${y}`]} />
    </div>
  );
}
