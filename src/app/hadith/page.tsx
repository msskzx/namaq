import type { Metadata } from 'next';
import { FORTY, fortyList } from '@/lib/forty';
import { FortyCard } from '@/components/hadith/FortyParts';

export const metadata: Metadata = { title: 'الحديث' };

/**
 * The hadith tab, as the app's (owner, 2026-11-18; every phone feature on the website too, owner 2026-11-19): al-Nawawi's
 * Forty in his order, each card his number, the Companion, the opening of his text and the books he names.
 */
export default function HadithPage() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-3xl">الحديث</h1>
        <p className="text-[0.9375rem] text-[var(--home-muted)]">{FORTY.books.nawawi.title}</p>
      </div>
      {fortyList().map(item => <FortyCard key={item.n} item={item} href={`/hadith/forty/${item.n}`} />)}
    </div>
  );
}
