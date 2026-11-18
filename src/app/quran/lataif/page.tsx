import type { Metadata } from 'next';
import itqan from '@shared/data/quran/itqanBalagha';
import { exampleReference } from '@shared/quran/lataif';
import { examples } from '@shared/quran/iltifat';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import LataifView from './LataifView';

export const metadata: Metadata = {
  title: 'مشاهد',
};

/** As in the app (owner, 2026-11-16): a curated list of examples, each card with its own picture, each with its reference. */
export default async function QuranLataifPage() {
  const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
  const views = examples(key => words.get(key));
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">مشاهد</h1>
      <LataifView views={views} references={Object.fromEntries(views.map(view => [view.key, exampleReference(view, itqan)]))} />
    </div>
  );
}
