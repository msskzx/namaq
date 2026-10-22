'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen, RotateCcw, TextSearch, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import PageSpread, { type SpreadMark } from '@/components/quran/PageSpread';
import { num } from '@/lib/quran/arabicNumber';
import type { AyahContext } from '@/lib/quran/ayahContext';
import styles from './AyahContext.module.css';

async function loadContext(url: string): Promise<AyahContext[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load ayah context');
  return response.json();
}

// docs/plans/quran-shared-openings.md
export default function AyahContextButton({ children, ayahKeys, differentWords, names, references, leaf = false }: { leaf?: boolean; references?: React.ReactNode; children: React.ReactNode; ayahKeys: string[]; differentWords: number[]; names: Record<number, string> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const ar = language === 'ar';
  const differing = differentWords.length > 0;
  const label = differing ? (ar ? 'عرض اختلافات الضبط والسياق' : 'View spelling differences and context') : (ar ? 'عرض الآيات في سياقها' : 'View ayat in context');
  const title = differing ? (ar ? 'اختلافات الضبط والسياق' : 'Spelling differences and context') : (ar ? 'الآيات في سياقها' : 'Ayat in context');
  const url = `/api/quran/context?${new URLSearchParams({ q: ayahKeys.join(',') })}`;
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

  return (
    <>
      {children}
      <span className="mt-1 flex flex-wrap items-center gap-2" dir="rtl">
        <Button size="sm" className="max-w-full" variant={leaf ? 'ghost' : differing ? 'highlight' : 'outline'} aria-label={leaf && references ? undefined : label} aria-labelledby={leaf && references ? `${titleId}-action ${titleId}-refs` : undefined} title={label} aria-haspopup="dialog" onClick={() => { setOpen(true); dialog.current?.showModal(); }}>
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
          <div><h2 id={titleId}>{title}</h2><p className={styles.note}>{ar ? 'الآية المقصودة بارزة، وقبلها آية وبعدها آية من السورة نفسها، إن وُجدتا.' : 'The matching ayah is emphasized, with the preceding and following ayat from the same surah when available.'}</p>{differing && <p className={styles.note}>{ar ? 'الكلمات الملوّنة تختلف في علامات الضبط. النص كما ورد في كل آية.' : 'Highlighted words differ in their marks. Each ayah keeps its original text.'}</p>}</div>
          <Button size="icon" aria-label={ar ? 'إغلاق' : 'Close'} onClick={() => dialog.current?.close()}><X size={18} aria-hidden /></Button>
        </div>
        {open && isLoading && <p role="status">{ar ? 'جارٍ تحميل الآيات…' : 'Loading ayat…'}</p>}
        {open && error && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="sm" onClick={() => void mutate()}><RotateCcw size={16} aria-hidden />{ar ? 'إعادة المحاولة' : 'Try again'}</Button></div>}
        {open && data && <div className={styles.cards}>{data.map(context => {
          const [surah, number] = context.ayah.key.split(':').map(Number);
          const name = names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`);
          const rows = [context.before, context.ayah, context.after].flatMap(ayah => {
            if (!ayah) return [];
            const offset = ayah === context.ayah ? 0 : ayah === context.after ? context.ayah.words.length + 1 : -Infinity;
            const marks: Record<number, SpreadMark> = Object.fromEntries(ayah.words.flatMap((_, i) => differentWords.includes(offset + i) ? [[i, { kind: 'exact', title: ar ? 'اختلاف في علامات الضبط' : 'Differing marks' }]] : []));
            return [[{ number: Number(ayah.key.split(':')[1]), words: ayah.words, current: ayah === context.ayah, marks }]];
          });
          return <article key={context.ayah.key} className={styles.card} aria-label={`${name} ${ar ? num(number) : number}`}>
            <PageSpread pages={[{ title: name, subtitle: ar ? `الآية ${num(number)} في سياقها` : `Ayah ${number} in context`, rows }]} />
            <Button size="sm" className="self-start" href={`/quran/read/${context.ayah.page}?a=${context.ayah.key}`}><BookOpen size={16} aria-hidden />{ar ? 'قراءة الآية' : 'Read ayah'}</Button>
          </article>;
        })}</div>}
      </dialog>
    </>
  );
}
