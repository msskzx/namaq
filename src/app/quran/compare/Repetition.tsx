'use client';

// docs/plans/quran-repetition-merge.md
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faCodeCompare } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import type { Repetition } from '@/lib/quran/repetition';
import { ARC_MIN, REFRAIN_MANY, type Occ } from '@/lib/quran/shifts';
import { Card } from '../Card';
import { NOTE, PANEL } from '../panel';

export const VISIBLE = 20;
const run = (at: Occ, len: number) => Object.fromEntries(Array.from({ length: len }, (_, k) => [at.word + k, 0]));

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className={PANEL}>
      <div className="text-3xl text-amber-600 dark:text-amber-400">{num(value)}</div>
      <div className={NOTE}>{label}</div>
    </div>
  );
}

function Ticks({ at, count, selected, onSelect, label }: { at: Occ[]; count: number; selected: number; onSelect: (k: number) => void; label: string }) {
  const step = Math.min(28, Math.max(4, 960 / count));
  const barH = 48;
  const h = barH + 16;
  const xOf = (ayah: number) => (count - ayah) * step;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${count * step} ${h}`} className="w-full" style={{ minWidth: Math.min(count * step, 960) }} role="group" aria-label={label}>
        <line x1={0} x2={count * step} y1={barH} y2={barH} className="stroke-gray-300 dark:stroke-gray-700" />
        {at.map((o, k) => (
          <g key={k}>
            <rect x={xOf(o.ayah)} y={2} width={Math.max(step * 0.7, 4)} height={barH - 2} role="button" tabIndex={0} aria-label={`الآية ${num(o.ayah)}`} aria-pressed={k === selected}
              className={`cursor-pointer outline-none focus-visible:stroke-2 focus-visible:stroke-gray-900 dark:focus-visible:stroke-white ${k === selected ? 'fill-amber-600 dark:fill-amber-300' : 'fill-amber-400 dark:fill-amber-600'}`}
              onClick={() => onSelect(k)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(k); } }}>
              <title>{`الآية ${num(o.ayah)}`}</title>
            </rect>
            <text x={xOf(o.ayah) + Math.max(step * 0.7, 4) / 2} y={barH + 12} textAnchor="middle" fontSize={10} className="fill-gray-600 dark:fill-gray-400">{num(o.ayah)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Within({ data, surah }: { data: Repetition; surah: Repetition['surahs'][number] }) {
  const rows = useMemo(() => data.within.filter(w => w.surah === surah.number), [data, surah.number]);
  const [all, setAll] = useState(false);
  const [sel, setSel] = useState<{ row: number; k: number } | null>(null);
  const shown = all ? rows : rows.slice(0, VISIBLE);
  const phrase = (len: number, at: Occ) => (data.ayat[`${surah.number}:${at.ayah}`] ?? '').split(' ').slice(at.word, at.word + len).join(' ');
  const chosen = sel ? rows[sel.row] : null;
  const cardSurah = { number: surah.number, name: surah.name, plain: plainName(surah.name) };

  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">عبارات تتكرر داخل {plainName(surah.name)}</h2>
      <p className={`${NOTE} mb-2`}>
        عبارة من {num(ARC_MIN)} كلمات فأكثر تتكرر بلفظها في آيتين أو أكثر، أو من ثلاث كلمات إن وردت {num(REFRAIN_MANY)} مرات فأكثر. كل علامة موضع للعبارة.
      </p>
      {rows.length === 0 ? <p className={NOTE}>لا عبارات تتكرر داخل هذه السورة.</p> : (
        <div className="flex flex-col gap-3">
          {shown.map((r, i) => (
            <div key={i}>
              <p className="text-lg font-arabic flex flex-wrap items-center gap-2" dir="rtl">
                {phrase(r.len, r.at[0])}
                <Badge size="sm" color="gray" text={`${num(r.at.length)} مرات`} />
                <Badge size="sm" color="gray" text={`${num(r.len)} كلمات`} />
              </p>
              <Ticks at={r.at} count={surah.ayat} selected={sel?.row === i ? sel.k : -1} onSelect={k => setSel({ row: i, k })} label={`مواضع «${phrase(r.len, r.at[0])}»`} />
            </div>
          ))}
        </div>
      )}
      {rows.length > VISIBLE && !all && (
        <Button size="sm" className="mt-3" onClick={() => setAll(true)}>
          <FontAwesomeIcon icon={faAnglesDown} />
          {`عرض الباقي (${num(rows.length - VISIBLE)})`}
        </Button>
      )}
      {chosen && sel && (
        <div className="mt-4" aria-live="polite">
          <Card surah={cardSurah} ayah={chosen.at[sel.k].ayah} text={data.ayat[`${surah.number}:${chosen.at[sel.k].ayah}`]} slots={run(chosen.at[sel.k], chosen.len)} />
        </div>
      )}
    </section>
  );
}

const RepetitionContext = createContext<{ data: Repetition | null; failed: boolean }>({ data: null, failed: false });

export function RepetitionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Repetition | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch('/api/quran/repetition')
      .then(res => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Repetition>;
      })
      .then(body => { if (live) setData(body); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, []);

  return <RepetitionContext.Provider value={{ data, failed }}>{children}</RepetitionContext.Provider>;
}

export function useRepetition() {
  return useContext(RepetitionContext).data;
}

function Status() {
  const { failed } = useContext(RepetitionContext);
  return <p role={failed ? 'alert' : 'status'} className={NOTE}>{failed ? 'تعذر تحميل البيانات.' : 'جارٍ التحميل…'}</p>;
}

export function RepetitionStats() {
  const { data } = useContext(RepetitionContext);
  return (
    <section className={`${PANEL} flex flex-col gap-3`}>
      <h2 className="text-2xl">تكرار العبارات</h2>
      <p className={NOTE}>عبارات تتكرر بلفظها داخل السورة الواحدة وبين السور.</p>
      {!data ? <Status /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Tile value={data.surahs.length} label="سورة" />
          <Tile value={data.within.length} label="عبارة تتكرر داخل سورة" />
          <Tile value={data.across.length} label="نص مشترك بين سور" />
          <Tile value={new Set(data.cells.filter(c => c.a !== c.b).flatMap(c => [c.a, c.b])).size} label="سورة فيها نص مشترك" />
        </div>
      )}
      <Button size="sm" href="/quran/compare" className="w-fit">
        <FontAwesomeIcon icon={faCodeCompare} />
        قارن السور
      </Button>
    </section>
  );
}

export function SurahRepetition({ surah }: { surah: number }) {
  const { data } = useContext(RepetitionContext);
  if (!data) return <Status />;
  return (
    <div className="flex flex-col gap-4">
      <p className={NOTE}>لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. يدل التطابق على اشتراك اللفظ وحده.</p>
      <Within key={surah} data={data} surah={data.surahs[surah - 1]} />
    </div>
  );
}
