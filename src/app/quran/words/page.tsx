import type { Metadata } from 'next';
import OppositesChart from './OppositesChart';
import WordCounts from './WordCounts';
import WordsSource from './WordsSource';
import { RepetitionProvider, RepetitionStats } from '../compare/Repetition';
import type { CountedSide, LemmaCount } from '@/lib/quran/lemmas';
import counts from './lemmas.json';

export const metadata: Metadata = {
  title: 'ألفاظ القرآن',
};

export default function QuranWordsPage() {
  return (
    <div dir="rtl" className="w-full p-4 flex flex-col gap-6 text-[var(--home-ink)]">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl">ألفاظ القرآن</h1>
        <WordsSource />
      </div>
      <WordCounts lemmas={counts.lemmas as LemmaCount[]} />
      <RepetitionProvider>
        <RepetitionStats />
      </RepetitionProvider>
      <OppositesChart opposites={counts.opposites as [CountedSide, CountedSide][]} lemmas={counts.lemmas as LemmaCount[]} />
    </div>
  );
}
