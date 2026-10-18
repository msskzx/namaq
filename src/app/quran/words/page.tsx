import type { Metadata } from 'next';
import OppositesChart from './OppositesChart';
import WordCounts from './WordCounts';
import { RepetitionProvider, RepetitionStats } from '../compare/Repetition';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import counts from './lemmas.json';

export const metadata: Metadata = {
  title: 'ألفاظ القرآن',
};

export default function QuranWordsPage() {
  return (
    <div dir="rtl" className="w-full p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <h1 className="text-3xl">ألفاظ القرآن</h1>
      <WordCounts lemmas={counts.lemmas as LemmaCount[]} />
      <RepetitionProvider>
        <RepetitionStats />
      </RepetitionProvider>
      <OppositesChart opposites={counts.opposites as [CountedSide, CountedSide][]} lemmas={counts.lemmas as LemmaCount[]} />
    </div>
  );
}
