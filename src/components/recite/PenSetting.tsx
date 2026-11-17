'use client';

import Button from '@/components/common/Button';
import { setPenRule, setQuizPen, usePenRule, useQuizPenSetting } from '@/lib/penRule';
import type { PenRule } from '@shared/quran/writeAyah';

/** What the recite bar's pen asks to write, by rule (shared/quran/writeAyah.ts penTargets). */
export const PEN_NAMES: Record<PenRule, { ar: string; en: string }> = {
  ends: { ar: 'أول الآية وآخرها', en: 'First and last words' },
  whole: { ar: 'الآية كاملة', en: 'The whole ayah' },
};
const RULES = Object.keys(PEN_NAMES) as PenRule[];

/** The pen rule for the mushaf and the home card (owner, 2026-11-17: a setting, the whole ayah by default; the app's PenSetting). */
export function PenSetting({ ar }: { ar: boolean }) {
  const rule = usePenRule();
  const label = ar ? 'الكتابة بالقلم في التسميع' : 'Writing with the pen while reciting';
  return <div className="flex flex-col gap-2">
    <span aria-hidden className="text-sm text-[var(--home-muted)]">{label}</span>
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {RULES.map(value => <Button key={value} size="sm" active={rule === value} aria-pressed={rule === value} onClick={() => setPenRule(value)}>{PEN_NAMES[value][ar ? 'ar' : 'en']}</Button>)}
    </div>
  </div>;
}

/** A quiz's own pen rule, or the one in settings. */
export function QuizPenSetting({ ar }: { ar: boolean }) {
  const rule = useQuizPenSetting();
  const label = ar ? 'الكتابة بالقلم' : 'Writing with the pen';
  return <div role="group" aria-label={label} className="flex basis-full flex-col gap-1.5">
    <span aria-hidden className="text-sm font-semibold text-[var(--home-ink)]">{label}</span>
    <div className="flex flex-wrap gap-2">
      <Button size="sm" active={rule === 'same'} aria-pressed={rule === 'same'} onClick={() => setQuizPen('same')}>{ar ? 'كما في الإعدادات' : 'As in settings'}</Button>
      {RULES.map(value => <Button key={value} size="sm" active={rule === value} aria-pressed={rule === value} onClick={() => setQuizPen(value)}>{PEN_NAMES[value][ar ? 'ar' : 'en']}</Button>)}
    </div>
  </div>;
}
