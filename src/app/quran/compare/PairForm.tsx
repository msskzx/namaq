'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Expand } from 'lucide-react';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import { num } from '@/lib/quran/arabicNumber';
import { NOTE } from '../panel';
import SurahPicker from './SurahPicker';

type Surah = { number: number; name: string };
type Side = { surah: number; from: number; to: number; max: number };
type Pair = { a: Side; b: Side };

const span = (s: Side) => (s.from === s.to ? num(s.from) : `${num(s.from)}–${num(s.to)}`);

export default function PairForm({ surahs, a, b, ayat, keep }: { surahs: Surah[]; a: Side; b: Side; ayat: boolean; keep: Record<string, string> }) {
  const router = useRouter();
  const [pair, setPair] = useState<Pair>({ a, b });
  const shown = JSON.stringify({ a, b });
  const [seen, setSeen] = useState(shown);
  if (seen !== shown) {
    setSeen(shown);
    setPair({ a, b });
  }
  const name = (n: number) => surahs.find(s => s.number === n)?.name ?? '';
  const apply = (next: Pair, whole: Partial<Record<'a' | 'b', boolean>> = {}) => {
    setPair(next);
    const params = new URLSearchParams({ a: String(next.a.surah), b: String(next.b.surah) });
    if (ayat) for (const key of ['a', 'b'] as const) {
      if (whole[key]) continue;
      params.set(`${key}f`, String(next[key].from));
      params.set(`${key}t`, String(next[key].to));
    }
    for (const [key, value] of Object.entries(keep)) params.set(key, value);
    router.push(`/quran/compare?${params}`, { scroll: false });
  };
  const side = (key: 'a' | 'b', title: string, which: string) => {
    const s = pair[key];
    const set = (patch: Partial<Side>, whole = false) => apply({ ...pair, [key]: { ...s, ...patch } }, { [key]: whole });
    return (
      <fieldset data-range-navigation className="flex flex-wrap items-center gap-2">
        <legend className="sr-only">{title}</legend>
        <SurahPicker name={key} label={title} value={s.surah} surahs={surahs.map(x => ({ number: x.number, name: x.name }))} onChange={surah => set({ surah }, true)} />
        {ayat && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--home-muted)]">
            <span className="flex items-center gap-2">
              من
              <NumberInput label={`من آية (${which})`} value={s.from} min={1} max={s.max} onChange={from => set({ from, to: Math.max(from, s.to) })} />
            </span>
            <span className="flex items-center gap-2">
              إلى
              <NumberInput label={`إلى آية (${which})`} value={s.to} min={1} max={s.max} onChange={to => set({ to, from: Math.min(to, s.from) })} />
            </span>
            <Button size="sm" aria-label={`الكل: آيات ${title}`} className="shrink-0" onClick={() => set({ from: 1, to: s.max }, true)}>
              <Expand size={14} aria-hidden />
              الكل
            </Button>
          </div>
        )}
      </fieldset>
    );
  };
  return (
    <details className="group rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper-deep)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm [&::-webkit-details-marker]:hidden">
        <span className={NOTE}>{ayat ? `${name(a.surah)} ${span(a)} · ${name(b.surah)} ${span(b)}` : `${name(a.surah)} · ${name(b.surah)}`}</span>
        <span className="flex items-center gap-1 text-[var(--home-accent)]">
          {ayat ? 'تحديد السورتين والآيات' : 'تحديد السورتين'}
          <ChevronDown size={16} aria-hidden className="transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-[var(--home-rule)] p-3">
        {side('a', 'السورة الأولى', 'الأولى')}
        {side('b', 'السورة الثانية', 'الثانية')}
      </div>
    </details>
  );
}
