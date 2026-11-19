import type { Metadata } from 'next';
import { num } from '@shared/quran/arabicNumber';
import Card from '@/components/common/Card';
import HadithSearch from '@/components/hadith/HadithSearch';
import SahihContinue from '@/components/hadith/SahihContinue';
import { FORTY } from '@/lib/forty';
import { SAHIH, SAHIH_SLUGS } from '@/lib/sahih';

export const metadata: Metadata = { title: 'الحديث' };

function BookCard({ href, title, by, size }: { href: string; title: string; by: string; size: string }) {
  return (
    <Card href={href} aria-label={title} className="flex flex-col gap-1 p-4">
      <span className="text-xl">{title}</span>
      <span className="text-sm text-[var(--home-muted)]">{by}</span>
      <span className="text-sm text-[var(--home-muted)]">{size}</span>
    </Card>
  );
}

/**
 * The hadith tab, as the app's (owner's sketch, 2026-11-19): one search over both Sahihs' babs and hadith, then a card for
 * each book, Sahih al-Bukhari, Sahih Muslim and al-Nawawi's Forty, with «تابع» to the last hadith read.
 */
export default function HadithPage() {
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <h1 className="text-3xl">الحديث</h1>
      <HadithSearch>
        {SAHIH_SLUGS.map(slug => {
          const book = SAHIH[slug];
          return (
            <div key={slug} className="flex flex-col gap-2">
              <BookCard href={`/hadith/sahih/${slug}`} title={book.title} by={`${book.author} (ت ${num(book.died)}هـ)`}
                size={`${num(book.kitabs.length)} كتابًا، ${num(book.kitabs[book.kitabs.length - 1].to)} حديثًا`} />
              <SahihContinue book={slug} />
            </div>
          );
        })}
        <BookCard href="/hadith/forty" title={FORTY.books.nawawi.title} by="يحيى بن شرف النووي" size={`${num(FORTY.entries.length)} حديثًا`} />
      </HadithSearch>
    </div>
  );
}
