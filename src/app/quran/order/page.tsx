import type { Metadata } from 'next';
import { num } from '@shared/quran/arabicNumber';
import { ORDER_JUZ, orderSurahs } from '@shared/quran/surahOrder';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import OrderView from './OrderView';

export const metadata: Metadata = {
  title: 'ترتيب السور: من الفاتحة إلى الناس',
};

/** `?juz=` opens the list at a juz, as «رتّب السور» links it after an answer. */
export default async function QuranOrderPage({ searchParams }: { searchParams: Promise<{ juz?: string }> }) {
  const asked = Number((await searchParams).juz);
  const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
  const data = (key: string) => words.get(key);
  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-6 text-[var(--home-ink)]">
      <OrderView surahs={orderSurahs(data, num)} juz={ORDER_JUZ.includes(asked) ? asked : null} />
    </div>
  );
}
