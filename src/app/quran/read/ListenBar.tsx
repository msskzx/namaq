'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, Pause, Play, Repeat, X } from 'lucide-react';
import { num } from '@shared/quran/arabicNumber';
import { EACH_AYAH, LISTEN_REFERENCE, ONCE, PAUSES, RANGE_TIMES, RECITERS, RIWAYA, SPEEDS, pauseLabel, reciterName, reciterOf, speedLabel, surahEnd, timesLabel, type Range, type RepeatPlan } from '@shared/quran/recitation';
import { readListenPlan, readReciter, serverListenPlan, serverReciter, subscribeListenPlan, subscribeReciter, writeListenPlan, writeReciter } from '@shared/listenSettings';
import Button from '@/components/common/Button';
import Reference from '@/components/common/Reference';
import { useSwipeClose } from '@/components/common/useSwipeClose';
import { applyReciter, applySpeed, ayahCounts, listen, stopListening, togglePlaying, useListening } from '@/lib/listen';
import styles from './Mushaf.module.css';
import { surahName } from '@shared/quran/surahNames';

const named = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${surahName(surah)} ${num(ayah)}`; };
const rangeText = (from: string, to: string) =>
  from.split(':')[0] === to.split(':')[0] ? `من ${named(from)} إلى ${num(Number(to.split(':')[1]))}` : `من ${named(from)} إلى ${named(to)}`;
const usePlan = () => useSyncExternalStore(subscribeListenPlan, readListenPlan, serverListenPlan);

function Chips<T>({ title, values, current, label, onPick }: { title: string; values: T[]; current: T; label: (value: T) => string; onPick: (value: T) => void }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="pb-2 text-sm text-[var(--home-muted)]">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {values.map(value => (
          <Button key={String(value)} size="sm" variant="outline" active={value === current} aria-pressed={value === current} onClick={() => onPick(value)} className="min-w-11 rounded-full">
            {label(value)}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

/** One end of the range: the surah's ayah numbers to pick from. */
function RangeEnd({ label, value, onPick }: { label: string; value: string; onPick: (key: string) => void }) {
  const [surah, ayah] = value.split(':').map(Number);
  return (
    <label className="flex flex-1 items-center gap-2 rounded-[var(--card-radius)] border border-[var(--home-rule)] bg-[var(--home-card)] px-3">
      <span className="sr-only">{label}</span>
      <span className="shrink-0">{surahName(surah)}</span>
      <select value={ayah} onChange={event => onPick(`${surah}:${event.target.value}`)} className="h-10 flex-1 appearance-none bg-transparent">
        {Array.from({ length: ayahCounts.get(surah) ?? 0 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{num(n)}</option>)}
      </select>
      <ChevronDown size={16} aria-hidden className="text-[var(--home-muted)]" />
    </label>
  );
}

/**
 * Listening's sheet (the app's ListenSheet.tsx): the range and its repeats, the speed, then the reciter.
 * The website keeps no downloads; it streams each ayah.
 */
export function ListenSheet({ start, onClose }: { start: string | null; onClose: () => void }) {
  const sheet = useRef<HTMLDialogElement>(null);
  const listening = useListening();
  const plan = usePlan();
  const reciter = useSyncExternalStore(subscribeReciter, readReciter, serverReciter);
  const [view, setView] = useState<'repeat' | 'reciters'>('repeat');
  const [picked, setPicked] = useState<Range | null>(null);
  const open = start !== null;
  useEffect(() => {
    const dialog = sheet.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useSwipeClose(sheet, open, { direction: 'down', onClose: () => sheet.current?.close() });
  const base = listening?.range ?? (start ? { from: start, to: surahEnd(start, ayahCounts) } : null);
  const range = picked ?? base;
  const change = (next: Partial<RepeatPlan>) => { writeListenPlan({ ...plan, ...next }); if (next.speed) applySpeed(); };
  return (
    <dialog ref={sheet} aria-label="الاستماع" onClose={() => { setView('repeat'); setPicked(null); onClose(); }} onClick={event => { if (event.target === sheet.current) sheet.current?.close(); }}
      dir="rtl" lang="ar" className="m-0 mx-auto mt-auto max-h-[85dvh] w-full max-w-lg rounded-t-[22px] border-0 bg-[var(--home-paper)] p-0 text-[var(--home-ink)] backdrop:bg-[var(--home-backdrop)]">
      {open && <div className="flex max-h-[85dvh] flex-col gap-4 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-[var(--home-rule)]" />
        {view === 'repeat' ? <>
          <div className="flex items-center gap-2">
            <h2 className="flex-1 text-lg font-normal">الاستماع</h2>
            {range && <Button size="icon" variant="primary" aria-label="استمع إلى المقطع" title="استمع إلى المقطع" className="rounded-full" onClick={() => { listen(range.from, range.to); sheet.current?.close(); }}>
              <Play aria-hidden fill="currentColor" />
            </Button>}
          </div>
          {range && <fieldset className="flex flex-col gap-2">
            <legend className="pb-2 text-sm text-[var(--home-muted)]">المقطع</legend>
            <div className="flex items-center gap-2">
              <RangeEnd label="من" value={range.from} onPick={from => setPicked({ from, to: range.to.split(':')[0] === from.split(':')[0] ? range.to : surahEnd(from, ayahCounts) })} />
              <span className="text-sm text-[var(--home-muted)]">إلى</span>
              <RangeEnd label="إلى" value={range.to} onPick={to => setPicked({ ...range, to })} />
            </div>
          </fieldset>}
          <Chips title="كرّر كل آية" values={EACH_AYAH} current={plan.eachAyah} label={timesLabel} onPick={eachAyah => change({ eachAyah })} />
          <Chips title="ثم كرّر المقطع كله" values={RANGE_TIMES} current={plan.rangeTimes} label={timesLabel} onPick={rangeTimes => change({ rangeTimes })} />
          <Chips title="مهلة بعد كل آية لتردّدها" values={PAUSES} current={plan.pause} label={pauseLabel} onPick={pause => change({ pause })} />
          <Chips title="السرعة" values={SPEEDS} current={plan.speed} label={speedLabel} onPick={speed => change({ speed })} />
          <hr className="border-[var(--home-rule)]" />
          <button type="button" onClick={() => setView('reciters')} className="flex items-center gap-3 text-start">
            <span className="flex flex-1 flex-col">
              <span>{reciterName(reciterOf(reciter))}</span>
              <span className="text-sm text-[var(--home-muted)]">{RIWAYA}</span>
            </span>
            <ChevronDown size={18} aria-hidden className="rotate-90 text-[var(--home-muted)]" />
          </button>
        </> : <>
          <h2 className="text-lg font-normal">القارئ</h2>
          <div role="radiogroup" aria-label="القارئ" className="flex flex-col">
            {RECITERS.map(item => (
              <button key={item.id} type="button" role="radio" aria-checked={item.id === reciter} onClick={() => { writeReciter(item.id); applyReciter(item.id); }} className="flex items-center gap-3 py-2 text-start">
                <span className="w-5">{item.id === reciter && <Check size={20} aria-hidden className="text-[var(--home-accent)]" />}</span>
                <span className="flex flex-1 flex-col">
                  <span>{reciterName(item)}</span>
                  <span className="text-sm text-[var(--home-muted)]">{RIWAYA}</span>
                </span>
              </button>
            ))}
          </div>
          <Reference title={LISTEN_REFERENCE.title} quotes={LISTEN_REFERENCE.quotes} />
        </>}
      </div>}
    </dialog>
  );
}

/** The recitation playing, a frosted bar over the bottom of the mushaf (the app's ListenBar.tsx). */
export default function ListenBar({ onRepeat, above = false }: { onRepeat: () => void; above?: boolean }) {
  const listening = useListening();
  const plan = usePlan();
  if (!listening) return null;
  const repeating = plan.eachAyah !== ONCE.eachAyah || plan.rangeTimes !== ONCE.rangeTimes || plan.pause !== ONCE.pause;
  return (
    <div className={styles.reciteBar} data-listen data-above={above || undefined}>
      <div role="toolbar" aria-label="الاستماع" dir="rtl" className={styles.listenBar}>
        <Button size="icon" variant="primary" className="rounded-full" aria-label={listening.playing ? 'إيقاف مؤقت' : 'استمع'} title={listening.playing ? 'إيقاف مؤقت' : 'استمع'} onClick={togglePlaying}>
          {listening.playing ? <Pause aria-hidden fill="currentColor" /> : <Play aria-hidden fill="currentColor" />}
        </Button>
        <Button size="lg" variant="muted" aria-label="التكرار والقارئ" title="التكرار والقارئ" aria-pressed={repeating} onClick={onRepeat}>
          <Repeat aria-hidden className={repeating ? 'text-[var(--home-accent)]' : undefined} />
        </Button>
        <button type="button" onClick={onRepeat} className="flex min-w-0 flex-1 flex-col text-start leading-tight">
          <span className="truncate">{named(listening.key)}</span>
          <span className="truncate text-xs text-[var(--home-muted)]">{`${reciterOf(listening.reciter).name} · ${rangeText(listening.keys[0], listening.keys[listening.keys.length - 1])}`}</span>
        </button>
        <Button size="lg" variant="muted" aria-label="أوقف الاستماع" title="أوقف الاستماع" onClick={stopListening}><X aria-hidden /></Button>
      </div>
    </div>
  );
}
