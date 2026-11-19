import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, MessagesSquare } from 'lucide-react';
import { bookOf, findHadith, placeOf } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { SahihHadithView } from '@/components/hadith/SahihParts';
import HadithBooks from '@/components/hadith/HadithBooks';
import { recordedIn } from '@shared/hadith';
import { RememberOpened } from '@/components/hadith/SahihContinue';
import { SAHIH, fortyOf, isSahihSlug, sahihText } from '@/lib/sahih';

type Params = Promise<{ book: string; n: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { book, n } = await params;
  return { title: isSahihSlug(book) ? `${SAHIH[book].title} ${num(Number(n))}` : 'الحديث' };
}

/**
 * One hadith of a Sahih (the app's hadith-sahih page): kitab › bab, the narrator, its words large, its chain drawn or read
 * whole, Muslim's other routes folded, the ones of the Forty that hold it, and the hadith before and after.
 */
export default async function SahihHadithPage({ params }: { params: Params }) {
  const { book: slug, n: at } = await params;
  if (!isSahihSlug(slug)) notFound();
  const book = SAHIH[slug];
  const text = await sahihText(slug);
  const found = findHadith(text, Number(at));
  const place = placeOf(book, Number(at));
  if (!found || !place) notFound();
  const { file, hadith } = found;
  const i = file.hadith.indexOf(hadith);
  const f = text.kitabs.indexOf(file);
  const before = i > 0 ? file.hadith[i - 1] : text.kitabs[f - 1]?.hadith.at(-1);
  const after = i < file.hadith.length - 1 ? file.hadith[i + 1] : text.kitabs[f + 1]?.hadith[0];
  const forty = fortyOf(slug, hadith.n);
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3.5 p-4 text-[var(--home-ink)]">
      <RememberOpened book={slug} n={hadith.n} />
      <div className="flex flex-col gap-0.5">
        <Link href={`/hadith/sahih/${slug}/kitab/${place.kitab.n}`} className="text-[0.9375rem] text-[var(--home-accent)] hover:underline">
          {`${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}`}
        </Link>
        {book.headingsBy === 'nawawi' && place.bab?.title && <span className="text-[0.8125rem] text-[var(--home-muted)]">تبويب النووي</span>}
        <h1 className="text-2xl">{`${book.title} ${[hadith.n, ...(hadith.also ?? [])].map(each => num(each)).join(' - ')}`}</h1>
      </div>
      <Card className="p-4"><SahihHadithView book={bookOf(book)} hadith={hadith} /></Card>
      {forty.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.0625rem] font-bold">من أخرجه</h2>
          {forty.map(entry => <HadithBooks key={entry.n} top={`${book.title} ${num(hadith.n)}`} boxes={recordedIn(entry)}
            hrefOf={box => { const [at, number] = box.key.split(':'); return isSahihSlug(at) && number ? `/hadith/sahih/${at}/${number}` : undefined; }} />)}
          <p className="text-[0.9375rem] text-[var(--home-muted)]">من الأربعين النووية</p>
          <div className="flex flex-wrap gap-2">{forty.map(entry => <Button key={entry.n} href={`/hadith/forty/${entry.n}`}><MessagesSquare size={18} aria-hidden />{entry.heading}</Button>)}</div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {before && <Button href={`/hadith/sahih/${slug}/${before.n}`}><ChevronRight size={18} aria-hidden />{`السابق ${num(before.n)}`}</Button>}
        {after && <Button href={`/hadith/sahih/${slug}/${after.n}`}>{`التالي ${num(after.n)}`}<ChevronLeft size={18} aria-hidden /></Button>}
      </div>
    </div>
  );
}
