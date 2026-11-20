'use client';

import { useState } from 'react';
import type { RingTie, TiesView } from '@/lib/tarajim';
import Button from '@/components/common/Button';
import { Link2, Network, Users } from 'lucide-react';
import CardWithRow from '@/components/common/CardWithRow';
import { betweenHref, BookCredit, nasabHref, TieSays, TiesRing } from '@/components/tarajim/TarajimParts';

export default function TiesPage({ view }: { view: TiesView }) {
  const [shown, setShown] = useState<RingTie | undefined>();
  const she = view.sex === 'FEMALE';
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">الصلات</h1>
      {/* One section in the home card's shape (owner 2026-11-20): the ring, the ways on under it, the books on the line. */}
      <CardWithRow className="flex flex-col gap-3 p-4" row={<>
        <Button size="lg" variant="muted" href={`/people/${view.slug}`} aria-label={she ? 'ترجمتها' : 'ترجمته'} title={she ? 'ترجمتها' : 'ترجمته'}><Users aria-hidden /></Button>
        <Button size="lg" variant="muted" href={nasabHref([view.slug])} aria-label="النسب" title="النسب"><Network aria-hidden /></Button>
        <Button size="lg" variant="muted" href={betweenHref([view.slug])} aria-label={she ? 'بينها وبين…' : 'بينه وبين…'} title={she ? 'بينها وبين…' : 'بينه وبين…'}><Link2 aria-hidden /></Button>
      </>}>
        <TiesRing view={view} onShow={setShown} />
        {shown && <TieSays tie={shown} />}
        {view.groups.length === 0 && <p className="text-[var(--home-muted)]">لا صلات مذكورة في الترجمة.</p>}
        <BookCredit credit={view.credit} />
      </CardWithRow>
    </div>
  );
}
