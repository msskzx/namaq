import { Suspense } from 'react';
import type { Metadata } from 'next';
import RepetitionLoader from './RepetitionLoader';
import OppositesChart from './OppositesChart';
import WordCounts from './WordCounts';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import counts from './lemmas.json';

export const metadata: Metadata = {
  title: 'القرآن: تكرار العبارات',
};

export default function QuranPage() {
  return (
    <>
      <Suspense>
        <RepetitionLoader />
      </Suspense>
      <div dir="rtl" className="w-full px-4 pb-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
        <WordCounts lemmas={counts.lemmas as LemmaCount[]} />
        <OppositesChart opposites={counts.opposites as [CountedSide, CountedSide][]} lemmas={counts.lemmas as LemmaCount[]} />
      </div>
    </>
  );
}
