'use client';

// docs/plans/quran-repetition-merge.md
import React, { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faArrowDown19, faArrowDownWideShort, faArrowLeft, faArrowRight, faListOl, faShuffle, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Toggle from '@/components/common/Toggle';
import { num } from '@/lib/quran/arabicNumber';
import { plainName } from '@/lib/quran/normalize';
import { MIN_WORDS } from '@/lib/quran/passages';
import type { Repetition } from '@/lib/quran/repetition';
import { ARC_MIN, REFRAIN_MANY, type Occ } from '@/lib/quran/shifts';
import { Card } from './Card';
import { PassageSide } from './PassageSide';
import { Legend, RepetitionMatrix, type Pick } from './RepetitionMatrix';
import type { Ayah } from '@/types/quran';

export const PANEL = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4';
export const NOTE = 'text-sm text-gray-600 dark:text-gray-400';
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

function Partners({ data, surah, onPick }: { data: Repetition; surah: number; onPick: (p: Pick) => void }) {
  const rows = data.cells
    .filter(c => c.a !== c.b && (c.a === surah || c.b === surah))
    .map(c => ({ other: c.a === surah ? c.b : c.a, words: c.words, phrases: c.phrases }))
    .sort((p, q) => q.words - p.words || p.other - q.other);
  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-1">نصوص مشتركة مع سور أخرى</h2>
      <p className={`${NOTE} mb-2`}>تتابع من {num(MIN_WORDS)} كلمات فأكثر يتطابق في سورتين بعد حذف التشكيل، وقد يتخلله اختلاف في بعض الكلمات. اختر سورة لقراءة النصين متجاورين.</p>
      {rows.length === 0 ? <p className={NOTE}>لا نصوص مشتركة بين هذه السورة وغيرها.</p> : (
        <ul className="flex flex-wrap gap-2">
          {rows.map(r => (
            <li key={r.other}>
              <Button size="sm" onClick={() => onPick({ s: surah, t: r.other })}>
                <FontAwesomeIcon icon={faShuffle} />
                {`${plainName(data.surahs[r.other - 1].name)} · ${num(r.words)}`}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PairView({ data, s, t }: { data: Repetition; s: number; t: number }) {
  const [at, setAt] = useState(0);
  const found = useMemo(() => data.passages
    .filter(p => [p.a.from.surah, p.b.from.surah].sort().join() === [s, t].sort().join())
    .map(p => (p.a.from.surah === s ? p : { ...p, a: p.b, b: p.a, marksA: p.marksB, marksB: p.marksA })), [data, s, t]);
  const [first, second] = [data.surahs[s - 1], data.surahs[t - 1]];
  const p = found[Math.min(at, found.length - 1)];
  const surahOf = (n: number) => ({ id: `s${n}`, number: n, name: data.surahs[n - 1].name, nameTransliterated: null }) as unknown as Ayah['surah'];

  return (
    <section className={PANEL}>
      <h2 className="text-2xl mb-3">{`${plainName(first.name)} و${plainName(second.name)}`}</h2>
      {!p ? <p className={NOTE}>لا نصوص مشتركة بين هاتين السورتين.</p> : (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Button size="sm" disabled={at === 0} onClick={() => setAt(at - 1)}>
              <FontAwesomeIcon icon={faArrowRight} />
              السابق
            </Button>
            <select aria-label="اختر نصًا مشتركًا" value={at} onChange={e => setAt(Number(e.target.value))} className="min-w-0 flex-1 rounded border border-amber-400 bg-white dark:bg-gray-900 px-2 py-1 text-sm">
              {found.map((x, i) => <option key={i} value={i}>{`${num(x.a.from.ayah)} ← ${num(x.b.from.ayah)} · ${num(x.matched)} كلمة`}</option>)}
            </select>
            <Button size="sm" disabled={at === found.length - 1} onClick={() => setAt(at + 1)}>
              التالي
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3 text-sm">
            <Badge size="sm" color="gray" text={`${num(p.matched)} كلمة متطابقة`} />
            <Badge size="sm" color="gray" text={`يرد في ${num(p.places)} مواضع`} />
            <Badge size="sm" color="gray" text={p.marksA.length + p.marksB.length === 0 ? 'لا اختلاف في الكلمات' : `${num(p.marksA.length)} كلمة مختلفة في الأول و${num(p.marksB.length)} في الثاني`} />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <PassageSide key={`a${at}`} title={plainName(first.name)} side={p.a} marks={p.marksA} ayat={data.ayat} count={first.ayat} surah={surahOf(s)} />
            <PassageSide key={`b${at}`} title={plainName(second.name)} side={p.b} marks={p.marksB} ayat={data.ayat} count={second.ayat} surah={surahOf(t)} />
          </div>
        </>
      )}
    </section>
  );
}

function Switch({ off, on, checked, onChange, offIcon, onIcon }: { off: string; on: string; checked: boolean; onChange: (on: boolean) => void; offIcon: IconDefinition; onIcon: IconDefinition }) {
  const label = (active: boolean) => 'cursor-pointer ' + (active ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <>
      <button type="button" tabIndex={-1} aria-hidden className={`${label(!checked)} justify-self-end`} onClick={() => onChange(false)}>{off}</button>
      <Toggle label={on} checked={checked} onChange={onChange} size="lg"
        offIcon={<FontAwesomeIcon icon={offIcon} className="size-4" />} onIcon={<FontAwesomeIcon icon={onIcon} className="size-4" />} />
      <button type="button" tabIndex={-1} aria-hidden className={`${label(checked)} justify-self-start`} onClick={() => onChange(true)}>{on}</button>
    </>
  );
}

function Ranked({ data, totals, pick, onPick }: { data: Repetition; totals: Map<number, number>; pick: Pick | null; onPick: (p: Pick) => void }) {
  const [mode, setMode] = useState<'surahs' | 'pairs'>('surahs');
  const [sort, setSort] = useState<'number' | 'count'>('count');
  const rows = useMemo(() => {
    if (mode === 'pairs') {
      return data.cells.filter(c => c.a !== c.b).sort((p, q) => q.words - p.words || p.a - q.a || p.b - q.b)
        .map(c => ({ key: `${c.a}:${c.b}`, label: `${plainName(data.surahs[c.a - 1].name)} و${plainName(data.surahs[c.b - 1].name)}`, words: c.words, number: c.a, pick: { s: c.a, t: c.b } }));
    }
    return data.surahs.filter(s => (totals.get(s.number) ?? 0) > 0)
      .map(s => ({ key: String(s.number), label: plainName(s.name), words: totals.get(s.number) ?? 0, number: s.number, pick: { s: s.number, t: null } }));
  }, [data, totals, mode]);
  const sorted = useMemo(() => [...rows].sort((p, q) => sort === 'count' ? q.words - p.words || p.number - q.number : p.number - q.number), [rows, sort]);
  return (
    <div className="flex flex-col gap-2">
      <div className="grid w-fit grid-cols-[auto_auto_auto] items-center gap-x-2 gap-y-2 text-sm">
        <Switch off="السور" on="الأزواج" checked={mode === 'pairs'} onChange={on => setMode(on ? 'pairs' : 'surahs')} offIcon={faListOl} onIcon={faShuffle} />
        <Switch off="ترتيب بالعدد" on="ترتيب بالرقم" checked={sort === 'number'} onChange={on => setSort(on ? 'number' : 'count')} offIcon={faArrowDownWideShort} onIcon={faArrowDown19} />
      </div>
      <ol className="flex flex-col max-h-[min(70vh,40rem)] overflow-y-auto">
        {sorted.map((r, i) => (
          <li key={r.key}>
            <button type="button" onClick={() => onPick(r.pick)} aria-current={pick?.s === r.pick.s && pick?.t === r.pick.t}
              className="w-full flex items-baseline gap-2 px-2 py-1 text-start rounded hover:bg-amber-100 dark:hover:bg-white/10 aria-[current=true]:bg-amber-100 dark:aria-[current=true]:bg-white/10">
              <span className={`${NOTE} w-6 shrink-0`}>{num(i + 1)}</span>
              <span className="flex-1">{r.label}</span>
              <span className="text-amber-700 dark:text-amber-300">{num(r.words)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RepetitionView({ data }: { data: Repetition }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const valid = (v: string | null) => {
    const n = Number(v);
    return v !== null && Number.isInteger(n) && n >= 1 && n <= data.surahs.length ? n : null;
  };
  const s = valid(params.get('s'));
  const t = valid(params.get('t'));
  const pick: Pick | null = s === null ? null : { s, t: t === s ? null : t };

  const totals = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of data.cells) {
      map.set(c.a, (map.get(c.a) ?? 0) + c.words);
      if (c.a !== c.b) map.set(c.b, (map.get(c.b) ?? 0) + c.words);
    }
    return map;
  }, [data]);

  const go = (p: Pick) => router.replace(`${pathname}?s=${p.s}${p.t ? `&t=${p.t}` : ''}`, { scroll: false });
  const crossSurahs = new Set(data.cells.filter(c => c.a !== c.b).flatMap(c => [c.a, c.b]));

  return (
    <div dir="rtl" className="w-full p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">القرآن: تكرار العبارات</h1>
        <p className={NOTE}>
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. يدل التطابق على اشتراك اللفظ وحده. تُحصى العبارة المتكررة داخل السورة وما تشترك فيه السور من نصوص، والخلية تعدّ الكلمات المكررة.
        </p>
        <Button size="sm" variant="outline" href="/quran/order" className="mt-3">
          <FontAwesomeIcon icon={faListOl} />
          ترتيب السور: من النبأ إلى الناس
        </Button>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Tile value={data.surahs.length} label="سورة" />
        <Tile value={data.within.length} label="عبارة تتكرر داخل سورة" />
        <Tile value={data.across.length} label="نص مشترك بين سور" />
        <Tile value={crossSurahs.size} label="سورة فيها نص مشترك" />
      </section>

      <section className={PANEL}>
        <h2 className="text-2xl mb-1">مصفوفة السور</h2>
        <p className={`${NOTE} mb-2`}>السور بترتيب المصحف. القطر لما تكرر داخل السورة نفسها، وما خارجه لما تشترك فيه سورتان. اضغط على خلية أو عمود، أو اختر من القائمة.</p>
        <div className="grid lg:grid-cols-[1fr_18rem] gap-4">
          <div className="flex flex-col gap-2">
            <RepetitionMatrix data={data} totals={totals} pick={pick} onPick={go} />
            <Legend />
          </div>
          <Ranked data={data} totals={totals} pick={pick} onPick={go} />
        </div>
      </section>

      {!pick && <p className={NOTE}>اختر سورة أو خلية لعرض المواضع.</p>}
      {pick && pick.t === null && (
        <>
          <Within key={pick.s} data={data} surah={data.surahs[pick.s - 1]} />
          <Partners data={data} surah={pick.s} onPick={go} />
        </>
      )}
      {pick && pick.t !== null && <PairView key={`${pick.s}:${pick.t}`} data={data} s={pick.s} t={pick.t} />}
    </div>
  );
}
