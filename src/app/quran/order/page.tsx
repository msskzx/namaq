import type { Metadata } from 'next';
import data from '@shared/data/quran/surahOrder.json';
import { num } from '@shared/quran/arabicNumber';
import { orderSurahs } from '@shared/quran/surahOrder';
import OrderView from './OrderView';

export const metadata: Metadata = {
  title: 'ترتيب السور: من فصلت إلى الناس',
};

export default function QuranOrderPage() {
  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-6 text-[var(--home-ink)]">
      <OrderView surahs={orderSurahs(data, num)} />
    </div>
  );
}
