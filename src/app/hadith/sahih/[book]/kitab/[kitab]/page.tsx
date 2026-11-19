import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { num } from '@shared/quran/arabicNumber';
import Chip from '@/components/common/Chip';
import { SahihHadithCard } from '@/components/hadith/SahihParts';
import { SAHIH, hadithItem, isSahihSlug, sahihText } from '@/lib/sahih';

type Params = Promise<{ book: string; kitab: string }>;
const kitabOf = async (params: Params) => {
  const { book: slug, kitab: at } = await params;
  if (!isSahihSlug(slug)) return null;
  const kitab = SAHIH[slug].kitabs.find(each => each.n === Number(at));
  return kitab ? { book: SAHIH[slug], kitab } : null;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await kitabOf(params);
  return { title: found ? `${found.kitab.title}، ${found.book.title}` : 'الحديث' };
}

/**
 * A kitab (the app's hadith-kitab page): each bab heading in the accent, what the author put under it before its first
 * hadith in muted ink, then its hadith as cards. In Muslim the headings are al-Nawawi's, and say so.
 */
export default async function SahihKitabPage({ params }: { params: Params }) {
  const found = await kitabOf(params);
  if (!found) notFound();
  const { book, kitab } = found;
  const file = (await sahihText(book.slug)).kitabs.find(each => each.n === kitab.n);
  return (
    <div dir="rtl" lang="ar" className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4 text-[var(--home-ink)]">
      <div className="flex flex-col gap-0.5">
        <Link href={`/hadith/sahih/${book.slug}`} className="text-sm text-[var(--home-muted)] hover:underline">{book.title}</Link>
        <h1 className="text-[1.625rem]">{kitab.title}</h1>
        {kitab.from > 0 && <p className="text-sm text-[var(--home-muted)]">{`الأحاديث ${num(kitab.from)}–${num(kitab.to)}`}</p>}
      </div>
      {kitab.babs.map((bab, i) => {
        const hadith = file?.hadith.filter(item => item.bab === i) ?? [];
        const said = file?.said[i];
        if (!bab.title && !said && !hadith.length) return null;
        return (
          <section key={i} className="flex flex-col gap-2.5">
            {bab.title && <h2 className="mt-2 text-lg leading-[1.8] text-[var(--home-accent)]">{bab.title}</h2>}
            {book.headingsBy === 'nawawi' && bab.title && <Chip label="تبويب النووي" small className="self-start" />}
            {said && <p className="leading-[1.9] text-[var(--home-muted)]">{said}</p>}
            {hadith.map(item => <SahihHadithCard key={item.n} {...hadithItem(item)} href={`/hadith/sahih/${book.slug}/${item.n}`} />)}
          </section>
        );
      })}
    </div>
  );
}
