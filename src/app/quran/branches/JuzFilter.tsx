'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import Button from '@/components/common/Button';
import NumberInput from '@/components/common/NumberInput';
import { useLanguage } from '@/components/language/LanguageContext';
import { branchesHref, type BranchesView } from '@/lib/quran/branches';
import { JUZ_STARTS, type JuzRange } from '@/lib/quran/juz';
import { useNavigatingRouter } from '@/components/common/NavigationLoader';

export default function JuzFilter({ range, phrase, view }: { range: JuzRange | null; phrase: string; view: BranchesView }) {
  const { language } = useLanguage();
  const router = useNavigatingRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const route = `${pathname}?${params.toString()}`;
  const applied = `${range?.from ?? 1}-${range?.to ?? JUZ_STARTS.length}`;
  const [draft, setDraft] = useState(() => [String(range?.from ?? 1), String(range?.to ?? JUZ_STARTS.length)]);
  const latest = useRef(draft);
  const editedAt = useRef<string | null>(null);
  const submitted = useRef<{ range: string; draft: string[] } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousApplied = useRef(applied);
  const previousRoute = useRef(route);
  const ar = language === 'ar';
  const from = Number(draft[0]);
  const to = Number(draft[1]);
  const valid = draft.every(value => value.trim() !== '' && Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= JUZ_STARTS.length) && from <= to;
  const changed = `${from}-${to}` !== applied;
  const cancel = () => clearTimeout(timer.current);

  useEffect(() => {
    if (previousApplied.current === applied && previousRoute.current === route) return;
    previousApplied.current = applied;
    previousRoute.current = route;
    const ownUpdate = submitted.current?.range === applied;
    const newerDraft = ownUpdate && latest.current.some((value, index) => value !== submitted.current!.draft[index]);
    if (!newerDraft) {
      const next = [String(range?.from ?? 1), String(range?.to ?? JUZ_STARTS.length)];
      latest.current = next;
      setDraft(next);
      editedAt.current = null;
    } else editedAt.current = route;
    submitted.current = null;
  }, [applied, range, route]);

  useEffect(() => {
    if (!valid || !changed || editedAt.current !== route) return;
    timer.current = setTimeout(() => {
      submitted.current = { range: `${from}-${to}`, draft: [...draft] };
      editedAt.current = null;
      router.replace(branchesHref(phrase, { from, to }, { ...view, page: 1 }), { scroll: false });
    }, 350);
    return cancel;
  }, [draft, valid, changed, route, from, to, phrase, view, router]);

  useEffect(() => {
    const navigating = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href], [data-branch-navigation]')) {
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
    window.addEventListener('popstate', cancel);
    return () => { document.removeEventListener('keydown', keyboardNavigation, true); document.removeEventListener('click', navigating, true); window.removeEventListener('popstate', cancel); cancel(); };
  }, []);

  const update = (index: number, value: string) => {
    cancel();
    editedAt.current = route;
    const next = latest.current.map((old, i) => i === index ? value : old);
    latest.current = next;
    setDraft(next);
  };
  const label = (index: number) => ar ? (index === 0 ? 'من الجزء' : 'إلى الجزء') : (index === 0 ? 'From juz' : 'To juz');
  return (
    <form onSubmit={event => event.preventDefault()} aria-label={ar ? 'نطاق الأجزاء' : 'Juz range'} className="flex flex-wrap items-center gap-3 text-sm">
      {[0, 1].map(index => (
        <span key={index} className="flex items-center gap-2">
          {label(index)}
          <NumberInput name={index === 0 ? 'juzFrom' : 'juzTo'} label={label(index)} iconFamily="lucide" draftValue={draft[index]} onDraftChange={value => update(index, value)} min={1} max={JUZ_STARTS.length} />
        </span>
      ))}
      {range && <Button size="sm" href={branchesHref(phrase, undefined, { ...view, page: 1 })} onClick={cancel}>
        <RotateCcw size={16} aria-hidden />
        {ar ? 'كل الأجزاء' : 'All juz'}
      </Button>}
      {!valid && <p role="status" className="w-full text-sm text-[var(--home-muted)]">{ar
        ? `أدخل جزأين من ١ إلى ٣٠، على أن تكون البداية قبل النهاية أو مساوية لها. النتائج المعروضة ما زالت للأجزاء ${range?.from ?? 1} إلى ${range?.to ?? 30}.`
        : `Enter whole numbers from 1 to 30, with From no greater than To. Results still show juz ${range?.from ?? 1} to ${range?.to ?? 30}.`}</p>}
    </form>
  );
}
