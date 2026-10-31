'use client';

import { ArrowLeft, ArrowRight, GalleryHorizontal, GitBranch, List } from 'lucide-react';
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

export type View = 'list' | 'tree' | 'cards';

export function TreeMode({ current, list, tree, cards }: { current: View; list: string; tree?: string; cards?: string }) {
  const ar = useLanguage().language === 'ar';
  return <Segmented iconOnly label={ar ? 'طريقة العرض' : 'View'} options={[
    { key: 'list', label: ar ? 'قائمة' : 'List', icon: <List aria-hidden />, current: current === 'list', href: list },
    ...(tree ? [{ key: 'tree', label: ar ? 'شجرة' : 'Tree', icon: <GitBranch aria-hidden />, current: current === 'tree', href: tree }] : []),
    ...(cards ? [{ key: 'cards', label: ar ? 'بطاقات الآيات' : 'Ayah cards', icon: <GalleryHorizontal aria-hidden />, current: current === 'cards', href: cards }] : []),
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
    <nav aria-label={ar ? 'التنقل بين الأشجار' : 'Tree navigation'} className="flex shrink-0 items-center gap-2">
      <Button size="lg" data-step="previous" aria-label={labels.previous} title={labels.previous} {...step(steps.previous)}><Back aria-hidden /></Button>
      <span className="text-sm tabular-nums text-[var(--home-muted)]">{ar ? `${num(steps.position)} / ${num(steps.total)}` : `${steps.position} / ${steps.total}`}</span>
      <Button size="lg" data-step="next" aria-label={labels.next} title={labels.next} {...step(steps.next)}><Forward aria-hidden /></Button>
    </nav>
  );
}
