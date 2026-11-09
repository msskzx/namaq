'use client';

import { ArrowLeft, ArrowRight, GalleryHorizontal } from 'lucide-react';
import TreeIcon from '@/components/common/TreeIcon';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import styles from './TreeSteps.module.css';

export type Steps = { previous?: string; next?: string; position: number; total: number };

/** Where this tree (or compare page, with unit 'page') sits in the list being swiped through. */
export function TreeProgress({ steps, unit = 'tree' }: { steps: Pick<Steps, 'position' | 'total'>; unit?: 'tree' | 'page' }) {
  const ar = useLanguage().language === 'ar';
  const { position, total } = steps;
  const remaining = total - position;
  const tree = unit === 'tree';
  const description = ar
    ? `${tree ? 'الشجرة' : 'الصفحة'} ${num(position)} من ${num(total)}، المتبقي ${num(remaining)}`
    : `${tree ? 'Tree' : 'Page'} ${position} of ${total}, ${remaining} remaining`;
  return <div className="flex items-center gap-2 text-xs text-[var(--home-muted)]" dir={ar ? 'rtl' : 'ltr'} title={description}>
    <progress className={styles.progress} value={position} max={total} aria-label={tree ? (ar ? 'التقدم بين الأشجار' : 'Tree progress') : (ar ? 'التقدم بين الصفحات' : 'Page progress')} aria-valuetext={description} />
    <span className="shrink-0 tabular-nums" dir="ltr" aria-hidden>{ar ? num(position) : position} / {ar ? num(total) : total}</span>
  </div>;
}

function withContext(href: string | undefined, on: boolean) {
  if (!href) return href;
  const url = new URL(href, 'http://localhost');
  if (on) url.searchParams.set('c', '1');
  else url.searchParams.delete('c');
  return `${url.pathname}${url.search}`;
}

/** Loads the neighbouring trees ahead, so stepping to one shows it at once. */
export function usePreload(...hrefs: (string | undefined)[]) {
  const router = useRouter();
  const wanted = hrefs.filter(Boolean).join(' ');
  useEffect(() => {
    for (const href of wanted.split(' ').filter(Boolean)) router.prefetch(href, { kind: 'full' } as Parameters<typeof router.prefetch>[1]);
  }, [router, wanted]);
}

/** One button that switches to the other view: the tree, or its ayah as cards. */
export function TreeMode({ to, href }: { to: 'tree' | 'cards'; href: string }) {
  const ar = useLanguage().language === 'ar';
  const label = to === 'cards' ? (ar ? 'اعرض بطاقات الآيات' : 'Show ayah cards') : (ar ? 'اعرض الشجرة' : 'Show tree');
  return <Button size="lg" variant="muted" href={href} scroll={false} aria-label={label} title={label}>
    {to === 'cards' ? <GalleryHorizontal aria-hidden /> : <TreeIcon aria-hidden />}
  </Button>;
}

/**
 * The previous/next links stay in the page, hidden: the arrows beside the tree card and swipes press them,
 * so the surrounding-ayat flag and the prefetch stay in one place.
 */
export default function TreeSteps({ steps }: { steps: Steps }) {
  const ar = useLanguage().language === 'ar';
  const on = useSearchParams().get('c') === '1';
  const Back = ar ? ArrowRight : ArrowLeft;
  const Forward = ar ? ArrowLeft : ArrowRight;
  const labels = ar ? { previous: 'الشجرة السابقة', next: 'الشجرة التالية' } : { previous: 'Previous tree', next: 'Next tree' };
  const [previous, next] = [withContext(steps.previous, on), withContext(steps.next, on)];
  usePreload(next, previous);
  const step = (href: string | undefined) => href ? { href } : { disabled: true };
  return (
    <nav aria-label={ar ? 'التنقل بين الأشجار' : 'Tree navigation'} className="hidden">
      <Button size="lg" data-step="previous" aria-label={labels.previous} title={labels.previous} {...step(previous)}><Back aria-hidden /></Button>
      <Button size="lg" data-step="next" aria-label={labels.next} title={labels.next} {...step(next)}><Forward aria-hidden /></Button>
    </nav>
  );
}
