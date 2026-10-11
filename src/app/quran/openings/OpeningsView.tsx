import React from 'react';
import Badge from '@/components/common/Badge';
import { SLOT_COLORS } from '@/components/quran/slotColors';
import { num } from '@/lib/quran/arabicNumber';
import { ANSWER_SRC, DISPUTE, NOTES, SHARED, type OpeningLine, type OpeningView } from '@/lib/quran/openings';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

function Words({ line }: { line: OpeningLine }) {
  return line.text.split(' ').map((word, i) => (
    <React.Fragment key={i}>
      {i > 0 && ' '}
      {line.slots && i in line.slots ? <mark className={`bg-transparent ${SLOT_COLORS[line.slots[i] % SLOT_COLORS.length]}`}>{word}</mark> : word}
    </React.Fragment>
  ));
}

const link = (s: { title: string; url: string }) => (
  <li key={s.url}>
    <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
  </li>
);

export default function OpeningsView({ items }: { items: OpeningView[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid md:grid-cols-3 gap-4">
        {items.map(({ surah, lines }) => (
          <section key={surah.number} className={PANEL} aria-label={`${num(surah.number)} ${surah.plain}`}>
            <h2 className="text-xl text-amber-600 dark:text-amber-400 mb-2">{`${num(surah.number)} ${surah.plain}`}</h2>
            {lines.map(l => (
              <p key={l.ayah} className="text-2xl leading-[2.2] font-arabic">
                <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
                <Words line={l} />
                {l.answer && <span className="ms-2"><Badge text={l.sourced ? 'الجواب' : 'الجواب، قراءتنا'} size="sm" color="amber" /></span>}
              </p>
            ))}
            {surah.number === 84 && <p className={`${NOTE} mt-2`}>الجواب هنا مختلف فيه، انظر أدناه.</p>}
          </section>
        ))}
      </div>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">اللفظ المشترك</h2>
        <ul className={NOTE} aria-label="اللفظ المشترك">
          {SHARED.map(({ phrase, at }, i) => {
            const item = items.find(it => it.surah.number === Number(Object.keys(at)[0]))!;
            const line = item.lines.find(l => l.ayah === Object.values(at)[0])!;
            const words = line.text.split(' ').filter((_, j) => line.slots?.[j] === i + 1);
            return <li key={phrase}>{`${words.join(' ')}: في ${Object.keys(at).map(n => num(Number(n))).join(' و')}`}</li>;
          })}
        </ul>
      </section>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">ما يجمعها وما يفرقها</h2>
        <ul className="list-disc ps-5 flex flex-col gap-1">
          {NOTES.map(n => <li key={n}>{n}</li>)}
        </ul>
        <ul className={`${NOTE} mt-2`} aria-label="مصدر الجواب">{link(ANSWER_SRC)}</ul>
      </section>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">{DISPUTE.title}</h2>
        <ul className="list-disc ps-5 flex flex-col gap-1">
          {DISPUTE.views.map(v => <li key={v}>{v}</li>)}
        </ul>
        <ul className={`${NOTE} mt-2`} aria-label="مصدر الخلاف">{DISPUTE.src.map(link)}</ul>
      </section>
    </div>
  );
}
