import type { Metadata } from 'next';
import { FORTY, fortyList, type FortyListItem } from '@/lib/forty';
import { FortyCard } from '@/components/hadith/FortyParts';

export const metadata: Metadata = { title: 'الأربعون النووية' };

/** al-Nawawi's Forty in his order (the app's hadith-book page for the Forty): each card his number, the Companion, his opening; then the eight Ibn Rajab adds (43–50). */
export default function FortyListPage() {
  const list = fortyList();
  const card = (item: FortyListItem) => <FortyCard key={item.n} item={item} href={`/hadith/forty/${item.n}`} />;
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">{FORTY.books.nawawi.title}</h1>
      {list.filter(item => !item.source).map(card)}
      <div className="mt-2 flex flex-col gap-0.5">
        <h2 className="text-[1.375rem]">ما زاده ابن رجب</h2>
        <p className="text-[0.9375rem] text-[var(--home-muted)]">{FORTY.books.ibnrajab.title}</p>
      </div>
      {list.filter(item => item.source === 'ibnrajab').map(card)}
    </div>
  );
}
