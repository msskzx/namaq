'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen, RotateCcw, TextSearch, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { MatchLegend, type SpreadMark } from '@/components/quran/PageSpread';
import { ayatCount, num } from '@/lib/quran/arabicNumber';
import type { AyahContext } from '@/lib/quran/ayahContext';
import styles from './AyahContext.module.css';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const MAX_KEYS = 200;

async function loadContext(url: string): Promise<AyahContext[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load ayah context');
  return response.json();
}

export function openFromNode(event: React.MouseEvent<HTMLElement>) {
  if ((event.target as Element).closest('a, button, input, label, dialog') || window.getSelection()?.toString()) return;
  event.currentTarget.querySelector<HTMLButtonElement>('[data-context-open]')?.click();
}

// docs/plans/quran-shared-openings.md
export default function AyahContextButton({ children, ayahKeys, subject, siblings = [], spellings = [], spellingAt = 0, differentWords, names, references, leaf = false }: { leaf?: boolean; references?: React.ReactNode; children: React.ReactNode; ayahKeys: string[]; subject?: string; siblings?: string[]; spellings?: { words: string[]; keys: string[] }[]; spellingAt?: number; differentWords: number[]; names: Record<number, string> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const ar = language === 'ar';
  const differing = differentWords.length > 0;
  const label = differing ? (ar ? 'عرض اختلافات الضبط والسياق' : 'View spelling differences and context') : (ar ? 'عرض الآيات في سياقها' : 'View ayat in context');
  const title = differing ? (ar ? 'اختلافات الضبط والسياق' : 'Spelling differences and context') : (ar ? 'الآيات في سياقها' : 'Ayat in context');
  const several = new Set([...ayahKeys, ...siblings]).size > 1;
  const exactLabel = ar ? 'في كل الآيات بلفظها' : 'In every ayah, same form';
  const rootLabel = ar ? 'في كل الآيات بجذرها أو بضبط مختلف' : 'In every ayah, by root or other marks';
  const url = `/api/quran/context?${new URLSearchParams({ q: [...ayahKeys, ...siblings].slice(0, MAX_KEYS).join(',') })}`;
  const { data, error, isLoading, mutate } = useSWR<AyahContext[]>(open ? url : null, loadContext, { revalidateOnFocus: false });

  useEffect(() => {
    if (!open) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
    };
  }, [open]);

  const card = (context: AyahContext, own = false) => {
    const [surah, number] = context.ayah.key.split(':').map(Number);
    const name = names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`);
    const rows = [context.before, context.ayah, context.after].flatMap(ayah => {
      if (!ayah) return [[]];
      const target = ayah === context.ayah;
      const markAt = (i: number): SpreadMark | null => {
        if (target && context.match?.rooted.includes(i)) return { kind: 'root', title: rootLabel };
        if (target && context.match?.exact.includes(i)) return { kind: 'exact', title: exactLabel };
        return null;
      };
      const marks: Record<number, SpreadMark> = Object.fromEntries(ayah.words.flatMap((_, i) => { const mark = markAt(i); return mark ? [[i, mark]] : []; }));
      return [[{ number: Number(ayah.key.split(':')[1]), words: ayah.words, current: ayah === context.ayah, marks }]];
    });
    return <article key={context.ayah.key} className={styles.card} aria-label={`${name} ${ar ? num(number) : number}${own ? (ar ? ' · آية هذا الفرع' : ' · this branch') : ''}`}>
      <PageSpread pages={[{ title: name, subtitle: own ? (ar ? `الآية ${num(number)} · آية هذا الفرع` : `Ayah ${number} · this branch`) : (ar ? `الآية ${num(number)} في سياقها` : `Ayah ${number} in context`), rows }]} />
      <Button size="sm" className="self-start" href={`/quran/read/${context.ayah.page}?a=${context.ayah.key}`}><BookOpen size={16} aria-hidden />{ar ? 'قراءة الآية' : 'Read ayah'}</Button>
    </article>;
  };

  return (
    <>
      <span id={`${titleId}-subject`} className="contents">{children}</span>
      <span className="mt-1 flex flex-wrap items-center gap-2" dir="rtl">
        <Button data-context-open size="sm" className="max-w-full" variant={leaf ? 'ghost' : differing ? 'highlight' : 'outline'} aria-label={leaf && references ? undefined : subject ? `${label}: ${subject}` : label} aria-labelledby={leaf && references ? `${titleId}-action ${titleId}-subject ${titleId}-refs` : undefined} title={label} aria-haspopup="dialog" onClick={() => { setOpen(true); dialog.current?.showModal(); }}>
          {leaf && references && <span id={`${titleId}-action`} className="sr-only">{label}</span>}
          {leaf && differing ? <span data-differing className={styles.differenceIcon}><TextSearch size={16} aria-hidden /></span> : <TextSearch size={16} aria-hidden />}
          {leaf && references && <span id={`${titleId}-refs`}>{references}</span>}
        </Button>
        {!leaf && references}
      </span>
      <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId} dir="rtl" onClose={() => setOpen(false)} onClick={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.current?.close();
      }}>
        <div className={styles.header}>
          <div><h2 id={titleId}>{title}</h2><p className={styles.note}>{ar ? 'الآية المقصودة بارزة، وقبلها آية وبعدها آية من السورة نفسها، إن وُجدتا.' : 'The matching ayah is emphasized, with the preceding and following ayat from the same surah when available.'}</p>{differing && <p className={styles.note}>{ar ? 'النص كما ورد في كل آية.' : 'Each ayah keeps its original text.'}</p>}{several && <MatchLegend exact={exactLabel} root={rootLabel} />}</div>
          <Button size="icon" aria-label={ar ? 'إغلاق' : 'Close'} onClick={() => dialog.current?.close()}><X size={18} aria-hidden /></Button>
        </div>
        {open && isLoading && <LoadingSpinner />}
        {open && error && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="sm" onClick={() => void mutate()}><RotateCcw size={16} aria-hidden />{ar ? 'إعادة المحاولة' : 'Try again'}</Button></div>}
        {spellings.length > 0 && <section className={styles.spellings} aria-labelledby={`${titleId}-marks`}>
          <h3 id={`${titleId}-marks`}>{ar ? 'الضبط في هذه العقدة' : 'Marks in this node'}</h3>
          <ul>{spellings.map(spelling => <li key={spelling.words.join(' ')}><span className="font-arabic">{spelling.words.map((word, i) => <React.Fragment key={i}>{i > 0 && ' '}{differentWords.includes(spellingAt + i) ? <mark>{word}</mark> : word}</React.Fragment>)}</span><span className={styles.note}>{ar ? ayatCount(spelling.keys.length) : `${spelling.keys.length} ${spelling.keys.length === 1 ? 'ayah' : 'ayat'}`}</span></li>)}</ul>
        </section>}
        {open && data && several && <p className={styles.note}>{siblings.length > 0 ? (ar ? 'آيات هذا الفرع أولًا، ثم الآيات التي تلتقي معها في العقدة نفسها. ' : 'This branch\'s ayat come first, then the ayat that meet it at the same node. ') : ''}{ar ? 'تُعلَّم الكلمات الموجودة في كل الآيات المعروضة هنا فقط.' : 'Only words found in every ayah shown here are marked.'}</p>}
        {open && data && <div className={styles.cards}>
          {data.filter(context => ayahKeys.includes(context.ayah.key)).map(context => card(context, siblings.length > 0))}
          {data.filter(context => siblings.includes(context.ayah.key)).map(context => card(context))}
        </div>}
      </dialog>
    </>
  );
}
