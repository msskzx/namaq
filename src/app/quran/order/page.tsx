import type { Metadata } from 'next';
import { num } from '@shared/quran/arabicNumber';
import { orderSurahs } from '@shared/quran/surahOrder';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import OrderView from './OrderView';

export const metadata: Metadata = {
  title: 'ترتيب السور: من الفاتحة إلى الناس',
};

export default async function QuranOrderPage() {
  const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
  const data = (key: string) => words.get(key);
  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-6 text-[var(--home-ink)]">
      <OrderView surahs={orderSurahs(data, num)} />
    </div>
  );
}
