import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { num } from '@shared/quran/arabicNumber';
import { SahihKitabList } from '@/components/hadith/SahihParts';
import Reference from '@/components/common/Reference';
import { SAHIH, SAHIH_SLUGS, isSahihSlug } from '@/lib/sahih';

export const generateStaticParams = () => SAHIH_SLUGS.map(book => ({ book }));

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }): Promise<Metadata> {
  const { book } = await params;
  return { title: isSahihSlug(book) ? SAHIH[book].title : 'الحديث' };
}

/** A Sahih's kitabs (the app's hadith-book page): each a row in one card, its number, name and hadith numbers. */
export default async function SahihBookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  if (!isSahihSlug(slug)) notFound();
  const book = SAHIH[slug];
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[1.625rem]">{book.title}</h1>
        <p className="text-[var(--home-muted)]">{`${book.author} (ت ${num(book.died)}هـ)`}</p>
        {book.headingsBy === 'nawawi' && <p className="text-sm text-[var(--home-muted)]">تراجم الأبواب من وضع النووي، كما في طبعة عبد الباقي.</p>}
      </div>
      {/* The list links each kitab, so its bab headings stay on the server. */}
      <SahihKitabList book={{ ...book, kitabs: book.kitabs.map(kitab => ({ ...kitab, babs: [] })) }} kitabHref={`/hadith/sahih/${slug}/kitab/`} />
      <Reference title={book.title} quotes={[{ text: `${book.title}، ${book.edition}` }]} links={[{ label: 'الكتاب في المكتبة الشاملة', url: `https://shamela.ws/book/${book.shamela}` }]} />
    </div>
  );
}
