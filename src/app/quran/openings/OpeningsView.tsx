import React from 'react';
import { NOTES, SHARED, type OpeningView } from '@/lib/quran/openings';
import { num } from '@/lib/quran/arabicNumber';
import { Card } from '../shifts/ShiftsView';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

export default function OpeningsView({ items }: { items: OpeningView[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        {items.map(({ surah, text, slots }) => (
          <section key={surah.number} aria-label={`${num(surah.number)} ${surah.plain}`}>
            <Card surah={surah} ayah={1} text={text} slots={slots} />
          </section>
        ))}
      </div>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">اللفظ المشترك</h2>
        <ul className={NOTE} aria-label="اللفظ المشترك">
          {SHARED.map(({ phrase, surahs }) => {
            const [first] = items.filter(i => surahs.includes(i.surah.number));
            const words = first.text.split(' ').filter((_, j) => first.slots?.[j] === SHARED.findIndex(s => s.phrase === phrase) + 1);
            return <li key={phrase}>{`${words.join(' ')}: في ${surahs.map(n => num(n)).join(' و')}`}</li>;
          })}
        </ul>
      </section>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">ما يجمعها وما يفرقها</h2>
        <ul className="list-disc ps-5 flex flex-col gap-1">
          {NOTES.map(n => <li key={n}>{n}</li>)}
        </ul>
      </section>
    </div>
  );
}
