import type { Metadata } from 'next';
import { buildOaths } from '@shared/quran/oaths';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import OathsView from './OathsView';

export const metadata: Metadata = {
  title: 'الأقسام في القرآن',
};

export default async function QuranOathsPage() {
  const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
  const data = (key: string) => words.get(key);
  return (
    <div dir="rtl" className="mx-auto w-full max-w-3xl px-4 py-6 text-[var(--home-ink)]">
      <OathsView allah={buildOaths('allah', data)} others={buildOaths('others', data)} />
    </div>
  );
}
