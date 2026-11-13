'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BookOpenCheck, Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import Toggle from '@/components/common/Toggle';
import Segmented from '@/components/common/Segmented';
import { memorizedPrefer, memorizedQuestions, readMemorized, readMemorizedAsked, serverMemorized, serverMemorizedAsked, setMemorizedAsked, subscribeMemorized, subscribeMemorizedAsked, writeMemorized, type Memorized } from '@shared/memorized';
import { num } from '@shared/quran/arabicNumber';
import surahRows from '@shared/data/quran/surahs.json';

/**
 * «ما أحفظه» on the website, as the app's (mobile/src/components/Memorized.tsx): the range picker, the settings section
 * with its two preferences, and the home card that asks once. Kept in this browser only, never shown or counted.
 */

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
export const useMemorized = () => useSyncExternalStore(subscribeMemorized, readMemorized, serverMemorized);

/** A short line for what is picked: «القرآن كله», «الأجزاء ٢٧، ٢٨…», or a nudge while nothing is picked. */
export function memorizedLabel(memorized: Memorized | null) {
  if (!memorized) return 'لم تختر بعد';
  if ('all' in memorized) return 'القرآن كله';
  const picked = memorized.unit === 'juz' ? memorized.picked.map(num) : memorized.picked.map(n => names[n] ?? num(n));
  return `${memorized.unit === 'juz' ? 'الأجزاء' : 'السور'} ${picked.join('، ')}`;
}

const cell = (on: boolean) => (on ? 'border-[var(--home-accent)] bg-[var(--home-accent)] text-[var(--home-paper)]' : 'border-[var(--home-rule)] text-[var(--home-ink)]');

function Row({ label, on, onChange }: { label: string; on: boolean; onChange: (on: boolean) => void }) {
  return <div className="flex min-h-11 items-center gap-3">
    <span className="flex-1 text-[var(--home-ink)]">{label}</span>
    <Toggle checked={on} label={label} onChange={onChange} />
  </div>;
}

/** Picking what is memorized: juz or surahs, any number of them, or the whole Quran; each click is kept at once. */
export function MemorizedPicker() {
  const memorized = useMemorized();
  const [unit, setUnit] = useState<'juz' | 'surah'>(() => (memorized && 'unit' in memorized ? memorized.unit : 'juz'));
  // The grid follows what is kept (another picker may have changed it); the last juz or surahs come back when «القرآن كله» is switched off.
  const last = useRef(memorized && 'unit' in memorized ? memorized : null);
  useEffect(() => { if (memorized && 'unit' in memorized) { last.current = memorized; setUnit(memorized.unit); } }, [memorized]);
  const all = !!memorized && 'all' in memorized;
  const picked = memorized && 'unit' in memorized && memorized.unit === unit ? memorized.picked : [];
  const toggle = (n: number) => {
    const next = picked.includes(n) ? picked.filter(p => p !== n) : [...picked, n];
    writeMemorized(next.length ? { unit, picked: next } : null);
    setMemorizedAsked();
  };
  return <div className="flex flex-col gap-3" dir="rtl">
    <Row label="القرآن كله" on={all} onChange={on => { writeMemorized(on ? { all: true } : last.current); setMemorizedAsked(); }} />
    {!all && <>
      <Segmented label="أختار" className="w-full [&>*]:flex-1" options={(['juz', 'surah'] as const).map(value => ({ key: value, label: value === 'juz' ? 'الأجزاء' : 'السور', current: unit === value, onClick: () => setUnit(value) }))} />
      {unit === 'juz' ? <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(n => {
          const on = picked.includes(n);
          return <button key={n} type="button" role="checkbox" aria-checked={on} aria-label={`الجزء ${num(n)}`} onClick={() => toggle(n)}
            className={`h-11 rounded-[10px] border text-lg ${cell(on)}`}>{num(n)}</button>;
        })}
      </div> : <div className="h-72 overflow-y-auto overscroll-contain rounded-[10px] border border-[var(--home-rule)]">
        {Array.from({ length: 114 }, (_, i) => i + 1).map(n => {
          const on = picked.includes(n);
          return <button key={n} type="button" role="checkbox" aria-checked={on} aria-label={names[n]} onClick={() => toggle(n)}
            className="flex w-full items-center gap-3 border-b border-[var(--home-paper-deep)] px-3 py-2.5 text-start">
            <span className="w-8 text-center text-sm text-[var(--home-muted)]">{num(n)}</span>
            <span className="flex-1 text-[var(--home-ink)]">{names[n]}</span>
            <span aria-hidden className={`grid size-[22px] place-items-center rounded-md border ${cell(on)}`}>{on && <Check size={16} />}</span>
          </button>;
        })}
      </div>}
    </>}
    <p className="text-sm text-[var(--home-muted)]">لا يُعرض هذا لأحد، ولا يُحسب منه شيء.</p>
  </div>;
}

/** The settings section «ما أحفظه»: what is picked (click to change), and the two preferences that use it. */
export function MemorizedSetting() {
  const memorized = useMemorized();
  const [open, setOpen] = useState(false);
  const questions = useSyncExternalStore(memorizedQuestions.subscribe, memorizedQuestions.read, memorizedQuestions.server);
  const prefer = useSyncExternalStore(memorizedPrefer.subscribe, memorizedPrefer.read, memorizedPrefer.server);
  const label = memorizedLabel(memorized);
  return <div className="flex flex-col gap-1" dir="rtl">
    <button type="button" aria-expanded={open} aria-label={`ما أحفظه: ${label}`} onClick={() => setOpen(value => !value)} className="flex items-center gap-3 py-1.5 text-start">
      <BookOpenCheck size={20} aria-hidden className="text-[var(--home-accent)]" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[var(--home-ink)]">ما أحفظه</span>
        <span className="truncate text-sm text-[var(--home-muted)]">{label}</span>
      </span>
      {open ? <ChevronUp size={18} aria-hidden /> : <ChevronDown size={18} aria-hidden />}
    </button>
    {open && <MemorizedPicker />}
    <Row label="الأسئلة مما أحفظ فقط" on={questions} onChange={memorizedQuestions.write} />
    <Row label="قدّم ما أحفظه في التأمل" on={prefer} onChange={memorizedPrefer.write} />
  </div>;
}

/** The home card that asks once what is memorized; «اختر» opens the picker in the card, × closes it for good (settings keep the choice). */
export function MemorizedPrompt() {
  const memorized = useMemorized();
  const asked = useSyncExternalStore(subscribeMemorizedAsked, readMemorizedAsked, serverMemorizedAsked);
  const [picking, setPicking] = useState(false);
  if ((asked || memorized) && !picking) return null;
  const done = () => { setPicking(false); setMemorizedAsked(); };
  return <section aria-labelledby="memorized-title" dir="rtl" className="flex flex-col gap-2 rounded-[14px] border border-dashed border-[var(--home-rule)] bg-[var(--home-card)] p-3">
    <div className="flex items-center gap-2">
      <BookOpenCheck size={20} aria-hidden className="text-[var(--home-accent)]" />
      <h2 id="memorized-title" className="flex-1 text-[17px] font-bold">{picking ? 'ما أحفظه' : 'ما الذي تحفظه؟'}</h2>
      {picking
        ? <button type="button" onClick={done} className="min-h-10 rounded-[10px] bg-[var(--home-accent)] px-4 text-[var(--home-paper)]">تم</button>
        : <button type="button" onClick={setMemorizedAsked} aria-label="إغلاق" title="إغلاق" className="grid size-9 place-items-center text-[var(--home-muted)]"><X size={18} aria-hidden /></button>}
    </div>
    {picking ? <MemorizedPicker /> : <>
      <p className="leading-7 text-[var(--home-muted)]">اختر ما تحفظه، لتأتيك الأسئلة منه، ويتقدّم في التأمل. تجده في الإعدادات أيضًا.</p>
      <button type="button" onClick={() => setPicking(true)} aria-label="اختر ما تحفظه" className="inline-flex min-h-10 items-center gap-1.5 self-start rounded-[10px] bg-[var(--home-accent)] px-4 text-[var(--home-paper)]">
        <Check size={18} aria-hidden />اختر
      </button>
    </>}
  </section>;
}
