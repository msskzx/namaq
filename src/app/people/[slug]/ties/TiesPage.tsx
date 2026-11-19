'use client';

import { useState } from 'react';
import type { RingTie, TiesView } from '@/lib/tarajim';
import Button from '@/components/common/Button';
import { betweenHref, CreditFold, nasabHref, TieSays, TiesRing } from '@/components/tarajim/TarajimParts';

export default function TiesPage({ view }: { view: TiesView }) {
  const [shown, setShown] = useState<RingTie | undefined>();
  const she = view.sex === 'FEMALE';
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-4" lang="ar" dir="rtl">
      <h1 className="text-[1.75rem]">الصلات</h1>
      <TiesRing view={view} onShow={setShown} />
      {shown && <TieSays tie={shown} />}
      {view.groups.length === 0 && <p className="text-[var(--home-muted)]">لا صلات مذكورة في الترجمة.</p>}
      <CreditFold credit={view.credit} />
      <div className="flex flex-wrap gap-2">
        <Button href={betweenHref([view.slug])}>{she ? 'بينها وبين…' : 'بينه وبين…'}</Button>
        <Button href={nasabHref([view.slug])}>النسب</Button>
        <Button href={`/people/${view.slug}`}>{she ? 'ترجمتها' : 'ترجمته'}</Button>
      </div>
    </div>
  );
}
