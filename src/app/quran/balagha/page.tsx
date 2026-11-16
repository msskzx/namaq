import type { Metadata } from 'next';
import itqan from '@shared/data/quran/itqanBalagha';
import { exampleReference } from '@shared/quran/balaghaPage';
import { examples } from '@shared/quran/iltifat';
import BalaghaView from './BalaghaView';

export const metadata: Metadata = {
  title: 'البلاغة',
};

/** As in the app (owner, 2026-11-16): a curated list of examples, each card with its own picture, each with its reference. */
export default function QuranBalaghaPage() {
  const views = examples();
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">البلاغة</h1>
      <BalaghaView views={views} references={Object.fromEntries(views.map(view => [view.key, exampleReference(view, itqan)]))} />
    </div>
  );
}
