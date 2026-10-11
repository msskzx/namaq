import React from 'react';
import { num } from '@/lib/quran/arabicNumber';
import { ANSWER_SRC, DISPUTE, NOTES, TASBIH_NOTES, TASBIH_SRC, type OpeningView, type Role, type TasbihRole, type TasbihView } from '@/lib/quran/openings';

const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
const NOTE = 'text-sm text-gray-600 dark:text-gray-400';

const ROLES: Record<Role, { label: string; block: string; chip: string }> = {
  condition: { label: 'الشرط', block: 'bg-sky-100 dark:bg-sky-950 border-sky-500', chip: 'bg-sky-500' },
  answer: { label: 'الجواب', block: 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500', chip: 'bg-emerald-500' },
  disputed: { label: 'موضع الخلاف في الجواب', block: 'bg-gray-200 dark:bg-gray-800 border-gray-500', chip: 'bg-gray-500' },
};

const TASBIH_ROLES: Record<TasbihRole, { label: string; mark: string; chip: string }> = {
  verb: { label: 'لفظ التسبيح', mark: 'bg-violet-200 dark:bg-violet-900', chip: 'bg-violet-500' },
  scope: { label: 'المسبَّح ومن يسبّح', mark: 'bg-amber-200 dark:bg-amber-900', chip: 'bg-amber-500' },
  closing: { label: 'الختم بالأسماء والصفات', mark: 'bg-rose-200 dark:bg-rose-900', chip: 'bg-rose-500' },
};

function Legend({ label, items }: { label: string; items: { label: string; chip: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-4" aria-label={label}>
      {items.map(i => (
        <li key={i.label} className="flex items-center gap-2">
          <span className={`inline-block w-4 h-4 rounded ${i.chip}`} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

const link = (s: { title: string; url: string }) => (
  <li key={s.url}>
    <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
  </li>
);

export default function OpeningsView({ items, tasbih }: { items: OpeningView[]; tasbih: TasbihView[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl">الشرط وجوابه</h2>
      <Legend label="دلالة الألوان" items={(Object.keys(ROLES) as Role[]).map(r => ROLES[r])} />
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
      <h2 className="text-2xl mt-4">الافتتاح بالتسبيح</h2>
      <Legend label="دلالة ألوان التسبيح" items={(Object.keys(TASBIH_ROLES) as TasbihRole[]).map(r => TASBIH_ROLES[r])} />
      <div className="grid md:grid-cols-2 gap-4">
        {tasbih.map(({ surah, ayah, words }) => (
          <section key={surah.number} className={PANEL} aria-label={`${num(surah.number)} ${surah.plain}`}>
            <h3 className="text-xl text-amber-600 dark:text-amber-400 mb-2">{`${num(surah.number)} ${surah.plain}`}</h3>
            <p className="text-2xl leading-[2.2] font-arabic">
              <span className="text-sm text-amber-600 dark:text-amber-400 me-2">{num(ayah)}</span>
              {words.map((w, i) => (
                <React.Fragment key={i}>
                  {i > 0 && ' '}
                  {w.role ? <mark data-role={w.role} className={`rounded px-1 text-inherit ${TASBIH_ROLES[w.role].mark}`}>{w.text}</mark> : w.text}
                </React.Fragment>
              ))}
            </p>
          </section>
        ))}
      </div>
      <section className={PANEL}>
        <h2 className="text-lg text-amber-600 dark:text-amber-400 mb-2">ما يجمع المسبّحات وما يفرقها</h2>
        <ul className="list-disc ps-5 flex flex-col gap-1">
          {TASBIH_NOTES.map(n => <li key={n}>{n}</li>)}
        </ul>
        <ul className={`${NOTE} mt-2`} aria-label="مصدر المسبحات">{link(TASBIH_SRC)}</ul>
      </section>
    </div>
  );
}
