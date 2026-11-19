import type { Metadata } from 'next';
import { FORTY, fortyList } from '@/lib/forty';
import { FortyCard } from '@/components/hadith/FortyParts';

export const metadata: Metadata = { title: 'الأربعون النووية' };

/** al-Nawawi's Forty in his order (the app's hadith-book page for the Forty): each card his number, the Companion, his opening. */
export default function FortyListPage() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">{FORTY.books.nawawi.title}</h1>
      {fortyList().map(item => <FortyCard key={item.n} item={item} href={`/hadith/forty/${item.n}`} />)}
    </div>
  );
}
