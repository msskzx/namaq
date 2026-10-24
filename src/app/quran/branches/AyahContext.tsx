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

const MAX_KEYS = 200;

async function loadContext(url: string): Promise<AyahContext[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not load ayah context');
  return response.json();
}

// docs/plans/quran-shared-openings.md
export default function AyahContextButton({ children, ayahKeys, subject, siblings = [], spans = {}, spellings = [], spellingAt = 0, differentWords, names, references, leaf = false }: { leaf?: boolean; references?: React.ReactNode; children: React.ReactNode; ayahKeys: string[]; subject?: string; siblings?: string[]; spans?: Record<string, [number, number]>; spellings?: { words: string[]; keys: string[] }[]; spellingAt?: number; differentWords: number[]; names: Record<number, string> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const ar = language === 'ar';
  const differing = differentWords.length > 0;
  const label = differing ? (ar ? 'عرض اختلافات الضبط والسياق' : 'View spelling differences and context') : (ar ? 'عرض الآيات في سياقها' : 'View ayat in context');
  const title = differing ? (ar ? 'اختلافات الضبط والسياق' : 'Spelling differences and context') : (ar ? 'الآيات في سياقها' : 'Ayat in context');
  const url = `/api/quran/context?${new URLSearchParams({ q: [...ayahKeys, ...siblings].slice(0, MAX_KEYS).join(','), ...(siblings.length > 0 && { vs: ayahKeys[0] }) })}`;
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

  const card = (context: AyahContext, highlighted: number[], compare = false, own = false) => {
    const [surah, number] = context.ayah.key.split(':').map(Number);
    const name = names[surah] ?? (ar ? `سورة ${num(surah)}` : `Surah ${surah}`);
    const rows = [context.before, context.ayah, context.after].flatMap(ayah => {
      if (!ayah) return [];
      const offset = ayah === context.ayah ? 0 : ayah === context.after ? context.ayah.words.length + 1 : -Infinity;
      const span = spans[context.ayah.key];
      const target = compare && ayah === context.ayah;
      const markAt = (i: number): SpreadMark | null => {
        if (highlighted.includes(offset + i)) return { kind: 'root', title: ar ? 'اختلاف في علامات الضبط' : 'Differing marks' };
        if (target && context.match?.rooted.includes(i)) return { kind: 'root', title: ar ? 'من الجذر نفسه في آية الفرع' : 'Same root in the branch ayah' };
        if (target && context.match?.different.includes(i)) return { kind: 'exact', title: ar ? 'ليست في آية الفرع' : 'Not in the branch ayah' };
        return !compare && span && offset + i >= span[0] && offset + i < span[1] ? { kind: 'exact', title: ar ? 'من أول الآية إلى هذه العقدة' : 'From the ayah start to this node' } : null;
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
        <Button size="sm" className="max-w-full" variant={leaf ? 'ghost' : differing ? 'highlight' : 'outline'} aria-label={leaf && references ? undefined : subject ? `${label}: ${subject}` : label} aria-labelledby={leaf && references ? `${titleId}-action ${titleId}-subject ${titleId}-refs` : undefined} title={label} aria-haspopup="dialog" onClick={() => { setOpen(true); dialog.current?.showModal(); }}>
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
          <div><h2 id={titleId}>{title}</h2><p className={styles.note}>{ar ? 'الآية المقصودة بارزة، وقبلها آية وبعدها آية من السورة نفسها، إن وُجدتا.' : 'The matching ayah is emphasized, with the preceding and following ayat from the same surah when available.'}</p>{differing && <p className={styles.note}>{ar ? 'النص كما ورد في كل آية.' : 'Each ayah keeps its original text.'}</p>}{(Object.keys(spans).length > 0 || differing) && <MatchLegend exact={Object.keys(spans).length > 0 ? (siblings.length > 0 ? (ar ? 'في آية هذا الفرع: من أول الآية إلى هذه العقدة' : 'In this branch: from the ayah start to this node') : (ar ? 'من أول الآية إلى هذه العقدة' : 'From the ayah start to this node')) : undefined} root={differing ? (ar ? 'اختلاف في علامات الضبط' : 'Differing marks') : undefined} />}</div>
          <Button size="icon" aria-label={ar ? 'إغلاق' : 'Close'} onClick={() => dialog.current?.close()}><X size={18} aria-hidden /></Button>
        </div>
        {open && isLoading && <p role="status">{ar ? 'جارٍ تحميل الآيات…' : 'Loading ayat…'}</p>}
        {open && error && <div role="alert"><p>{ar ? 'تعذّر تحميل الآيات.' : 'Could not load the ayat.'}</p><Button size="sm" onClick={() => void mutate()}><RotateCcw size={16} aria-hidden />{ar ? 'إعادة المحاولة' : 'Try again'}</Button></div>}
        {spellings.length > 0 && <section className={styles.spellings} aria-labelledby={`${titleId}-marks`}>
          <h3 id={`${titleId}-marks`}>{ar ? 'الضبط في هذه العقدة' : 'Marks in this node'}</h3>
          <ul>{spellings.map(spelling => <li key={spelling.words.join(' ')}><span className="font-arabic">{spelling.words.map((word, i) => <React.Fragment key={i}>{i > 0 && ' '}{differentWords.includes(spellingAt + i) ? <mark>{word}</mark> : word}</React.Fragment>)}</span><span className={styles.note}>{ar ? ayatCount(spelling.keys.length) : `${spelling.keys.length} ${spelling.keys.length === 1 ? 'ayah' : 'ayat'}`}</span></li>)}</ul>
        </section>}
        {open && data && siblings.length > 0 && <>
          <p className={styles.note}>{ar ? 'آية هذا الفرع أولًا، ثم الآيات التي تلتقي معها في العقدة نفسها، كلٌّ منها مقارنةٌ بها كما في صفحة المقارنة.' : 'This branch\'s ayah comes first, then the ayat that meet it at the same node, each compared with it as on the compare page.'}</p>
          <MatchLegend exact={ar ? 'في الآيات الأخرى: ليست في آية الفرع' : 'In the other ayat: not in the branch ayah'} root={ar ? 'الجذر نفسه' : 'Same root'} />
        </>}
        {open && data && <div className={styles.cards}>
          {data.filter(context => ayahKeys.includes(context.ayah.key)).map(context => card(context, differentWords, false, siblings.length > 0))}
          {data.filter(context => siblings.includes(context.ayah.key)).map(context => card(context, [], true))}
        </div>}
      </dialog>
    </>
  );
}
