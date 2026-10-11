import React from 'react';
import { num } from '@/lib/quran/arabicNumber';
import { ANSWER_SRC, DISPUTE, NOTES, type OpeningView, type Role } from '@/lib/quran/openings';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

const ROLES: Record<Role, { label: string; block: string; chip: string }> = {
  condition: { label: 'الشرط', block: 'bg-sky-100 dark:bg-sky-950 border-sky-500', chip: 'bg-sky-500' },
  answer: { label: 'الجواب', block: 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500', chip: 'bg-emerald-500' },
  disputed: { label: 'موضع الخلاف في الجواب', block: 'bg-gray-200 dark:bg-gray-800 border-gray-500', chip: 'bg-gray-500' },
};

const link = (s: { title: string; url: string }) => (
  <li key={s.url}>
    <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
  </li>
);

export default function OpeningsView({ items }: { items: OpeningView[] }) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-4" aria-label="دلالة الألوان">
        {(Object.keys(ROLES) as Role[]).map(r => (
          <li key={r} className="flex items-center gap-2">
            <span className={`inline-block w-4 h-4 rounded ${ROLES[r].chip}`} aria-hidden />
            {ROLES[r].label}
          </li>
        ))}
      </ul>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map(({ surah, lines }) => (
          <section key={surah.number} className={PANEL} aria-label={`${num(surah.number)} ${surah.plain}`}>
            <h2 className="text-xl text-amber-600 dark:text-amber-400 mb-2">{`${num(surah.number)} ${surah.plain}`}</h2>
            {lines.map(l => (
              <p key={l.ayah} data-role={l.role} className={`text-2xl leading-[2.2] font-arabic border-s-4 rounded px-2 mb-1 ${ROLES[l.role].block}`}>
                <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(l.ayah)}</span>
                {l.text}
                {l.role === 'answer' && !l.sourced && <span className={`${NOTE} ms-2`}>قراءتنا</span>}
              </p>
            ))}
          </section>
        ))}
      </div>
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
