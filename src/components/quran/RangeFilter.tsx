'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import type { JuzRange } from '@/lib/quran/juz';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

export const NAVIGATING = 'range-filter:navigating';
export const announceNavigation = () => document.dispatchEvent(new Event(NAVIGATING));

export type RangeLabels = { from: string; to: string; all: string; form: string; invalid: (range: JuzRange) => string };

export default function RangeFilter({ range, max, names, href, labels }: { range: JuzRange | null; max: number; names: [string, string]; href: (range?: JuzRange) => string; labels: RangeLabels }) {
  const router = useNavigatingRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const route = `${pathname}?${params.toString()}`;
  const applied = `${range?.from ?? 1}-${range?.to ?? max}`;
  const [draft, setDraft] = useState(() => [String(range?.from ?? 1), String(range?.to ?? max)]);
  const latest = useRef(draft);
  const editedAt = useRef<string | null>(null);
  const submitted = useRef<{ range: string; draft: string[] } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousApplied = useRef(applied);
  const previousRoute = useRef(route);
  const hrefFor = useRef(href);
  hrefFor.current = href;
  const from = Number(draft[0]);
  const to = Number(draft[1]);
  const valid = draft.every(value => value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= max) && from <= to;
  const changed = `${from}-${to}` !== applied;
  const cancel = () => clearTimeout(timer.current);

  useEffect(() => {
    if (previousApplied.current === applied && previousRoute.current === route) return;
    previousApplied.current = applied;
    previousRoute.current = route;
    const ownUpdate = submitted.current?.range === applied;
    const newerDraft = ownUpdate && latest.current.some((value, index) => value !== submitted.current!.draft[index]);
    if (!newerDraft) {
      const next = [String(range?.from ?? 1), String(range?.to ?? max)];
      latest.current = next;
      setDraft(next);
      editedAt.current = null;
    } else editedAt.current = route;
    submitted.current = null;
  }, [applied, range, route, max]);

  useEffect(() => {
    if (!valid || !changed || editedAt.current !== route) return;
    timer.current = setTimeout(() => {
      submitted.current = { range: `${from}-${to}`, draft: [...draft] };
      editedAt.current = null;
      router.replace(hrefFor.current({ from, to }), { scroll: false });
    }, 350);
    return cancel;
  }, [draft, valid, changed, route, from, to, router]);

  useEffect(() => {
    const navigating = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href], [data-branch-navigation], [data-range-navigation]')) {
        cancel();
        editedAt.current = null;
      }
    };
    const keyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof Element && event.target.getAttribute('role') === 'combobox') {
        cancel();
        editedAt.current = null;
      }
    };
    document.addEventListener('keydown', keyboardNavigation, true);
    document.addEventListener('click', navigating, true);
    const elsewhere = () => {
      cancel();
      editedAt.current = null;
    };
    window.addEventListener('popstate', cancel);
    document.addEventListener(NAVIGATING, elsewhere);
    return () => { document.removeEventListener('keydown', keyboardNavigation, true); document.removeEventListener('click', navigating, true); window.removeEventListener('popstate', cancel); document.removeEventListener(NAVIGATING, elsewhere); cancel(); };
  }, []);

  const update = (index: number, value: string) => {
    cancel();
    editedAt.current = route;
    const next = latest.current.map((old, i) => i === index ? value : old);
    latest.current = next;
    setDraft(next);
  };
  const label = (index: number) => (index === 0 ? labels.from : labels.to);
  return (
    <form onSubmit={event => event.preventDefault()} aria-label={labels.form} className="flex flex-wrap items-center gap-3 text-sm">
      {[0, 1].map(index => (
        <span key={index} className="flex items-center gap-2">
          {label(index)}
          <NumberInput name={names[index]} label={label(index)} iconFamily="lucide" draftValue={draft[index]} onDraftChange={value => update(index, value)} min={1} max={max} />
        </span>
      ))}
      {range && <Button size="sm" href={href()} onClick={cancel}>
        <RotateCcw size={16} aria-hidden />
        {labels.all}
      </Button>}
      {!valid && <p role="status" className="w-full text-sm text-[var(--home-muted)]">{labels.invalid(range ?? { from: 1, to: max })}</p>}
    </form>
  );
}
