'use client';

import { ArrowLeft, ArrowRight, GalleryHorizontal, List } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import Segmented from '@/components/common/Segmented';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';

export type Steps = { previous?: string; next?: string; position: number; total: number };

function withContext(href: string | undefined, on: boolean) {
  if (!href) return href;
  const url = new URL(href, 'http://localhost');
  if (on) url.searchParams.set('c', '1');
  else url.searchParams.delete('c');
  return `${url.pathname}${url.search}`;
}

export function TreeMode({ browsing, list, browse }: { browsing: boolean; list: string; browse?: string }) {
  const ar = useLanguage().language === 'ar';
  if (!browse) return null;
  return <Segmented label={ar ? 'طريقة العرض' : 'View'} options={[
    { key: 'list', label: ar ? 'قائمة' : 'List', icon: <List size={16} aria-hidden />, current: !browsing, href: list },
    { key: 'browse', label: ar ? 'تصفّح' : 'Browse', icon: <GalleryHorizontal size={16} aria-hidden />, current: browsing, href: browse },
  ]} />;
}

export default function TreeSteps({ steps }: { steps: Steps }) {
  const ar = useLanguage().language === 'ar';
  const on = useSearchParams().get('c') === '1';
  const Back = ar ? ArrowRight : ArrowLeft;
  const Forward = ar ? ArrowLeft : ArrowRight;
  const labels = ar ? { previous: 'الشجرة السابقة', next: 'الشجرة التالية' } : { previous: 'Previous tree', next: 'Next tree' };
  const step = (href?: string) => href ? { href: withContext(href, on)! } : { disabled: true };
  return (
    <nav aria-label={ar ? 'التنقل بين الأشجار' : 'Tree navigation'} className="flex items-center gap-2">
      <Button size="sm" data-step="previous" {...step(steps.previous)}><Back className="size-3" aria-hidden />{labels.previous}</Button>
      <span className="text-sm tabular-nums text-[var(--home-muted)]">{ar ? `${num(steps.position)} / ${num(steps.total)}` : `${steps.position} / ${steps.total}`}</span>
      <Button size="sm" data-step="next" {...step(steps.next)}>{labels.next}<Forward className="size-3" aria-hidden /></Button>
    </nav>
  );
}
