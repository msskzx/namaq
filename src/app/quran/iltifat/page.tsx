import type { Metadata } from 'next';
import { examples } from '@shared/quran/iltifat';
import IltifatView from './IltifatView';

export const metadata: Metadata = {
  title: 'الالتفات',
};

/** As in the app (owner, 2026-11-13): seven examples, each card with its own picture, the explanation behind the help icon. */
export default function QuranIltifatPage() {
  return (
    <div dir="rtl" className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">الالتفات</h1>
      <IltifatView views={examples()} />
    </div>
  );
}
