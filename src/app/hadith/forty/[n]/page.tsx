import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MessagesSquare } from 'lucide-react';
import Button from '@/components/common/Button';
import { FortyHadith } from '@/components/hadith/FortyParts';
import { FORTY, JIBRIL, fortyPage } from '@/lib/forty';

export const generateStaticParams = () => FORTY.entries.map(entry => ({ n: String(entry.n) }));

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  return { title: fortyPage(Number((await params).n))?.entry.heading ?? 'الحديث' };
}

/**
 * One of al-Nawawi's Forty (owner, 2026-11-18; the app's hadith page): his text, then each book he names with the records
 * found there, every chain drawn («الرسم») or read whole («النص كاملًا»). No. 2 opens the Jibril pages with their scenes.
 */
export default async function FortyHadithPage({ params }: { params: Promise<{ n: string }> }) {
  const page = fortyPage(Number((await params).n));
  if (!page) notFound();
  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <FortyHadith {...page} jibril={page.entry.n === 2 && (
        <div className="flex flex-wrap gap-2">
          <Button href={`/hadith/${JIBRIL.muslim}`}><MessagesSquare size={18} aria-hidden />المشاهد في صحيح مسلم</Button>
          <Button href={`/hadith/${JIBRIL.bukhari}`}><MessagesSquare size={18} aria-hidden />رواية أبي هريرة في البخاري</Button>
        </div>
      )} />
    </div>
  );
}
